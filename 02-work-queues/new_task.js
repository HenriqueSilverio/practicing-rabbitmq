const amqp = require('amqplib');

(async () => {
  const queue   = 'task_queue';
  const message = process.argv.slice(2).join(' ') || 'Hello World!';

  const connection = await amqp.connect('amqp://localhost');
  const channel    = await connection.createChannel();
  const reply      = await channel.assertQueue(queue, { durable: true });

  const buffer     = Buffer.from(message);
  const options    = { persistent: true };
  const bufferFull = await channel.sendToQueue(queue, buffer, options);

  console.log(` [x] Sent '${message}'`);

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
})();
