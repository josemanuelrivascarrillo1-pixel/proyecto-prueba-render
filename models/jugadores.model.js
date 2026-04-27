const Conexion = require('../config/conexion'); // Importa la conexión a PostgreSQL

module.exports = {
    // Crear un nuevo cliente
    crear: (data) => Conexion.query(
        'INSERT INTO jugadores(nombre, apellido, edad) VALUES($1, $2, $3)',
        [data.nombre, data.apellido, data.edad]
    ),

    // Listar todos los jugadores activos (estado = 1)
    listar: () => Conexion.query(
        'SELECT * FROM jugadores WHERE estado = 1 ORDER BY pk_jugador ASC'
    ),

    // Obtener un cliente por su ID (necesario para el select en pedidos)
    obtenerPorId: (id) => Conexion.query(
        'SELECT * FROM jugadores WHERE pk_jugador = $1 AND estado = 1',
        [id]
    ),

    // Actualizar datos de un cliente
    actualizar: (id, data) => Conexion.query(
        'UPDATE jugadores SET nombre=$1, apellido=$2, edad=$3 WHERE pk_jugador=$4',
        [data.nombre, data.apellido, data.edad, id]
    ),

    // Desactivar cliente (soft delete - cambiar estado a 0)
    desactivar: (id) => Conexion.query(
        'UPDATE jugadores SET estado=0 WHERE pk_jugador=$1',
        [id]
    ),

    // Eliminar cliente permanentemente (hard delete)
    // NOTA: Fallará si tiene pedidos asociados por la FK RESTRICT
    desaparecer: (id) => Conexion.query(
        'DELETE FROM jugadores WHERE pk_jugador=$1',
        [id]
    )
};