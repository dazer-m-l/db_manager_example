const { DataTypes } = require("sequelize");
const sequelize = require("../dbConfig/mysqlConfig");

const UsuarioMySQL = sequelize.define("Usuario", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    imagen: { 
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "default.jpg" 
    }
}, {
    tableName: "usuarios",
    timestamps: false
});

module.exports = UsuarioMySQL;
