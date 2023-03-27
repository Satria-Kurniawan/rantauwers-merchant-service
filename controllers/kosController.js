const Kos = require("../models/kosModel");
const { isValidObjectId } = require("mongoose");

const insertKos = async (req, res) => {
  const {
    name,
    description,
    kosRules,
    kosGeneralFacilities,
    kosType,
    location,
  } = req.body;

  const kosExists = await Kos.exists({ userId: req.user._id });

  if (kosExists)
    return res.status(400).json({ message: "Data kos sudah ada!" });

  // Melalui internal service
  // const thumbnailImage = req.files.thumbnailImage[0].filename ?? null;
  // const moreImages = [];
  // req.files.moreImages?.map((image) => moreImages.push(image.filename));

  // Melalui api gateway
  const thumbnailImage = req.body.thumbnailImage ?? null;
  const moreImages = req.body.moreImages ?? null;

  try {
    const kos = await Kos.create({
      name,
      description,
      kosRules,
      kosGeneralFacilities,
      kosType,
      thumbnailImage,
      moreImages,
      location,
      userId: req.user._id,
    });

    res.status(201).json({
      message: "Berhasil menambahkan data kos.",
      kos,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};

const getAllKos = async (req, res) => {
  try {
    const allKos = await Kos.find();

    res.json({ allKos });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const getKos = async (req, res) => {
  try {
    const kos = await Kos.findOne({ slug: req.params.slug });

    if (!kos) return res.status(400).json({ message: "Kos tidak ditemukan" });

    res.json({ kos });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const getKosByAdmin = async (req, res) => {
  try {
    const kos = await Kos.findOne({ userId: req.user._id });

    if (!kos) return res.status(400).json({ message: "Tidak ada data kos" });

    res.json({ kos });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const updateKos = async (req, res) => {
  const {
    name,
    description,
    kosRules,
    kosGeneralFacilities,
    kosType,
    location,
  } = req.body;

  if (!isValidObjectId(req.params.kosId))
    return res.status(400).json({ message: "Id kos tidak valid)." });

  try {
    const kos = await Kos.findById(req.params.kosId);

    // Melalui internal service
    // const thumbnailImage = req.file?.filename ?? kos.thumbnailImage;

    // Melalui api gateway
    const thumbnailImage = req.body.thumbnailImage ?? kos.thumbnailImage;

    kos.name = name;
    kos.description = description;
    kos.kosRules = kosRules;
    kos.kosGeneralFacilities = kosGeneralFacilities;
    kos.kosType = kosType;
    kos.location = location;
    kos.thumbnailImage = thumbnailImage;

    const updatedKos = await kos.save();

    res.json({ message: "Berhasil memperbarui kos.", updatedKos });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

const deleteKos = async (req, res) => {
  try {
    await Kos.findByIdAndDelete(req.params.kosId);

    res.json({ message: "Berhasil menghapus kos." });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const deleteKosImage = async (req, res) => {
  try {
    const kos = await Kos.findById(req.params.kosId);

    const imageExist = kos.moreImages.find(
      (image) => image === req.params.fileName
    );

    if (!imageExist)
      return res.status(400).json({ message: "Gambar tidak ditemukan" });

    kos.moreImages = kos.moreImages.filter(
      (image) => image !== req.params.fileName
    );

    await kos.save();

    res.json({
      message: "Berhasil menghapus gambar",
      image: req.params.fileName,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const insertKosImages = async (req, res) => {
  try {
    const kos = await Kos.findById(req.params.kosId);

    // Melalui internal service
    // if (!req.files) return res.status(400).json({ message: "File kosong" });
    // req.files.moreImages?.forEach((image) => {
    //   kos.moreImages.push(image.filename);
    // });

    // Melalui api gateway
    if (!req.body.moreImages)
      return res.status(400).json({ message: "File kosong" });

    req.body.moreImages?.forEach((fileName) => {
      kos.moreImages.push(fileName);
    });

    await kos.save();

    res.json({
      message: "Berhasil menambahkan gambar",
      images: kos.moreImages,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

module.exports = {
  insertKos,
  getAllKos,
  getKos,
  getKosByAdmin,
  updateKos,
  deleteKos,
  deleteKosImage,
  insertKosImages,
};
