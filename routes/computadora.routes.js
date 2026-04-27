const express = require('express');
const router = express.Router();
const controller = require('../controllers/computadora.controller'); // Importa el controlador

// GET /computadora - Listar todos los computadora
router.get('/', controller.listar);

// GET /computadora/:id - Obtener un computadora específico
router.get('/:id', controller.obtenerPorId);

// POST /computadora - Crear un nuevo computadora
router.post('/', controller.crear);

// PUT /computadora/:id - Actualizar un computadora existente
router.put('/:id', controller.actualizar);

// PATCH /computadora/:id/desactivar - Desactivar computadora (soft delete)
router.patch('/:id/desactivar', controller.desactivar);

// DELETE /computadora/:id - Eliminar computadora permanentemente (hard delete)
router.delete('/:id', controller.desaparecer);

module.exports = router; // Exporta el router para usarlo en app.js