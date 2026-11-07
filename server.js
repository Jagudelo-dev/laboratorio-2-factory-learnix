// 1. Importamos la herramienta Express que acabamos de instalar
const express = require('express');

// 2. Creamos nuestra aplicación (nuestro mesero)
const app = express();

// 3. Le decimos a la app que entienda los datos en formato JSON
app.use(express.json());

// ==============================================================
// Base de datos simulada y patrón Factory Method (Grupo 2)
// ==============================================================

let baseDeDatos = [];

class FabricaDePersonas {
  static crear(datosRecibidos) {
    return {
      id: Date.now().toString(),
      nombre: (datosRecibidos.nombre || '').trim(),
      apellido: (datosRecibidos.apellido || '').trim(),
      telefono: datosRecibidos.telefono
        ? datosRecibidos.telefono.trim()
        : 'Sin teléfono',
    };
  }
}

// Ruta POST para crear y guardar
app.post('/personas', (req, res) => {
  const personaLista = FabricaDePersonas.crear(req.body);
  baseDeDatos.push(personaLista);
  res.status(201).json(personaLista);
});

// Ruta GET para consultar
app.get('/personas', (req, res) => {
  res.json(baseDeDatos);
});

// 5. Encendemos el servidor en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor encendido. Entra a http://localhost:${PORT}/personas`);
});