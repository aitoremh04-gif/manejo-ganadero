// CONFIGURACIÓN DE TELEGRAM Y GOOGLE SHEETS
const TELEGRAM_BOT_TOKEN = "TU_BOT_TOKEN_AQUI";
const TELEGRAM_CHAT_ID = "TU_CHAT_ID_AQUI";
const GOOGLE_WEB_APP_URL = "https://script.google.com/macros/s/TU_SCRIPT_ID/exec"; 

// 1. Actualización visual del semáforo en el DOM
function actualizarSemaforo(estado) {
  const luz = document.getElementById("luz-semaforo");
  const texto = document.getElementById("texto-semaforo");
  if (!luz || !texto) return;

  luz.className = "semaforo-luz " + estado;
  if (estado === "verde") texto.textContent = "Sincronizado";
  if (estado === "amarillo") texto.textContent = "Sincronizando...";
  if (estado === "rojo") texto.textContent = "Sin Conexión (Offline)";
}

// 2. Envío a Telegram con validación de respuesta (HTTP 200)
async function enviarATelegram(mensaje) {
  if (!TELEGRAM_BOT_TOKEN || TELEGRAM_BOT_TOKEN.includes("TU_BOT_TOKEN")) {
    console.warn("⚠️ Token de Telegram no configurado.");
    return false;
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: mensaje,
        parse_mode: "Markdown"
      })
    });

    const data = await response.json();
    return data.ok; // Devuelve true solo si Telegram confirmó la recepción
  } catch (error) {
    console.error("❌ Error enviando mensaje a Telegram:", error);
    return false;
  }
}

// 3. Envío opcional a Google Sheets
async function enviarAGoogleSheets(modulo, id, contenido) {
  if (!GOOGLE_WEB_APP_URL || GOOGLE_WEB_APP_URL.includes("TU_SCRIPT_ID")) return true;

  try {
    await fetch(GOOGLE_WEB_APP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ modulo, id, contenido })
    });
    return true; 
  } catch (error) {
    console.error("❌ Error enviando a Google Sheets:", error);
    return false;
  }
}

// 4. Formateador de mensajes para Telegram
function darFormatoTelegram(modulo, reg) {
  let texto = `🤠 *Hato Laguna Brava - Registro (${modulo})*\n`;
  texto += `🗓 *Fecha:* ${reg.fecha || new Date().toISOString().split('T')[0]}\n`;
  texto += `-----------------------------------\n`;

  // Iterar propiedades excluyendo metadatos internos
  Object.keys(reg).forEach(key => {
    if (!["id", "sincronizado", "fecha"].includes(key)) {
      const label = key.charAt(0).toUpperCase() + key.slice(1);
      texto += `• *${label}:* ${reg[key]}\n`;
    }
  });

  return texto;
}

// 5. Motor de Sincronización Principal
export async function sincronizarDatosPendientes() {
  if (!navigator.onLine) {
    actualizarSemaforo("rojo");
    return;
  }

  const clavesModulo = [
    { clave: "hlb_eventos", modulo: "Eventos Novedades" },
    { clave: "hlb_pesajes_levante", modulo: "Pesajes Levante" },
    { clave: "hlb_combustibles", modulo: "Combustible / Maquinaria" },
    { clave: "hlb_logistica_comidas", modulo: "Logística Comedor" },
    { clave: "hlb_tareas", modulo: "Planificación Tareas" },
    { clave: "hlb_sanitario", modulo: "Manejo Sanitario" }
  ];

  let huboSincronizacion = false;

  for (const item of clavesModulo) {
    const registros = JSON.parse(localStorage.getItem(item.clave) || "[]");
    const pendientes = registros.filter(r => !r.sincronizado);

    if (pendientes.length > 0) {
      huboSincronizacion = true;
      actualizarSemaforo("amarillo");

      for (const reg of pendientes) {
        // Construir mensaje formateado
        const mensajeTelegram = darFormatoTelegram(item.modulo, reg);

        // Enviar a Telegram y Google Sheets
        const exitoTelegram = await enviarATelegram(mensajeTelegram);
        const exitoSheets = await enviarAGoogleSheets(item.modulo, reg.id, reg);

        // Solo se marca como sincronizado si Telegram responde OK
        if (exitoTelegram && exitoSheets) {
          reg.sincronizado = true;
        }
      }

      // Guardar cambios en el almacenamiento local
      localStorage.setItem(item.clave, JSON.stringify(registros));
    }
  }

  actualizarSemaforo(navigator.onLine ? "verde" : "rojo");
}

// Event Listeners y Exposición Global
window.addEventListener("online", () => sincronizarDatosPendientes());
window.addEventListener("offline", () => actualizarSemaforo("rojo"));

setInterval(sincronizarDatosPendientes, 30000);
document.addEventListener("DOMContentLoaded", sincronizarDatosPendientes);

window.sincronizarDatosPendientes = sincronizarDatosPendientes;
