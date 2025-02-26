document.addEventListener("DOMContentLoaded", async () => {
    const form = document.getElementById("registroForm");
    const nombreInput = document.getElementById("nombre");
    const passwordInput = document.getElementById("password");
    const imagenInput = document.getElementById("imagen");
    const fechaInput = document.getElementById("fecha");
    const descripcionInput = document.getElementById("descripcion");
    const submitButton = document.getElementById("submit");
    const dbSwitch = document.getElementById("dbSwitch");
    
    let editId = null;

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            if (!/^[a-zA-ZñÑáéíóúÁÉÍÓÚ]+(?:\s[a-zA-ZñÑáéíóúÁÉÍÓÚ]+)*$/.test(nombreInput.value) || /^\s/.test(nombreInput.value)) {
                Swal.fire("Error", "El nombre solo puede contener letras y no debe comenzar con espacios.", "error");
                return;
            }
            if (/^\s|\s$/.test(descripcionInput.value) || descripcionInput.value.trim() === "") {
                Swal.fire("Error", "La descripción no puede empezar con espacios ni estar vacía.", "error");
                return;
            }
            if (/\s/.test(passwordInput.value) || passwordInput.value.trim() === "") {
                Swal.fire("Error", "La contraseña no puede contener espacios ni estar vacía.", "error");
                return;
            }
            if (imagenInput.files.length === 0 || !/\.(jpg|jpeg|png|gif)$/i.test(imagenInput.files[0].name)) {
                Swal.fire("Error", "Debes seleccionar una imagen en formato válido.", "error");
                return;
            }
            if (!fechaInput.value) {
                Swal.fire("Error", "Debes seleccionar una fecha válida.", "error");
                return;
            }

            submitButton.disabled = true;
            submitButton.textContent = "Procesando...";
            const formData = new FormData(form);
            const database = dbSwitch.checked ? "mongo" : "mysql";
            formData.append("database", database);

            try {
                const method = editId ? "PUT" : "POST";
                const endpoint = editId ? `http://localhost:5000/api/usuarios/${database}/${editId}` : `http://localhost:5000/api/usuarios/${database}`;
                const response = await fetch(endpoint, { method, body: formData });
                if (!response.ok) throw new Error("Error en el servidor");
                Swal.fire("Éxito", "Operación realizada con éxito.", "success");
                form.reset();
                editId = null;
                submitButton.textContent = "Enviar";
            } catch (error) {
                console.error("Error al guardar los datos:", error);
                Swal.fire("Error", "Hubo un problema con la solicitud.", "error");
            }

            submitButton.disabled = false;
        });
    }
});
