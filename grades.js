const express = require('express');
const router = express.Router();
const db = require('./database');

// Obtener todas las notas con nombre del estudiante
router.get('/', (req, res) => {

const query = `
    SELECT
        grades.id,
        grades.student_id,
        students.name AS student_name,
        grades.subject,
        grades.grade
    FROM grades
    INNER JOIN students
    ON grades.student_id = students.id
    ORDER BY grades.id DESC
`;

    db.all(query, [], (err, rows) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(rows);
    });

});

// Obtener una nota por ID
router.get('/:id', (req, res) => {

    const id = req.params.id;

    db.get(
        `
SELECT
    grades.id,
    grades.student_id,
    students.name AS student_name,
    grades.subject,
    grades.grade
        FROM grades
        INNER JOIN students
        ON grades.student_id = students.id
        WHERE grades.id = ?
        `,
        [id],
        (err, row) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (!row) {
                return res.status(404).json({
                    message: 'Nota no encontrada'
                });
            }

            res.json(row);
        }
    );
});

// Crear nota
router.post('/', (req, res) => {

    const {
        student_id,
        subject,
        grade
    } = req.body;

    if (!student_id || !subject || grade === undefined) {
        return res.status(400).json({
            message: 'Todos los campos son obligatorios'
        });
    }

    if (grade < 0 || grade > 5) {
        return res.status(400).json({
            message: 'La nota debe estar entre 0 y 5'
        });
    }

    db.run(
        `
        INSERT INTO grades
        (student_id, subject, grade)
        VALUES (?, ?, ?)
        `,
        [student_id, subject, grade],
        function(err) {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.status(201).json({
                message: 'Nota registrada correctamente',
                id: this.lastID
            });
        }
    );
});

// Actualizar nota
router.put('/:id', (req, res) => {

    const id = req.params.id;

    const {
        student_id,
        subject,
        grade
    } = req.body;

    if (grade < 0 || grade > 5) {
        return res.status(400).json({
            message: 'La nota debe estar entre 0 y 5'
        });
    }

    db.run(
        `
        UPDATE grades
        SET
            student_id = ?,
            subject = ?,
            grade = ?
        WHERE id = ?
        `,
        [
            student_id,
            subject,
            grade,
            id
        ],
        function(err) {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    message: 'Nota no encontrada'
                });
            }

            res.json({
                message: 'Nota actualizada correctamente'
            });
        }
    );
});

// Eliminar nota
router.delete('/:id', (req, res) => {

    const id = req.params.id;

    db.run(
        'DELETE FROM grades WHERE id = ?',
        [id],
        function(err) {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    message: 'Nota no encontrada'
                });
            }

            res.json({
                message: 'Nota eliminada correctamente'
            });
        }
    );
});

module.exports = router;