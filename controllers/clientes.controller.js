// ============================================
// CONTROLADOR: clientes.controller.js
// Descripción: Maneja la lógica de negocio para clientes
// ============================================

const Cliente = require('../models/clientes.model'); // Importa el modelo de clientes

// Crear un nuevo cliente
exports.crear = async (req, res) => {
    try {
        await Cliente.crear(req.body); // Inserta los datos del body
        res.json({ mensaje: 'Cliente creado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message }); // Maneja errores (ej: email duplicado)
    }
};

// Listar todos los clientes activos
exports.listar = async (req, res) => {
    try {
        const data = await Cliente.listar(); // Obtiene todos los clientes
        res.json(data.rows); // Devuelve solo las filas
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un cliente específico por ID
exports.obtenerPorId = async (req, res) => {
    try {
        const data = await Cliente.obtenerPorId(req.params.id);
        res.json(data.rows[0]); // Devuelve solo el primer registro
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar un cliente existente
exports.actualizar = async (req, res) => {
    try {
        await Cliente.actualizar(req.params.id, req.body); // Actualiza con el ID de la URL
        res.json({ mensaje: 'Cliente actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Desactivar cliente (soft delete)
exports.desactivar = async (req, res) => {
    try {
        await Cliente.desactivar(req.params.id);
        res.json({ mensaje: 'Cliente desactivado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar cliente permanentemente (hard delete)
exports.desaparecer = async (req, res) => {
    try {
        await Cliente.desaparecer(req.params.id);
        res.json({ mensaje: 'Cliente eliminado permanentemente' });
    } catch (error) {
        // Si tiene pedidos asociados, PostgreSQL lanzará error por la FK RESTRICT
        res.status(500).json({ error: 'No se puede eliminar: el cliente tiene pedidos asociados' });
    }
};