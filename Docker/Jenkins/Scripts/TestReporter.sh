

# Desde aqui se necesita establecer el funcionario correcto, al cual se le asignara
# de forma automatica por turnado el tramite, para que en la segunda prueba se pueda retomar
# el funcionario y el tramite que se le asigno
# npx cypress run --spec "cypress/e2e/Ciudadano/00{1,4}*.cy.js" \
#     --env ciudadano=ciudadanoManuel,tramite=civiles_familiares_mercantiles_abogado_demandado,funcionario=secretarioAcuerdos01


# Inicia y cancela tramites, luego los elimina
rm -r tmp
npx cypress run --spec cypress/e2e/Ciudadano/001*.cy.js 
npx cypress run --spec cypress/e2e/SecretarioAcuerdos/001*.cy.js 
npx cypress run --spec cypress/e2e/SecretarioAcuerdos/002*.cy.js  


# Construye el reporte con los json generados
# npx mochawesome-merge "tmp/reports/.jsons/*.json" > tmp/merged-report.json
# npx marge tmp/merged-report.json --reportFilename Reporte.html --reportDir tmp 
