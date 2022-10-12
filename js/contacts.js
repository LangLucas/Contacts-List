const d =document
const $form = d.querySelector('form')

$form.addEventListener('submit',(e)=>{
    //e = evento, 
    e.preventDefault(); //cancela el comportamiento por defecto del evento
    console.log('Datos Capturados')

    createContact($form.nombre.value, $form.correo.value, $form.telefono.value) //agregar parametros

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
                                    <button class="btn-card-delete"><i class="fa-sharp fa-solid fa-trash-can"></i></button>
                                    <button class="btn-card-update"><i class="fa-sharp fa-solid fa-pen-to-square"></i></button>
                                </div>
                            </div>`
                
                
            });
            //ejecutando una unica vez. Fuera del for 
            document.querySelector('.list-contacts').innerHTML = $template
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