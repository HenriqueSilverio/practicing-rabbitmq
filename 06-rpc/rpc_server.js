const amqp      = require('amqplib');
const fibonacci = require('./fibonacci');

(async () => {
  const connection = await amqp.connect('amqp://localhost');
  const channel    = await connection.createChannel();

  const queue = 'rpc_queue';

  await channel.assertQueue(queue, { durable: false });
  await channel.prefetch(1);

  console.log(' [x] Awaiting RPC requests');

  channel.consume(queue, async (message) => {
    const n = parseInt(message.content.toString(), 10);

    console.log(` [.] fib(${n})`);

    const r = fibonacci(n);

    await channel.sendToQueue(
      message.properties.replyTo,
      Buffer.from(r.toString()),
      { correlationId: message.properties.correlationId }
    );

    channel.ack(message);
  });
})();
