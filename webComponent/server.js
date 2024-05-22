const http = require('http');
const url = require('url');
const db = require('./db');
const fs = require('fs');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    // Configurar encabezados CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Manejar las solicitudes preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const reqUrl = url.parse(req.url, true);
    let responded = false;

    if (reqUrl.pathname === '/usuario' && req.method === 'GET') {
        // Consultar todas las cuentas
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
        console.log("entro al metodo");
        const id = reqUrl.query.id;

        if (!id) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Se requiere un ID' }));
            return;
        }

        // Eliminar la cuenta con el ID especificado
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

        // Escuchar el evento 'data' para acumular los datos del cuerpo de la solicitud
        req.on('data', chunk => {
            body += chunk.toString();
        });

        // Escuchar el evento 'end' para procesar el cuerpo de la solicitud una vez que todos los datos se hayan recibido
        req.on('end', () => {
            try {
                const data = JSON.parse(body);

                // Aquí puedes manejar los datos del cuerpo (data)
                // Por ejemplo, insertar una nueva cuenta en la base de datos
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
        
    }else if (reqUrl.pathname === '/cargar-usuarios' && req.method === 'GET') {
        // Leer el archivo JSON y cargar usuarios
        fs.readFile('./cuentas.json', 'utf8', (err, data) => {
            if (err) {
                console.error('Error al leer el archivo JSON:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Error interno del servidor' }));
            } else {
                try {
                    const cuentas = JSON.parse(data).cuentas;

                    // Iterar sobre cada cuenta y ejecutar una consulta de inserción para cada una
                    cuentas.forEach(cuenta => {
                        db.query('INSERT INTO acount (username, saldo) VALUES (?, ?)', [cuenta.username, cuenta.saldo], (err, results) => {
                            if (err) {
                                console.error('Error al insertar la cuenta:', err);
                                // Puedes manejar el error aquí si es necesario
                            } else {
                                console.log('Cuenta insertada correctamente:', results.insertId);
                                // Puedes enviar una respuesta al cliente aquí si lo deseas
                            }
                        });
                    });

                    // Una vez que todas las cuentas se han insertado, enviar una respuesta al cliente
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