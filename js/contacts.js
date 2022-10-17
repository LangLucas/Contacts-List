const d =document
const $form = d.querySelector('form')
let $listBtnsModi
let ContactCode
let EstoyModificando = false


$form.addEventListener('submit',(e)=>{
    //e = evento, 
    e.preventDefault(); //cancela el comportamiento por defecto del evento
    console.log('Datos Capturados')

    if(EstoyModificando){
        updateContact($form.nombre.value, $form.correo.value, $form.telefono.value,ContactCode)
    }else{
        createContact($form.nombre.value, $form.correo.value, $form.telefono.value) //agregar parametros
    }
    
    EstoyModificando = false
    $form.reset()

    
})


readContacts()


function readContacts() {
    let $template = ""
    fetch('http://localhost:3000/contactos')
        .then(res => res.json())
        .then(contactos => {

            //en este segmento se muestra data.json en la pagina
            document.querySelector('.list-contacts').innerHTML = ''
            contactos.forEach(contacto => {
                $template += `<div class="card">
                                <img src="../img/avatar.png" alt="Avatar">
                                <div class="card-container">
                                    <h4><b>${contacto.nombre}</b></h4>
                                    <p>${contacto.correo}</p>
                                    <p>${contacto.telefono}</p>
                                    <button class="btn-card-delete">Eliminar</button>
                                    <button data-codigo='${contacto.id}' class="btn-card-update">Modificar</button>
                                </div>
                            </div>`
                
                
            });
            //ejecutando una unica vez. Fuera del for 
            document.querySelector('.list-contacts').innerHTML = $template

            //obtenemos del html los botones de modificar
            $listBtnsModi = d.querySelectorAll('.btn-card-update')

            //recorrer array botones y por cada boton agrego una escucha al evento click, funcion anonima tipo flecha
            //obteniendo id de usuario en consola
            $listBtnsModi.forEach(boton =>{
                boton.addEventListener('click',(e)=>{
                    let id = e.target.dataset.codigo
                    //llamada a la funcion que leera el contacto a modificar de data.json
                    readOneContact(id)
                    EstoyModificando = true
                })
            })
        })
}

//traera los datos eleguidos a modificar
function readOneContact(idContact){
    fetch('http://localhost:3000/contactos/' + idContact)
    .then(res => res.json())
        .then(contacto => {
            ContactCode = contacto.id
            $form.nombre.value = contacto.nombre
            $form.correo.value = contacto.correo
            $form.telefono.value = contacto.telefono
        })
        
}

//crea contactos con fetch, usando el boton guardar se almacena la informacion
function createContact(pnombre, pcorreo, ptelefono) {

    //guardando parametros dentro de un objeto -> dandole formato json para almacenarlos en data.json
    const dataContact = {
        nombre: pnombre,
        correo: pcorreo,
        telefono: ptelefono,
    }

    const infoRequest = {
        method: 'POST',
        body: JSON.stringify(dataContact),
        headers: {
            'Content-Type': 'application/json'

        }
    }

    console.log(infoRequest.body)

    fetch('http://localhost:3000/contactos', infoRequest)
        .then(res => res.json())
        .then(res => {

            alert(`El registo de ${res.nombre} se creo correctamente con el codigo ${res.id}  `)
            readContacts()
        })
}

function updateContact(nombre, correo, telefono, id) {

    //guardando parametros dentro de un objeto -> dandole formato json para almacenarlos en data.json
    const dataContact = {
        nombre: nombre,
        correo: correo,
        telefono: telefono,
        id: id
    }

    const infoRequest = {
        method: 'PUT',
        body: JSON.stringify(dataContact),
        headers: {
            'Content-Type': 'application/json'

        }
    }

    console.log(infoRequest.body)

    fetch('http://localhost:3000/contactos/' + dataContact.id, infoRequest)
        .then(res => res.json())
        .then(res => {
            alert(`El cambio de ${res.nombre} se modifico correctamente`)
            console.log(res)
            readContacts()
        })
}

