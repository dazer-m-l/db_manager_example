require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const connectMongoDB = require("./dbConfig/mongoConfig");
const mysqlPool = require("./dbConfig/mysqlConfig");

const app = express();
app.use(express.json());
app.use(cors());

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
app.use("/uploads", express.static("uploads"));

module.exports = upload;

const usuariosMySQLRoutes = require("./routes/mysql_user");
const usuariosMongoRoutes = require("./routes/mongo_user");

app.use("/api/usuarios/mysql", usuariosMySQLRoutes);
app.use("/api/usuarios/mongo", usuariosMongoRoutes);

connectMongoDB().catch(error => console.error("Error en MongoDB:", error));
mysqlPool.getConnection()
    .then(connection => {
        console.log("Conectado a la DB MySQL");
        connection.release();
    })
    .catch(error => console.error("Error al conectar en MySQL:", error));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
