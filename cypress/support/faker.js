import { fakerES_MX } from '@faker-js/faker';

export const crearUnaPersonaFalsa = () => {
  const faker = fakerES_MX;

  const usuario = {
    nombre: faker.person.firstName(),
    apellidoMaterno: faker.person.lastName().split(' ')[0],
    apellidoPaterno: faker.person.lastName().split(' ')[0],
    lengua: 'Español',
    alias: faker.animal.petName(),
    correo: faker.internet.email(),
    telefono: Math.random().toString().substring(2, 12),
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


export function createParty(partyType='random', partyRegime='random'){
  const partyTypes = ['Actor', 'Demandado', 'Imputado'];
  const partyRegimes = ['Persona Fisica', 'Persona Moral'];

  const _type = partyType === 'random'
    ? partyTypes[Math.floor(Math.random() * partyTypes.length)]
    : partyType;

  if (!partyTypes.includes(_type)) {
    throw new Error(`El tipo "${_type}" no es válido. Debe ser uno de: ${partyTypes.join(', ')}`);
  }


  const _regime = partyRegime === 'random'
    ? partyRegimes[Math.floor(Math.random() * partyRegimes.length)]
    : partyRegime;

  if (!partyRegimes.includes(_regime)) {
    throw new Error(`El régimen "${_regime}" no es válido. Debe ser uno de: ${partyRegimes.join(', ')}`);
  }

    let _personalData = {
        regime: _regime,
        firstName: faker.person.firstName(),
        maternalLastName: faker.person.lastName().split(' ')[0],
        paternalLastName: faker.person.lastName().split(' ')[0],
        alias: faker.person.firstName(),
        age: Math.floor(Math.random() * 50) + 18,
        birthDate: '15-05-1990',
        sex: "Masculino",
        gender: "Heteronormatividad",
        classification: "Privado",
        showCover: true
    };

    let _contactData = {
        email : "eltuercas@gmailmail.com",
        phone : "5555555555",
        residencePlace : "Calle de la prueba"
    }

    let _transparencyData = {
        canReadWrite: "Si",
        speaksSpanish: "Si",
        languageOrDialect: "Ninguno",
        educationLevel: "Secundaria",
        maritalStatus: "No especifica",
        nationality: "MEXICANA",
        occupation: "QA Tester",
        belongsToIndigenousCommunity: "no"
    };


  if (_personalData.regime == 'Persona Moral'){
    _personalData['companyName'] = fakerES_MX.company.name()
  }

  return {
    type : _type,
    personalData : _personalData,
    contactData : _contactData,
    transparency : _transparencyData
  }


};



Cypress.Commands.add('crearPersonasFalsas', (cantidad) => {
  return cy.wrap(crearPersonasFalsas(cantidad));
});