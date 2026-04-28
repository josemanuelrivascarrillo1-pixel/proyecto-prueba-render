const Gastos = require('../models/gastos.model'); // Importa el modelo de Gastoss

// Crear un nuevo Gastos
exports.crear = async (req, res) => {
    try {
        await Gastos.crear(req.body); // Inserta los datos del body
        res.json({ mensaje: 'Gastos creado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message }); // Maneja errores (ej: email duplicado)
    }
};

// Listar todos los Gastoss activos
exports.listar = async (req, res) => {
    try {
        const data = await Gastos.listar(); // Obtiene todos los Gastoss
        res.json(data.rows); // Devuelve solo las filas
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un Gastos específico por ID
exports.obtenerPorId = async (req, res) => {
    try {
        const data = await Gastos.obtenerPorId(req.params.id);
        res.json(data.rows[0]); // Devuelve solo el primer registro
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar un Gastos existente
exports.actualizar = async (req, res) => {
    try {
        await Gastos.actualizar(req.params.id, req.body); // Actualiza con el ID de la URL
        res.json({ mensaje: 'Gastos actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Desactivar Gastos (soft delete)
exports.desactivar = async (req, res) => {
    try {
        await Gastos.desactivar(req.params.id);
        res.json({ mensaje: 'Gastos desactivado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar Gastos permanentemente (hard delete)
exports.desaparecer = async (req, res) => {
    try {
        await Gastos.desaparecer(req.params.id);
        res.json({ mensaje: 'Gastos eliminado permanentemente' });
    } catch (error) {
        // Si tiene pedidos asociados, PostgreSQL lanzará error por la FK RESTRICT
        res.status(500).json({ error: 'No se puede eliminar: el Gastos tiene pedidos asociados' });
    }
};