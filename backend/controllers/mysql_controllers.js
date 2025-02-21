const db = require("../dbConfig/mysqlConfig");

const obtenerUsuarios = async (req, res) => {
    try {
        const [results] = await db.query("SELECT *, CONCAT('http://localhost:5000/uploads/', imagen) AS imagen_url FROM usuarios");
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const obtenerUsuarioPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const [results] = await db.query("SELECT *, CONCAT('http://localhost:5000/uploads/', imagen) AS imagen_url FROM usuarios WHERE id = ?", [id]);

        if (results.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json(results[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const crearUsuario = async (req, res) => {
    try {

        const { nombre, password, fecha, descripcion } = req.body;
        const imagen = req.file ? req.file.filename : "default.jpg";

        if (!nombre || !password || !fecha || !descripcion) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        const [result] = await db.query(
            "INSERT INTO usuarios (nombre, password, fecha, descripcion, imagen) VALUES (?, ?, ?, ?, ?)",
            [nombre, password, fecha, descripcion, imagen]
        );

        res.json({ id: result.insertId, nombre, password, fecha, descripcion, imagen });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const actualizarUsuario = async (req, res) => {
    try {
        const { nombre, password, fecha, descripcion } = req.body;
        const imagen = req.file ? req.file.filename : undefined;
        const { id } = req.params;

        if (!nombre || !password || !fecha || !descripcion) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        let sql = "UPDATE usuarios SET nombre=?, password=?, fecha=?, descripcion=?";
        let values = [nombre, password, fecha, descripcion];

        if (imagen) {
            sql += ", imagen=?";
            values.push(imagen);
        }

        sql += " WHERE id=?";
        values.push(id);

        const [result] = await db.query(sql, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json({ message: "Usuario actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query("DELETE FROM usuarios WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
};
