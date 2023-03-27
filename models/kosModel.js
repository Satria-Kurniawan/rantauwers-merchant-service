const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);

const kosSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Nama kos harus diisi."],
    },
    description: {
      type: String,
      default: null,
    },
    kosRules: {
      type: Array,
      default: null,
    },
    kosGeneralFacilities: {
      type: Array,
      default: null,
    },
    kosType: {
      type: String,
      required: [true, "Tipe kos harus diisi. (Putra/Putri/Campur)"],
    },
    rating: {
      type: Number,
      default: null,
    },
    slug: {
      type: String,
      slug: "name",
    },
    thumbnailImage: {
      type: String,
      default: null,
    },
    moreImages: {
      type: Array,
      default: null,
    },
    location: {
      type: String,
      required: true,
    },
    lat: {
      type: Number,
      default: null,
    },
    long: {
      type: Number,
      default: null,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Kos", kosSchema);
