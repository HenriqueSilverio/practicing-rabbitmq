const amqp = require('amqplib');

(async () => {
  const queue      = 'hello';
  const connection = await amqp.connect('amqp://localhost');
  const channel    = await connection.createChannel();
  const reply      = await channel.assertQueue(queue, { durable: false });

  console.log(` [*] Waiting for messages in ${queue}. To exit press CTRL+C`);

  channel.consume(queue, (message) => {
    console.log(`[x] Received ${message.content.toString()}`);
  }, { noAck: true });
})();
