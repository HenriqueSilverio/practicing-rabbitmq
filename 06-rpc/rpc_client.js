const amqp = require('amqplib');
const uuid = require('./uuid');

(async () => {
  const args = process.argv.slice(2);

  if (0 === args.length) {
    console.log('Usage: node rpc_client.js num');
    process.exit(1);
  }

  const connection = await amqp.connect('amqp://localhost');
  const channel    = await connection.createChannel();
  const reply      = await channel.assertQueue('', { exclusive: true });

  const corr = uuid();
  const num  = parseInt(args[0], 10);

  console.log(` [x] Requesting fib(${num})`);

  channel.consume(reply.queue, (message) => {
    if (message.properties.correlationId === corr) {
      console.log(` [.] Got ${message.content.toString()}`);
    }

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  }, { noAck: true });

  channel.sendToQueue(
    'rpc_queue',
    Buffer.from(num.toString()),
    { correlationId: corr, replyTo: reply.queue }
  );
})();
