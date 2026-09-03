<!-- MÓDULO 1: POTREROS Y UGM -->
    <section id="mod-1" class="module-view active">
      <div class="module-header">
        <h3>1. Control de Pastoreo, Potreros y UGM</h3>
      </div>
      
      <form id="form-mod1">
        <div class="form-row">
          <div class="form-group" style="grid-column: span 2;">
            <label>Potrero / Hectáreas:</label>
            <select class="form-control" id="m1-potrero" onchange="calcularUGM1()">
              <option value="432">Macanillal (432 ha)</option>
              <option value="569">El Galpón (569 ha)</option>
              <option value="80">Mata del Muerto (80 ha)</option>
              <option value="234">Manguito (234 ha)</option>
              <option value="205">Mata de Piña (205 ha)</option>
              <option value="102">Las Rallas (102 ha)</option>
              <option value="703">Potrero del Medio (703 ha)</option>
              <option value="77">Cuatro Esquinas (77 ha)</option>
              <option value="418">Paulero (418 ha)</option>
              <option value="422">Jobo Gacho (422 ha)</option>
              <option value="40">Curva del Peligro (40 ha)</option>
              <option value="36">Módulo A (36 ha)</option>
              <option value="36">Módulo B (36 ha)</option>
              <option value="36">Módulo C (36 ha)</option>
              <option value="36">Módulo D (36 ha)</option>
              <option value="143">Módulo F (143 ha)</option>
              <option value="125">Saladillal (125 ha)</option>
              <option value="142">Carretera (142 ha)</option>
              <option value="32">María del Carmen (32 ha)</option>
              <option value="26">Casa (26 ha)</option>
            </select>
          </div>
          <div class="form-group">
            <label>Época:</label>
            <select class="form-control" id="m1-epoca"><option>Invierno</option><option>Verano</option></select>
          </div>
          <div class="form-group">
            <label>Movimiento:</label>
            <select class="form-control" id="m1-movimiento"><option>Ingreso</option><option>Egreso</option></select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group"><label>Fecha Ingreso:</label><input type="date" id="m1-f-ingreso" class="form-control"></div>
          <div class="form-group"><label>Salida Est.:</label><input type="date" id="m1-f-salida" class="form-control"></div>
          <div class="form-group" style="grid-column: span 2;"><label>Responsable:</label><input type="text" id="m1-responsable" class="form-control" placeholder="Caporal"></div>
        </div>

        <label style="font-size:10px; font-weight:bold; margin: 4px 0 2px 0; display:block;">Categorías (Cantidad):</label>
        <div class="category-grid" id="m1-etarios-container"></div>

        <div class="form-row">
          <div class="form-group">
            <label>Total Cabezas:</label>
            <input type="number" id="m1-total-cabezas" class="form-control" readonly value="0" style="font-weight:bold;">
          </div>
          <div class="form-group">
            <label>Total UGM:</label>
            <input type="text" id="m1-total-ugm" class="form-control" readonly value="0.0 UGM" style="font-weight:bold; color:var(--blue-primary);">
          </div>
          <div class="form-group">
            <label>Carga (UGM/Ha):</label>
            <input type="text" id="m1-carga-ha" class="form-control" readonly value="0.00 UGM/ha" style="font-weight:bold;">
          </div>
        </div>

        <div class="form-group">
          <label>Observaciones:</label>
          <input type="text" id="m1-obs" class="form-control" placeholder="Estado del pasto, agua, etc.">
        </div>

        <div class="btn-group">
          <button type="button" class="btn-action" onclick="guardarRegistroMod1()">Guardar</button>
          <button type="button" class="btn-action btn-reset" onclick="limpiarFormMod1()">Limpiar</button>
        </div>
      </form>

      <div style="margin-top:12px;">
        <h4 style="margin:0 0 4px 0; font-size:11px; color:var(--blue-primary);">Resumen de Pastoreo</h4>
        <div class="kpi-container">
          <div class="kpi-card"><div class="kpi-title">Cabezas</div><div class="kpi-value" id="stat-cabezas">0</div></div>
          <div class="kpi-card"><div class="kpi-title">UGM Hato</div><div class="kpi-value" id="stat-ugm">0.0</div></div>
        </div>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Potrero</th>
              <th>Ha</th>
              <th>Época</th>
              <th>Mov.</th>
              <th>Detalle Categorías</th>
              <th>Cab.</th>
              <th>UGM/Ha</th>
              <th>Resp.</th>
              <th>Obs.</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody id="tabla-mod1-body"></tbody>
        </table>
      </div>
    </section>
