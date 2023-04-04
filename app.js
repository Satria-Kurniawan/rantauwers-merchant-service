const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const port = process.env.PORT || 6002;
const connectToDatabase = require("./config/database");
const { errorHandler } = require("./middlewares/errorHandler");
const { kosQueuePublishKosDetail } = require("./messageBroker/kosQueue");
const {
  roomQueueUpdatingRoomData,
  roomQueuePublishRoomDetail,
} = require("./messageBroker/roomQueue");

connectToDatabase();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.use("/api/kos", require("./routes/kosRoutes"));
app.use("/api/room", require("./routes/roomRoutes"));

// Message Broker triger event
kosQueuePublishKosDetail();
roomQueueUpdatingRoomData();
roomQueuePublishRoomDetail();
//

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Merchant service ready on port ${port}`);
});
