

# # Desde aqui se necesita establecer el funcionario correcto, al cual se le asignara
# # de forma automatica por turnado el tramite, para que en la segunda prueba se pueda retomar
# # el funcionario y el tramite que se le asigno


npx cypress run --spec "cypress/e2e/Ciudadano/004*.cy.js" \
    --env ciudadano=ciudadanoManuel,tramite=civiles_familiares_mercantiles_abogado_demandado,funcionario=secretarioAcuerdos01 \
    --reporter-options reportFilename=CreacionDemandaInical



specs=(
    'cypress/e2e/Ciudadano/001*.cy.js'
    'cypress/e2e/SecretarioAcuerdos/001*.cy.js'
    'cypress/e2e/SecretarioAcuerdos/002*.cy.js'
    'cypress/e2e/SecretarioAcuerdos/003*.cy.js'
)
specs_independientes=$(IFS=,; echo "${specs[*]}")
npx cypress run --env jsonFile=true --quiet --spec "$specs_independientes" \
    --reporter-options reportFilename=Creacion


# para probar los botones, tabuladores  pero ahora con el funcionario nuevo
# 014 turna el expediente al segundo funcionario
specs=(
    'cypress/e2e/SecretarioAcuerdos/007*.cy.js' 
    'cypress/e2e/SecretarioAcuerdos/008*.cy.js' 
    'cypress/e2e/SecretarioAcuerdos/009*.cy.js' 
    'cypress/e2e/SecretarioAcuerdos/010*.cy.js' 
    'cypress/e2e/SecretarioAcuerdos/011*.cy.js' 
    'cypress/e2e/SecretarioAcuerdos/012*.cy.js' 
    'cypress/e2e/SecretarioAcuerdos/013*.cy.js' 
    'cypress/e2e/SecretarioAcuerdos/014*.cy.js'
)
specs_funcionario=$(IFS=,; echo "${specs[*]}")
npx cypress run --env jsonFile=true --quiet --spec "$specs_funcionario" \
    --reporter-options reportFilename=Funcionario




# Se reutiliza el script para probar los botones, tabuladores  pero ahora con el funcionario nuevo
specs=(
    'cypress/e2e/SecretarioAcuerdos/501*.cy.js'
    'cypress/e2e/SecretarioAcuerdos/007*.cy.js'
    'cypress/e2e/SecretarioAcuerdos/008*.cy.js'
    'cypress/e2e/SecretarioAcuerdos/009*.cy.js'
    'cypress/e2e/SecretarioAcuerdos/011*.cy.js'
    'cypress/e2e/SecretarioAcuerdos/012*.cy.js'
    'cypress/e2e/SecretarioAcuerdos/013*.cy.js'
)

specs_turnado=$(IFS=,; echo "${specs[*]}")
npx cypress run --env jsonFile=true --quiet --spec "$specs_turnado" \
    --reporter-options reportFilename=TurnadoPostValidations



# Construye el reporte con los json generados
# npx mochawesome-merge "tmp/reports/.jsons/*.json" > tmp/merged-report.json
# npx marge tmp/merged-report.json --reportFilename Reporte.html --reportDir tmp --inline=true
