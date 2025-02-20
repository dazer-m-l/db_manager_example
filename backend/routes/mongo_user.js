const express = require("express");
const router = express.Router();
const multer = require("multer");
const usuarioController = require("../controllers/mongo_controller");
const upload = require("../server");

router.get("/", usuarioController.obtenerUsuarios);
router.get("/:id", usuarioController.obtenerUsuarioPorId);
router.post("/", upload.single("imagen"), usuarioController.crearUsuario);
router.put("/:id", upload.single("imagen"), usuarioController.actualizarUsuario);
router.delete("/:id", usuarioController.eliminarUsuario);

module.exports = router;
