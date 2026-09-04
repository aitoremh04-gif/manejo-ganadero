export function cargarHistorialRotaciones() {
  const tbody = document.getElementById('tbody-historial-rotaciones');
  if (!tbody) return;

  const historial = JSON.parse(localStorage.getItem('hlb_historial_potreros') || '[]');

  if (historial.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Sin registros en el historial</td></tr>';
    return;
  }

  tbody.innerHTML = historial.map(reg => `
    <tr>
      <td><b>${reg.potrero}</b></td>
      <td>${reg.lote}</td>
      <td>${reg.fechaEntrada}</td>
      <td>${reg.fechaSalida || 'En uso'}</td>
      <td>${reg.diasUso || '-'}</td>
      <td>${reg.cargaUgmHa} UGM/Ha</td>
    </tr>
  `).join('');
}

// Cargar al inicializar el módulo
document.addEventListener('DOMContentLoaded', cargarHistorialRotaciones);
window.cargarHistorialRotaciones = cargarHistorialRotaciones;
