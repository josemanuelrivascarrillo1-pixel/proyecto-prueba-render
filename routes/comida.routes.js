const express = require('express');
const router = express.Router();
const controller = require('../controllers/comida.controller'); // Importa el controlador

// GET /COMIDA - Listar todos los COMIDA
router.get('/', controller.listar);

// GET /COMIDA/:id - Obtener un COMIDA específico
router.get('/:id', controller.obtenerPorId);

// POST /COMIDA - Crear un nuevo COMIDA
router.post('/', controller.crear);

// PUT /COMIDA/:id - Actualizar un COMIDA existente
router.put('/:id', controller.actualizar);

// PATCH /COMIDA/:id/desactivar - Desactivar COMIDA (soft delete)
router.patch('/:id/desactivar', controller.desactivar);

// DELETE /COMIDA/:id - Eliminar COMIDA permanentemente (hard delete)
router.delete('/:id', controller.desaparecer);

module.exports = router; // Exporta el router para usarlo en app.js