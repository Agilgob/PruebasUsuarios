#!/bin/bash

# Aqui se ejecutan las pruebas para cada vista:
# A diferencia de las otras pruebas, aqui no se hacen modificaciones en el ambiente,
# pero se prueban los elementos visibles de la pantalla, funcionalidades como botones, tablas
# paginadores, buscadores, barras de busqueda y peticiones a la API, asi como reincidencia de las peticiones
# como algunas pruebas de performance

npx cypress run --spec cypress/e2e/Funcionario/MisExpedientes.cy.js