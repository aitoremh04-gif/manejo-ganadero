export function guardarConsumoComidas() {
  const fecha = document.getElementById('logistica-fecha')?.value;
  const comensales = parseInt(document.getElementById('logistica-comensales')?.value || '0', 10);

  if (!fecha || comensales <= 0) {
    alert('⚠️ Selecciona una fecha e ingresa un número de comensales válido.');
    return;
  }

  const registro = { id: Date.now(), fecha, comensales };
  const datos = JSON.parse(localStorage.getItem('hlb_logistica_comidas') || '[]');
  datos.push(registro);
  localStorage.setItem('hlb_logistica_comidas', JSON.stringify(datos));

  alert(`🍳 Logística registrada para ${fecha}: ${comensales} persona(s).`);
}

window.guardarConsumoComidas = guardarConsumoComidas;
