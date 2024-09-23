// Mostrar el contenedor de resultados al enviar el formulario
document.getElementById('result').hidden = true;

// Validación para permitir solo números enteros, decimales o fracciones bloqueando teclas no necesarias
function validateInput(event) {
  const key = event.key;
  const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '/', 'Enter', 'Delete', 'ArrowLeft', 'ArrowRight'];
  
  // Bloquear cualquier tecla que no esté en allowedKeys
  if (!allowedKeys.includes(key) && event.key !== "Backspace" && event.key !== "Tab") {
    event.preventDefault();
  }
}

// Asignar validación a los inputs
const inputs = document.querySelectorAll('input[type="text"]');
inputs.forEach(input => {
  input.addEventListener('keydown', validateInput);
});

// Expresión regular para validar fracciones, decimales o enteros
const fractionOrIntOrDecimalRegex = /^-?\d+(\.\d+)?(\/?\d*)?$/;

// Función para validar si un valor es fracción, decimal o entero
function isValidFractionOrIntegerOrDecimal(value) {
  return fractionOrIntOrDecimalRegex.test(value);
}

// Función para convertir decimales a fracciones
function decimalToFraction(decimal) {
  if (decimal % 1 === 0) return decimal; // Si es un entero, devolverlo tal cual
  const len = decimal.toString().split('.')[1].length;
  const denominator = Math.pow(10, len);
  const numerator = decimal * denominator;
  const gcd = (a, b) => b ? gcd(b, a % b) : a; // Función para obtener el máximo común divisor
  const divisor = gcd(numerator, denominator);
  return `${numerator / divisor}/${denominator / divisor}`;
}

// Convertir los decimales de los inputs a fracciones
function convertDecimalsToFractions(values) {
  return values.map(value => {
    if (value.includes('.')) {
        return decimalToFraction(parseFloat(value));
    }
    return value; // Si no es decimal, lo devuelve tal cual
  });
}

document.getElementById('equation-form').addEventListener('submit', function(event) {
  document.getElementById('result').hidden = false;
  event.preventDefault(); // Evita recargar la página al enviar el formulario

  let x1 = document.getElementById('x1').value;
  let y1 = document.getElementById('y1').value;
  let z1 = document.getElementById('z1').value;
  let x2 = document.getElementById('x2').value;
  let y2 = document.getElementById('y2').value;
  let z2 = document.getElementById('z2').value;

  // Verifica si los inputs son válidos
  if (
    !isValidFractionOrIntegerOrDecimal(x1) ||
    !isValidFractionOrIntegerOrDecimal(y1) ||
    !isValidFractionOrIntegerOrDecimal(z1) ||
    !isValidFractionOrIntegerOrDecimal(x2) ||
    !isValidFractionOrIntegerOrDecimal(y2) ||
    !isValidFractionOrIntegerOrDecimal(z2)
  ){
    document.getElementById('result').innerHTML = `<h2>Error:</h2> Por favor ingrese solo números enteros, fracciones o decimales válidos.`;
    return;
  }

  // Convertir decimales a fracciones antes de enviar
  [x1, y1, z1, x2, y2, z2] = convertDecimalsToFractions([x1, y1, z1, x2, y2, z2]);

  // Llamar a la ruta en el servidor para resolver la ecuación
  fetch(`/solve?x1=${x1}&y1=${y1}&z1=${z1}&x2=${x2}&y2=${y2}&z2=${z2}`)
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            document.getElementById('result').innerHTML = `<h2>Error:</h2> ${data.error}`;
        } else {
            // Generar el formato del contenido de la solución y el procedimiento
            document.getElementById('result').innerHTML = `
                <h3>Resultado:</h3>
                <div class="result-box">
                    <p><strong>$$${data.x}$$</strong></p>
                    <p><strong>$$${data.y}$$</strong></p>
                </div>
                <h3>Procedimiento:</h3>
                <ol class="procedure-list">
                    <li>$$${data.step1[0]}$$  $$${data.step1[1]}$$  $$${data.step1[2]}$$  $$${data.step1[3]}$$</li>
                    <li>$$${data.step2[0]}$$  $$${data.step2[1]}$$  $$${data.step2[2]}$$  $$${data.step2[3]}$$</li>
                    <li>$$${data.step3[0]}$$  $$${data.step3[1]}$$  $$${data.step3[2]}$$  $$${data.step3[3]}$$</li>
                    <li>$$${data.step4[0]}$$  $$${data.step4[1]}$$  $$${data.step4[2]}$$  $$${data.step4[3]}$$</li>
                    <li>$$${data.step5[0]}$$  $$${data.step5[1]}$$  $$${data.step5[2]}$$  $$${data.step5[3]}$$</li>
                </ol>
            `;
            // Actualizar MathJax después de generar nuevo contenido
            MathJax.typeset();
        }
    })
    .catch(error => {
        document.getElementById('result').innerHTML = `<h2>Error:</h2> ${error.message}`;
        console.error('Error al resolver las ecuaciones:', error);
    });
});
