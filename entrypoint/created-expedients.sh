#!/bin/bash

# This script finds a previously created expedient and captures its data.
npx cypress run --spec "cypress/e2e/Funcionario/MISEXP_FindCandidateTestData.cy.js"

# Validate if testData.json exists 
if [ -f "tmp/testData.json" ]; then
    echo "Test data file exists."
    TESTDATA_FILE_EXISTS=true
else
    echo "Test data file does not exist. Exiting."
    exit 1
fi

# Check the expedient permissions 
