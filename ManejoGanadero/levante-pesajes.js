 <!-- MÓDULO LEVANTE -->
    <section id="mod-levante" class="module-view">
      <div class="module-header">
        <h3>⚖️ Módulo de Levante y Eficiencia Ponderal</h3>
      </div>

      <form id="form-levante">
        <div class="form-row">
          <div class="form-group"><label>Lote:</label><input type="text" id="lev-lote" class="form-control" placeholder="Lote Mautes 2026"></div>
          <div class="form-group">
            <label>Época:</label>
            <select class="form-control" id="lev-epoca"><option>Invierno</option><option>Verano</option></select>
          </div>
          <div class="form-group">
            <label>Sexo:</label>
            <select class="form-control" id="lev-sexo"><option>Macho</option><option>Hembra</option></select>
          </div>
          <div class="form-group">
            <label>Especie:</label>
            <select class="form-control" id="lev-especie"><option>Bovino</option><option>Bufalino</option></select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group"><label>Grupo Etario:</label><input type="text" id="lev-grupo" class="form-control" placeholder="Mautes / Bautes"></div>
          <div class="form-group"><label>N° Animales:</label><input type="number" id="lev-cant" class="form-control" placeholder="50" oninput="calcularMetricasLevante()"></div>
        </div>

        <div class="form-row">
          <div class="form-group"><label>Fecha Pesaje Ant.:</label><input type="date" id="lev-f-ant" class="form-control" onchange="calcularMetricasLevante()"></div>
          <div class="form-group"><label>Peso Ant. (kg):</label><input type="number" id="lev-peso-ant" class="form-control" placeholder="180" oninput="calcularMetricasLevante()"></div>
        </div>

        <div class="form-row">
          <div class="form-group"><label>Fecha Pesaje Act.:</label><input type="date" id="lev-f-act" class="form-control" onchange="calcularMetricasLevante()"></div>
          <div class="form-group"><label>Peso Act. (kg):</label><input type="number" id="lev-peso-act" class="form-control" placeholder="205" oninput="calcularMetricasLevante()"></div>
          <div class="form-group"><label>Peso Meta (kg):</label><input type="number" id="lev-peso-meta" class="form-control" value="320" oninput="calcularMetricasLevante()"></div>
        </div>

        <div class="form-row">
          <div class="form-group"><label>Próximo Pesaje:</label><input type="date" id="lev-f-prox" class="form-control"></div>
        </div>

        <div class="kpi-container">
          <div class="kpi-card"><div class="kpi-title">GMD (kg/día)</div><div class="kpi-value" id="kpi-gmd">0.000</div></div>
          <div class="kpi-card"><div class="kpi-title">Ganancia Lote</div><div class="kpi-value" id="kpi-ganancia-total">0 kg</div></div>
          <div class="kpi-card"><div class="kpi-title">Meses a Meta</div><div class="kpi-value" id="kpi-meses-meta">0.0 M</div></div>
        </div>

        <div class="form-group"><label>Observaciones:</label><input type="text" id="lev-obs" class="form-control" placeholder="Suplementación, condición corporal, etc."></div>

        <div class="btn-group">
          <button type="button" class="btn-action" onclick="guardarRegistroLevante()">Guardar</button>
          <button type="button" class="btn-action btn-reset" onclick="limpiarFormLevante()">Limpiar</button>
        </div>
      </form>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Lote</th>
              <th>Sexo/Esp</th>
              <th>Cant</th>
              <th>GMD (kg/d)</th>
              <th>Ganancia Lote</th>
              <th>Meta (Meses)</th>
              <th>Próx Pesaje</th>
              <th>Obs.</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody id="tabla-levante-body"></tbody>
        </table>
      </div>
    </section>
