export function parseFunctionary(_functionary) {
    let functionary = {"key" : _functionary};
    functionary["email"] = process.env[`${_functionary}_EMAIL`];
    functionary["password"] = process.env[`${_functionary}_PASSWORD`];
    functionary['nombre'] = process.env[`${_functionary}_NOMBRE`];
    functionary["username"] = process.env[`${_functionary}_USERNAME`];
    functionary["archivoFirel"] = process.env[`${_functionary}_ARCHIVOFIREL`];
    functionary["passwordFirel"] = process.env[`${_functionary}_PASSWORDFIREL`];
    functionary["turnaA"] = process.env[`${_functionary}_TURNAA`];
    functionary["archivoAcuerdos"] = process.env[`${_functionary}_ARCHIVOACUERDOS`];

    if (!functionary.email || !functionary.password) {
        throw new Error(`Missing environment variables for functionary: ${functionary.key}`);
    }
    return functionary;
};

export function parseCitizen(_citizen) {
    let citizen = {"key" : _citizen};
    citizen["email"] = process.env[`${_citizen}_EMAIL`];
    citizen["password"] = process.env[`${_citizen}_PASSWORD`];
    citizen["archivoFirel"] = process.env[`${_citizen}_ARCHIVOFIREL`];
    citizen["passwordFirel"] = process.env[`${_citizen}_PASSWORDFIREL`];
    citizen["documentoIdentificacion"] = process.env[`${_citizen}_DOCUMENTOIDENTIFICACION`];

    if (!citizen.email || !citizen.password) {
        throw new Error(`Missing environment variables for citizen: ${citizen.key}`);
    }
    return citizen;
    
};


export function parseEnvironment() {
    const environment = {
        documentoPDF: process.env.PDF_DOCUMENT,
        imagenPNG: process.env.PGN_IMAGE,
        environment: process.env.ENVIRONMENT,
        funcionarioURL: process.env.FUNCTIONARY_URL,
        ciudadanoURL: process.env.CITIZEN_URL,
        superadminURL: process.env.SUPERADMIN_URL,
        modeladorURL: process.env.MODELER_URL
    };
    
    Object.keys(environment).forEach((key) => {
        if (!environment[key]) {
            throw new Error(`Missing environment variable: ${key} in environment ${environment.environment}`);
        }
    });
    
    
    return environment;
};