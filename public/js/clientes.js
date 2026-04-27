// ============================================
// JAVASCRIPT: clientes.js
// Descripción: Maneja la lógica del frontend para clientes
// ============================================

setTimeout(() => {

    // Obtener referencias a elementos del DOM
    const form = document.getElementById('formCliente');
    const tabla = document.getElementById('tablaClientes');

    // Cargar la lista de clientes al iniciar
    listar();

    // ========== SUBMIT DEL FORMULARIO ==========
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevenir recarga de página

            // Obtener valores de los campos del formulario
            const id = document.getElementById('pk_cliente').value;
            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const telefono = document.getElementById('telefono').value;
            const direccion = document.getElementById('direccion').value;

            // Crear objeto con los datos
            const data = { nombre, email, telefono, direccion };

            // Determinar si es actualización o creación
            if (id) {
                // PUT - Actualizar cliente existente
                await fetch(`/clientes/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            } else {
                // POST - Crear nuevo cliente
                await fetch('/clientes', {
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

    // ========== LISTAR CLIENTES ==========
    async function listar() {
        if (!tabla) return; // Verificar que la tabla exista

        // Hacer petición GET al backend
        const res = await fetch('/clientes');
        const data = await res.json();

        // Limpiar contenido anterior de la tabla
        tabla.innerHTML = '';

        // Iterar sobre cada cliente y crear una fila
        data.forEach(c => {
            tabla.innerHTML += `
                <tr>
                    <td>${c.pk_cliente}</td>
                    <td>${c.nombre}</td>
                    <td>${c.email}</td>
                    <td>${c.telefono || 'N/A'}</td>
                    <td>${c.direccion || 'N/A'}</td>
                    <td>
                        <button class="btn btn-sm btn-warning"
                            onclick="editar(${c.pk_cliente}, '${c.nombre}', '${c.email}', '${c.telefono || ''}', '${c.direccion || ''}')">
                            Editar
                        </button>
                        <button class="btn btn-sm btn-secondary"
                            onclick="desactivar(${c.pk_cliente})">
                            Desactivar
                        </button>
                        <button class="btn btn-sm btn-danger"
                            onclick="desaparecer(${c.pk_cliente})">
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
                tbodyId: 'tablaClientes',
                filasPorPagina: 10
            });
        }
    }

    // ========== EDITAR CLIENTE ==========
    // Función global para cargar datos en el formulario
    window.editar = (id, nombre, email, telefono, direccion) => {
        mostrarFormulario(); // Mostrar el formulario
        
        // Llenar los campos con los datos del cliente
        document.getElementById('pk_cliente').value = id;
        document.getElementById('nombre').value = nombre;
        document.getElementById('email').value = email;
        document.getElementById('telefono').value = telefono;
        document.getElementById('direccion').value = direccion;
    };

    // ========== DESACTIVAR CLIENTE (SOFT DELETE) ==========
    window.desactivar = async (id) => {
        // Confirmar acción
        if (!confirm('¿Desactivar este cliente?')) return;
        
        // PATCH - Cambiar estado a 0
        await fetch(`/clientes/${id}/desactivar`, {
            method: 'PATCH'
        });
        
        // Recargar la lista
        listar();
    };

    // ========== ELIMINAR CLIENTE (HARD DELETE) ==========
    window.desaparecer = async (id) => {
        // Confirmar acción
        if (!confirm('¿Eliminar permanentemente este cliente? Esta acción no se puede deshacer.')) return;
        
        // DELETE - Eliminar de la base de datos
        const res = await fetch(`/clientes/${id}`, { method: 'DELETE' });
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
    const form = document.getElementById('formCliente');
    const f = document.getElementById('contenedorFormulario');
    const t = document.getElementById('contenedorTabla');
    const b = document.getElementById('btnCancelar');
    const id = document.getElementById('pk_cliente');

    if (form) form.reset(); // Limpiar formulario
    if (id) id.value = ''; // Limpiar ID oculto
    if (f) f.classList.add('d-none');
    if (t) t.classList.remove('d-none');
    if (b) b.classList.add('d-none');
};