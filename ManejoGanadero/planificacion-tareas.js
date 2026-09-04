export function crearPlanificacionTarea() {
  const descripcion = document.getElementById('tarea-descripcion')?.value.trim();
  const fecha = document.getElementById('tarea-fecha')?.value;
  const prioridad = document.getElementById('tarea-prioridad')?.value;

  if (!descripcion || !fecha) {
    alert('⚠️ Ingresa la descripción y la fecha programada para la tarea.');
    return;
  }

  const tarea = {
    id: Date.now(),
    descripcion,
    fecha,
    prioridad,
    completada: false
  };

  const tareas = JSON.parse(localStorage.getItem('hlb_tareas') || '[]');
  tareas.push(tarea);
  localStorage.setItem('hlb_tareas', JSON.stringify(tareas));

  alert(`📝 Tarea asignada con éxito (${prioridad.toUpperCase()}): "${descripcion}"`);
  document.getElementById('tarea-descripcion').value = '';
}

window.crearPlanificacionTarea = crearPlanificacionTarea;
