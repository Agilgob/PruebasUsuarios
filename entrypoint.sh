#!/bin/bash
set -e

./runCypress.sh > /tmp/test_events.log
./runPlaywright.sh > /tmp/test_events.log
./runSenderReports.sh 
