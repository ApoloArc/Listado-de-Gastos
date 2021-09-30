//Variables 

const formulario = document.getElementById('agregar-gasto');
const listado = document.querySelector('.list-group');

//Listeners

eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
    formulario.addEventListener('submit', agregarGasto);
}

//Clases

class Presupuesto{
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    variableGasto(gasto) {
        this.gastos = [...this.gastos, gasto]; //Se usa el primer this.gato para acceder al antiguo this. , solo con el ".this" se puede hacer esto, de ese modo no modificamos el arreglo anterior
        this.calcularRestante();
    }
    calcularRestante(){
        const gastado = this.gastos.reduce((total, gasto)=> total + gasto.cantidadGasto, 0);
        this.restante = this.presupuesto - gastado;
        console.log(this.restante)
    }
    eliminarGasto(id){
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        this.calcularRestante();

    }
}

class UI {
    insertarPresupuesto(cantidad) {
    
        const {presupuesto, restante} = cantidad;
        document.getElementById('total').textContent = presupuesto;
        document.getElementById('restante').textContent = restante;

        
    }

    mostrarAlerta(mensaje, tipo){
        // Crear el div
        const div = document.createElement('div');
        div.classList.add('text-center', 'alert');

        if (tipo === 'error') {
            div.classList.add('alert-danger');
        }else{
            div.classList.add('alert-success');
        }

        div.textContent = mensaje;

        // Imprimir en el HTML

        document.querySelector('.primario').insertBefore(div, formulario);
        
        //Desaparecer el mensaje luego de 3 segundos

        setTimeout(() => {
            div.remove();
        }, 3000);

    }
    mostrarGastos(gastos){
        
        this.limpiarHtml();

        //Creando la lista      Iteramos en cada gasto y lo imprimimos
        
        gastos.forEach(gasto => {
    
            const {gastoNombre, cantidadGasto, id} = gasto;
            const nuevoli = document.createElement('li');
            nuevoli.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoli.dataset.id = id;

            //Cuerpo de el li, no se usa textContent porque también añadimos clases
            nuevoli.innerHTML = `

            ${gastoNombre} <span class='badge badge-primary badge-pill'>$ ${cantidadGasto}</span>

            `

            //Boton de borrar

            const btnBorrar = document.createElement('button');
            btnBorrar.className = 'btn btn-danger borrar-gasto';
            btnBorrar.textContent = 'Borrar x'
            btnBorrar.onclick=  () => {
                eliminarGasto(id);
            };

            nuevoli.appendChild(btnBorrar);
            listado.appendChild(nuevoli);
        });
    }
    limpiarHtml(){
        while (listado.firstChild) {
 
            listado.removeChild(listado.firstChild);   
        }
    }

    actualizarRestante (restante){
        document.getElementById('restante').textContent = restante;
    }

    pintarRestante(presupuestoObj){

        const {presupuesto, restante} = presupuestoObj;
        const divRestante = document.querySelector('.restante');

        if ((presupuesto / 4) > restante) {
            divRestante.classList.remove('alert-success', 'alert-warning');
            divRestante.classList.add('alert-danger');

        }
        else if((presupuesto / 2) > restante) {

            divRestante.classList.remove('alert-success', 'alert-danger');
            divRestante.classList.add('alert-warning', 'raaaaaaaa');
            console.log('gastate la mitad');
        }else{
            divRestante.classList.remove('alert-danger', 'alert-warning');
            divRestante.classList.add('alert-success');
        }

        // Si el total es cero o menor 
        if (restante <= 0) {
            ui.mostrarAlerta('El presupuesto se ha agotado', 'error');
            formulario.querySelector('button[type="submit"]').disabled = true;
        }


    }
}

const ui = new UI();

let presupuesto;


//Funciones

function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('¿Cuál es tu presupuesto?');

    if (presupuestoUsuario === '' || presupuestoUsuario <= 0 || isNaN(presupuestoUsuario) || presupuestoUsuario === null) {
        window.location.reload();
    }

    presupuesto = new Presupuesto(presupuestoUsuario) ;
    ui.insertarPresupuesto(presupuesto);
}

function agregarGasto(e) {
    e.preventDefault();
    const gastoNombre = document.getElementById('gasto').value;
    const cantidadGasto = Number(document.getElementById('cantidad').value);
    

    if (gastoNombre === '' || cantidadGasto === '') {
        ui.mostrarAlerta('Todos los campos son obligatorios', 'error')
        return;
    }else if(cantidadGasto <= 0 || isNaN(cantidadGasto)) {
        ui.mostrarAlerta('Cantidad no válida, por favor ingresa un número', 'error');
        return;
    }

    //Extraer variables
    const gasto = {gastoNombre, cantidadGasto, id: Date.now()};

    // Llamando a la funcion dentro de presupuesto, accedemos a ella gracias a let presupuesto
    presupuesto.variableGasto(gasto);
    
    // Agregando el contenido al array que tenemos
    ui.mostrarAlerta('Gasto Agregado Correctamente');

    //Imprimir los gastos

    const {gastos, restante} = presupuesto;

    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.pintarRestante(presupuesto);

    //Reseteamos el formulario
    formulario.reset();
}


function eliminarGasto(id) {
    presupuesto.eliminarGasto(id);

    const {gastos, restante} = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.pintarRestante(presupuesto);
}
