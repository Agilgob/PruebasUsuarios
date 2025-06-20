#!/bin/bash

export STRATEGY=deploy        # smoke | average | breakpoint | spike | stress | deploy
export ENVIRONMENT=production # sandbox | production
export APPLICATION=functionary
export K6_WEB_DASHBOARD=true

TESTS=(
    optimizacion-crimes
    optimizacion-dependences
    optimizacion-judgement
    optimizacion-legalWays
    optimizacion-matters
    optimizacion-partyType
    optimizacion-rubros
)

for TEST in "${TESTS[@]}"; do
    CURRENT_DATETIME=$(date +"%Y-%m-%d_%H-%M-%S")
    export K6_WEB_DASHBOARD_EXPORT="tmp/${ENVIRONMENT}-${TEST}-${STRATEGY}-${CURRENT_DATETIME}.html"
    export LOGS_DIR="tmp/${ENVIRONMENT}-${TEST}-${STRATEGY}-${CURRENT_DATETIME}.log"

    echo "▶️ Ejecutando prueba: $TEST"
    k6 run "k6/${APPLICATION}/tests/${TEST}.js" >> "$LOGS_DIR"
done
