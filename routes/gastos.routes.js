const express = require('express');
const router = express.Router();
const controller = require('../controllers/gastos.controller');

// 🔥 Activos
router.get('/', controller.listar);

// 🔥 Inactivos (BONITO)
router.get('/inactivos', controller.listarInactivos);

// 🔥 Por ID (SIEMPRE AL FINAL)
router.get('/:id', controller.obtenerPorId);

router.post('/', controller.crear);
router.put('/:id', controller.actualizar);
router.patch('/:id/desactivar', controller.desactivar);
router.delete('/:id', controller.desaparecer);

module.exports = router;