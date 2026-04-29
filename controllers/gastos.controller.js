const Gastos = require('../models/gastos.model');

// Crear
exports.crear = async (req, res) => {
    try {
        await Gastos.crear(req.body);
        res.json({ mensaje: 'Gasto creado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// LISTAR (ACTIVOS / INACTIVOS CON QUERY)
exports.listar = async (req, res) => {
    try {
        const data = await Gastos.listar(1);
        res.json(data.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.listarInactivos = async (req, res) => {
    try {
        const data = await Gastos.listar(0);
        res.json(data.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener por ID
exports.obtenerPorId = async (req, res) => {
    try {
        const data = await Gastos.obtenerPorId(req.params.id);
        res.json(data.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar
exports.actualizar = async (req, res) => {
    try {
        await Gastos.actualizar(req.params.id, req.body);
        res.json({ mensaje: 'Gasto actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Soft delete (desactivar)
exports.desactivar = async (req, res) => {
    try {
        await Gastos.desactivar(req.params.id);
        res.json({ mensaje: 'Gasto desactivado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Hard delete
exports.desaparecer = async (req, res) => {
    try {
        await Gastos.desaparecer(req.params.id);
        res.json({ mensaje: 'Gasto eliminado permanentemente' });
    } catch (error) {
        res.status(500).json({ error: 'No se puede eliminar: tiene relaciones' });
    }
};