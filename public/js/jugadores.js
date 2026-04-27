setTimeout(() => {


    // Obtener referencias a elementos del DOM
    const form = document.getElementById('formJugador');
    const tabla = document.getElementById('tablaJugadores');


    // Cargar la lista de jugadores al iniciar
    listar();


    // ========== SUBMIT DEL FORMULARIO ==========
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();


            // Obtener valores de los campos del formulario
            const id = document.getElementById('pk_jugador').value;
            const nombre = document.getElementById('nombre').value;
            const apellido = document.getElementById('apellido').value;
            const edad = document.getElementById('edad').value;


            // Crear objeto con los datos
            const data = { nombre, apellido, edad };


            // Determinar si es actualización o creación
            if (id) {
                // PUT - Actualizar jugador existente
                await fetch(`/jugadores/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            } else {
                // POST - Crear nuevo jugador
                await fetch('/jugadores', {
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


    // ========== LISTAR JUGADORES ==========
    async function listar() {
        if (!tabla) return;


        // Hacer petición GET al backend
        const res = await fetch('/jugadores');
        const data = await res.json();


        // Limpiar contenido anterior de la tabla
        tabla.innerHTML = '';


        // Iterar sobre cada jugador y crear una fila
        data.forEach(j => {
            tabla.innerHTML += `
                <tr>
                    <td>${j.pk_jugador}</td>
                    <td>${j.nombre}</td>
                    <td>${j.apellido}</td>
                    <td>${j.edad || 'N/A'}</td>
                    <td>
                        <button class="btn btn-sm btn-warning"
                            onclick="editar(${j.pk_jugador}, '${j.nombre}', '${j.apellido}', '${j.edad || ''}')">
                            Editar
                        </button>
                        <button class="btn btn-sm btn-secondary"
                            onclick="desactivar(${j.pk_jugador})">
                            Desactivar
                        </button>
                        <button class="btn btn-sm btn-danger"
                            onclick="desaparecer(${j.pk_jugador})">
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


            await new Promise(resolve => setTimeout(resolve, 10));


            initPaginacion({
                tbodyId: 'tablaJugadores',
                filasPorPagina: 10
            });
        }
    }


    // ========== EDITAR JUGADOR ==========
    window.editar = (id, nombre, apellido, edad) => {
        mostrarFormulario();


        // Llenar los campos con los datos del jugador
        document.getElementById('pk_jugador').value = id;
        document.getElementById('nombre').value = nombre;
        document.getElementById('apellido').value = apellido;
        document.getElementById('edad').value = edad;
    };


    // ========== DESACTIVAR JUGADOR (SOFT DELETE) ==========
    window.desactivar = async (id) => {
        if (!confirm('¿Desactivar este jugador?')) return;


        await fetch(`/jugadores/${id}/desactivar`, {
            method: 'PATCH'
        });


        listar();
    };


    // ========== ELIMINAR JUGADOR (HARD DELETE) ==========
    window.desaparecer = async (id) => {
        if (!confirm('¿Eliminar permanentemente este jugador? Esta acción no se puede deshacer.')) return;


        const res = await fetch(`/jugadores/${id}`, { method: 'DELETE' });
        const result = await res.json();


        if (!res.ok) {
            alert(result.error);
            return;
        }


        listar();
    };


}, 100);


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
    const form = document.getElementById('formJugador');
    const f = document.getElementById('contenedorFormulario');
    const t = document.getElementById('contenedorTabla');
    const b = document.getElementById('btnCancelar');
    const id = document.getElementById('pk_jugador');


    if (form) form.reset();
    if (id) id.value = '';
    if (f) f.classList.add('d-none');
    if (t) t.classList.remove('d-none');
    if (b) b.classList.add('d-none');
};
