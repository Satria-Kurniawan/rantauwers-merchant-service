const amqp = require("amqplib/callback_api");
const Kos = require("../models/kosModel");

const uri = process.env.MESSAGE_BROKER;
const port = process.env.MESSAGE_BROKER_PORT;

// Memproduksi detail kos
const kosQueueGetKosDetail = () => {
  amqp.connect(`${uri}:${port}`, (err, conn) => {
    if (err) throw err;

    conn.createChannel((err, channel) => {
      if (err) throw err;

      const queueName = "kos_queue";

      channel.assertQueue(queueName, {
        durable: false,
      });

      console.log(`Waiting for requests from ${queueName}`);

      channel.consume(queueName, async (msg) => {
        const kosSlug = msg.content.toString();
        console.log(`Received request for kos with slug: ${kosSlug}`);

        // Process the request and send response back to message broker
        const kos = await Kos.findOne({ slug: kosSlug });

        // if(!kos) return ...

        channel.assertQueue(msg.properties.replyTo, { durable: false });

        channel.sendToQueue(
          msg.properties.replyTo,
          Buffer.from(JSON.stringify(kos))
        );

        channel.ack(msg);
      });
    });
  });
};

module.exports = { kosQueueGetKosDetail };
