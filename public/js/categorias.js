setTimeout(() => {

    // Obtener referencias a elementos del DOM
    const form = document.getElementById('formCategorias');
    const tabla = document.getElementById('tablacategorias');

    // Cargar la lista de categoria al iniciar
    listar();

    // ========== SUBMIT DEL FORMULARIO ==========
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevenir recarga de página

            // Obtener valores de los campos del formulario
            const id = document.getElementById('pk_categoria').value;
            const nombre = document.getElementById('nombre').value;
        

            // Crear objeto con los datos
            const data = { nombre };

            // Determinar si es actualización o creación
            if (id) {
                // PUT - Actualizar categoria existente
                await fetch(`/categorias/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            } else {
                // POST - Crear nuevo categoria
                await fetch('/categorias', {
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

async function listar() {
    if (!tabla) return;

    try {
        const res = await fetch('/categorias');
        const data = await res.json();

        tabla.innerHTML = '';

        data.forEach(c => {
            tabla.innerHTML += `
                <tr>
                    <td>${c.pk_categoria}</td>
                    <td>${c.nombre}</td>
                    <td>${c.fecha_registro}</td>
                    <td>${c.estado}</td>
                    <td>
                        <button class="btn btn-sm btn-warning"
                            onclick="editar(${c.pk_categoria}, '${c.nombre}')">
                            Editar
                        </button>
                        <button class="btn btn-sm btn-secondary"
                            onclick="desactivar(${c.pk_categoria})">
                            Desactivar
                        </button>
                        <button class="btn btn-sm btn-danger"
                            onclick="desaparecer(${c.pk_categoria})">
                            Eliminar
                        </button>
                    </td>
                </tr>
            `;
        });

        const footer = document.getElementById('footer-paginacion');
        if (footer) {
            const resFooter = await fetch('/views/partials/footer-table.html');
            footer.innerHTML = await resFooter.text();

            await new Promise(resolve => setTimeout(resolve, 10));

            initPaginacion({
                tbodyId: 'tablaGastos',
                filasPorPagina: 10
            });
        }

    } catch (error) {
        console.error('Error listando:', error);
    }
}

    // ========== EDITAR CLIENTE ==========
    // Función global para cargar datos en el formulario
    window.editar = (id, nombre ) => {
        mostrarFormulario(); // Mostrar el formulario
        
        // Llenar los campos con los datos del categoria
        document.getElementById('pk_categoria').value = id;
        document.getElementById('nombre').value = nombre;

    };

    // ========== DESACTIVAR CLIENTE (SOFT DELETE) ==========
    window.desactivar = async (id) => {
        // Confirmar acción
        if (!confirm('¿Desactivar este categoria?')) return;
        
        // PATCH - Cambiar estado a 0
        await fetch(`/categorias/${id}/desactivar`, {
            method: 'PATCH'
        });
        
        // Recargar la lista
        listar();
    };

    // ========== ELIMINAR CLIENTE (HARD DELETE) ==========
    window.desaparecer = async (id) => {
        // Confirmar acción
        if (!confirm('¿Eliminar permanentemente este categoria? Esta acción no se puede deshacer.')) return;
        
        // DELETE - Eliminar de la base de datos
        const res = await fetch(`/categorias/${id}`, { method: 'DELETE' });
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
    const form = document.getElementById('formCategoria');
    const f = document.getElementById('contenedorFormulario');
    const t = document.getElementById('contenedorTabla');
    const b = document.getElementById('btnCancelar');
    const id = document.getElementById('pk_categoria');

    if (form) form.reset(); // Limpiar formulario
    if (id) id.value = ''; // Limpiar ID oculto
    if (f) f.classList.add('d-none');
    if (t) t.classList.remove('d-none');
    if (b) b.classList.add('d-none');
};