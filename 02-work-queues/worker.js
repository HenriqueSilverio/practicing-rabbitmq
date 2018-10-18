const amqp = require('amqplib');

(async () => {
  const connection = await amqp.connect('amqp://localhost');
  const channel    = await connection.createChannel();

  const queue = 'task_queue';
  const reply = await channel.assertQueue(queue, { durable: true });

  await channel.prefetch(1);

  console.log(` [*] Waiting for messages in ${queue}. To exit press CTRL+C`);

  channel.consume(queue, (message) => {
    const string  = message.content.toString();
    const seconds = string.split('.').length - 1;

    console.log(`[x] Received ${string}`);

    setTimeout(() => {
      console.log(` [x] Done`);
      channel.ack(message);
    }, seconds * 1000);
  }, { noAck: false });
})();
