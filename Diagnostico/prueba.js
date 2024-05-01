const fs = requclearre('fs');
const xlsx = require('xlsx');
const mysql = require('mysql');

// Configura la conexión a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: '2daprueba'
});

// Lee el archivo Excel
const workbook = xlsx.readFile('./Localidades.xlsx');
const sheetName = workbook.SheetNames[0]; // Suponiendo que los datos están en la primera hoja
const worksheet = workbook.Sheets[sheetName];

// Convertir el archivo Excel a formato JSON
const data = xlsx.utils.sheet_to_json(worksheet, { raw: false });

// Conectar a la base de datos
connection.connect((err) => {
    if (err) {
        console.error('Error de conexión a la base de datos:', err);
        return;
    }

    console.log('Conectado a la base de datos.');

    // Iterar sobre cada fila de datos y realizar la inserción en la base de datos
    data.forEach((row) => {
        const { Localidad, 'Código UTA 2020': codigoUTA2020, 'Código UTA 2010': codigoUTA2010, Latitud, Longitud, Municipio, Departamento, Provincia } = row;

        // Construir la consulta SQL de inserción
        // Llamar al procedimiento almacenado insert_masivo
        connection.query(
            'CALL insert_masivo(?, ?, ?, ?, ?, ?, ?, ?)',
            [Localidad, codigoUTA2020, codigoUTA2010, Latitud, Longitud, Municipio, Departamento, Provincia],
            (error, results, fields) => {
                if (error) {
                    console.error('Error al llamar al procedimiento almacenado:', error);
                } else {
                    console.log('Procedimiento almacenado ejecutado correctamente.');
                }
            }
        );


        /*   // Ejecutar la consulta SQL
          connection.query(query, [Localidad, codigoUTA2020, codigoUTA2010, Latitud, Longitud, Municipio, Departamento, Provincia], (error, results, fields) => {
            if (error) {
              console.error('Error al insertar datos:', error);
            } else {
              console.log('Datos insertados correctamente.');
            }
          }); */
    });

    // Cerrar la conexión a la base de datos al finalizar la inserción
    connection.end((err) => {
        if (err) {
            console.error('Error al cerrar la conexión:', err);
        } else {
            console.log('Conexión cerrada correctamente.');
        }
    });
});


