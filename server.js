const express = require('express');
const { exec } = require('child_process');
const path = require('path'); // Para manejar rutas correctamente
const app = express();
const port = 3000;

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para ejecutar el código Python y enviar la respuesta al navegador
app.get('/solve', (req, res) => {
  // Extraer los valores de las ecuaciones desde la solicitud
  const { x1, y1, z1, x2, y2, z2 } = req.query;

  // Validar que todos los valores estén presentes y sean números
  if (![x1, y1, z1, x2, y2, z2].every(value => !isNaN(parseFloat(value)))) {
    return res.status(400).send('Todos los parámetros deben ser números válidos');
  }

  // Ejecutar el script de Python con los valores proporcionados
  exec(`python public/solve.py ${x1} ${y1} ${z1} ${x2} ${y2} ${z2}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error ejecutando Python: ${error}`);
      console.error(`stderr: ${stderr}`);
      return res.status(500).send('Error ejecutando Python');
    }
    res.send(stdout); // Enviar el resultado de Python al navegador
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
