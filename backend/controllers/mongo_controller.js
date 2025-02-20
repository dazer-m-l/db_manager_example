const Usuario = require("../models/models_mongo");

const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json(usuarios);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const obtenerUsuarioPorId = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.json(usuario);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const crearUsuario = async (req, res) => {
    try {
        const { nombre, password, fecha, descripcion } = req.body;
        const imagen = req.file ? req.file.filename : "default.jpg";

        const nuevoUsuario = new Usuario({ nombre, password, fecha, descripcion, imagen });
        await nuevoUsuario.save();
        res.json(nuevoUsuario);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const actualizarUsuario = async (req, res) => {
    try {
        const { nombre, password, fecha, descripcion } = req.body;
        const imagen = req.file ? req.file.filename : undefined;

        let updateData = { nombre, password, fecha, descripcion };
        if (imagen) updateData.imagen = imagen;

        const usuarioActualizado = await Usuario.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!usuarioActualizado) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json(usuarioActualizado);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const eliminarUsuario = async (req, res) => {
    try {
        const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
        if (!usuarioEliminado) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.json({ message: "Usuario eliminado correctamente" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
};
