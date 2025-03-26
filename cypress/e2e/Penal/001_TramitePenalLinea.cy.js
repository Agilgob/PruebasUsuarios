import { loadTestData, saveTestData } from '../../support/loadTestData';


describe('Automatización de Trámite Penal en Línea', () => {
    let formulariosCompletados = false;

    let cantImputados = Cypress.env('cantImputados') || 4;
    let cantVictimas = Cypress.env('cantVictimas') || 2;
    let imputados;
    let victimas;


    before(() => { 

        loadTestData();

        cy.crearPersonasFalsas(cantImputados).then((imputadosCreados) => {
            imputados = imputadosCreados
        })

        cy.crearPersonasFalsas(cantVictimas).then((victimasCreadas) => {
            victimas = victimasCreadas
        })

        cy.wait(500)

    });


    beforeEach(() => {
        // ✅ Deshabilitar animaciones directamente dentro del test
        cy.document().then((doc) => {
            const style = doc.createElement('style');
            style.innerHTML = `
                        *, *::before, *::after {
                            transition: none !important;
                            animation: none !important;
                        }
                    `;
            doc.head.appendChild(style);
        });

        cy.session('ciudadano-session', () => {
            cy.visit(environment.ciudadanoURL);
            cy.loginCiudadano(ciudadano.email, ciudadano.password)
        });

        cy.visit(environment.ciudadanoURL);
    });

    it('Debe completar el flujo del trámite penal', () => {
        
        cy.getNavigationBar('Trámites disponibles').click();

        // Tarjetas - Selecciona Tarjeta Penal
        cy.contains('Penal - Ordenes de aprehensión, reaprehensión, cateos y comparecencias')
            .closest('.procedure-card') // Encuentra la tarjeta contenedora
            .within(() => {
                cy.contains('Ir al trámite').should('be.visible').click();
            });
        cy.contains('Iniciar trámite').scrollIntoView().should('be.visible').click();

        
        // VISTA : Ingreso

        cy.get('input[name="carpeta_investigacion"]').type('1/2024'); // Numero de la carpeta de investigacion
        cy.llenarSelect('Distrito', 'Distrito segundo')

        cy.llenarSelectRandomValue('Vía o solicitud') // support/actions/llenarCamposFormularios.js
        cy.llenarSelect('Vía o solicitud', 'Orden de Cateo')
        cy.llenarSelect('Delito', 'ABANDONO DE PERSONAS')
        cy.llenarSelect('Forma de desahogo de la audiencia', 'Electrónico')
        cy.llenarSelect('Dependencia o Particular Solicitante', 'Juzgados de distrito en sistema acusatorio')
        cy.llenarSelect('Cantidad de imputados relacionados', cantImputados)
        cy.llenarSelect('Cantidad de victimas u ofendidos', cantVictimas)


        // 4️⃣ Adjuntar Firma FIREL (Modal de Firma)
        cy.contains('Agregar Firma').click();
        cy.contains('Firma Firel').click();
        cy.contains("Agregar Archivo").get('input[type=file]').eq(1)
            .selectFile( ciudadano.archivoFirel , { force: true })
            .click({ force: true });

        cy.contains('Contraseña').parent().get('input[name="password"]')
            .type( ciudadano.passwordFirel );

        cy.get('.modal-footer').within(() => {
            cy.contains('Agregar').click();
        });

        // Carga el documento a firmar
        cy.intercept('POST', '**/api/v1/upload_document').as('uploadDocument');
        cy.contains('Agregar Archivo').get('input[type=file]')
            .selectFile("assets/documento.pdf", { force: true }).click({ force: true });
        cy.wait('@uploadDocument').then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
            expect(interception.response.body.status).to.eq(true);
        });

        cy.contains('Firmar').click();
        // Esperar a que el modal de Firma FIREL se cierre
        cy.wait(2000);

        // 7️⃣ Adjuntar Anexos (Modal de Anexos)
        cy.contains('Agregar Campo para subir anexos').click();

        // Llenar los datos en el modal de anexos
        cy.get('div[role="dialog"]').within(() => {
            // 1️⃣ Seleccionar el tipo de documento
            cy.contains('Selecciona el tipo de documento').click();
            cy.get('div[id*="-option-0"]').click(); // Selecciona la primera opción

            // 2️⃣ Ingresar una etiqueta en el campo de texto
            cy.get('input[placeholder="Agrega una etiqueta para identificar este documento"]')
                .type('Documento Prueba');

            cy.contains('* Selecciona el archivo a subir')
                .get('input[type=file]')
                .selectFile("assets/documento.pdf", { force: true })
                .click({ force: true });

            cy.contains('Agregar').click();
        });

        // Esperar a que el modal de anexos se cierre
        cy.wait(5000);
        cy.intercept('POST', '**/api/v1/execute_stage').as('executeStage');
        cy.contains('Siguiente').click();
        cy.wait('@executeStage').then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
            expect(interception.response.body.status).to.eq(true);
        })




        // VISTA : Sujeto procesal ult

        cy.llenarSelect('Sujeto procesal', 'Agente del ministerio público') 
        cy.llenarSelect('Elige el regimén del Sujeto procesal', 'Física') 
        cy.llenarSelect('Nacionalidad', 'MEXICANA') 
        cy.llenarSelect('Edad', Math.floor(Math.random() * 50 + 18)) 
        cy.llenarSelectRandomValue('Estado civil')
        seleccionaRadioAleatorio('Sexo') 
        cy.llenarSelectRandomValue('Género')
        seleccionaRadioAleatorio('¿Sabe leer y escribir?') 
        cy.llenarSelectRandomValue('Grado de estudios')
        seleccionaRadioAleatorio('¿Habla español?') 
        cy.get('input[placeholder="selecciona una fecha"]').type('15-08-1990{enter}'); // 

        cy.contains('Siguiente').click();
        cy.wait('@executeStage').then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
            expect(interception.response.body.status).to.eq(true);
            cy.wait(2000)
        })

    
        // VISTA : Datos del imputado 

        imputados.forEach((imputado, index) => {

            cy.contains('h3', `Datos del Imputado`).scrollIntoView().should('be.visible');

            cy.contains('Apellido paterno').siblings('input').clear().type(imputado.apellidoPaterno);
            cy.contains('Apellido materno').siblings('input').clear().type(imputado.apellidoMaterno);
            cy.contains('Nombre(s)').siblings('input').clear().type(imputado.nombre);
            cy.contains('Alias').siblings('input').clear().type(imputado.alias);
            cy.contains('Número de teléfono').siblings('input').clear().type(imputado.telefono );
            seleccionaRadioAleatorio('Sexo');
            cy.llenarSelectRandomValue('Género');
            cy.llenarSelect('Edad', Math.floor(Math.random() * 50 + 18));
            cy.get('input[placeholder="selecciona una fecha"]').clear().type(imputado.fechaNacimiento);
            cy.llenarSelect('Nacionalidad', imputado.nacionalidad || 'MEXICANA');
            cy.contains('Lugar de nacimiento').siblings('input').clear().type(imputado.pais);
            cy.contains('Lugar habitual de residencia').siblings('input').clear().type(imputado.pais);
            cy.llenarSelectRandomValue('Estado civil');
            seleccionaRadioAleatorio('¿Sabe leer y escribir?');
            cy.llenarSelectRandomValue('Grado de estudios');
            seleccionaRadioAleatorio('¿Habla español?');
            cy.contains('Lengua indígena o dialecto').parent().find('input').clear().type(imputado.lengua);
            cy.contains('Ocupación').parent().find('input').clear().type(imputado.ocupacion || 'Desconocido');

            cy.contains('Siguiente').click();
            cy.wait('@executeStage').then((interception) => {
                expect(interception.response.statusCode).to.eq(200);
                expect(interception.response.body.status).to.eq(true);
                cy.screenshot(`Imputado ${index + 1}`)
                
            });
            cy.wait(2000) // Para que la vista cambie y no hacer el get sobre elementos que ya se llenaron en
                // el ciclo anterior :( no se puede quitar el wait

        });
            
        
        // Vista : Datos de la victima


        cy.llenarSelectRandomValue('Elige el tipo de parte del que se ingresará la información');
        cy.llenarSelectRandomValue('¿El nombre de la víctima u ofendido es un dato reservado?');
        cy.contains('¿El nombre de la víctima u ofendido es un dato reservado?')
            .scrollIntoView()
            .should('be.visible')
            .closest('div')
            .within(() => {
                cy.get('div[class!="singleValue"]').invoke('text').then((text) => {
                    if(text === 'Sí') {
                        cy.contains('Sí').click();
                    }
                    else{
                        cy.contains('No').click();
                    }
                })
            })
            


    //     // Ciclo para víctimas
    //     for (let i = 0; i <= nVic; i++) {
    //         town = municipiosR[Math.floor(Math.random() * municipiosR.length)];
    //         name = nombresR[Math.floor(Math.random() * nombresR.length)];
    //         lastName = apellidosR[Math.floor(Math.random() * apellidosR.length)];
    //         bday = 2024 - (Math.floor(Math.random() * (55 - 18 + 1)) + 18);
    //         month = (Math.floor(Math.random() * 12)) + 1;

    //         cy.wait(5000);
    //         // Inicio del formulario para víctimas
    //         // 1. Seleccionar "Tipo de parte"
    //         cy.contains('Elige el tipo de parte del que se ingresará la información')
    //             .parent().click();
    //         cy.get('div[id^="react-select"][id$="-option-0"]').should('exist').click(); // Ejemplo: "Víctima"

    //         // 2. Elegir si el nombre es un dato reservado (Sí o No aleatorio)
    //         let reservedData = Math.random() < 0.5 ? "0" : "1"; // "0" = Sí, "1" = No
    //         cy.log(`La opción seleccionada es: ${reservedData}`);

    //         cy.contains('¿El nombre de la víctima u ofendido es un dato reservado?')
    //             .parent().click();
    //         cy.get(`div[id^="react-select"][id$="-option-${reservedData}"]`).should('exist').click();

    //         // 3. Llenado del formulario básico
    //         cy.contains(`Apellido paterno`).parent().find('input').clear().type(lastName + i);
    //         cy.contains(`Apellido materno`).parent().find('input').clear().type('LOPEZ');
    //         cy.contains(`Nombre(s)`).parent().find('input').clear().type(name + i);


    //         if (reservedData === "1") { // Si la respuesta es "No", llenar más datos
    //             cy.log("Se seleccionó 'No', llenando el formulario completo.");

    //             cy.contains('Correo electrónico').parent().find('input').clear().type(`${name}${lastName}@correo.com`);
    //             cy.contains(`Número de teléfono`).parent().find('input').clear().type('3312345678');

    //             cy.contains('Masculino').click();

    //             cy.contains('Género').parent().click();
    //             cy.get('div[id^="react-select"][id$="-option-2"]').should('exist').click();

    //             cy.contains('Edad').parent().click();
    //             cy.get('div[id^="react-select"][id$="-option-3"]').should('exist').click(); // Cambia la edad

    //             cy.contains('Fecha de nacimiento').parent().find('input').clear().type(`15-${month}-${bday}`);

    //             cy.contains(`Lugar de nacimiento`).parent().find('input').clear().type('Mexico');

    //             cy.contains('Nacionalidad').parent().click();
    //             cy.get('div[id^="react-select"][id$="-option-1"]').should('exist').click(); // Ejemplo: "Argentina"

    //             cy.contains('Estado civil').parent().click();
    //             cy.get('div[id^="react-select"][id$="-option-1"]').should('exist').click(); // Ejemplo: "Casado"

    //     cy.contains('¿Sabe leer y escribir?').get('[id^="Sí-radio"]').check({ force: true });

    //             cy.contains('Grado de estudios').parent().click();
    //             cy.get('div[id^="react-select"][id$="-option-2"]').should('exist').click(); // Ejemplo: "Licenciatura"

    //             //cy.contains('¿Habla español?').parent().contains('Sí').click();

    //             cy.contains('Lengua indígena o dialecto').parent().find('input').clear().type('Ninguno');
    //             cy.contains('Ocupación').parent().find('input').clear().type('Abogado');
    //         } else {
    //             cy.log("Se seleccionó 'Sí', llenando solo los datos básicos.");
    //         }
    //         // 4. Hacer clic en "Siguiente"
    //         cy.contains('Siguiente').click();

    //     }
    //     // 1. Verificar que el mensaje de acuse está presente
    //     cy.contains('ACUSE DE ENVÍO DE ESCRITO ELECTRÓNICO').should('be.visible');
    //     cy.contains('Estimado Ciudadano: Se te hará llegar una notificación a tu correo electrónico').should('be.visible');

    //     // 2. Hacer clic en "Confirmar"
    //     cy.contains('Confirmar').click();

    //     cy.wait(10000);

    //     // 1. Verificar que estamos en "Proyectos de envío"
    //     cy.contains('Proyectos de envío')
    //         .should('have.class', 'active') // Verifica si ya está activa
    //         .then(($tab) => {
    //             if (!$tab.hasClass('active')) {
    //                 cy.contains('Proyectos de envío').click(); // Si no está activa, la selecciona
    //             }
    //         });

    //     // 2. Abrir el dropdown de filtro de estado
    //     cy.contains('Filtra tus trámites por estado aquí').parent().find('button').click();

    //     // 3. Seleccionar "En revisión"
    //     cy.contains('button', 'En revisión').click();

    //     // 4. Verificar que los trámites filtrados están en estado "Revisión"
    //     cy.get('table tbody tr').each(($row) => {
    //         cy.wrap($row).find('td').eq(3).should('contain', 'Revisión'); // Asegura que la columna de estado dice "Revisión"
    //     });
        formulariosCompletados = true;

    });

    it("Valida que los formularios se completaron correctamente", () => {
        if(!formulariosCompletados) {
            throw new Error("Abortada porque no se han completado los formularios");
        }
    })

});


const seleccionaRadioAleatorio = (label) => {
    cy.get('.col-md-12.col-12', {log:false}).filter(`:contains("${label}")`, {log:false}).within( () => { // Selecciona Sexo
        cy.get('.form-check-input', {log:false}).its('length', {log:false}).then((length) => { 
            const randomOption = Math.floor(Math.random() * length);
            cy.get('.form-check-input', {log:false}).eq(randomOption).check({ force: true });
         })
    })
}