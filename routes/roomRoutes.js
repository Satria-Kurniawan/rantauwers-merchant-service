const express = require("express");
const router = express.Router();
const {
  insertRoom,
  getAllRoom,
  getRoomsPerKos,
  getRoomsByAdmin,
  getRoom,
  updateRoom,
  deleteRoom,
} = require("../controllers/roomController");
const { withAuth, withRoleAdmin } = require("../middlewares/auth");
const upload = require("../middlewares/fileUpload");

router.post(
  "/insert",
  [withAuth, withRoleAdmin, upload.single("thumbnailImage")],
  insertRoom
);
router.get("/all", getAllRoom);
router.get("/:kosId/all", getRoomsPerKos);
router.get("/my/own", [withAuth, withRoleAdmin], getRoomsByAdmin);
router.get("/:roomId", getRoom);
router.put(
  "/:roomId/update",
  [withAuth, withRoleAdmin, upload.single("thumbnailImage")],
  updateRoom
);
router.delete("/:roomId/delete", [withAuth, withRoleAdmin], deleteRoom);

module.exports = router;
