const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);

const roomSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Nama kos wajib diisi!"],
  },
  roomSpecifications: {
    type: Array,
    default: null,
  },
  roomFacilities: {
    type: Array,
    default: null,
  },
  bathroomFacilities: {
    type: Array,
    default: null,
  },
  thumbnailImage: {
    type: String,
    default: null,
  },
  pricePerDay: {
    type: Number,
    default: null,
  },
  pricePerWeek: {
    type: Number,
    default: null,
  },
  pricePerMonth: {
    type: Number,
    default: null,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  slug: {
    type: String,
    slug: "name",
  },
  kosId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Kos",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

module.exports = mongoose.model("Room", roomSchema);
