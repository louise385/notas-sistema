const express = require('express');
const router = express.Router();
const db = require('./database');

// Obtener todos los estudiantes
router.get('/', (req, res) => {
    db.all(
        'SELECT * FROM students ORDER BY id DESC',
        [],
        (err, rows) => {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json(rows);
        }
    );
});

// Obtener estudiante por ID
router.get('/:id', (req, res) => {

    const id = req.params.id;

    db.get(
        'SELECT * FROM students WHERE id = ?',
        [id],
        (err, row) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (!row) {
                return res.status(404).json({
                    message: 'Estudiante no encontrado'
                });
            }

            res.json(row);
        }
    );
});

// Crear estudiante
router.post('/', (req, res) => {

    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            message: 'Nombre y correo son obligatorios'
        });
    }

    db.run(
        'INSERT INTO students (name, email) VALUES (?, ?)',
        [name, email],
        function (err) {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.status(201).json({
                message: 'Estudiante creado correctamente',
                id: this.lastID
            });
        }
    );
});

// Actualizar estudiante
router.put('/:id', (req, res) => {

    const id = req.params.id;
    const { name, email } = req.body;

    db.run(
        `
        UPDATE students
        SET name = ?, email = ?
        WHERE id = ?
        `,
        [name, email, id],
        function (err) {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    message: 'Estudiante no encontrado'
                });
            }

            res.json({
                message: 'Estudiante actualizado correctamente'
            });
        }
    );
});

// Eliminar estudiante
router.delete('/:id', (req, res) => {

    const id = req.params.id;

    db.run(
        'DELETE FROM students WHERE id = ?',
        [id],
        function (err) {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    message: 'Estudiante no encontrado'
                });
            }

            res.json({
                message: 'Estudiante eliminado correctamente'
            });
        }
    );
});

module.exports = router;