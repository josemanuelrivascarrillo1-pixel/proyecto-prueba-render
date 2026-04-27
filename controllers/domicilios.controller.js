const domicilio = require('../models/domicilios.model'); // Importa el modelo de categoriass

// Crear un nuevo domicilio
exports.crear = async (req, res) => {
    try {
        await domicilio.crear(req.body); // Inserta los datos del body
        res.json({ mensaje: 'domicilio creado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message }); // Maneja errores (ej: email duplicado)
    }
};

// Listar todos los categoriass activos
exports.listar = async (req, res) => {
    try {
        const data = await domicilio.listar(); // Obtiene todos los categoriass
        res.json(data.rows); // Devuelve solo las filas
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un domicilio específico por ID
exports.obtenerPorId = async (req, res) => {
    try {
        const data = await domicilio.obtenerPorId(req.params.id);
        res.json(data.rows[0]); // Devuelve solo el primer registro
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar un domicilio existente
exports.actualizar = async (req, res) => {
    try {
        await domicilio.actualizar(req.params.id, req.body); // Actualiza con el ID de la URL
        res.json({ mensaje: 'domicilio actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Desactivar domicilio (soft delete)
exports.desactivar = async (req, res) => {
    try {
        await domicilio.desactivar(req.params.id);
        res.json({ mensaje: 'domicilio desactivado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar domicilio permanentemente (hard delete)
exports.desaparecer = async (req, res) => {
    try {
        await domicilio.desaparecer(req.params.id);
        res.json({ mensaje: 'domicilio eliminado permanentemente' });
    } catch (error) {
        // Si tiene pedidos asociados, PostgreSQL lanzará error por la FK RESTRICT
        res.status(500).json({ error: 'No se puede eliminar: el domicilio tiene pedidos asociados' });
    }
};