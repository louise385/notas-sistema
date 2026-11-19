const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const studentsRoutes = require('./students');
const gradesRoutes = require('./grades');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Rutas API
app.use('/students', studentsRoutes);
app.use('/grades', gradesRoutes);

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

