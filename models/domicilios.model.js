const Conexion = require('../config/conexion'); // Importa la conexión a PostgreSQL

module.exports = {
    // Crear un nuevo categorias
    crear: (data) => Conexion.query(
        'INSERT INTO domicilio(nombre, numero) VALUES($1, $2)',
        [data.nombre, data.numero]
    ),

    // Listar todos los categorias activos (estado = 1)
    listar: () => Conexion.query(
        'SELECT * FROM domicilio WHERE estado = 1 ORDER BY pk_domicilio ASC'
    ),

    // Obtener un categorias por su ID (necesario para el select en pedidos)
    obtenerPorId: (id) => Conexion.query(
        'SELECT * FROM domicilio WHERE pk_domicilio = $1 AND estado = 1',
        [id]
    ),

    // Actualizar datos de un categorias
    actualizar: (id, data) => Conexion.query(
        'UPDATE domicilio SET nombre=$1, numero=$2 WHERE pk_domicilio=$3',
        [data.nombre, data.numero, id]
    ),

    // Desactivar categorias (soft delete - cambiar estado a 0)
    desactivar: (id) => Conexion.query(
        'UPDATE domicilio SET estado=0 WHERE pk_domicilio=$1',
        [id]
    ),

    // Eliminar categorias permanentemente (hard delete)
    // NOTA: Fallará si tiene pedidos asociados por la FK RESTRICT
    desaparecer: (id) => Conexion.query(
        'DELETE FROM domicilio WHERE pk_domicilio=$1',
        [id]
    )
};