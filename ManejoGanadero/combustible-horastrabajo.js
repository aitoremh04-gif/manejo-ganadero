export function registrarControlCombustible() {
  const equipo = document.getElementById('combustible-equipo')?.value;
  const litros = parseFloat(document.getElementById('combustible-litros')?.value || '0');
  const horometro = parseFloat(document.getElementById('combustible-horometro')?.value || '0');

  if (!litros && !horometro) {
    alert('⚠️ Ingresa la cantidad de litros o el valor del horómetro/kilometraje.');
    return;
  }

  const registro = {
    id: Date.now(),
    fecha: new Date().toISOString().split('T')[0],
    equipo,
    litros,
    horometro
  };

  const registros = JSON.parse(localStorage.getItem('hlb_combustibles') || '[]');
  registros.push(registro);
  localStorage.setItem('hlb_combustibles', JSON.stringify(registros));

  alert(`⛽ Control guardado para ${equipo}. Litros: ${litros} L | Horómetro: ${horometro}`);
  document.getElementById('combustible-litros').value = '';
  document.getElementById('combustible-horometro').value = '';
}

window.registrarControlCombustible = registrarControlCombustible;
