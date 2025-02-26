document.addEventListener("DOMContentLoaded", async () => {
    const tablaDatos = document.getElementById("tablaDatos");
    const viewSwitch = document.getElementById("viewSwitch");
    const modal = new bootstrap.Modal(document.getElementById("editModal"));
    const modalForm = document.getElementById("modalForm");
    const modalNombre = document.getElementById("modalNombre");
    const modalPassword = document.getElementById("modalPassword");
    const modalFecha = document.getElementById("modalFecha");
    const modalDescripcion = document.getElementById("modalDescripcion");
    const modalImagen = document.getElementById("modalImagen");
    const modalImagenPreview = document.getElementById("modalImagenPreview");
    let editId = null;

    async function loadData() {
        if (!tablaDatos) return;
        const database = viewSwitch?.checked ? "mongo" : "mysql";
        try {
            const response = await fetch(`http://localhost:5000/api/usuarios/${database}`);
            if (!response.ok) throw new Error("Error al cargar los datos");
            const data = await response.json();
            fillTable(data);
        } catch (error) {
            console.error("Error al cargar datos:", error);
        }
    }
   
    viewSwitch.addEventListener("change", () => {
        loadData();
    });
    

    function fillTable(data) {
        console.log("Llenando tabla con datos:", data);
        tablaDatos.innerHTML = "";
        if (!data || data.length === 0) {
            tablaDatos.innerHTML = "<tr><td colspan='7'>No hay datos disponibles</td></tr>";
            return;
        }

        data.forEach(item => {
            const row = document.createElement("tr");

            const idCell = document.createElement("td");
            idCell.textContent = item.id || item._id;

            const nombreCell = document.createElement("td");
            nombreCell.textContent = item.nombre;

            const passwordCell = document.createElement("td");
            passwordCell.textContent = item.password;

            const imagenCell = document.createElement("td");
            const imagen = document.createElement("img");
            imagen.src = item.imagen_url || `http://localhost:5000/uploads/${item.imagen}` || "default.png";
            imagen.alt = "Imagen";
            imagen.width = 50;
            imagen.height = 50;
            imagenCell.appendChild(imagen);

            const fechaCell = document.createElement("td");
            fechaCell.textContent = item.fecha ? new Date(item.fecha).toLocaleDateString() : "No disponible";

            const descripcionCell = document.createElement("td");
            descripcionCell.textContent = item.descripcion;

            const accionesCell = document.createElement("td");
            const btnContainer = document.createElement("div");
            btnContainer.classList.add("btn-container");

            const editBtn = document.createElement("button");
            editBtn.classList.add("btn", "btn-warning", "edit-btn");
            editBtn.textContent = "✏ Editar";
            editBtn.dataset.id = item.id || item._id;
            editBtn.addEventListener("click", () => openEditModal(item.id || item._id));

            const deleteBtn = document.createElement("button");
            deleteBtn.classList.add("btn", "btn-danger", "delete-btn");
            deleteBtn.textContent = "🗑 Eliminar";
            deleteBtn.dataset.id = item.id || item._id;
            deleteBtn.addEventListener("click", () => deleteUser(item.id || item._id));


            btnContainer.appendChild(editBtn);
            btnContainer.appendChild(deleteBtn);
            accionesCell.appendChild(btnContainer);

            row.appendChild(idCell);
            row.appendChild(nombreCell);
            row.appendChild(passwordCell);
            row.appendChild(imagenCell);
            row.appendChild(fechaCell);
            row.appendChild(descripcionCell);
            row.appendChild(accionesCell);

            tablaDatos.appendChild(row);
        });
    }

    async function openEditModal(id) {
        const database = viewSwitch?.checked ? "mongo" : "mysql";
        try {
            const response = await fetch(`http://localhost:5000/api/usuarios/${database}/${id}`);
            if (!response.ok) throw new Error("Error al obtener usuario");
            const user = await response.json();
    
            editId = id;
            modalNombre.value = user.nombre;
            modalPassword.value = user.password;
            modalFecha.value = user.fecha ? user.fecha.split("T")[0] : "";
            modalDescripcion.value = user.descripcion;
            modalImagenPreview.src = user.imagen_url || `http://localhost:5000/uploads/${user.imagen}` || "default.png";
            modalImagenPreview.style.display = "block";
            modal.show();
        } catch (error) {
            console.error("Error al cargar usuario:", error);
            Swal.fire("Error", "No se pudo cargar el usuario.", "error");
        }
    }
    

    function deleteUser(id) {
        const database = viewSwitch.checked ? "mongo" : "mysql";
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`http://localhost:5000/api/usuarios/${database}/${id}`, {
                        method: "DELETE"
                    });

                    if (!response.ok) throw new Error("Error al eliminar usuario");

                    Swal.fire("Eliminado", "Usuario eliminado correctamente.", "success");
                    loadData();
                } catch (error) {
                    console.error("Error al eliminar usuario:", error);
                    Swal.fire("Error", "Hubo un problema al eliminar el usuario.", "error");
                }
            }
        });
    }

    modalForm.addEventListener("submit", async (e) => {
        e.preventDefault();
    
    
        if (!/^[a-zA-ZñÑáéíóúÁÉÍÓÚ]+(?:\s[a-zA-ZñÑáéíóúÁÉÍÓÚ]+)*$/.test(modalNombre.value) || /^\s/.test(modalNombre.value)) {
            Swal.fire("Error", "El nombre solo puede contener letras y no debe comenzar con espacios.", "error");
            return;
        }
    
        if (/\s/.test(modalPassword.value) || modalPassword.value.trim() === "") {
            Swal.fire("Error", "La contraseña no puede contener espacios ni estar vacía.", "error");
            return;
        }
    
        if (/^\s|\s$/.test(modalDescripcion.value) || modalDescripcion.value.trim() === "") {
            Swal.fire("Error", "La descripción no puede empezar con espacios ni estar vacía.", "error");
            return;
        }
    
        if (!modalFecha.value) {
            Swal.fire("Error", "Debes seleccionar una fecha válida.", "error");
            return;
        }
    
        if (modalImagen.files.length > 0 && !/\.(jpg|jpeg|png|gif)$/i.test(modalImagen.files[0].name)) {
            Swal.fire("Error", "Debes seleccionar una imagen en formato válido (JPG, PNG, GIF).", "error");
            return;
        }
    
        const formData = new FormData();
        formData.append("nombre", modalNombre.value);
        formData.append("password", modalPassword.value);
        formData.append("fecha", modalFecha.value);
        formData.append("descripcion", modalDescripcion.value);
    
        if (modalImagen.files.length > 0) {
            formData.append("imagen", modalImagen.files[0]);
        }
    
        const database = viewSwitch.checked ? "mongo" : "mysql";
        try {
            const response = await fetch(`http://localhost:5000/api/usuarios/${database}/${editId}`, {
                method: "PUT",
                body: formData
            });
    
            if (!response.ok) throw new Error("Error al actualizar usuario");
    
            Swal.fire("Éxito", "Usuario actualizado correctamente.", "success");
            modal.hide();
            loadData();
        } catch (error) {
            console.error("Error al actualizar usuario:", error);
            Swal.fire("Error", "No se pudo actualizar el usuario.", "error");
        }
    });

    loadData();
});
