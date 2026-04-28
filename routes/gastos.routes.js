const express = require('express');
const router = express.Router();
const controller = require('../controllers/gastos.controller'); // Importa el controlador

// GET /gastos - Listar todos los gastos
router.get('/', controller.listar);

// GET /gastos/:id - Obtener un cliente específico
router.get('/:id', controller.obtenerPorId);

// POST /gastos - Crear un nuevo cliente
router.post('/', controller.crear);

// PUT /gastos/:id - Actualizar un cliente existente
router.put('/:id', controller.actualizar);

// PATCH /gastos/:id/desactivar - Desactivar cliente (soft delete)
router.patch('/:id/desactivar', controller.desactivar);

// DELETE /gastos/:id - Eliminar cliente permanentemente (hard delete)
router.delete('/:id', controller.desaparecer);

module.exports = router; // Exporta el router para usarlo en app.js