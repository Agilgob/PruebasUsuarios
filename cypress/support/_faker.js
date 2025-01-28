import { fakerES_MX } from '@faker-js/faker';

export const crearUnaPersonaFalsa = () => {
  const faker = fakerES_MX;

  let telefono = Math.random().toString().substring(2, 12);

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
    fechaNacimiento: '15-05-1990',
    nacionalidad: 'MEXICANA',
  };

  return usuario;
};

export const crearPersonasFalsas = (cantidad = 1) => {
  const personas = [];
  for (let i = 0; i < cantidad; i++) {
    personas.push(crearUnaPersonaFalsa());
  }
  return personas;
};

