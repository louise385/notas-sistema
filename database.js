const sqlite3 = require('sqlite3').verbose();

// Crear o conectar con la base de datos
const db = new sqlite3.Database('./school.db', (err) => {
    if (err) {
        console.error('Error al conectar con SQLite:', err.message);
    } else {
        console.log('Base de datos SQLite conectada correctamente');
    }
});

// Activar claves foráneas
db.serialize(() => {

    db.run(`
        PRAGMA foreign_keys = ON
    `);

    // Tabla de estudiantes
    db.run(`
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL
        )
    `);

    // Tabla de notas
    db.run(`
        CREATE TABLE IF NOT EXISTS grades (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER NOT NULL,
            subject TEXT NOT NULL,
            grade REAL NOT NULL CHECK(grade >= 0 AND grade <= 5),
            FOREIGN KEY(student_id)
            REFERENCES students(id)
            ON DELETE CASCADE
        )
    `);

    console.log('Tablas verificadas correctamente');
});

module.exports = db;