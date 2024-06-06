console.log('Introducción a WebComponents');

class CustomSelector extends HTMLElement {
    constructor() {
        super();
        this._data = {};
        this._title = document.createElement('h2');
        this._title.innerText = 'Gestión de Cuentas';

        this._listButton = document.createElement('button');
        this._listButton.innerText = 'Listar';
        this._listButton.addEventListener('click', this.listar.bind(this));
        this._createButton = document.createElement('button');
        this._createButton.innerText = 'Crear';
        this._createButton.addEventListener('click', this.crear.bind(this));
        this._editButton = document.createElement('button');
        this._editButton.innerText = 'Editar';
        this._editButton.addEventListener('click', this.editar.bind(this));
        this._deleteButton = document.createElement('button');
        this._deleteButton.innerText = 'Eliminar';
        this._deleteButton.addEventListener('click', this.eliminar.bind(this));

        this._table = document.createElement('table');
        this._table.innerHTML = `
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Saldo</th>
                </tr>
            </thead>
            <tbody id="cuerpo-tabla"></tbody>
        `;

        const buttonContainer = document.createElement('menu');
        buttonContainer.classList.add('button-container');
        const liList = document.createElement('li');
        const liCreate = document.createElement('li');
        const liEdit = document.createElement('li');
        const liDelete = document.createElement('li');

        liList.appendChild(this._listButton);
        liCreate.appendChild(this._createButton);
        liEdit.appendChild(this._editButton);
        liDelete.appendChild(this._deleteButton);

        buttonContainer.appendChild(liList);
        buttonContainer.appendChild(liCreate);
        buttonContainer.appendChild(liEdit);
        buttonContainer.appendChild(liDelete);

        this.appendChild(buttonContainer);
        this.appendChild(this._table);

        this.cuentas = [];
        this._cuerpoTabla = this.querySelector('#cuerpo-tabla');
    }

    connectedCallback() {
        this.listar();
    }

    async fillTable() {
        this._cuerpoTabla.innerHTML = '';

        try {
            const response = await fetch("http://localhost:3000/usuario");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const dataCuentas = await response.json();
            console.log(dataCuentas);

            if (!Array.isArray(dataCuentas)) {
                throw new Error('Invalid data format');
            }

            this.cuentas = dataCuentas;

            for (const cuenta of this.cuentas) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${cuenta.id}</td>
                    <td>${cuenta.username}</td>
                    <td>${cuenta.saldo}</td>
                `;
                this._cuerpoTabla.appendChild(row);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    listar() {
        this.fillTable();
    }

    async crear() {
        const ID =prompt ('ingrese id');
        const username = prompt('Ingrese el Username:');
        const saldo = parseFloat(prompt('Ingrese el Saldo:'));

        if (!username || isNaN(saldo)) {
            alert('Datos inválidos. Por favor, intente de nuevo.');
            return;
        }

        const nuevaCuenta = { username, saldo };

        try {
            const response = await fetch("http://localhost:3000/usuario", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevaCuenta)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Nueva cuenta creada:', result);

            this.listar(); // Actualizar tabla después de crear cuenta
        } catch (error) {
            console.error('Error creando cuenta:', error);
        }
    }

    async editar() {
        const id = parseInt(prompt('Ingrese el ID de la cuenta a editar:'));
        const cuentaExistente = this.cuentas.find(cuenta => cuenta.id === id);
    
        if (cuentaExistente) {
            const nuevoUsername = prompt('Ingrese el nuevo Username:', cuentaExistente.username);
            const nuevoSaldo = parseFloat(prompt('Ingrese el nuevo Saldo:', cuentaExistente.saldo));
    
            if (!nuevoUsername || isNaN(nuevoSaldo)) {
                alert('Datos inválidos. Por favor, intente de nuevo.');
                return;
            }
    
            const datosActualizados = { username: nuevoUsername, saldo: nuevoSaldo };
    
            try {
                const response = await fetch(`http://localhost:3000/usuario?id=${id}`, {  // Ajuste aquí
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(datosActualizados)
                });
    
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
    
                console.log('Cuenta actualizada:', await response.json());
                this.listar(); // Actualizar tabla después de editar cuenta
            } catch (error) {
                console.error('Error actualizando cuenta:', error);
            }
        } else {
            alert('No se encontró ninguna cuenta con ese ID.');
            console.log('No se encontró ninguna cuenta con ese ID.');
        }
    }
    
    async eliminar() {
        const id = parseInt(prompt('Ingrese el ID de la cuenta a eliminar:'));

        if (typeof id !== "number") {

            alert('ID inválido. Por favor, intente de nuevo.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/usuario?id=${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Cuenta eliminada:', result);

            this.listar(); // Actualizar tabla después de eliminar cuenta
        } catch (error) {
            console.error('Error eliminando cuenta:', error);
        }
    }
}

customElements.define('x-custom-selector', CustomSelector);
