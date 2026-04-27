const Conexion = require('../config/conexion'); // Importa la conexión a PostgreSQL

module.exports = {
    // Crear un nuevo videojuegos
    crear: (data) => Conexion.query(
        'INSERT INTO videojuegos(nombre, genero, precio) VALUES($1, $2, $3)',
        [data.nombre, data.genero, data.precio]
    ),

    // Listar todos los videojuegos activos (estado = 1)
    listar: () => Conexion.query(
        'SELECT * FROM videojuegos WHERE estado = 1 ORDER BY pk_videojuego ASC'
    ),

    // Obtener un videojuegos por su ID (necesario para el select en pedidos)
    obtenerPorId: (id) => Conexion.query(
        'SELECT * FROM videojuegos WHERE pk_videojuego = $1 AND estado = 1',
        [id]
    ),

    // Actualizar datos de un videojuegos
    actualizar: (id, data) => Conexion.query(
        'UPDATE videojuegos SET nombre=$1, genero=$2, precio=$3 WHERE pk_videojuego=$4',
        [data.nombre, data.genero, data.precio, id]
    ),

    // Desactivar videojuegos (soft delete - cambiar estado a 0)
    desactivar: (id) => Conexion.query(
        'UPDATE videojuegos SET estado=0 WHERE pk_videojuego=$1',
        [id]
    ),

    // Eliminar videojuegos permanentemente (hard delete)
    // NOTA: Fallará si tiene pedidos asociados por la FK RESTRICT
    desaparecer: (id) => Conexion.query(
        'DELETE FROM videojuegos WHERE pk_videojuego=$1',
        [id]
    )

    };