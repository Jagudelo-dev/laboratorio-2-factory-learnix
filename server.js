// 1. Importamos la herramienta Express que acabamos de instalar

const express = require('express');

// 2. Creamos nuestra aplicación (nuestro mesero)

const app = express();

// 3. Le decimos a la app que entienda los datos en formato JSON

app.use(express.json());

// ==============================================================
// Aquí irá la base de datos simulada y el patrón de diseño...
// ==============================================================

// 4. Creamos una ruta de prueba (Endpoint)

app.get('/prueba', (req, res) => {
    
    // req (Request): Lo que pide el cliente (navegador/frontend)
// res (Response): Lo que le respondemos desde el servidor
res.send("¡El servidor de Node está vivo!");
});
// 5. Encendemos el servidor en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
console.log(`Servidor encendido. Entra a
http://localhost:${PORT}/prueba`);
});
