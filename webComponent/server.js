const http = require('http');
const url = require('url');
const db = require('./db');
const fs = require('fs');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const reqUrl = url.parse(req.url, true);

    if (reqUrl.pathname === '/usuario' && req.method === 'GET') {
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
    } else if (reqUrl.pathname === '/usuario' && req.method === 'DELETE') {
        const id = reqUrl.query.id;

        if (!id) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Se requiere un ID' }));
            return;
        }

        db.query('DELETE FROM acount WHERE id = ?', [id], (err, results) => {
            if (err) {
                console.error('Error al eliminar la cuenta:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Error interno del servidor' }));
            } else if (results.affectedRows === 0) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Cuenta no encontrada' }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Cuenta eliminada correctamente' }));
            }
        });
    } else if (reqUrl.pathname === '/usuario' && req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const { username, saldo } = data;

                db.query('INSERT INTO acount (username, saldo) VALUES (?, ?)', [username, saldo], (err, results) => {
                    if (err) {
                        console.error('Error al insertar la cuenta:', err);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Error interno del servidor' }));
                    } else {
                        res.writeHead(201, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Cuenta creada correctamente', id: results.insertId }));
                    }
                });
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Datos inválidos en el cuerpo de la solicitud' }));
            }
        });

    } else if (reqUrl.pathname === '/usuario' && req.method === 'PUT') {
        const id = reqUrl.query.id;
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });
        console.log("entro a editar");
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const { username, saldo } = data;

                db.query('UPDATE acount SET username = ?, saldo = ? WHERE id = ?', [username, saldo, id], (err, results) => {
                    if (err) {
                        console.error('Error al actualizar la cuenta:', err);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Error interno del servidor' }));
                    } else if (results.affectedRows === 0) {
                        res.writeHead(404, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Cuenta no encontrada' }));
                    } else {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Cuenta actualizada correctamente' }));
                    }
                });
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Datos inválidos en el cuerpo de la solicitud' }));
            }
        });
    } else if (reqUrl.pathname === '/cargar-usuarios' && req.method === 'GET') {
        fs.readFile('./cuentas.json', 'utf8', (err, data) => {
            if (err) {
                console.error('Error al leer el archivo JSON:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Error interno del servidor' }));
            } else {
                try {
                    const cuentas = JSON.parse(data).cuentas;

                    cuentas.forEach(cuenta => {
                        const saldo = parseFloat(cuenta.saldo.replace('$', ''));
                        db.query('INSERT INTO acount (username, saldo) VALUES (?, ?)', [cuenta.username, saldo], (err, results) => {
                            if (err) {
                                console.error('Error al insertar la cuenta:', err);
                            } else {
                                console.log('Cuenta insertada correctamente:', results.insertId);
                            }
                        });
                    });

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Usuarios cargados correctamente' }));
                } catch (error) {
                    console.error('Error al parsear el archivo JSON:', error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Error interno del servidor' }));
                }
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
