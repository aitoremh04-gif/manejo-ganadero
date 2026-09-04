export function registrarEventoCategorias() {
    const categoria = document.getElementById('eventos-categoria').value;
    const tipo = document.getElementById('eventos-tipo').value;
    const cantidad = document.getElementById('eventos-cantidad').value;

    console.log(`Evento registrado: ${cantidad} de ${categoria} (${tipo})`);
    // Lógica del evento...
}

window.registrarEventoCategorias = registrarEventoCategorias;
