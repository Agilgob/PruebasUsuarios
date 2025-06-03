export STRATEGY=spike # smoke | average | breakpoint | spike | stress
export ENVIRONMENT=sandbox # sandbox | production
export APPLICATION=functionary
export K6_WEB_DASHBOARD=true 


export TEST=optimizacion-crimes
CURRENT_DATETIME=$(date +"%Y-%m-%d_%H-%M-%S")
export K6_WEB_DASHBOARD_EXPORT="tmp/${ENVIRONMENT}-${TEST}-${STRATEGY}-${CURRENT_DATETIME}.html"
export LOGS_DIR="tmp/${ENVIRONMENT}-${TEST}-${STRATEGY}-${CURRENT_DATETIME}.log"
k6 run "k6/${APPLICATION}/tests/${TEST}.js" >> "$LOGS_DIR"

export TEST=optimizacion-dependences
CURRENT_DATETIME=$(date +"%Y-%m-%d_%H-%M-%S")
export K6_WEB_DASHBOARD_EXPORT="tmp/${ENVIRONMENT}-${TEST}-${STRATEGY}-${CURRENT_DATETIME}.html"
export LOGS_DIR="tmp/${ENVIRONMENT}-${TEST}-${STRATEGY}-${CURRENT_DATETIME}.log"
k6 run "k6/${APPLICATION}/tests/${TEST}.js" >> "$LOGS_DIR"


export TEST=optimizacion-judgement
CURRENT_DATETIME=$(date +"%Y-%m-%d_%H-%M-%S")
export K6_WEB_DASHBOARD_EXPORT="tmp/${ENVIRONMENT}-${TEST}-${STRATEGY}-${CURRENT_DATETIME}.html"
export LOGS_DIR="tmp/${ENVIRONMENT}-${TEST}-${STRATEGY}-${CURRENT_DATETIME}.log"
k6 run "k6/${APPLICATION}/tests/${TEST}.js" >> "$LOGS_DIR"


export TEST=optimizacion-legalWays
CURRENT_DATETIME=$(date +"%Y-%m-%d_%H-%M-%S")
export K6_WEB_DASHBOARD_EXPORT="tmp/${ENVIRONMENT}-${TEST}-${STRATEGY}-${CURRENT_DATETIME}.html"
export LOGS_DIR="tmp/${ENVIRONMENT}-${TEST}-${STRATEGY}-${CURRENT_DATETIME}.log"
k6 run "k6/${APPLICATION}/tests/${TEST}.js" >> "$LOGS_DIR"


export TEST=optimizacion-matters
CURRENT_DATETIME=$(date +"%Y-%m-%d_%H-%M-%S")
export K6_WEB_DASHBOARD_EXPORT="tmp/${ENVIRONMENT}-${TEST}-${STRATEGY}-${CURRENT_DATETIME}.html"
export LOGS_DIR="tmp/${ENVIRONMENT}-${TEST}-${STRATEGY}-${CURRENT_DATETIME}.log"
k6 run "k6/${APPLICATION}/tests/${TEST}.js" >> "$LOGS_DIR"

export TEST=optimizacion-partyType
CURRENT_DATETIME=$(date +"%Y-%m-%d_%H-%M-%S")
export K6_WEB_DASHBOARD_EXPORT="tmp/${ENVIRONMENT}-${TEST}-${STRATEGY}-${CURRENT_DATETIME}.html"
export LOGS_DIR="tmp/${ENVIRONMENT}-${TEST}-${STRATEGY}-${CURRENT_DATETIME}.log"
k6 run "k6/${APPLICATION}/tests/${TEST}.js" >> "$LOGS_DIR"

# export TEST=optimizacion-rubros
# CURRENT_DATETIME=$(date +"%Y-%m-%d_%H-%M-%S")
# export K6_WEB_DASHBOARD_EXPORT="tmp/${ENVIRONMENT}-${TEST}-${STRATEGY}-${CURRENT_DATETIME}.html"
# export LOGS_DIR="tmp/${ENVIRONMENT}-${TEST}-${STRATEGY}-${CURRENT_DATETIME}.log"
# k6 run "k6/${APPLICATION}/tests/${TEST}.js" >> "$LOGS_DIR"


