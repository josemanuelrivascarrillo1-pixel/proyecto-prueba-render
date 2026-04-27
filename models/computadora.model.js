const Conexion = require('../config/conexion'); // Importa la conexión a PostgreSQL

module.exports = {
    // Crear un nuevo computadora
    crear: (data) => Conexion.query(
        'INSERT INTO computadora(nombre, precio, marca) VALUES($1, $2, $3)',
        [data.nombre, data.precio, data.marca]
    ),

    // Listar todos los computadora activos (estado = 1)
    listar: () => Conexion.query(
        'SELECT * FROM computadora WHERE estado = 1 ORDER BY pk_computadora ASC'
    ),

    // Obtener un computadora por su ID (necesario para el select en pedidos)
    obtenerPorId: (id) => Conexion.query(
        'SELECT * FROM computadora WHERE pk_computadora = $1 AND estado = 1',
        [id]
    ),

    // Actualizar datos de un computadora
    actualizar: (id, data) => Conexion.query(
        'UPDATE computadora SET nombre=$1, precio=$2, marca=$3 WHERE pk_computadora=$4',
        [data.nombre, data.precio, data.marca, id]
    ),

    // Desactivar computadora (soft delete - cambiar estado a 0)
    desactivar: (id) => Conexion.query(
        'UPDATE computadora SET estado=0 WHERE pk_computadora=$1',
        [id]
    ),

    // Eliminar computadora permanentemente (hard delete)
    // NOTA: Fallará si tiene pedidos asociados por la FK RESTRICT
    desaparecer: (id) => Conexion.query(
        'DELETE FROM computadora WHERE pk_computadora=$1',
        [id]
    )

    };