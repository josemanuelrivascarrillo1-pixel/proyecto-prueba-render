const express = require('express');
const router = express.Router();
const controller = require('../controllers/videojuegos.controller'); // Importa el controlador

// GET /videojuegos - Listar todos los videojuegos
router.get('/', controller.listar);

// GET /videojuegos/:id - Obtener un videojuegos específico
router.get('/:id', controller.obtenerPorId);

// POST /videojuegos - Crear un nuevo videojuegos
router.post('/', controller.crear);

// PUT /videojuegos/:id - Actualizar un videojuegos existente
router.put('/:id', controller.actualizar);

// PATCH /videojuegos/:id/desactivar - Desactivar videojuegos (soft delete)
router.patch('/:id/desactivar', controller.desactivar);

// DELETE /videojuegos/:id - Eliminar videojuegos permanentemente (hard delete)
router.delete('/:id', controller.desaparecer);

module.exports = router; // Exporta el router para usarlo en app.js