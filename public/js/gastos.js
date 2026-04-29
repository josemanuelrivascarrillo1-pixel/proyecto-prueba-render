setTimeout(() => {

    const form = document.getElementById('formGasto');
    const tabla = document.getElementById('tablaGastos');

    if (!form) {
        console.warn('No se encontró el formulario');
        return;
    }

    listar();
    cargarCategorias();

    // ========== TOTAL EN TIEMPO REAL ==========
    const montoInput = document.getElementById('monto');
    const descuentoInput = document.getElementById('descuento');
    const totalInput = document.getElementById('total');

    function calcularTotal() {
        const monto = parseFloat(montoInput.value) || 0;
        const descuento = parseFloat(descuentoInput.value) || 0;
        const total = monto - (monto * descuento / 100);
        totalInput.value = total.toFixed(2);
    }

    montoInput?.addEventListener('input', calcularTotal);
    descuentoInput?.addEventListener('input', calcularTotal);

    // ========== SUBMIT ==========
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        console.log('SI ENTRA AL SUBMIT 🔥');

        const id = document.getElementById('pk_gasto').value;
        const nombre = document.getElementById('nombre').value.trim();
        const monto = parseFloat(document.getElementById('monto').value);
        const descuento = parseFloat(document.getElementById('descuento').value) || 0;
        const fecha = document.getElementById('fecha').value;
        const fk_categoria = document.getElementById('fk_categoria').value;

        // 🔥 VALIDACIÓN
        if (!nombre || isNaN(monto) || !fecha) {
            alert('Completa los campos obligatorios');
            return;
        }

        const total = monto - (monto * descuento / 100);

        const data = { nombre, monto, descuento, total, fecha, fk_categoria };

        console.log('Datos a enviar:', data);

        try {
            let res;

            if (id) {
                res = await fetch(`/gastos/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            } else {
                res = await fetch('/gastos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            }

            if (!res.ok) {
                const error = await res.json();
                console.error('Error del servidor:', error);
                alert('Error al guardar');
                return;
            }

            form.reset();
            totalInput.value = '';
            mostrarTabla();
            listar();

        } catch (err) {
            console.error('Error en fetch:', err);
            alert('Error de conexión');
        }
    });

    // ========== LISTAR ==========
    async function listar() {
        if (!tabla) return;

        try {
            const res = await fetch('/gastos');
            const data = await res.json();

            tabla.innerHTML = '';

            data.forEach(g => {
                tabla.innerHTML += `
                    <tr>
                        <td>${g.pk_gasto}</td>
                        <td>${g.nombre}</td>
                        <td>$${g.monto}</td>
                        <td>${g.descuento}%</td>
                        <td>$${g.total}</td>
                        <td>${g.fecha}</td>
                        <td>${g.categoria_nombre || 'Sin categoría'}</td>
                        <td>
                            <button class="btn btn-sm btn-warning"
                                onclick="editar(
                                    ${g.pk_gasto},
                                    '${g.nombre}',
                                    ${g.monto},
                                    ${g.descuento},
                                    '${g.fecha}',
                                    '${g.fk_categoria || ''}'
                                )">
                                Editar
                            </button>
                            <button class="btn btn-sm btn-secondary"
                                onclick="desactivar(${g.pk_gasto})">
                                Desactivar
                            </button>
                            <button class="btn btn-sm btn-danger"
                                onclick="desaparecer(${g.pk_gasto})">
                                Eliminar
                            </button>
                        </td>
                    </tr>
                `;
            });

            // paginación
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

    // ========== CARGAR CATEGORÍAS ==========
    async function cargarCategorias() {
        try {
            const res = await fetch('/categorias');
            const data = await res.json();

            const select = document.getElementById('fk_categoria');

            select.innerHTML = '<option value="">Seleccionar categoría</option>';

            data.forEach(c => {
                select.innerHTML += `
                    <option value="${c.pk_categoria}">
                        ${c.nombre}
                    </option>
                `;
            });

        } catch (error) {
            console.error('Error cargando categorías:', error);
        }
    }

    // ========== EDITAR ==========
    window.editar = (id, nombre, monto, descuento, fecha, fk_categoria) => {
        mostrarFormulario();

        document.getElementById('pk_gasto').value = id;
        document.getElementById('nombre').value = nombre;
        document.getElementById('monto').value = monto;
        document.getElementById('descuento').value = descuento;
        document.getElementById('fecha').value = fecha;
        document.getElementById('fk_categoria').value = fk_categoria;

        calcularTotal();
    };

    // ========== DESACTIVAR ==========
    window.desactivar = async (id) => {
        if (!confirm('¿Desactivar este gasto?')) return;

        await fetch(`/gastos/${id}/desactivar`, {
            method: 'PATCH'
        });

        listar();
    };

    // ========== ELIMINAR ==========
    window.desaparecer = async (id) => {
        if (!confirm('¿Eliminar permanentemente este gasto?')) return;

        const res = await fetch(`/gastos/${id}`, { method: 'DELETE' });
        const result = await res.json();

        if (!res.ok) {
            alert(result.error);
            return;
        }

        listar();
    };

}, 100);

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