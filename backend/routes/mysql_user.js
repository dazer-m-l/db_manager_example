const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/mysql_controllers");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = "uploads/";

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }

        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.get("/", usuarioController.obtenerUsuarios);
router.get("/:id", (req, res, next) => {
    next();
}, usuarioController.obtenerUsuarioPorId);

router.post("/", upload.single("imagen"), usuarioController.crearUsuario);
router.put("/:id", upload.single("imagen"), usuarioController.actualizarUsuario);
router.delete("/:id", usuarioController.eliminarUsuario);

module.exports = router;
