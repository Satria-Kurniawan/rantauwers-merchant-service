const amqp = require("amqplib/callback_api");
const Room = require("../models/roomModel");

const uri = process.env.MESSAGE_BROKER;
const port = process.env.MESSAGE_BROKER_PORT;

// Mengupdate data ruangan, ketika sudah dipesan
const roomQueueUpdatingRoomData = () => {
  amqp.connect(`${uri}:${port}`, (err, conn) => {
    if (err) throw err;

    conn.createChannel((err, channel) => {
      if (err) throw err;

      const queueName = "payment_success";

      channel.assertQueue(queueName, { durable: false });

      channel.consume(
        queueName,
        async (msg) => {
          const data = msg.content.toString();
          const parsedData = JSON.parse(data);

          const room = await Room.findById(parsedData.roomId);

          room.isAvailable = false;
          await room.save();

          channel.ack(msg);
        },
        { noAck: false }
      );
    });
  });
};

// Memproduksi detail kos
const roomQueuePublishRoomDetail = () => {
  amqp.connect(`${uri}:${port}`, (err, conn) => {
    if (err) throw err;

    conn.createChannel((err, channel) => {
      if (err) throw err;

      const queueName = "room_queue";

      channel.assertQueue(queueName, {
        durable: false,
      });

      channel.consume(queueName, async (msg) => {
        const roomId = msg.content.toString();

        // Process the request and send response back to message broker
        const room = await Room.findById(roomId);

        // if(!room) return ...

        channel.assertQueue(msg.properties.replyTo, { durable: false });

        channel.sendToQueue(
          msg.properties.replyTo,
          Buffer.from(JSON.stringify(room))
        );

        channel.ack(msg);
      });
    });
  });
};

module.exports = { roomQueueUpdatingRoomData, roomQueuePublishRoomDetail };
