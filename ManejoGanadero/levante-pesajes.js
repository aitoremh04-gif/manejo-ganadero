// 1. Declaras y exportas la función normalmente
export function guardarPesajeLevante() {
    const idAnimal = document.getElementById('levante-id-animal').value;
    const peso = document.getElementById('levante-peso-actual').value;
    const fecha = document.getElementById('levante-fecha-pesaje').value;

    if (!idAnimal || !peso) {
        alert('Por favor complete la identificación y el peso.');
        return;
    }

    console.log(`Pesaje registrado: Animal ${idAnimal}, Peso: ${peso} kg, Fecha: ${fecha}`);
    // Lógica para guardar en base de datos o almacenamiento local...
}

// 2. La adjuntas al objeto global window para hacerla visible al onclick del HTML
window.guardarPesajeLevante = guardarPesajeLevante;
