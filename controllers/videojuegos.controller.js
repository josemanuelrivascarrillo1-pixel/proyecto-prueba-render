const videojuegos = require('../models/videojuegos.model'); // Importa el modelo de categoriass

// Crear un nuevo videojuegos
exports.crear = async (req, res) => {
    try {
        await videojuegos.crear(req.body); // Inserta los datos del body
        res.json({ mensaje: 'videojuegos creado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message }); // Maneja errores (ej: email duplicado)
    }
};

// Listar todos los videojuegos activos
exports.listar = async (req, res) => {
    try {
        const data = await videojuegos.listar(); // Obtiene todos los videojuegos
        res.json(data.rows); // Devuelve solo las filas
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un videojuegos específico por ID
exports.obtenerPorId = async (req, res) => {
    try {
        const data = await videojuegos.obtenerPorId(req.params.id);
        res.json(data.rows[0]); // Devuelve solo el primer registro
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar un videojuegos existente
exports.actualizar = async (req, res) => {
    try {
        await videojuegos.actualizar(req.params.id, req.body); // Actualiza con el ID de la URL
        res.json({ mensaje: 'videojuegos actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Desactivar videojuegos (soft delete)
exports.desactivar = async (req, res) => {
    try {
        await videojuegos.desactivar(req.params.id);
        res.json({ mensaje: 'videojuegos desactivado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar videojuegos permanentemente (hard delete)
exports.desaparecer = async (req, res) => {
    try {
        await videojuegos.desaparecer(req.params.id);
        res.json({ mensaje: 'videojuegos eliminado permanentemente' });
    } catch (error) {
        // Si tiene pedidos asociados, PostgreSQL lanzará error por la FK RESTRICT
        res.status(500).json({ error: 'No se puede eliminar: el videojuegos tiene pedidos asociados' });
    }
};