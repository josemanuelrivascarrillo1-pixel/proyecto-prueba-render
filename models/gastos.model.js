const Conexion = require('../config/conexion');

module.exports = {

    // Crear
    crear: (data) => Conexion.query(
        `INSERT INTO gastos(nombre, monto, descuento, total, fecha, fk_categoria) 
         VALUES($1, $2, $3, $4, $5, $6)`,
        [
            data.nombre,
            data.monto,
            data.descuento || 0,
            data.total,
            data.fecha,
            data.fk_categoria || null
        ]
    ),

    // 🔥 LISTAR DINÁMICO (ACTIVOS / INACTIVOS)
    listar: (estado = 1) => Conexion.query(`
        SELECT 
            g.pk_gasto,
            g.nombre,
            g.monto,
            g.descuento,
            g.total,
            g.fecha,
            g.estado,
            g.fk_categoria,
            c.nombre AS categoria_nombre
        FROM gastos g
        LEFT JOIN categorias c
            ON g.fk_categoria = c.pk_categoria
        WHERE g.estado = $1
        ORDER BY g.pk_gasto ASC
    `, [estado]),

    // Obtener por ID
    obtenerPorId: (id) => Conexion.query(`
        SELECT 
            g.*, 
            c.nombre AS categoria_nombre
        FROM gastos g
        LEFT JOIN categorias c
            ON g.fk_categoria = c.pk_categoria
        WHERE g.pk_gasto = $1
    `, [id]),

    // Actualizar
    actualizar: (id, data) => {
        const descuento = data.descuento || 0;
        const total = data.monto - (data.monto * descuento / 100);

        return Conexion.query(
            `UPDATE gastos 
             SET nombre=$1, monto=$2, descuento=$3, total=$4, fecha=$5, fk_categoria=$6 
             WHERE pk_gasto=$7`,
            [
                data.nombre,
                data.monto,
                descuento,
                total,
                data.fecha,
                data.fk_categoria || null,
                id
            ]
        );
    },

    // Soft delete
    desactivar: (id) => Conexion.query(
        'UPDATE gastos SET estado=0 WHERE pk_gasto=$1',
        [id]
    ),

    // Hard delete
    desaparecer: (id) => Conexion.query(
        'DELETE FROM gastos WHERE pk_gasto=$1',
        [id]
    )
};