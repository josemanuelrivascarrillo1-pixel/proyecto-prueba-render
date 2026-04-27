const Comida = require('../models/comida.model'); // Importa el modelo de categoriass

// Crear un nuevo Comida
exports.crear = async (req, res) => {
    try {
        await Comida.crear(req.body); // Inserta los datos del body
        res.json({ mensaje: 'Comida creado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message }); // Maneja errores (ej: email duplicado)
    }
};

// Listar todos los computadoras activos
exports.listar = async (req, res) => {
    try {
        const data = await Comida.listar(); // Obtiene todos los computadoras
        res.json(data.rows); // Devuelve solo las filas
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un Comida específico por ID
exports.obtenerPorId = async (req, res) => {
    try {
        const data = await Comida.obtenerPorId(req.params.id);
        res.json(data.rows[0]); // Devuelve solo el primer registro
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar un Comida existente
exports.actualizar = async (req, res) => {
    try {
        await Comida.actualizar(req.params.id, req.body); // Actualiza con el ID de la URL
        res.json({ mensaje: 'Comida actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Desactivar Comida (soft delete)
exports.desactivar = async (req, res) => {
    try {
        await Comida.desactivar(req.params.id);
        res.json({ mensaje: 'Comida desactivado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar Comida permanentemente (hard delete)
exports.desaparecer = async (req, res) => {
    try {
        await Comida.desaparecer(req.params.id);
        res.json({ mensaje: 'Comida eliminado permanentemente' });
    } catch (error) {
        // Si tiene pedidos asociados, PostgreSQL lanzará error por la FK RESTRICT
        res.status(500).json({ error: 'No se puede eliminar: el Comida tiene pedidos asociados' });
    }
};