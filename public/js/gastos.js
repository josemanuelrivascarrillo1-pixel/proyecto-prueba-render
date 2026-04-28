setTimeout(() => {

    const form = document.getElementById('formGasto');
    const tabla = document.getElementById('tablaGastos');

    listar();

    // ========== SUBMIT ==========
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const id = document.getElementById('pk_gasto').value;
            const nombre = document.getElementById('nombre').value;
            const monto = parseFloat(document.getElementById('monto').value);
            const descuento = parseFloat(document.getElementById('descuento').value) || 0;
            const fecha = document.getElementById('fecha').value;
            const fk_categoria = document.getElementById('fk_categoria').value;

            // calcular total automáticamente
            const total = monto - (monto * descuento / 100);

            const data = { nombre, monto, descuento, total, fecha, fk_categoria };

            if (id) {
                await fetch(`/gastos/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            } else {
                await fetch('/gastos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            }

            form.reset();
            mostrarTabla();
            listar();
        });
    }

    // ========== LISTAR ==========
    async function listar() {
        if (!tabla) return;

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
                    <td>${g.fk_categoria || 'N/A'}</td>
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

        // paginación (igual que tu código)
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