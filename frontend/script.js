document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registroForm");
    const dbSwitch = document.getElementById("dbSwitch"); 
    const viewSwitch = document.getElementById("viewSwitch"); 
    const tablaDatos = document.getElementById("tablaDatos");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const database = dbSwitch.checked ? "mongo" : "mysql";
        formData.append("database", database);

        console.log("📤 Enviando datos:", Object.fromEntries(formData.entries()));

        try {
            const response = await fetch(`http://localhost:5000/api/usuarios/${database}`, {
                method: "POST",
                body: formData
            });

            if (!response.ok) throw new Error(`Error en el servidor: ${response.statusText}`);

            alert("Datos guardados correctamente");
            form.reset();
            loadData();
        } catch (error) {
            console.error("Error al guardar los datos:", error);
        }
    });

    async function loadData() {
        const database = viewSwitch.checked ? "mongo" : "mysql";

        try {
            const response = await fetch(`http://localhost:5000/api/usuarios/${database}`);
            if (!response.ok) throw new Error(`Error al cargar los datos: ${response.statusText}`);

            const data = await response.json();
            fillTable(data);
        } catch (error) {
            console.error("❌ Error al cargar los datos:", error);
        }
    }

    function fillTable(data) {
        tablaDatos.innerHTML = "";

        if (!data || data.length === 0) {
            tablaDatos.innerHTML = "<tr><td colspan='6'>No hay datos disponibles</td></tr>";
            return;
        }

        data.forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.id || item._id}</td>
                <td>${item.nombre}</td>
                <td>${item.password}</td>
                <td>
                    ${item.imagen ? `<img src="${item.imagen_url || `http://localhost:5000/uploads/${item.imagen}`}" alt="${item.nombre}" width="80">` : "Sin imagen"}
                </td>
                <td>${new Date(item.fecha).toLocaleDateString()}</td>
                <td>${item.descripcion}</td>
            `;
            tablaDatos.appendChild(row);
        });
    }

    viewSwitch.addEventListener("change", loadData);
    loadData();
});
