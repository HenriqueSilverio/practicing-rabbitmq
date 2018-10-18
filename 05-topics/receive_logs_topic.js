const amqp = require('amqplib');

(async () => {
  const args = process.argv.slice(2);

  if (0 === args.length) {
    console.log('Usage: receive_logs_topic.js <facility>.<severity>');
    process.exit(1);
  }

  const connection = await amqp.connect('amqp://localhost');
  const channel    = await connection.createChannel();

  const exchangeName = 'topic_logs';

  await channel.assertExchange(exchangeName, 'topic', { durable: false });

  const reply = await channel.assertQueue('', { exclusive: true });

  console.log(` [*] Waiting for messages in ${reply.queue}. To exit press CTRL+C`);

  args.forEach((key) => channel.bindQueue(reply.queue, exchangeName, key));

  channel.consume(reply.queue, (message) => {
    console.log(` [x] ${message.fields.routingKey}: ${message.content.toString()}`);
  }, { noAck: true });
})();
