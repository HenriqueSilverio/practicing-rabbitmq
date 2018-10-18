const amqp = require('amqplib');

(async () => {
  const queue      = 'hello';
  const connection = await amqp.connect('amqp://localhost');
  const channel    = await connection.createChannel();
  const reply      = await channel.assertQueue(queue, { durable: false });
  const bufferFull = await channel.sendToQueue(queue, Buffer.from('Hello World!'));

  console.log(` [x] Sent 'Hello World!'`);

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
})();
