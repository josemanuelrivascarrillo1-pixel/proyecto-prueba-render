const Conexion = require('../config/conexion'); // Importa la conexión a PostgreSQL

module.exports = {
    // Crear un nuevo comida
    crear: (data) => Conexion.query(
        'INSERT INTO comida(nombrePlatillo, precioPlatillo) VALUES($1, $2)',
        [data.nombrePlatillo, data.precioPlatillo]
    ),

    // Listar todos los comida activos (estado = 1)
    listar: () => Conexion.query(
        'SELECT * FROM comida WHERE estado = 1 ORDER BY pk_comida ASC'
    ),

    // Obtener un comida por su ID (necesario para el select en pedidos)
    obtenerPorId: (id) => Conexion.query(
        'SELECT * FROM comida WHERE pk_comida = $1 AND estado = 1',
        [id]
    ),

    // Actualizar datos de un comida
    actualizar: (id, data) => Conexion.query(
        'UPDATE comida SET nombrePlatillo=$1, precioPlatillo=$2 WHERE pk_comida=$3',
        [data.nombrePlatillo, data.precioPlatillo, id]
    ),

    // Desactivar comida (soft delete - cambiar estado a 0)
    desactivar: (id) => Conexion.query(
        'UPDATE comida SET estado=0 WHERE pk_comida=$1',
        [id]
    ),

    // Eliminar comida permanentemente (hard delete)
    // NOTA: Fallará si tiene pedidos asociados por la FK RESTRICT
    desaparecer: (id) => Conexion.query(
        'DELETE FROM comida WHERE pk_comida=$1',
        [id]
    )

    };