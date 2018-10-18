const amqp = require('amqplib');

(async () => {
  const connection = await amqp.connect('amqp://localhost');
  const channel    = await connection.createChannel();

  const exchangeName = 'logs';
  const message      = process.argv.slice(2).join(' ') || 'Hello World!';

  await channel.assertExchange(exchangeName, 'fanout', { durable: false });
  await channel.publish(exchangeName, '', Buffer.from(message));

  console.log(` [x] Sent '${message}'`);

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
})();
