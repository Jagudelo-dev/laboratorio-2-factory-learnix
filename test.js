// test.js – Pruebas automáticas del laboratorio Factory Method
const BASE = 'http://localhost:3000';

const assert = (cond, msg) => { if (!cond) throw new Error(msg); };
const test = async (nombre, fn) => {
  try { await fn(); console.log(`✅ PASS: ${nombre}`); }
  catch (e) { console.log(`❌ FAIL: ${nombre} → ${e.message}`); }
};

(async () => {
  console.log('\n🧪 Probando API Factory Method...\n');

  await test('GET /personas devuelve [] al inicio', async () => {
    const r = await fetch(`${BASE}/personas`);
    const d = await r.json();
    assert(r.status === 200, `Status ${r.status}`);
    assert(Array.isArray(d), 'No es array');
    assert(d.length === 0, `Debería estar vacío, tiene ${d.length}`);
  });

  await test('POST limpia espacios con .trim()', async () => {
    const r = await fetch(`${BASE}/personas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: '  Juan  ', apellido: '  Perez  ', telefono: '  300123  ' })
    });
    const d = await r.json();
    assert(r.status === 201, `Status ${r.status}`);
    assert(d.nombre === 'Juan', `nombre="${d.nombre}"`);
    assert(d.apellido === 'Perez', `apellido="${d.apellido}"`);
    assert(d.telefono === '300123', `telefono="${d.telefono}"`);
    assert(d.id, 'Falta id');
  });

  await test('POST sin teléfono asigna "Sin teléfono"', async () => {
    const r = await fetch(`${BASE}/personas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: 'Ana', apellido: 'Gomez' })
    });
    const d = await r.json();
    assert(d.telefono === 'Sin teléfono', `telefono="${d.telefono}"`);
  });

  await test('GET devuelve 2 registros guardados', async () => {
    const r = await fetch(`${BASE}/personas`);
    const d = await r.json();
    assert(d.length === 2, `Esperaba 2, hay ${d.length}`);
  });

  console.log('\n🎉 Fin de las pruebas\n');
})();