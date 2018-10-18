const amqp = require('amqplib');

(async () => {
  const connection = await amqp.connect('amqp://localhost');
  const channel    = await connection.createChannel();

  const exchangeName = 'topic_logs';
  const args         = process.argv.slice(2);
  const key          = args.length > 0 ? args[0] : 'anonymous.info';
  const message      = args.slice(1).join(' ') || 'Hello World!';

  await channel.assertExchange(exchangeName, 'topic', { durable: false });
  await channel.publish(exchangeName, key, Buffer.from(message));

  console.log(` [x] Sent ${key}: '${message}'`);

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
})();
