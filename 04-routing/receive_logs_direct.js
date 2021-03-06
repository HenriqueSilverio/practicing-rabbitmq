const amqp = require('amqplib');

(async () => {
  const args = process.argv.slice(2);

  if (0 === args.length) {
    console.log('Usage: receive_logs_direct.js [info] [warning] [error]');
    process.exit(1);
  }

  const connection = await amqp.connect('amqp://localhost');
  const channel    = await connection.createChannel();

  const exchangeName = 'direct_logs';

  await channel.assertExchange(exchangeName, 'direct', { durable: false });

  const reply = await channel.assertQueue('', { exclusive: true });

  console.log(` [*] Waiting for messages in ${reply.queue}. To exit press CTRL+C`);

  args.forEach((severity) => channel.bindQueue(reply.queue, exchangeName, severity));

  channel.consume(reply.queue, (message) => {
    console.log(` [x] ${message.fields.routingKey}: ${message.content.toString()}`);
  }, { noAck: true });
})();
