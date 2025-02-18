document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const switchButton = document.getElementById("switch"); // Botón para cambiar entre SQL y NoSQL
    const tableSQL = document.getElementById("tableSQL tbody");
    const tableNoSQL = document.getElementById("tableNoSQL tbody");

    // 📌 1️⃣ Evento para enviar datos
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = {
            usuario: formData.get("usuario"),
            password: formData.get("password"),
            fecha: formData.get("fecha"),
            descripcion: formData.get("descripcion"),
            imagen: formData.get("imagen").name, // Solo enviamos el nombre del archivo
            database: switchButton.checked ? "nosql" : "sql" // SQL o NoSQL
        };

        try {
            const response = await fetch("http://localhost:5000/api/guardar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error("Error en el servidor");

            alert("Datos guardados correctamente");

            // Recargar las tablas
            loadData();
        } catch (error) {
            console.error("Error:", error);
        }
    });

    // 📌 2️⃣ Función para cargar datos en ambas tablas
    async function loadData() {
        try {
            // Obtener datos de SQL
            const sqlResponse = await fetch("http://localhost:5000/api/datos/sql");
            const sqlData = await sqlResponse.json();

            // Obtener datos de NoSQL (MongoDB)
            const noSqlResponse = await fetch("http://localhost:5000/api/datos/nosql");
            const noSqlData = await noSqlResponse.json();

            // Llenar tablas
            fillTable(tableSQL, sqlData);
            fillTable(tableNoSQL, noSqlData);
        } catch (error) {
            console.error("Error al cargar los datos:", error);
        }
    }

    // 📌 3️⃣ Función para llenar las tablas
    function fillTable(table, data) {
        table.innerHTML = ""; // Limpiar tabla antes de actualizar
        data.forEach((item) => {
            const row = table.insertRow();
            row.innerHTML = `
                <td>${item.usuario}</td>
                <td>${item.password}</td>
                <td>${item.fecha}</td>
                <td>${item.descripcion}</td>
                <td><img src="${item.imagen}" width="50"></td>
            `;
        });
    }

    // 📌 4️⃣ Cargar los datos al inicio
    loadData();
});
