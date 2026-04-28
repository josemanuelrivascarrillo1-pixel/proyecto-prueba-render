const Conexion = require('../config/conexion'); // Importa la conexión a PostgreSQL

module.exports = {
    // Crear un nuevo gasto
    crear: (data) => Conexion.query(
    `INSERT INTO gastos(nombre, monto, descuento, total, fecha, fk_categoria) 
     VALUES($1, $2, $3, $4, $5, $6)`,
    [data.nombre, data.monto, data.descuento || 0, data.total, data.fecha, data.fk_categoria || null
    ]
),

    // Listar todos los gastos activos (estado = 1)
    listar: () => Conexion.query(
        'SELECT * FROM gastos WHERE estado = 1 ORDER BY pk_gasto ASC'
    ),

    // Obtener un gasto por su ID (necesario para el select en pedidos)
    obtenerPorId: (id) => Conexion.query(
        'SELECT * FROM gastos WHERE pk_gasto = $1 AND estado = 1',
        [id]
    ),

    // Actualizar datos de un gasto
    actualizar: (id, data) => {
    const descuento = data.descuento || 0;
    const total = data.monto - (data.monto * descuento / 100);

    return Conexion.query(
        `UPDATE gastos 
         SET nombre=$1, monto=$2, descuento=$3, total=$4, fecha=$5, fk_categoria=$6 WHERE pk_gasto=$7`,
        [data.nombre,data.monto,descuento,total,data.fecha,data.fk_categoria || null, id]);
},

    // Desactivar gasto (soft delete - cambiar estado a 0)
    desactivar: (id) => Conexion.query(
        'UPDATE gastos SET estado=0 WHERE pk_gasto=$1',
        [id]
    ),

    // Eliminar gasto permanentemente (hard delete)
    // NOTA: Fallará si tiene pedidos asociados por la FK RESTRICT
    desaparecer: (id) => Conexion.query(
        'DELETE FROM gastos WHERE pk_gasto=$1',
        [id]
    )
};