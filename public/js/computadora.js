setTimeout(() => {

    // Obtener referencias a elementos del DOM
    const form = document.getElementById('formComputadora');
    const tabla = document.getElementById('tablaComputadora');

    // Cargar la lista de categoria al iniciar
    listar();

    // ========== SUBMIT DEL FORMULARIO ==========
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevenir recarga de página

            // Obtener valores de los campos del formulario
            const id = document.getElementById('pk_computadora').value;
            const nombre = document.getElementById('nombre').value;
            const precio = document.getElementById('precio').value;
            const marca = document.getElementById('marca').value;
        

            // Crear objeto con los datos
            const data = { nombre, precio, marca };

            // Determinar si es actualización o creación
            if (id) {
                // PUT - Actualizar categoria existente
                await fetch(`/computadora/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            } else {
                // POST - Crear nuevo categoria
                await fetch('/computadora', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            }

            // Limpiar formulario y recargar tabla
            form.reset();
            mostrarTabla();
            listar();
        });
    }

    // ========== LISTAR COMPUTADORA ==========
    async function listar() {
        if (!tabla) return; // Verificar que la tabla exista

        // Hacer petición GET al backend
        const res = await fetch('/computadora');
        const data = await res.json();

        // Limpiar contenido anterior de la tabla
        tabla.innerHTML = '';

        // Iterar sobre cada categoria y crear una fila
        data.forEach(c => {
            tabla.innerHTML += `
                <tr>
                    <td>${c.pk_computadora}</td>
                    <td>${c.nombre}</td>
                    <td>${c.precio}</td>
                    <td>${c.marca}</td>
                    <td>${c.fecha_registro}</td>
                    <td>${c.estado}</td>
                    <td>
                        <button class="btn btn-sm btn-warning"
                            onclick="editar(${c.pk_computadora}, '${c.nombre}', '${c.precio}', '${c.marca}')">
                            Editar
                        </button>
                        <button class="btn btn-sm btn-secondary"
                            onclick="desactivar(${c.pk_computadora})">
                            Desactivar
                        </button>
                        <button class="btn btn-sm btn-danger"
                            onclick="desaparecer(${c.pk_computadora})">
                            Eliminar
                        </button>
                    </td>
                </tr>
            `;
        });

        // Cargar el footer de paginación y luego inicializarla
        const footer = document.getElementById('footer-paginacion');
        if (footer) {
            const resFooter = await fetch('/views/partials/footer-table.html');
            footer.innerHTML = await resFooter.text();
            
            // Esperar un momento para que el DOM se actualice
            await new Promise(resolve => setTimeout(resolve, 10));
            
            // Inicializar paginación
            initPaginacion({
                tbodyId: 'tablaComputadora',
                filasPorPagina: 10
            });
        }
    }

    // ========== EDITAR COMPUTADORA ==========
    // Función global para cargar datos en el formulario
    window.editar = (id, nombre, precio, marca ) => {
        mostrarFormulario(); // Mostrar el formulario
        
        // Llenar los campos con los datos del categoria
        document.getElementById('pk_computadora').value = id;
        document.getElementById('nombre').value = nombre;
        document.getElementById('precio').value = precio;
        document.getElementById('marca').value = marca;

    };

    // ========== DESACTIVAR COMPUTADORA (SOFT DELETE) ==========
    window.desactivar = async (id) => {
        // Confirmar acción
        if (!confirm('¿Desactivar este computadora?')) return;
        
        // PATCH - Cambiar estado a 0
        await fetch(`/computadora/${id}/desactivar`, {
            method: 'PATCH'
        });
        
        // Recargar la lista
        listar();
    };

    // ========== ELIMINAR COMPUTADORA (HARD DELETE) ==========
    window.desaparecer = async (id) => {
        // Confirmar acción
        if (!confirm('¿Eliminar permanentemente este computadora? Esta acción no se puede deshacer.')) return;
        
        // DELETE - Eliminar de la base de datos
        const res = await fetch(`/computadora/${id}`, { method: 'DELETE' });
        const result = await res.json();
        
        // Mostrar mensaje de error si tiene pedidos asociados
        if (!res.ok) {
            alert(result.error);
            return;
        }
        
        // Recargar la lista
        listar();
    };

}, 100); // Timeout para asegurar que el DOM esté listo

// ========== FUNCIONES GLOBALES DE UI ==========

// Mostrar el formulario y ocultar la tabla
window.mostrarFormulario = function () {
    const f = document.getElementById('contenedorFormulario');
    const t = document.getElementById('contenedorTabla');
    const b = document.getElementById('btnCancelar');

    if (f) f.classList.remove('d-none');
    if (t) t.classList.add('d-none');
    if (b) b.classList.remove('d-none');
};

// Mostrar la tabla y ocultar el formulario
window.mostrarTabla = function () {
    const form = document.getElementById('formComputadora');
    const f = document.getElementById('contenedorFormulario');
    const t = document.getElementById('contenedorTabla');
    const b = document.getElementById('btnCancelar');
    const id = document.getElementById('pk_computadora');

    if (form) form.reset(); // Limpiar formulario
    if (id) id.value = ''; // Limpiar ID oculto
    if (f) f.classList.add('d-none');
    if (t) t.classList.remove('d-none');
    if (b) b.classList.add('d-none');
};