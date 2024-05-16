const http = require('http');
const url = require('url');
const db = require('./db');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url, true);

  if (reqUrl.pathname === '/usuario' && req.method === 'GET') {
    // Consultar todas las provincias
    db.query('SELECT * FROM acount', (err, results) => {
      if (err) {
        console.error('Error al obtener las cuentas:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error interno del servidor' }));
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(results));
      }
    });
  } else if (reqUrl.pathname === '/api/departamentos-municipios' && req.method === 'GET') {
 

    
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
  }
});

server.listen(PORT, () => {
  console.log(`Servidor web escuchando en el puerto ${PORT}`);
});