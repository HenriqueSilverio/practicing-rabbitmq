const amqp = require('amqplib');

(async () => {
  const connection = await amqp.connect('amqp://localhost');
  const channel    = await connection.createChannel();

  const exchangeName = 'logs';

  await channel.assertExchange(exchangeName, 'fanout', { durable: false });

  const reply = await channel.assertQueue('', { exclusive: true });

  console.log(` [*] Waiting for messages in ${reply.queue}. To exit press CTRL+C`);

  await channel.bindQueue(reply.queue, exchangeName, '');

  channel.consume(reply.queue, (message) => {
    console.log(` [x] ${message.content.toString()}`);
  }, { noAck: true });
})();
