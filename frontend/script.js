document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registroForm");
    const nombreInput = document.getElementById("nombre");
    const passwordInput = document.getElementById("password");
    const imagenInput = document.getElementById("imagen");
    const fechaInput = document.getElementById("fecha");
    const descripcionInput = document.getElementById("descripcion");
    const submitButton = document.getElementById("submit");
    const dbSwitch = document.getElementById("dbSwitch");
    const viewSwitch = document.getElementById("viewSwitch");
    const tablaDatos = document.getElementById("tablaDatos");

    let editId = null;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();


        if (!/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/.test(nombreInput.value)) {
            alert("El nombre solo puede contener letras, espacios y caracteres con acentos.");
            return;
        }        

        if (/\s/.test(passwordInput.value)) {
            alert("Formato incorrecto de contraseña.");
            return;
        }

        if (imagenInput.files.length > 0) {
            const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
            if (!allowedExtensions.test(imagenInput.files[0].name)) {
                alert("Solo se permiten imágenes en esta sección.");
                return;
            }
        }

        const formData = new FormData(form);
        const database = dbSwitch.checked ? "mongo" : "mysql";
        formData.append("database", database);

        try {
            let response;

            if (editId) {
                // 🔥 Si hay un ID, hacemos una solicitud PUT (editar)
                response = await fetch(`http://localhost:5000/api/usuarios/${database}/${editId}`, {
                    method: "PUT",
                    body: formData
                });
            } else {
                // 🔥 Si no hay ID, hacemos una solicitud POST (crear)
                response = await fetch(`http://localhost:5000/api/usuarios/${database}`, {
                    method: "POST",
                    body: formData
                });
            }

            if (!response.ok) throw new Error(`Error en el servidor: ${response.statusText}`);

            alert(editId ? "Usuario actualizado correctamente" : "Usuario guardado correctamente");

            form.reset();
            editId = null;
            submitButton.value = "Enviar";

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
            console.error("Error al cargar los datos:", error);
        }
    }

    function fillTable(data) {
        tablaDatos.innerHTML = "";

        if (!data || data.length === 0) {
            tablaDatos.innerHTML = "<tr><td colspan='7'>No hay datos disponibles</td></tr>";
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
                <td>
                    <button class="edit-btn" data-id="${item.id || item._id}">✏ Editar</button>
                    <button class="delete-btn" data-id="${item.id || item._id}">🗑 Eliminar</button>
                </td>
            `;
            tablaDatos.appendChild(row);
        });

        document.querySelectorAll(".edit-btn").forEach(button => {
            button.addEventListener("click", editUser);
        });

        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", deleteUser);
        });
    }

    async function deleteUser(event) {
        const id = event.target.dataset.id;
        const database = viewSwitch.checked ? "mongo" : "mysql";

        if (confirm("¿Seguro que quieres eliminar este usuario?")) {
            try {
                const response = await fetch(`http://localhost:5000/api/usuarios/${database}/${id}`, {
                    method: "DELETE"
                });

                if (!response.ok) throw new Error("Error al eliminar el usuario");

                alert("Usuario eliminado correctamente");
                loadData();
            } catch (error) {
                console.error("Error al eliminar:", error);
            }
        }
    }

    function editUser(event) {
        const id = event.target.dataset.id;
        const database = viewSwitch.checked ? "mongo" : "mysql";

        fetch(`http://localhost:5000/api/usuarios/${database}/${id}`)
            .then(response => response.json())
            .then(user => {

                nombreInput.value = user.nombre;
                passwordInput.value = user.password;
                fechaInput.value = user.fecha.split("T")[0];
                descripcionInput.value = user.descripcion;

                editId = id; 
                submitButton.value = "Actualizar";
            })
            .catch(error => console.error("Error al obtener usuario:", error));
    }

    viewSwitch.addEventListener("change", loadData);
    loadData();
});
