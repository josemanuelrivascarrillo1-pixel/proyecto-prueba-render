const Conexion = require('../config/conexion'); // Importa la conexión a PostgreSQL

module.exports = {
    // Crear un nuevo categorias
    crear: (data) => Conexion.query(
        'INSERT INTO categorias(nombre) VALUES($1)',
        [data.nombre]
    ),

    // Listar todos los categorias activos (estado = 1)
    listar: () => Conexion.query(
        'SELECT * FROM categorias WHERE estado = 1 ORDER BY pk_categoria ASC'
    ),

    // Obtener un categorias por su ID (necesario para el select en pedidos)
    obtenerPorId: (id) => Conexion.query(
        'SELECT * FROM categorias WHERE pk_categoria = $1 AND estado = 1',
        [id]
    ),

    // Actualizar datos de un categorias
    actualizar: (id, data) => Conexion.query(
        'UPDATE categorias SET nombre=$1 WHERE pk_categoria=$2',
        [data.nombre, id]
    ),

    // Desactivar categorias (soft delete - cambiar estado a 0)
    desactivar: (id) => Conexion.query(
        'UPDATE categorias SET estado=0 WHERE pk_categoria=$1',
        [id]
    ),

    // Eliminar categorias permanentemente (hard delete)
    // NOTA: Fallará si tiene pedidos asociados por la FK RESTRICT
    desaparecer: (id) => Conexion.query(
        'DELETE FROM categorias WHERE pk_categoria=$1',
        [id]
    )
};