/**
 * Módulo 1: Control de Pastoreo, Potreros y UGM
 * Hato Laguna Brava (Mantecal, Apure)
 * Versión Directa Síncrona - Corregida y Blindada
 */

// 1. Matriz de Categorías Bovinas y Factores UGM
const CATEGORIAS_BOVINAS = [
  { id: "vacas_escoteras", nombre: "Vacas Escoteras", factorUGM: 0.93 },
  { id: "vacas_paridas", nombre: "Vacas Paridas", factorUGM: 1.00 },
  { id: "novillas_servidas", nombre: "Novillas Servidas", factorUGM: 0.73 },
  { id: "mautas_levante", nombre: "Mautas Levante", factorUGM: 0.49 },
  { id: "mautes_levante", nombre: "Mautes Levante", factorUGM: 0.53 },
  { id: "toros_reproductores", nombre: "Toros / Reprod.", factorUGM: 1.33 },
  { id: "becerros_as", nombre: "Becerros / Becerras", factorUGM: 0.24 }
];

// 2. Renderizado dinámico del formulario de categorías
window.renderizarFormularioCategorias = function() {
  const contenedor = document.getElementById("m1-etarios-container");
  if (!contenedor) return;

  contenedor.innerHTML = CATEGORIAS_BOVINAS.map(cat => `
    <div class="cat-box" style="border:1px solid #ccc; padding:4px; border-radius:4px; text-align:center;">
      <label style="font-size:10px; font-weight:bold; display:block;">${cat.nombre}</label>
      <input 
        type="number" 
        id="input-cat-${cat.id}" 
        class="form-control input-categoria-bovina" 
        data-factor="${cat.factorUGM}"
        data-nombre="${cat.nombre}"
        min="0" 
        placeholder="0"
        oninput="calcularUGM1()"
        style="width:100%; text-align:center;"
      >
      <span style="font-size:9px; color:#637381; display:block;">${cat.factorUGM} UGM</span>
    </div>
  `).join('');
};

// 3. Control de fechas por defecto
window.establecerFechaPorDefecto = function() {
  const inputFechaIngreso = document.getElementById("m1-f-ingreso");
  if (inputFechaIngreso && !inputFechaIngreso.value) {
    inputFechaIngreso.value = new Date().toISOString().split("T")[0];
  }
};

// 4. Cálculo en tiempo real de UGM y Carga por Ha
window.calcularUGM1 = function() {
  const selectPotrero = document.getElementById("m1-potrero");
  const hectareas = parseFloat(selectPotrero?.value || 0);

  let totalCabezas = 0;
  let totalUGM = 0;

  const inputsCategorias = document.querySelectorAll(".input-categoria-bovina");
  inputsCategorias.forEach(input => {
    const cantidad = parseInt(input.value || 0, 10);
    const factorUGM = parseFloat(input.dataset.factor || 0);

    if (cantidad > 0) {
      totalCabezas += cantidad;
      totalUGM += cantidad * factorUGM;
    }
  });

  const cargaPorHa = hectareas > 0 ? (totalUGM / hectareas) : 0;

  const elCabezas = document.getElementById("m1-total-cabezas");
  const elUGM = document.getElementById("m1-total-ugm");
  const elCarga = document.getElementById("m1-carga-ha");

  if (elCabezas) elCabezas.value = totalCabezas;
  if (elUGM) elUGM.value = `${totalUGM.toFixed(1)} UGM`;
  if (elCarga) elCarga.value = `${cargaPorHa.toFixed(2)} UGM/ha`;

  return { totalCabezas, totalUGM, cargaPorHa, hectareas };
};

// 5. Guardar registro en LocalStorage
window.guardarRegistroMod1 = function() {
  const selectPotrero = document.getElementById("m1-potrero");
  const hectareas = parseFloat(selectPotrero?.value || 0);
  const potreroTexto = selectPotrero?.options[selectPotrero.selectedIndex]?.text || "N/A";
  const potreroNombre = potreroTexto.split("(")[0].trim();

  const epoca = document.getElementById("m1-epoca")?.value || "N/A";
  const movimiento = document.getElementById("m1-movimiento")?.value || "Ingreso";
  const fechaIngreso = document.getElementById("m1-f-ingreso")?.value || "";
  const responsable = document.getElementById("m1-responsable")?.value.trim() || "N/A";
  const observaciones = document.getElementById("m1-obs")?.value.trim() || "";

  const { totalCabezas, totalUGM, cargaPorHa } = window.calcularUGM1();

  if (totalCabezas <= 0) {
    alert("⚠️ Ingresa al menos una categoría con cantidad mayor a cero.");
    return;
  }

  const desgloseArr = [];
  document.querySelectorAll(".input-categoria-bovina").forEach(input => {
    const cantidad = parseInt(input.value || 0, 10);
    if (cantidad > 0) {
      desgloseArr.push(`${input.dataset.nombre}: ${cantidad}`);
    }
  });

  const registro = {
    id: Date.now(),
    potrero: potreroNombre,
    hectareas,
    epoca,
    movimiento,
    fechaIngreso,
    responsable,
    observaciones,
    detalleCategorias: desgloseArr.join(", "),
    totalCabezas,
    totalUGM: parseFloat(totalUGM.toFixed(1)),
    cargaPorHa: parseFloat(cargaPorHa.toFixed(2))
  };

  const historial = JSON.parse(localStorage.getItem("hlb_historial_potreros") || "[]");
  historial.push(registro);
  localStorage.setItem("hlb_historial_potreros", JSON.stringify(historial));

  window.renderizarTablaHistorial();
  window.limpiarFormMod1();
};

// 6. Renderizado de la tabla de historial
window.renderizarTablaHistorial = function() {
  const tbody = document.getElementById("tabla-mod1-body");
  if (!tbody) return;

  const historial = JSON.parse(localStorage.getItem("hlb_historial_potreros") || "[]");
  tbody.innerHTML = "";

  if (historial.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" style="text-align:center; color:#888; padding: 12px;">No hay registros cargados</td></tr>`;
    window.actualizarEstadisticasKPI([]);
    return;
  }

  historial.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${item.potrero}</strong></td>
      <td>${item.hectareas}</td>
      <td>${item.epoca}</td>
      <td><span class="badge ${item.movimiento === 'Ingreso' ? 'badge-ingreso' : 'badge-egreso'}">${item.movimiento}</span></td>
      <td style="font-size:10px;">${item.detalleCategorias}</td>
      <td><strong>${item.totalCabezas}</strong></td>
      <td>${item.cargaPorHa}</td>
      <td>${item.responsable}</td>
      <td>${item.observaciones || ''}</td>
      <td>
        <button type="button" onclick="eliminarRegistroMod1(${item.id})" style="color:red; border:none; background:none; cursor:pointer; font-weight:bold;">✕</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  window.actualizarEstadisticasKPI(historial);
};

// 7. Actualización de indicadores clave (KPI)
window.actualizarEstadisticasKPI = function(historialData) {
  const historial = historialData || [];
  const sumCabezas = historial.reduce((acc, curr) => acc + (curr.totalCabezas || 0), 0);
  const sumUGM = historial.reduce((acc, curr) => acc + (curr.totalUGM || 0), 0);

  const elStatCabezas = document.getElementById("stat-cabezas");
  const elStatUGM = document.getElementById("stat-ugm");

  if (elStatCabezas) elStatCabezas.textContent = sumCabezas.toLocaleString();
  if (elStatUGM) elStatUGM.textContent = sumUGM.toFixed(1);
};

// 8. Eliminar registro del historial
window.eliminarRegistroMod1 = function(id) {
  if (!confirm("¿Deseas eliminar este registro de pastoreo?")) return;
  let historial = JSON.parse(localStorage.getItem("hlb_historial_potreros") || "[]");
  historial = historial.filter(item => item.id !== id);
  localStorage.setItem("hlb_historial_potreros", JSON.stringify(historial));
  window.renderizarTablaHistorial();
};

// 9. Reset del formulario
window.limpiarFormMod1 = function() {
  document.getElementById("form-mod1")?.reset();
  document.querySelectorAll(".input-categoria-bovina").forEach(input => input.value = "");
  window.establecerFechaPorDefecto();
  window.calcularUGM1();
};

// 10. Inicialización inmediata y robusta
window.inicializarModuloPotreros = function() {
  window.renderizarFormularioCategorias();
  window.establecerFechaPorDefecto();
  window.renderizarTablaHistorial();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", window.inicializarModuloPotreros);
} else {
  window.inicializarModuloPotreros();
}
