console.log('Introducción a WebComponents');

class CustomSelector extends HTMLElement {
    constructor() {
        super();

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
        const buttonContainer = document.createElement("menu");
        buttonContainer.classList.add('button-container');
        const liList = document.createElement("li");
        const liCreate = document.createElement("li");
        const liEdit = document.createElement("li");
        const liDelete = document.createElement("li");

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

    async fillTable() {
        this._cuerpoTabla.innerHTML = '';
        let dataCuentas = await this.#DataLoading();
        for (const cuenta of dataCuentas["cuentas"]) {
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

    async #DataLoading(){//metodo privado
    
        let result = undefined;
       
            result = await fetch("./cuentas.json");
            const parseResult = await result.json()
            return {...parseResult};
       
    
    };// asincronica para leer y mostrar json

    crear() {
        const id = prompt('Ingrese el ID:');
        const username = prompt('Ingrese el Username:');
        const saldo = prompt('Ingrese el Saldo:');

        const nuevaCuenta = { id: parseInt(id), username, saldo };
        console.log('Nueva cuenta creada:', nuevaCuenta);
        this.cuentas.push(nuevaCuenta);

        this.fillTable(); // Actualizar tabla después de crear cuenta
    }

    editar() {

         const id = prompt('Ingrese el ID de la cuenta a editar:');
        const cuentaExistente = this.cuentas.find(cuenta => cuenta.id === parseInt(id));
       // const cuentaExistente = cuentas.find(cuenta => cuenta.id === parseInt(id));
        if (cuentaExistente) {
            const nuevoUsername = prompt('Ingrese el nuevo Username:', cuentaExistente.username);
            const nuevoSaldo = prompt('Ingrese el nuevo Saldo:', cuentaExistente.saldo);

            console.log('Cuenta anterior:', cuentaExistente);
            cuentaExistente.username = nuevoUsername;
            cuentaExistente.saldo = nuevoSaldo;
            console.log('Cuenta actualizada:', cuentaExistente);

            this.fillTable(); // Actualizar tabla después de editar cuenta
        } else {
            console.log('No se encontró ninguna cuenta con ese ID.');
        }
    }

    eliminar() {
        const id = prompt('Ingrese el ID de la cuenta a eliminar:');
        const index = this.cuentas.findIndex(cuenta => cuenta.id === parseInt(id));

        if (index !== -1) {
            const cuentaEliminada = this.cuentas.splice(index, 1)[0];
            console.log('Cuenta eliminada:', cuentaEliminada);

            this.fillTable(); // Actualizar tabla después de eliminar cuenta
        } else {
            console.log('No se encontró ninguna cuenta con ese ID.');
        }
    }
}

customElements.define('x-custom-selector', CustomSelector);

