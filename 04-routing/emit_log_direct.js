const amqp = require('amqplib');

(async () => {
  const connection = await amqp.connect('amqp://localhost');
  const channel    = await connection.createChannel();

  const exchangeName = 'direct_logs';
  const args         = process.argv.slice(2);
  const message      = process.argv.slice(1).join(' ') || 'Hello World!';
  const severity     = args.length > 0 ? args[0] : 'info';

  await channel.assertExchange(exchangeName, 'direct', { durable: false });
  await channel.publish(exchangeName, severity, Buffer.from(message));

  console.log(` [x] Sent ${severity}: '${message}'`);

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
})();
