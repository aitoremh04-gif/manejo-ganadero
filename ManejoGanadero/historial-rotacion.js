<!-- MÓDULO 3: HISTORIAL, ROTACIÓN Y ESTADÍSTICA -->
    <section id="mod-historial" class="module-view">
      <div class="module-header">
        <h3>📊 Historial, Rotación y Estadística de Potreros</h3>
      </div>

      <div class="form-row" style="margin-bottom: 12px;">
        <div class="form-group" style="grid-column: span 2;">
          <label>Seleccionar Potrero para Análisis:</label>
          <select class="form-control" id="m3-potrero-select" onchange="analizarPotreroHistorial()">
            <option value="Macanillal (432 ha)">Macanillal (432 ha)</option>
            <option value="El Galpón (569 ha)">El Galpón (569 ha)</option>
            <option value="Mata del Muerto (80 ha)">Mata del Muerto (80 ha)</option>
            <option value="Manguito (234 ha)">Manguito (234 ha)</option>
            <option value="Mata de Piña (205 ha)">Mata de Piña (205 ha)</option>
            <option value="Las Rallas (102 ha)">Las Rallas (102 ha)</option>
            <option value="Potrero del Medio (703 ha)">Potrero del Medio (703 ha)</option>
            <option value="Cuatro Esquinas (77 ha)">Cuatro Esquinas (77 ha)</option>
            <option value="Paulero (418 ha)">Paulero (418 ha)</option>
            <option value="Jobo Gacho (422 ha)">Jobo Gacho (422 ha)</option>
            <option value="Curva del Peligro (40 ha)">Curva del Peligro (40 ha)</option>
            <option value="Módulo A (36 ha)">Módulo A (36 ha)</option>
            <option value="Módulo B (36 ha)">Módulo B (36 ha)</option>
            <option value="Módulo C (36 ha)">Módulo C (36 ha)</option>
            <option value="Módulo D (36 ha)">Módulo D (36 ha)</option>
            <option value="Módulo F (143 ha)">Módulo F (143 ha)</option>
            <option value="Saladillal (125 ha)">Saladillal (125 ha)</option>
            <option value="Carretera (142 ha)">Carretera (142 ha)</option>
            <option value="María del Carmen (32 ha)">María del Carmen (32 ha)</option>
            <option value="Casa (26 ha)">Casa (26 ha)</option>
          </select>
        </div>
      </div>

      <!-- KPI ESTADO ACTUAL -->
      <h4 style="margin: 4px 0; font-size: 11px; color: var(--blue-primary);">Estado Actual y Disponibilidad</h4>
      <div class="kpi-container">
        <div class="kpi-card">
          <div class="kpi-title">Días Descanso</div>
          <div class="kpi-value" id="m3-dias-descanso">0 Días</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">Disponibilidad</div>
          <div style="margin-top:2px;" id="m3-container-semaforo">
            <span class="status-badge badge-amarillo" id="m3-semaforo-status">Sin datos</span>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">Uso Promedio</div>
          <div class="kpi-value" id="m3-dias-uso-prom">0.0 Días</div>
        </div>
      </div>

      <!-- ESTADÍSTICA ESTACIONAL -->
      <h4 style="margin: 10px 0 4px 0; font-size: 11px; color: var(--blue-primary);">Análisis Estacional (Invierno vs Verano)</h4>
      <div class="kpi-container">
        <div class="kpi-card">
          <div class="kpi-title">Carga Invierno</div>
          <div class="kpi-value" id="m3-carga-inv">0.00 UGM/ha</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">Carga Verano</div>
          <div class="kpi-value" id="m3-carga-ver">0.00 UGM/ha</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">Transeúntes Totales</div>
          <div class="kpi-value" id="m3-total-cabezas">0 Cab.</div>
        </div>
      </div>

      <!-- BITÁCORA DEL POTRERO -->
      <h4 style="margin: 10px 0 4px 0; font-size: 11px; color: var(--blue-primary);">Bitácora Cronológica del Potrero</h4>
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Ingreso</th>
              <th>Salida</th>
              <th>Época</th>
              <th>Mov.</th>
              <th>Cabezas</th>
              <th>UGM/Ha</th>
              <th>Detalle Categorías</th>
              <th>Resp.</th>
              <th>Observaciones</th>
            </tr>
          </thead>
          <tbody id="tabla-mod3-body"></tbody>
        </table>
      </div>
    </section>

  </main>

  <script>
    let db;
    
    // Inicialización del SDK de Telegram WebApp
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }

    function actualizarSemaforo(estado, texto) {
      const luz = document.getElementById("luz-semaforo");
      const txt = document.getElementById("texto-semaforo");
      if (luz) luz.className = "semaforo-luz " + estado;
      if (txt) txt.innerText = texto;
    }

    actualizarSemaforo("amarillo", "Cargando...");

    const request = indexedDB.open("HatoLagunaBrava_v5", 1);
    request.onupgradeneeded = (e) => {
      db = e.target.result;
      if (!db.objectStoreNames.contains("potreros")) db.createObjectStore("potreros", { keyPath: "id", autoIncrement: true });
      if (!db.objectStoreNames.contains("levante")) db.createObjectStore("levante", { keyPath: "id", autoIncrement: true });
    };
    
    request.onsuccess = (e) => {
      db = e.target.result;
      actualizarSemaforo("verde", "Sincronizado");
      cargarTablas();
    };

    request.onerror = (e) => {
      actualizarSemaforo("rojo", "Error DB");
    };

    // Ponderaciones zootécnicas ajustadas para trópico bajo y búfalos
    const FACTORES_UGM = {
      "Mautas": 0.5, "Bautas": 0.5,
      "Mautes": 0.5, "Bautes": 0.5,
      "Becerros": 0.25, "Bucerros": 0.25,
      "Vacas Vacías": 1.0, "Búfalas Vacías": 1.2,
      "Toros": 1.5, "Butoros": 1.5,
      "Vacas Pñ": 1.0, "Búfala Pñ": 1.2,
      "Vacas Paridas": 1.0, "Búfala Parida": 1.3,
      "Vacas Monta": 1.0, "Búfala Monta": 1.2,
      "Novillas Pñ": 0.7, "Buvilla Pñ": 0.8,
      "Novillas Monta": 0.7, "Buvilla Monta": 0.8,
      "Novillas Vacías": 0.7, "Buvillas Vacías": 0.8
    };

    const GRUPOS_DESPLEGABLES = [
      ["Mautas", "Bautas"],
      ["Mautes", "Bautes"],
      ["Becerros", "Bucerros"],
      ["Vacas Vacías", "Búfalas Vacías"],
      ["Toros", "Butoros"],
      ["Vacas Pñ", "Búfala Pñ"],
      ["Vacas Paridas", "Búfala Parida"],
      ["Vacas Monta", "Búfala Monta"],
      ["Novillas Pñ", "Buvilla Pñ"],
      ["Novillas Monta", "Buvilla Monta"],
      ["Novillas Vacías", "Buvillas Vacías"]
    ];

    document.addEventListener("DOMContentLoaded", () => {
      const hoy = new Date().toISOString().split('T')[0];
      document.querySelectorAll("input[type='date']").forEach(i => i.value = hoy);
      generarCamposEtarios1();
    });

    function navegarA(id, el) {
      document.querySelectorAll('.module-view').forEach(m => m.classList.remove('active'));
      document.querySelectorAll('.sidebar-menu li').forEach(l => l.classList.remove('active'));
      
      const target = document.getElementById(id);
      if (target) target.classList.add('active');
      if (el) el.classList.add('active');
      
      if (id === 'mod-historial') {
        analizarPotreroHistorial();
      }
    }

    function generarCamposEtarios1() {
      const container = document.getElementById("m1-etarios-container");
      if (!container) return;
      container.innerHTML = "";

      GRUPOS_DESPLEGABLES.forEach((opciones) => {
        const div = document.createElement("div");
        div.className = "cat-box";
        div.innerHTML = `
          <select class="form-control select-cat" onchange="calcularUGM1()">
            <option value="${opciones[0]}">${opciones[0]}</option>
            <option value="${opciones[1]}">${opciones[1]}</option>
          </select>
          <input type="number" class="form-control input-cant" value="0" min="0" placeholder="Cant." oninput="calcularUGM1()">
        `;
        container.appendChild(div);
      });
      calcularUGM1();
    }

    function calcularUGM1() {
      const ha = parseFloat(document.getElementById("m1-potrero").value) || 1;
      let totalCabezas = 0;
      let totalUGM = 0;

      const boxes = document.querySelectorAll(".cat-box");
      boxes.forEach(box => {
        const catSelected = box.querySelector(".select-cat").value;
        const cant = parseInt(box.querySelector(".input-cant").value) || 0;
        const factor = FACTORES_UGM[catSelected] || 1.0;

        totalCabezas += cant;
        totalUGM += (cant * factor);
      });

      const cargaHa = (totalUGM / ha).toFixed(2);
      document.getElementById("m1-total-cabezas").value = totalCabezas;
      document.getElementById("m1-total-ugm").value = `${totalUGM.toFixed(1)} UGM`;
      document.getElementById("m1-carga-ha").value = `${cargaHa} UGM/ha`;
    }

    function guardarRegistroMod1() {
      const selPotrero = document.getElementById("m1-potrero");
      const potreroNombre = selPotrero.options[selPotrero.selectedIndex].text;
      const ha = selPotrero.value;
      const epoca = document.getElementById("m1-epoca").value;
      const mov = document.getElementById("m1-movimiento").value;
      const fIng = document.getElementById("m1-f-ingreso").value;
      const fSal = document.getElementById("m1-f-salida").value;
      const resp = document.getElementById("m1-responsable").value;
      const cabezas = parseInt(document.getElementById("m1-total-cabezas").value) || 0;
      const ugmHa = document.getElementById("m1-carga-ha").value;
      const ugmTotal = parseFloat(document.getElementById("m1-total-ugm").value) || 0;
      const obs = document.getElementById("m1-obs").value;

      if (cabezas <= 0) return alert("⚠️ Ingrese al menos un animal.");

      actualizarSemaforo("amarillo", "En cola...");

      let desgloseText = [];
      document.querySelectorAll(".cat-box").forEach(box => {
        const cat = box.querySelector(".select-cat").value;
        const cant = parseInt(box.querySelector(".input-cant").value) || 0;
        if (cant > 0) desgloseText.push(`${cat}: ${cant}`);
      });

      const reg = { potreroNombre, ha, epoca, mov, fIng, fSal, resp, detalle: desgloseText.join(", "), cabezas, ugmHa, ugmTotal, obs };

      const tx = db.transaction("potreros", "readwrite");
      tx.objectStore("potreros").add(reg);
      
      tx.oncomplete = () => {
        cargarTablas();
        limpiarFormMod1();
        actualizarSemaforo("verde", "Sincronizado");
        alert("✅ Registro guardado y sincronizado.");
      };

      tx.onerror = () => {
        actualizarSemaforo("rojo", "Error guardando");
      };
    }

    function limpiarFormMod1() {
      document.getElementById("form-mod1").reset();
      const hoy = new Date().toISOString().split('T')[0];
      document.getElementById("m1-f-ingreso").value = hoy;
      document.getElementById("m1-f-salida").value = hoy;
      generarCamposEtarios1();
    }

    function calcularMetricasLevante() {
      const fAnt = new Date(document.getElementById("lev-f-ant").value);
      const fAct = new Date(document.getElementById("lev-f-act").value);
      const pesoAnt = parseFloat(document.getElementById("lev-peso-ant").value) || 0;
      const pesoAct = parseFloat(document.getElementById("lev-peso-act").value) || 0;
      const pesoMeta = parseFloat(document.getElementById("lev-peso-meta").value) || 0;
      const cant = parseInt(document.getElementById("lev-cant").value) || 1;

      if (fAct <= fAnt || pesoAnt <= 0 || pesoAct <= 0) return;

      const diffDias = Math.max(1, Math.round((fAct - fAnt) / (1000 * 60 * 60 * 24)));
      const gananciaInd = pesoAct - pesoAnt;
      const gmd = gananciaInd / diffDias;
      const gananciaLote = gananciaInd * cant;

      let mesesMeta = "0.0";
      if (gmd > 0 && pesoMeta > pesoAct) {
        mesesMeta = ((pesoMeta - pesoAct) / (gmd * 30.44)).toFixed(1);
      }

      document.getElementById("kpi-gmd").innerText = gmd.toFixed(3);
      document.getElementById("kpi-ganancia-total").innerText = `${gananciaLote.toFixed(1)} kg`;
      document.getElementById("kpi-meses-meta").innerText = `${mesesMeta} M`;
    }

    function guardarRegistroLevante() {
      const lote = document.getElementById("lev-lote").value;
      const epoca = document.getElementById("lev-epoca").value;
      const sexo = document.getElementById("lev-sexo").value;
      const especie = document.getElementById("lev-especie").value;
      const grupo = document.getElementById("lev-grupo").value;
      const cant = document.getElementById("lev-cant").value;
      const gmd = document.getElementById("kpi-gmd").innerText;
      const ganLote = document.getElementById("kpi-ganancia-total").innerText;
      const mesesMeta = document.getElementById("kpi-meses-meta").innerText;
      const proxPesaje = document.getElementById("lev-f-prox").value;
      const obs = document.getElementById("lev-obs").value;

      if (!lote || !cant) return alert("⚠️ Ingrese el lote y la cantidad de animales.");

      actualizarSemaforo("amarillo", "En cola...");

      const reg = { lote, epoca, sexo, especie, grupo, cant, gmd, ganLote, mesesMeta, proxPesaje, obs };

      const tx = db.transaction("levante", "readwrite");
      tx.objectStore("levante").add(reg);
      
      tx.oncomplete = () => {
        cargarTablas();
        limpiarFormLevante();
        actualizarSemaforo("verde", "Sincronizado");
        alert("✅ Pesaje registrado y sincronizado.");
      };

      tx.onerror = () => {
        actualizarSemaforo("rojo", "Error guardando");
      };
    }

    function limpiarFormLevante() {
      document.getElementById("form-levante").reset();
      document.getElementById("kpi-gmd").innerText = "0.000";
      document.getElementById("kpi-ganancia-total").innerText = "0 kg";
      document.getElementById("kpi-meses-meta").innerText = "0.0 M";
    }

    function borrarFila(store, id) {
      if (confirm("¿Desea borrar este registro?")) {
        actualizarSemaforo("amarillo", "En cola...");
        const tx = db.transaction(store, "readwrite");
        tx.objectStore(store).delete(id);
        tx.oncomplete = () => {
          cargarTablas();
          actualizarSemaforo("verde", "Sincronizado");
        };
      }
    }

    function cargarTablas() {
      if (!db) return;

      // Cargar Módulo 1 (Potreros)
      const tx1 = db.transaction("potreros", "readonly");
      tx1.objectStore("potreros").getAll().onsuccess = (e) => {
        const list = e.target.result;
        const tbody = document.getElementById("tabla-mod1-body");
        tbody.innerHTML = "";
        let totCab = 0; let totUgm = 0;

        list.forEach(r => {
          totCab += r.cabezas;
          totUgm += r.ugmTotal;
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${r.potreroNombre}</td>
            <td>${r.ha}</td>
            <td>${r.epoca}</td>
            <td>${r.mov}</td>
            <td>${r.detalle || '-'}</td>
            <td>${r.cabezas}</td>
            <td>${r.ugmHa}</td>
            <td>${r.resp || '-'}</td>
            <td>${r.obs || '-'}</td>
            <td><button class="btn-danger" onclick="borrarFila('potreros', ${r.id})">Borrar</button></td>
          `;
          tbody.appendChild(tr);
        });

        document.getElementById("stat-cabezas").innerText = totCab;
        document.getElementById("stat-ugm").innerText = totUgm.toFixed(1);
      };

      // Cargar Módulo Levante
      const tx2 = db.transaction("levante", "readonly");
      tx2.objectStore("levante").getAll().onsuccess = (e) => {
        const list = e.target.result;
        const tbody = document.getElementById("tabla-levante-body");
        tbody.innerHTML = "";

        list.forEach(r => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${r.lote}</td>
            <td>${r.sexo} / ${r.especie}</td>
            <td>${r.cant}</td>
            <td>${r.gmd}</td>
            <td>${r.ganLote}</td>
            <td>${r.mesesMeta}</td>
            <td>${r.proxPesaje || '-'}</td>
            <td>${r.obs || '-'}</td>
            <td><button class="btn-danger" onclick="borrarFila('levante', ${r.id})">Borrar</button></td>
          `;
          tbody.appendChild(tr);
        });
      };
    }

    // Análisis de Historial y Rotación por Potrero (Módulo 3)
    function analizarPotreroHistorial() {
      if (!db) return;
      const targetPotrero = document.getElementById("m3-potrero-select").value;
      
      const tx = db.transaction("potreros", "readonly");
      tx.objectStore("potreros").getAll().onsuccess = (e) => {
        const registros = e.target.result.filter(r => r.potreroNombre === targetPotrero);
        const tbody = document.getElementById("tabla-mod3-body");
        tbody.innerHTML = "";

        if (registros.length === 0) {
          document.getElementById("m3-dias-descanso").innerText = "Sin registros";
          document.getElementById("m3-semaforo-status").innerText = "Sin Datos";
          document.getElementById("m3-semaforo-status").className = "status-badge badge-amarillo";
          document.getElementById("m3-dias-uso-prom").innerText = "0.0 Días";
          document.getElementById("m3-carga-inv").innerText = "0.00 UGM/ha";
          document.getElementById("m3-carga-ver").innerText = "0.00 UGM/ha";
          document.getElementById("m3-total-cabezas").innerText = "0 Cab.";
          return;
        }

        // Ordenar cronológicamente por fecha de salida/ingreso
        registros.sort((a, b) => new Date(b.fSal) - new Date(a.fSal));

        let totalCab = 0;
        let sumUgmInv = 0, countInv = 0;
        let sumUgmVer = 0, countVer = 0;
        let totalDiasOcupacion = 0;

        registros.forEach(r => {
          totalCab += r.cabezas;
          const ugmVal = parseFloat(r.ugmHa) || 0;
          
          if (r.epoca === "Invierno") { sumUgmInv += ugmVal; countInv++; }
          else { sumUgmVer += ugmVal; countVer++; }

          const dIng = new Date(r.fIng);
          const dSal = new Date(r.fSal);
          if (!isNaN(dIng) && !isNaN(dSal)) {
            totalDiasOcupacion += Math.max(0, Math.round((dSal - dIng) / (1000 * 60 * 60 * 24)));
          }

          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${r.fIng}</td>
            <td>${r.fSal}</td>
            <td>${r.epoca}</td>
            <td>${r.mov}</td>
            <td>${r.cabezas}</td>
            <td>${r.ugmHa}</td>
            <td>${r.detalle || '-'}</td>
            <td>${r.resp || '-'}</td>
            <td>${r.obs || '-'}</td>
          `;
          tbody.appendChild(tr);
        });

        // Cálculo de días de descanso desde el último egreso
        const ultimoRegistro = registros[0];
        const hoy = new Date();
        const ultimaSalida = new Date(ultimoRegistro.fSal);
        const diasDescanso = Math.max(0, Math.round((hoy - ultimaSalida) / (1000 * 60 * 60 * 24)));

        document.getElementById("m3-dias-descanso").innerText = `${diasDescanso} Días`;
        
        // Semáforo de disponibilidad por descanso estacional
        const semaforoEl = document.getElementById("m3-semaforo-status");
        if (diasDescanso >= 35) {
          semaforoEl.innerText = "Óptimo";
          semaforoEl.className = "status-badge badge-verde";
        } else if (diasDescanso >= 21) {
          semaforoEl.innerText = "Recuperación";
          semaforoEl.className = "status-badge badge-amarillo";
        } else {
          semaforoEl.innerText = "Ocupado / Reciente";
          semaforoEl.className = "status-badge badge-rojo";
        }

        document.getElementById("m3-dias-uso-prom").innerText = `${(totalDiasOcupacion / registros.length).toFixed(1)} Días`;
        document.getElementById("m3-carga-inv").innerText = `${countInv > 0 ? (sumUgmInv / countInv).toFixed(2) : "0.00"} UGM/ha`;
        document.getElementById("m3-carga-ver").innerText = `${countVer > 0 ? (sumUgmVer / countVer).toFixed(2) : "0.00"} UGM/ha`;
        document.getElementById("m3-total-cabezas").innerText = `${totalCab} Cab.`;
      };
    }
  </script>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <title>Sistema Hato Laguna Brava</title>
