#!/bin/bash


# Obtener la imagen de docker cypress-agilgob mas reciente   
DOCKER_IMAGE=$(docker images --format "{{.Repository}}:{{.Tag}}" | grep "cypress-agilgob:")



# specs=(
#     'cypress/e2e/Ciudadano/001*.cy.js'
#     'cypress/e2e/SecretarioAcuerdos/001*.cy.js'
#     'cypress/e2e/SecretarioAcuerdos/002*.cy.js'
#     'cypress/e2e/SecretarioAcuerdos/003*.cy.js'
#     'cypress/e2e/Ciudadano/004*.cy.js'
# )
# specs_independientes=$(IFS=,; echo "${specs[*]}")

# docker run --rm  \
#     -e SPEC=$specs_independientes \
#     -e CIUDADANO=ciudadanoManuel \
#     -e TRAMITE=civiles_familiares_mercantiles_abogado_demandado \
#     -e FUNCIONARIO=secretarioAcuerdos01 \
#     -v $(pwd)/cypress_report:/home/PruebasUsuarios/tmp \
#     $DOCKER_IMAGE


specs=(
    'cypress/e2e/SecretarioAcuerdos/007*.cy.js' 
    'cypress/e2e/SecretarioAcuerdos/008*.cy.js' 
    'cypress/e2e/SecretarioAcuerdos/009*.cy.js' 
    'cypress/e2e/SecretarioAcuerdos/011*.cy.js' 
    'cypress/e2e/SecretarioAcuerdos/012*.cy.js' 
    'cypress/e2e/SecretarioAcuerdos/013*.cy.js' 
)
specs_funcionario=$(IFS=,; echo "${specs[*]}")
docker run --rm  \
    -e SPEC=$specs_funcionario \
    -e JSON_FILE=true \
    -v $(pwd)/cypress_report:/home/PruebasUsuarios/tmp \
    $DOCKER_IMAGE




# specs=(
   
#     'cypress/e2e/SecretarioAcuerdos/007*.cy.js' 
#     'cypress/e2e/SecretarioAcuerdos/008*.cy.js' 
#     'cypress/e2e/SecretarioAcuerdos/009*.cy.js' 
#     'cypress/e2e/SecretarioAcuerdos/010*.cy.js' 
#     'cypress/e2e/SecretarioAcuerdos/011*.cy.js' 
#     'cypress/e2e/SecretarioAcuerdos/012*.cy.js' 
#     'cypress/e2e/SecretarioAcuerdos/013*.cy.js' 
#     'cypress/e2e/SecretarioAcuerdos/014*.cy.js'
# )
# specs_funcionario=$(IFS=,; echo "${specs[*]}")
# docker run --rm  \
#     -e SPEC=$specs_independientes \
#     -e JSON_FILE=true \
#     -v $(pwd)/cypress_report:/home/PruebasUsuarios/tmp \
#     $DOCKER_IMAGE



# npx cypress run --env jsonFile=true --quiet --spec "$specs_funcionario" \
#     --reporter-options reportFilename=Funcionario




# # Se reutiliza el script para probar los botones, tabuladores  pero ahora con el funcionario nuevo
# specs=(
#     'cypress/e2e/SecretarioAcuerdos/501*.cy.js'
#     'cypress/e2e/SecretarioAcuerdos/007*.cy.js'
#     'cypress/e2e/SecretarioAcuerdos/008*.cy.js'
#     'cypress/e2e/SecretarioAcuerdos/009*.cy.js'
#     'cypress/e2e/SecretarioAcuerdos/011*.cy.js'
#     'cypress/e2e/SecretarioAcuerdos/012*.cy.js'
#     'cypress/e2e/SecretarioAcuerdos/013*.cy.js'
# )

# specs_turnado=$(IFS=,; echo "${specs[*]}")
# npx cypress run --env jsonFile=true --quiet --spec "$specs_turnado" \
#     --reporter-options reportFilename=TurnadoPostValidations


