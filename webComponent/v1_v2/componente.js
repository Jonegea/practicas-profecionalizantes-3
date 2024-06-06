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
    connectedCallback() {this.#DataLoading()}

    async fillTable() {
        this._cuerpoTabla.innerHTML = '';
        let dataCuentas = await this._data;
        console.log(this._data);
        this.cuentas = dataCuentas.cuentas; // Actualizar this.cuentas con los datos cargados
        for (const cuenta of this.cuentas) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cuenta.id}</td>
                <td>${cuenta.username}</td>
                <td>${cuenta.saldo}</td>
            `;
            this._cuerpoTabla.appendChild(row);
        }
    }

    listar() {
        this.fillTable();
    }

    async #DataLoading() { // Método privado
        let result = await fetch("./cuentas.json");
        this._data = await result.json();
       // return await result.json();
        
    }

    crear() {
        const id = parseInt(prompt('Ingrese el ID:'));
        const username = prompt('Ingrese el Username:');
        const saldo = parseFloat(prompt('Ingrese el Saldo:'));

        if (!id || !username || isNaN(saldo)) {
            alert('Datos inválidos. Por favor, intente de nuevo.');
            return;
        }

        const nuevaCuenta = { id, username, saldo };
        this.cuentas.push(nuevaCuenta);

        console.log('Nueva cuenta creada:', nuevaCuenta);
        this.fillTable(); // Actualizar tabla después de crear cuenta
    }

    editar() {
        const id = parseInt(prompt('Ingrese el ID de la cuenta a editar:'));
        const cuentaExistente = this.cuentas.find(cuenta => cuenta.id === id);

        if (cuentaExistente) {
            const nuevoUsername = prompt('Ingrese el nuevo Username:', cuentaExistente.username);
            const nuevoSaldo = parseFloat(prompt('Ingrese el nuevo Saldo:', cuentaExistente.saldo));

            if (!nuevoUsername || isNaN(nuevoSaldo)) {
                alert('Datos inválidos. Por favor, intente de nuevo.');
                return;
            }

            console.log('Cuenta anterior:', cuentaExistente);
            cuentaExistente.username = nuevoUsername;
            cuentaExistente.saldo = nuevoSaldo;
            console.log('Cuenta actualizada:', cuentaExistente);

            this.fillTable(); // Actualizar tabla después de editar cuenta
        } else {
            alert('No se encontró ninguna cuenta con ese ID.');
            console.log('No se encontró ninguna cuenta con ese ID.');
        }
    }

    eliminar() {
        const id = parseInt(prompt('Ingrese el ID de la cuenta a eliminar:'));
        const index = this.cuentas.findIndex(cuenta => cuenta.id === id);

        if (index !== -1) {
            const cuentaEliminada = this.cuentas.splice(index, 1)[0];
            console.log('Cuenta eliminada:', cuentaEliminada);

            this.fillTable(); // Actualizar tabla después de eliminar cuenta
        } else {
            alert('No se encontró ninguna cuenta con ese ID.');
            console.log('No se encontró ninguna cuenta con ese ID.');
        }
    }
}

customElements.define('x-custom-selector', CustomSelector);
