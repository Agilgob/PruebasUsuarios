export STRATEGY=average # smoke | average | breakpoint | spike | stress
export ENVIRONMENT=sandbox
export APPLICATION=citizen
export K6_WEB_DASHBOARD=true 
export TEST=api-login.js

BAR="#########################################################################################################"
echo "${BAR}" 
echo "\t Running stress test for ${APPLICATION} in ${ENVIRONMENT} environment with ${STRATEGY} strategy | Test: ${TEST}"
echo "${BAR}" 

CURRENT_DATETIME=$(date +"%Y-%m-%d_%H-%M-%S")
export K6_WEB_DASHBOARD_EXPORT="tmp/${ENVIRONMENT}-${APPLICATION}-${STRATEGY}-${CURRENT_DATETIME}.html"
k6 run "k6/${APPLICATION}/tests/${TEST}"
