//variables===============================================
// elementos del HTML.
// HTML elements.
const horario = document.getElementById("horario");
const listaRecervaciones = document.querySelectorAll(".reservacion");
const diaElement = document.querySelectorAll(".dia");
const vacantes = document.querySelectorAll(".vacantes")[0].children;
const borrarBtn = document.getElementById("borrar");
const cancelarBotones = document.querySelectorAll(".cancelar");
const limpiar = document.getElementById("limpiar");
const cargando = document.getElementById("loading");
// variables globales.
//globals variables.
var UI, recervaciones, usuario;
var cancelar = false;
var agendaCitas = [];
// clases=================================================
class Cita{
    constructor ( id, nombre, dia, hora) {
        this.nombre = nombre;
        this.dia = dia;
        this.hora = hora;
        this.id = Number(id);
    }
    // toma las reservaciones guardadas en el LocalStorage.
    // take reservations saved in the LS.
    obtenerCitasLocalStorage() {
        if (localStorage.getItem("citas") === null) {
            agendaCitas = [];
        }else {
            agendaCitas = JSON.parse( localStorage.getItem("citas") );
        }
        // si LS no tiene reservaciones, retorna un array vacio, de lo contrario retorna un array con las reservaciones.
        // if LS is empty, return an empty array, if it is not return an array with the reservations.
        return agendaCitas;
    }
    // guarda la nueva reservacion en el LocalStorage.
    // save the new reservation in LocalStorage.
    guardarCitaLocalStorage(cita){
        let agendaCitasLS = this.obtenerCitasLocalStorage();        
        let flag = true;
        agendaCitasLS.forEach(function (agendaCitaLS) {
            // valida si ya hay una reseracion en ese dia y hora.
            // validate if the reservation is already saved at that time.
            if (agendaCitaLS.dia == cita.dia && agendaCitaLS.hora == cita.hora) {
                alert("Ya tiene recervación");
                flag = false;
            }  
        })
        // Si no hay reservaciones en ese dia y hora, guarda en LS, de lo contrario no lo guarda.
        // if there is not reservation at that time, save in LS, on the contrary is not saved.
        if (flag) {
            agendaCitasLS.push(cita);           
            localStorage.setItem("citas", JSON.stringify(agendaCitasLS));
            return true;           
        }
        // si la reservacion fué guardada retorna "true", de lo contraio retorna "false".
        // if the reservation it was saved return "true", on the contrary return "false".
    }
    obtenerActividades(){
        let agendaCitasLS = this.obtenerCitasLocalStorage();
        let actividadesDiarias = [];
        let actividadesLunes = 0;
        let actividadesMartes = 0;
        let actividadesMiercoles = 0;
        let actividadesJueves = 0;
        let actividadesViernes = 0; 
        // toma las reservaciones del LS y cuenta cuántas reservationes tiene en cada dia.
        // take all reservations from LS and it count how many reservations has each day.
        agendaCitasLS.forEach(cita => {
            switch (cita.dia) {
                case 1:
                actividadesLunes += 1;           
                    break;
                case 2:
                actividadesMartes += 1;
                    break;
                case 3:
                actividadesMiercoles += 1;
                    break;
                case 4:
                actividadesJueves += 1;
                    break;
                case 5:
                actividadesViernes += 1;
                    break;
                default:
                    return false;
                    break;
            }
        })
        actividadesDiarias.push(actividadesLunes);
        actividadesDiarias.push(actividadesMartes);
        actividadesDiarias.push(actividadesMiercoles);
        actividadesDiarias.push(actividadesJueves);
        actividadesDiarias.push(actividadesViernes);
        // la cantidad de reservaciones en cada dia es añadido a un array y es retornado.
        // the quantity of reservation in each day is added to an array and is returned. 
        return actividadesDiarias;
        // se retorna un array como este ejemplo:
        // is returned an array like this example:
        //  dia1 - dia2 - dia3 - dia4 - dia5
        //  day1 - day2 - day3 - day4 - day5
        // [   2  ,  5   ,  0  ,   1  ,  8  ]
    }
    porcentajeActividadDiaria(dia){
        // toma la cantidad de actividad de cada dia y calcula (%) de cada dia.
        // take the quantity of activity for each day and it calculate (%) from each day.
        let actividades = this.obtenerActividades();
        let porcentaje;
        // actividades al 0%
        // activity 0%
        if (actividades[dia - 1] == 0) {
            porcentaje = 0;
        }
        // actividades al 25%
        // activity 25%
        if (actividades[dia - 1] >= 1 && actividades[dia - 1] <= 4) {
            porcentaje = 25;
        }
        // actividades al 50&
        // activity 50%
        if (actividades[dia - 1] >= 4 && actividades[dia - 1] <= 6) {
            porcentaje = 50;
        }
        // actividades al 75&
        // activity 75%
        if (actividades[dia - 1] >= 6 && actividades[dia - 1] <= 8) {
            porcentaje = 75;
        }
        // actividades al 100%
        // activity 100%
        if (actividades[dia - 1] == 8) {
            porcentaje = 100;
        }
        return porcentaje;
        // retorna el (%) de cada dia.
        // return the (%) from each day.
    }
    // borrar reservaciones del LS
    // delete reservations from LS
    cancelarCita(idBorrar){
        let agendaCitasLS = this.obtenerCitasLocalStorage();
        let borrado = false;
        agendaCitasLS.forEach( function(cita, index) {
            // busca si hay una reservacion con la id a borrar.
            // look for if there is a reservation with the Id to delete.
            if (cita.id == idBorrar) {
                agendaCitasLS.splice(index, 1);
                localStorage.setItem("citas", JSON.stringify(agendaCitasLS));
                borrado = true;
            }
        })
        // retorna si fue borrado o no.
        // it return if it was deleted or not.
        return borrado;
    }
}
class Interfaz {
    // pone el marcador amarillo en el horario.
    // put highlighter yellow at the schedule.
    marcadorCitaEnHorario(marcadorId, marcador, dia, hora) {
        usuario = prompt("Nombre ");
        // valida si es un usuario que agrega la reservacion.
        // validate if is an user that add the reservation.
        if (usuario && usuario.length > 2 && !Number(usuario)) {
            // crea una reservacion.
            // it create a reservation.
            let cita = new Cita(marcadorId, usuario, dia, hora);
            // y es guardado en el LS.
            // and is saved in LS.
            if(cita.guardarCitaLocalStorage(cita)){
                marcador.classList.add("activo");
                if (cita.dia == this.detectarDiaHoy()) {
                    // si la reservacion es para hoy la imprime.
                    // if the reservation is for today is printed.
                    this.imprimirReservacionesDeHoy();
                }
            }
        }else {
            alert("Nombre no válido")
        }
    }
    // imprime las reservaciones de hoy.
    // print the reservations for today.
    imprimirReservacionesDeHoy(){
        listaRecervaciones[0].innerHTML = "";
        // ordena las recevaciones por orden de hora tomando la id.
        // order the reservations by the hours taking the id.
        agendaCitas.sort(function(a, b){return a.id - b.id});
        let diaHoy = this.detectarDiaHoy();
        agendaCitas.forEach(cita => {
            // valida si la reservation del LS es de hoy, si lo es, la imprime.
            // validate if the reservation from LS is for today, if is it, is printed.
            if (cita.dia == diaHoy) {
                let template = `
                <p class="text-center font-weight-bold m-0">${cita.nombre} - <span class="text-info">${cita.hora}</span></p>
                `;
                listaRecervaciones[0].innerHTML += template;
                
            } 
        }); 
    }
    imprimirCitasLocalStorage (){
        agendaCitas = new Cita;
        agendaCitas.obtenerCitasLocalStorage();
        // Obtiene las reservas desde LocalStorage
        // Retrieves reservations from LocalStorage
        
        let horarioRecervado = horario.lastElementChild.children;
        // Obtiene una referencia al último hijo de "horario" y sus elementos hijos, que representan los horarios disponibles
        // Gets a reference to the last child of "horario" and its child elements, which represent the available time slots
        
        agendaCitas.forEach(cita => {
            for (const index in horarioRecervado) {
                // Itera sobre cada reserva y cada horario disponible
                // Iterates over each reservation and each available time slot
                if (horarioRecervado.hasOwnProperty(index)) {
                    let element = horarioRecervado[index];
                    // Selecciona el elemento correspondiente a la reserva
                    // Selects the element corresponding to the reservation
                    element = element.children[cita.dia];
                    // Destaca el elemento si corresponde a la reserva
                    // Highlights the element if it corresponds to the reservation
                    if (element.id == cita.id) {
                        element.classList.add("activo");
                    }
                }
            }
        });
    }
    // imprime la disponibilidad the cada dia.
    // print how avalible is each day.
    imprimirDisponibilidad() {
        let diaActividad = new Cita();
        let dias = diaActividad.obtenerActividades(); 
                
        for (let i = 0; i < dias.length; i++) {
            let dia = i + 1; 
            vacantes[dia].classList = [];
            
            // añade clases de css tomando el (%) de actividades de cada dia.
            // add css classes taking the (%) of the activities from each day.
            if ( diaActividad.porcentajeActividadDiaria(dia) == 0 || !dias) {
                vacantes[dia].classList.add("diponibilidad100");
            }
            if ( diaActividad.porcentajeActividadDiaria(dia) == 25) {
                vacantes[dia].classList.add("diponibilidad75");
            }
            if ( diaActividad.porcentajeActividadDiaria(dia) == 50) {
                vacantes[dia].classList.add("diponibilidad50");
            }
            if ( diaActividad.porcentajeActividadDiaria(dia) == 75) {
                vacantes[dia].classList.add("diponibilidad25");
            }
            if ( diaActividad.porcentajeActividadDiaria(dia) == 100) {
                vacantes[dia].classList.add("diponibilidad0");
            }
        }
    }
    detectarDiaHoy(){
        // retorna el dia de hoy.
        // return what day is today.
        let diaHoy = new Date();
        diaHoy = diaHoy.getDay();

        switch (diaHoy) {
            case 1:
            diaElement[0].innerText = "Lunes";
                break;
            case 2:
            diaElement[0].innerText = "Martes";
                break;
            case 3:
            diaElement[0].innerText = "Miercoles";
                break;
            case 4:
            diaElement[0].innerText = "Jueves";
                break;
            case 5:
            diaElement[0].innerText = "Viernes";
                break;
            default:
                return false;
                break;
        }
        return diaHoy;
    }
}
// permitir usar las clases "Interfaz" y  "Cita".
// allow to use the classes "Interfaz" and "Cita". 
recervaciones = new Cita();
UI = new Interfaz();
// EventListeners=========================================
// carga los eventListeners.
// load the eventListeners.
cargarEventListener();
function cargarEventListener() {
    // actualiza el horario cada segundo.
    // update the schedule each second.
    // si no es lunes-viernes, no inicia app
    // if is not monday-friday, the app doesn't start
    if (UI.detectarDiaHoy() == false) {
        alert("Es tu fin de semana, no tienes nada que hacer.. :)");
        UI.imprimirDisponibilidad();
        UI.imprimirCitasLocalStorage();
    } else {
        setInterval(() => {
            UI.detectarDiaHoy();
            UI.imprimirDisponibilidad();
            UI.imprimirCitasLocalStorage();
            setTimeout(() => {
                cargando.style.display = "none";
                UI.imprimirReservacionesDeHoy();
            }, 3000);
        }, 1000);
    }
    // valida si ha sido cliqueado una recervacion para añadirla o borrarla.
    // validate if has been clicked a reservation to add or delete it.
    horario.addEventListener("click", function leerRecervacion(e){
        e.preventDefault();
        if(e.target.classList[0] == "seleccion" || e.target.classList == "cancelar") {   
            let marcador, marcadorId, hora, dia;
            if(!cancelar && e.target.classList[1] !== "activo") {
                marcador = e.target;
                marcadorId = e.target.id;
                hora = e.target.parentElement.querySelectorAll("th")[0].textContent;
                dia = e.composedPath()[0].cellIndex;
                UI.marcadorCitaEnHorario(marcadorId, marcador, dia, hora);
            }else {
                if(e.target.parentElement.classList[1] == "activo"){
                    marcador = e.target.parentElement;
                    marcadorId = e.target.parentElement.id;
                    
                    if(recervaciones.cancelarCita(marcadorId) == true ){
                        marcador.classList.remove("activo");
                        alert("Cita cancelada");
                    }  
                }
            }
        }
    });
    // detecta si el usuario quiere cancelar reservaciones.
    // detect if the user wants to cancel reservations.
    borrarBtn.addEventListener("click", function () {
        agendasCitas = recervaciones.obtenerCitasLocalStorage();
        cancelarBotones.forEach(btn => {
            if (btn.style.display == "block") {   
                btn.style.display = "none";
                cancelar = false;
            }else {
                if (agendaCitas.length !== 0) {
                    btn.style.display = "block";
                    cancelar = true;
                }
            }
        })
    });
}
