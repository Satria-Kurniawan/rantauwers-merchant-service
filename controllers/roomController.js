const Kos = require("../models/kosModel");
const Room = require("../models/roomModel");
const { isValidObjectId } = require("mongoose");

const insertRoom = async (req, res) => {
  const {
    name,
    roomSpecifications,
    roomFacilities,
    bathroomFacilities,
    pricePerDay,
    pricePerWeek,
    pricePerMonth,
  } = req.body;

  // Melalui internal service
  //   const thumbnailImage = req.file ? req.file.filename : null;

  // Melalui api gateway
  const thumbnailImage = req.body.thumbnailImage ?? null;

  try {
    const kos = await Kos.findOne({ userId: req.user._id });

    if (!kos)
      return res
        .status(404)
        .json({ message: "Belum membuat data kos (kos tidak ditemukan)." });

    const room = await Room.create({
      name,
      roomSpecifications,
      roomFacilities,
      bathroomFacilities,
      pricePerDay,
      pricePerWeek,
      pricePerMonth,
      thumbnailImage,
      kosId: kos._id,
      userId: req.user._id,
    });

    res.status(201).json({
      message: "Berhasil menambahkan data ruangan.",
      room,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};

const getAllRoom = async (req, res) => {
  try {
    const allRoom = await Room.find().populate("kosId");

    res.json({ allRoom });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

const getRoomsPerKos = async (req, res) => {
  try {
    const kos = await Kos.findById(req.params.kosId);
    const roomsPerKos = await Room.find({ kosId: kos._id });

    res.json({ roomsPerKos });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const getRoomsByAdmin = async (req, res) => {
  try {
    const rooms = await Room.find({ userId: req.user._id });

    if (!rooms)
      return res.status(400).json({ message: "Tidak ada data ruangan" });

    res.json({ rooms });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);

    res.json({ room });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const updateRoom = async (req, res) => {
  const {
    name,
    roomSpecifications,
    roomFacilities,
    bathroomFacilities,
    pricePerDay,
    pricePerWeek,
    pricePerMonth,
  } = req.body;

  if (!isValidObjectId(req.params.roomId))
    return res.status(400).json({ message: "Id ruangan tidak valid)." });

  try {
    const room = await Room.findById(req.params.roomId);

    const fileName = req.file ? req.file.filename : room.thumbnailImage;
    // const fileName = req.body.fileName ? req.body.fileName : room.thumbnailImage;

    room.name = name;
    room.roomSpecifications = roomSpecifications;
    room.roomFacilities = roomFacilities;
    room.bathroomFacilities = bathroomFacilities;
    room.pricePerDay = pricePerDay;
    room.pricePerWeek = pricePerWeek;
    room.pricePerMonth = pricePerMonth;
    room.thumbnailImage = fileName;

    const updatedroom = await room.save();

    res.json({ message: "Berhasil memperbarui ruangan.", updatedroom });
  } catch (error) {
    res.status(400).json({ error });
  }
};

const deleteRoom = async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.roomId);

    res.json({ message: "Berhasil menghapus ruangan." });
  } catch (error) {
    res.status(500).json({ error });
  }
};

module.exports = {
  insertRoom,
  getAllRoom,
  getRoomsPerKos,
  getRoomsByAdmin,
  getRoom,
  updateRoom,
  deleteRoom,
};
