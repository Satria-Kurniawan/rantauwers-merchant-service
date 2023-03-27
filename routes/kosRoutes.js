const express = require("express");
const router = express.Router();
const {
  insertKos,
  getAllKos,
  getKos,
  getKosByAdmin,
  updateKos,
  deleteKos,
  deleteKosImage,
  insertKosImages,
} = require("../controllers/kosController");
const { withAuth, withRoleAdmin } = require("../middlewares/auth");
const upload = require("../middlewares/fileUpload");

router.post(
  "/insert",
  [
    withAuth,
    withRoleAdmin,
    upload.fields([
      { name: "thumbnailImage", maxCount: 1 },
      { name: "moreImages", maxCount: 10 },
    ]),
  ],
  insertKos
);
router.get("/all", getAllKos);
router.get("/:slug", getKos);
router.get("/my/own", [withAuth, withRoleAdmin], getKosByAdmin);
router.put(
  "/:kosId/update",
  [withAuth, withRoleAdmin, upload.single("thumbnailImage")],
  updateKos
);
router.delete("/:kosId/delete", [withAuth, withRoleAdmin], deleteKos);
router.delete(
  "/:kosId/image/:fileName/delete",
  [withAuth, withRoleAdmin],
  deleteKosImage
);
router.post(
  "/:kosId/image/insert",
  [
    withAuth,
    withRoleAdmin,
    upload.fields([{ name: "moreImages", maxCount: 10 }]),
  ],
  insertKosImages
);

module.exports = router;
