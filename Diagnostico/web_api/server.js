const http = require('http');
const url = require('url');
const db = require('./db');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url, true);

  if (reqUrl.pathname === '/api/provincias' && req.method === 'GET') {
    // Consultar todas las provincias
    db.query('SELECT * FROM provincia', (err, results) => {
      if (err) {
        console.error('Error al obtener las provincias:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error interno del servidor' }));
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(results));
      }
    });
  } else if (reqUrl.pathname === '/api/departamentos-municipios' && req.method === 'GET') {
    // Consultar departamentos/municipios por provincia
    const idProvincia = reqUrl.query.id_provincia;
    db.query('SELECT * FROM municipio WHERE id_departamento IN (SELECT id FROM departamento WHERE id_provincia = ?)', [idProvincia], (err, results) => {
      if (err) {
        console.error('Error al obtener los municipios por provincia:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error interno del servidor' }));
      } else {
        console.log(results);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(results));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
  }
});

server.listen(PORT, () => {
  console.log(`Servidor web escuchando en el puerto ${PORT}`);
});
