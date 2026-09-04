export function guardarRegistroSanitario() {
  const producto = document.getElementById('sanitario-producto')?.value.trim();
  const dosis = document.getElementById('sanitario-dosis')?.value.trim();
  const lote = document.getElementById('sanitario-lote')?.value.trim();

  if (!producto || !dosis || !lote) {
    alert('⚠️ Completa los campos de producto, dosis y lote a tratar.');
    return;
  }

  const aplicacion = {
    id: Date.now(),
    fecha: new Date().toISOString().split('T')[0],
    producto,
    dosis,
    lote
  };

  const tratamientos = JSON.parse(localStorage.getItem('hlb_sanitario') || '[]');
  tratamientos.push(aplicacion);
  localStorage.setItem('hlb_sanitario', JSON.stringify(tratamientos));

  alert(`💉 Tratamiento registrado: ${producto} aplicado a ${lote}.`);
  document.getElementById('sanitario-producto').value = '';
  document.getElementById('sanitario-dosis').value = '';
  document.getElementById('sanitario-lote').value = '';
}

window.guardarRegistroSanitario = guardarRegistroSanitario;
