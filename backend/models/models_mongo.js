const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    password: { type: String, required: true },
    fecha: { type: Date, required: true },
    descripcion: { type: String, required: true },
    imagen: { type: String, default: "http://localhost:5000/uploads/default.jpg" }
});

module.exports = mongoose.model("Usuario", usuarioSchema);
