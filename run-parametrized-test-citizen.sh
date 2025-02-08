ciudadano=('ciudadanoManuel')
tramites=(
    'civiles_familiares_mercantiles'
    'civiles_familiares_mercantiles_abogado'
    'civiles_familiares_mercantiles_abogado_demandado'
)

for c in "${ciudadano[@]}"; do
    for t in "${tramites[@]}"; do

        echo "Corriendo pruebas para el ciudadano $c con el trámite $t"
        npx cypress run --spec "cypress/e2e/Ciudadano/004_TramiteSecretarioAcuerdos.cy.js" --env ciudadano=$c,tramite=$t --quiet \
            >> "RESULTADOS.log"
    done
done
