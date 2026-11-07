# Laboratorio 2: Patron Factory Method (Learnix IA)

API REST desarrollada en **Node.js + Express** que implementa el patron de diseno **Factory Method** para crear, limpiar y validar objetos de tipo `Persona` antes de guardarlos en memoria.

> **Institucion:** SENA - Centro de Formacion  
> **Instructor:** Edwin Rozo Gomez  
> **Tecnologias:** JavaScript, Node.js y Express  
> **Fecha de sustentacion:** 7 de noviembre de 2026

## Integrantes del equipo y roles

| Nombre | Rol en el laboratorio |
| --- | --- |
| **Jose Miguel Agudelo** | Creacion del esqueleto inicial del proyecto, instalacion de Express, finalizacion de la API (fabrica, rutas y pruebas), pruebas automaticas (`test.js`) y redaccion del README |
| **Juan David Valencia (Juanda)** | Desarrollo del servidor base (`server.js`) y estructura inicial de rutas |
| Genler Johan Bolivar | Integrante del equipo |
| Xander Gonzales Echeverri | Integrante del equipo |
| Jeremy Pinzon Coll | Integrante del equipo |
| Carol Daiana Orozco | Integrante del equipo |

## Que es el patron Factory Method?

El **Factory Method** es un patron de diseno **creacional** que delega la creacion de objetos a una fabrica, clase o metodo dedicado, en lugar de construirlos directamente dentro del controlador.

### Problema que resuelve

Los datos enviados por un cliente mediante `POST` pueden llegar con espacios adicionales o sin todos los campos esperados. Si la ruta se encarga de validar, limpiar y construir el objeto, el controlador se vuelve repetitivo y dificil de mantener.

### Solucion aplicada

La clase `FabricaDePersonas` recibe los datos crudos y devuelve un objeto limpio y listo para guardar. De esta manera, la ruta solo coordina la solicitud y delega la construccion a la fabrica.

```text
Cliente -> POST /personas -> FabricaDePersonas.crear(req.body)
        -> objeto limpio -> base de datos en memoria
```

## Analisis del patron aplicado

| Elemento | Descripcion |
| --- | --- |
| **Nombre del patron** | **Factory Method**, un patron creacional que delega la construccion de objetos en un metodo de fabrica. |
| **Problema que resolvimos** | Evitar que la ruta `POST` concentrara la limpieza de datos, la asignacion de valores por defecto y la creacion de cada objeto `Persona`. |
| **Ventajas identificadas** | Separa responsabilidades, mantiene las rutas pequenas, centraliza la limpieza de datos, facilita las pruebas y permite cambiar la forma de crear personas sin modificar el controlador. |
| **Desventajas identificadas** | Agrega una clase y una llamada adicional para un dominio pequeno; para una aplicacion muy simple puede sentirse como mas estructura de la necesaria. Ademas, esta fabrica no reemplaza una validacion completa ni una base de datos persistente. |

### Contraste de arquitectura

| Aspecto | Sin Factory Method | Con Factory Method (arquitectura actual) |
| --- | --- | --- |
| **Creacion del objeto** | La ruta recibe los datos, los limpia y construye directamente la persona. | `FabricaDePersonas.crear(req.body)` construye la persona. |
| **Responsabilidad de la ruta** | Coordina la peticion y tambien contiene las reglas de transformacion. | Coordina la peticion, solicita el objeto a la fabrica y lo guarda. |
| **Mantenimiento** | Las reglas pueden repetirse en varias rutas y ser mas dificiles de cambiar. | Las reglas estan centralizadas en un solo lugar. |
| **Pruebas** | Es necesario probar la ruta junto con toda la logica de construccion. | La logica de construccion puede probarse de forma centralizada y la API se prueba mediante sus endpoints. |
| **Escalabilidad** | Agregar nuevos tipos de objetos aumenta la complejidad del controlador. | La creacion puede extenderse mediante nuevas fabricas o metodos sin sobrecargar las rutas. |

En este laboratorio, la arquitectura con Factory Method es adecuada porque mantiene la ruta enfocada en el flujo HTTP y deja las reglas de construccion de `Persona` dentro de `FabricaDePersonas`.

## Requisitos previos

| Herramienta | Version minima | Verificar con |
| --- | --- | --- |
| **Node.js** | 18 o superior | `node -v` |
| **npm** | 9 o superior | `npm -v` |
| **Git** | 2.30 o superior | `git --version` |

> Node.js incluye npm automaticamente. Descarga la version LTS desde [nodejs.org](https://nodejs.org/).
>
> Node.js 18 o superior es obligatorio porque `test.js` utiliza `fetch` nativo.

## Instalacion y ejecucion

### 1. Clonar el repositorio

```bash
git clone https://github.com/Jagudelo-dev/laboratorio-2-factory-learnix.git
cd laboratorio-2-factory-learnix
```

### 2. Instalar dependencias

```bash
npm install
```

Esto instala Express y crea `node_modules/`, carpeta que no debe subirse al repositorio.

### 3. Verificar Express

```bash
npm list express
```

La salida debe mostrar una version instalada de Express, por ejemplo `express@5.3.0`.

### 4. Iniciar el servidor

```bash
node server.js
```

Salida esperada:

```text
Servidor encendido. Entra a http://localhost:3000/personas
```

Deja esta terminal abierta mientras haces las pruebas. Para detener el servidor, presiona `Ctrl + C`.

## Como probar la API

La API guarda los registros solamente en memoria. Al reiniciar el servidor, la lista vuelve a estar vacia.

### Pruebas automaticas con `test.js`

Abre dos terminales ubicadas en la carpeta del proyecto.

**Terminal 1: iniciar el servidor**

```bash
node server.js
```

**Terminal 2: ejecutar las pruebas**

```bash
node test.js
```

> Importante: el script `test.js` espera que el servidor ya este ejecutandose en `http://localhost:3000`. El comando `npm test` no ejecuta estas pruebas en la configuracion actual de `package.json`; utiliza `node test.js`.

Salida esperada:

```text
🧪 Probando API Factory Method...

✅ PASS: GET /personas devuelve [] al inicio
✅ PASS: POST limpia espacios con .trim()
✅ PASS: POST sin teléfono asigna "Sin teléfono"
✅ PASS: GET devuelve 2 registros guardados

🎉 Fin de las pruebas
```

#### Que valida cada prueba?

| Prueba | Que comprueba | Que demuestra |
| --- | --- | --- |
| `GET` vacio | `GET /personas` responde `[]` al inicio | La base de datos comienza vacia |
| `POST` con `trim()` | Los espacios de los campos se eliminan | La fabrica limpia los datos |
| `POST` sin telefono | Se asigna `Sin telefono` cuando falta el campo | La fabrica aplica un valor por defecto |
| `GET` con dos registros | Se recuperan los dos objetos creados | La persistencia en memoria funciona |

Si la primera prueba falla porque encuentra registros, reinicia el servidor y vuelve a ejecutar `node test.js`.

### Prueba manual con el navegador

Con el servidor ejecutandose, abre `http://localhost:3000/personas` en el navegador. La respuesta inicial debe ser:

```json
[]
```

Para crear una persona desde la consola del navegador, ejecuta:

```javascript
fetch('http://localhost:3000/personas', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nombre: ' Juan ',
    apellido: 'Perez',
    telefono: '300123'
  })
})
  .then((respuesta) => respuesta.json())
  .then((datos) => console.log('Respuesta del servidor:', datos));
```

La respuesta tendra esta forma. El valor exacto de `id` varia porque se genera con la hora actual:

```json
{
  "id": "<timestamp>",
  "nombre": "Juan",
  "apellido": "Perez",
  "telefono": "300123"
}
```

Para probar el valor predeterminado del telefono:

```javascript
fetch('http://localhost:3000/personas', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nombre: 'Ana', apellido: 'Gomez' })
})
  .then((respuesta) => respuesta.json())
  .then(console.log);
```

En este caso, la respuesta incluira `"telefono": "Sin teléfono"`.

### Prueba con `curl`

Con el servidor ejecutandose, abre otra terminal:

```bash
# Consultar la lista
curl http://localhost:3000/personas

# Crear una persona con espacios
curl -X POST http://localhost:3000/personas \
  -H "Content-Type: application/json" \
  -d '{"nombre":"  Pedro  ","apellido":"  Ruiz  "}'

# Consultar la lista actualizada
curl http://localhost:3000/personas
```

La persona creada tendra el nombre `Pedro`, el apellido `Ruiz` y el telefono `Sin teléfono`.

### Prueba con Postman o Insomnia

Tambien puedes utilizar Postman o Insomnia con estos valores:

- **Metodo:** `POST`
- **URL:** `http://localhost:3000/personas`
- **Encabezado:** `Content-Type: application/json`
- **Cuerpo:**

```json
{
  "nombre": " María ",
  "apellido": "Lopez"
}
```

La respuesta debe tener estado `201 Created`.

## Endpoints disponibles

| Metodo | Ruta | Descripcion | Estado exitoso |
| --- | --- | --- | --- |
| `GET` | `/personas` | Devuelve todas las personas guardadas en memoria | `200 OK` |
| `POST` | `/personas` | Limpia, crea y guarda una persona | `201 Created` |

El cuerpo esperado para `POST /personas` es:

```json
{
  "nombre": "  Juan  ",
  "apellido": " Perez ",
  "telefono": " 300123 "
}
```

La respuesta devuelve los campos `id`, `nombre`, `apellido` y `telefono`. `nombre` y `apellido` se limpian con `trim()`. Si no se envia `telefono`, se utiliza `Sin teléfono`.

## Estructura del proyecto

```text
laboratorio-2-factory-learnix/
├── node_modules/          # Dependencias instaladas (no se sube a GitHub)
├── .gitignore             # Excluye node_modules y .env
├── package.json           # Configuracion y dependencias del proyecto
├── package-lock.json      # Versiones exactas de dependencias
├── server.js              # API principal y patron Factory Method
├── test.js                # Pruebas automaticas
└── README.md              # Documentacion del proyecto
```

| Archivo | Proposito |
| --- | --- |
| `server.js` | Contiene la fabrica, la base de datos en memoria y las rutas `GET` y `POST`. |
| `test.js` | Ejecuta cuatro pruebas automaticas contra el servidor. |
| `package.json` | Define el proyecto y su dependencia de Express. |
| `.gitignore` | Evita subir `node_modules/` y archivos `.env`. |
| `README.md` | Contiene la documentacion y las instrucciones de ejecucion. |

## Explicacion del codigo

### 1. La fabrica

```javascript
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
```

- `static` permite llamar a `crear()` sin instanciar la clase.
- `Date.now().toString()` genera el identificador usando la hora actual.
- `trim()` elimina espacios al inicio y al final.
- El operador ternario asigna `Sin teléfono` cuando no llega el campo `telefono`.

### 2. Las rutas

```javascript
app.post('/personas', (req, res) => {
  const personaLista = FabricaDePersonas.crear(req.body);
  baseDeDatos.push(personaLista);
  res.status(201).json(personaLista);
});

app.get('/personas', (req, res) => {
  res.json(baseDeDatos);
});
```

La ruta `POST` delega la limpieza y construccion del objeto a la fabrica. Despues guarda el resultado en `baseDeDatos` y devuelve la persona creada. La ruta `GET` devuelve todos los registros actuales.

### 3. Las pruebas

`test.js` realiza peticiones reales con `fetch`, verifica las respuestas mediante `assert` e imprime `PASS` o `FAIL` para cada caso. Las cuatro pruebas comprueban que el estado inicial sea vacio, que los espacios se limpien, que exista un valor predeterminado para el telefono y que la lista conserve dos registros.

## Limitaciones conocidas

- Los datos se almacenan en memoria y se pierden al detener el servidor.
- No hay una base de datos permanente.
- No se definen validaciones de campos obligatorios ni rutas para actualizar o eliminar personas.
- El identificador se genera con `Date.now()` y no pretende reemplazar un identificador de base de datos en produccion.
