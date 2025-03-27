import { fakerES, fakerES_MX } from '@faker-js/faker';


const crearUnaPersonaFalsa = () => {
  const faker = fakerES_MX;

  let telefono = "" + Math.random();
  telefono = telefono.substring(2, 12);
  
  const usuario = {
    nombre: faker.person.firstName(),
    apellidoMaterno: faker.person.lastName().split(' ')[0],
    apellidoPaterno: faker.person.lastName().split(' ')[0],
    lengua: 'Español',
    alias: faker.animal.petName(),
    correo: faker.internet.email(),
    telefono: telefono,
    direccion: faker.location.streetAddress(),
    ciudad: faker.location.city(),
    estado: faker.location.state(),
    pais: faker.location.country(),
    codigoPostal: faker.location.zipCode(),
    ocupacion: faker.person.jobType(),
    fechaNacimiento: '15-05-1990'
  };
  return cy.wrap(usuario);
};

const crearPersonasFalsas = (numero) => {
  const personas = [];
  return cy.wrap(null).then(() => {
    for (let i = 0; i < numero; i++) {
      crearUnaPersonaFalsa().then((persona) => {
        personas.push(persona);
      });
    }
  }).then(() => personas);
};

Cypress.Commands.add('crearPersonasFalsas', crearPersonasFalsas);
Cypress.Commands.add('crearUnaPersonaFalsa', crearUnaPersonaFalsa);