const amqp = require("amqplib/callback_api");
const Kos = require("../models/kosModel");

const uri = process.env.MESSAGE_BROKER;
const port = process.env.MESSAGE_BROKER_PORT;

// Memproduksi detail kos
const kosQueuePublishKosDetail = () => {
  amqp.connect(`${uri}:${port}`, (err, conn) => {
    if (err) throw err;

    conn.createChannel((err, channel) => {
      if (err) throw err;

      const queueName = "kos_queue";

      channel.assertQueue(queueName, {
        durable: false,
      });

      channel.consume(queueName, async (msg) => {
        const kosSlug = msg.content.toString();

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

module.exports = { kosQueuePublishKosDetail };
