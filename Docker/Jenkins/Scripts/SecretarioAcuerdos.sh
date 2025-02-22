

# Desde aqui se necesita establecer el funcionario correcto, al cual se le asignara
# de forma automatica por turnado el tramite, para que en la segunda prueba se pueda retomar
# el funcionario y el tramite que se le asigno
npx cypress run --spec "cypress/e2e/Ciudadano/001*.cy.js" --env ciudadano=ciudadanoManuel
npx cypress run --spec "cypress/e2e/Ciudadano/004*.cy.js" \
    --env ciudadano=ciudadanoManuel,tramite=civiles_familiares_mercantiles_abogado_demandado,funcionario=secretarioAcuerdos01


# Inicia y cancela tramites, luego los elimina
npx cypress run --spec cypress/e2e/SecretarioAcuerdos/00{1,2}*.cy.js \
    --env jsonFile=true --quiet


npx cypress run --spec 'cypress/e2e/SecretarioAcuerdos/0{07,08,09,10,11,12,13}*.cy.js' \
    --env jsonFile=true --quiet


npx cypress run --spec 'cypress/e2e/SecretarioAcuerdos/014*.cy.js' \
    --env jsonFile=true --quiet



# TO DO en algun punto se debe agregar el funcionario que al que se le turno el tramite

# Se retoma el tramite que se le asigno al funcionario
npx cypress run --spec 'cypress/e2e/SecretarioAcuerdos/015*.cy.js' \
    --env jsonFile=true --quiet


# se reutiliza el script para probar los botones, tabuladores  pero ahora con el funcionario nuevo
npx cypress run --spec 'cypress/e2e/SecretarioAcuerdos/0{07,08,09,10,11,12,13}*.cy.js' \
    --env jsonFile=true --quiet


# Construye el reporte con los json generados
# npx mochawesome-merge "tmp/reports/.jsons/*.json" > tmp/merged-report.json
# npx marge tmp/merged-report.json --reportFilename Reporte.html --reportDir tmp --inline=true
