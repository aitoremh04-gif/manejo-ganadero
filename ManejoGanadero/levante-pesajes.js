export function guardarPesajeLevante() {
  const idAnimal = document.getElementById('levante-id-animal')?.value.trim();
  const peso = parseFloat(document.getElementById('levante-peso-actual')?.value || '0');
  const fecha = document.getElementById('levante-fecha-pesaje')?.value;

  if (!idAnimal || !peso || !fecha) {
    alert('⚠️ Por favor completa la identificación, el peso y la fecha.');
    return;
  }

  const registroPesaje = {
    id: Date.now(),
    idAnimal,
    peso,
    fecha
  };

  const pesajes = JSON.parse(localStorage.getItem('hlb_pesajes_levante') || '[]');
  pesajes.push(registroPesaje);
  localStorage.setItem('hlb_pesajes_levante', JSON.stringify(pesajes));

  alert(`✅ Pesaje guardado para el animal ${idAnimal}: ${peso} kg.`);
  document.getElementById('levante-id-animal').value = '';
  document.getElementById('levante-peso-actual').value = '';
}

window.guardarPesajeLevante = guardarPesajeLevante;
