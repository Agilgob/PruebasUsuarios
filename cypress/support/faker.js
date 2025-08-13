import { fakerES_MX } from '@faker-js/faker';
import { getRandomInt, chooseRandom } from '../utilities/random.js';
import { deepMerge } from '../utilities/deepMerge.js';


const faker = fakerES_MX;

export const crearUnaPersonaFalsa = () => {
 
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



/* 
All multi-select values will be omitted from these fixtures, to avoid changes in selectors.   
*/ 
function personalData(){
    return {
        regime : 'random',
        firstName: faker.person.firstName(),
        maternalLastName: faker.person.lastName().split(' ')[0],
        paternalLastName: faker.person.lastName().split(' ')[0],
        alias: faker.person.firstName(),
        age: getRandomInt(19,80),
        birthDate: `${getRandomInt(1,29)}-${getRandomInt(1,12)}-${getRandomInt(1945, 2005)}`,
        sex: chooseRandom(['Masculino', "Femenino"]), 
        gender: 'random',
        classification: 'random'
    };
}


function contactData(){
    return {
        email: faker.internet.email(),
        phoneNumber: getRandomInt(1111111111,9999999999),
        residencePlace: `${faker.location.streetAddress()}, ${faker.location.city()}` 
    }
}

function transparency(){
    const indigenous = [
      'Nahuatl', 'Tonantzin', 'Huirarica', 'Maya', 'Zapoteco', 'Mixteco', 'Otomí', 'Tzotzil',
      'Tzeltal', 'Mazateco', 'Purépecha', 'Huasteco', 'Chol', 'Tojolabal', 'Mazahua', 'Tarahumara',
      'Yaqui', 'Cora', 'Huichol', 'Chinanteco', 'Triqui', 'Amuzgo', 'Tepehuano', 'Popoloca',
      'Chontal', 'Zoque', 'Cuicateco', 'Mixe', 'Tlapaneco', 'Chatino', 'Chichimeca', 'Pame',
      'Guarijío', 'Seri', 'Cahuilla', 'Cochimi', 'Kiliwa', 'Kumiai', 'Paipai', 'Kickapoo'
    ];
    return {
        canReadWrite : 'random',
        speaksSpanish : 'random',
        languageOrDialect : chooseRandom(indigenous),
        educationalLevel : 'random',
        maritalStatus : 'random',
        nationality : 'random',
        occupation : faker.person.jobType(),
        indigenousCommunity : {
            answer : chooseRandom(['si','no']),
            community :  chooseRandom(indigenous)
        }
    }
}



export function createParty( personAttributes = {} ){

  let person = {
    partyType : 'random',
    personalData : personalData(),
    contactData : contactData(),
    transparency : transparency()
  }

  return deepMerge(person, personAttributes);

};

// console.clear()
// console.log(
//     createParty({
//         'partType' : 'Asesino en serie', 
//         'personalData' : { 'firstName' : 'El Galletoso'},
//         'contactData' : { 'email' : 'manuel@agilgob.com'},
//         'kind': 'public'
//     }))



Cypress.Commands.add('crearPersonasFalsas', (cantidad) => {
  return cy.wrap(crearPersonasFalsas(cantidad));
});

