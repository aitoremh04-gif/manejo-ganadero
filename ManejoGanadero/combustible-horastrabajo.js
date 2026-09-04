export function registrarControlCombustible() {
    const equipo = document.getElementById('combustible-equipo').value;
    const litros = document.getElementById('combustible-litros').value;
    const horometro = document.getElementById('combustible-horometro').value;

    console.log(`Combustible: ${equipo} - Litros: ${litros}, Horómetro: ${horometro}`);
    // Lógica de registro...
}

window.registrarControlCombustible = registrarControlCombustible;
