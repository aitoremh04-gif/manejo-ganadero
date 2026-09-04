export function registrarEventoCategorias() {
  const categoria = document.getElementById('eventos-categoria')?.value;
  const tipo = document.getElementById('eventos-tipo')?.value;
  const cantidad = parseInt(document.getElementById('eventos-cantidad')?.value || '0', 10);

  if (!cantidad || cantidad <= 0) {
    alert('⚠️ Por favor ingresa una cantidad válida.');
    return;
  }

  const nuevoEvento = {
    id: Date.now(),
    fecha: new Date().toISOString().split('T')[0],
    categoria,
    tipo,
    cantidad
  };

  const eventos = JSON.parse(localStorage.getItem('hlb_eventos') || '[]');
  eventos.push(nuevoEvento);
  localStorage.setItem('hlb_eventos', JSON.stringify(eventos));

  alert(`✅ Evento registrado: ${cantidad} animal(es) en categoría ${categoria} (${tipo}).`);
  document.getElementById('eventos-cantidad').value = 1;
}

// Exponer la función al entorno global para el HTML
window.registrarEventoCategorias = registrarEventoCategorias;
