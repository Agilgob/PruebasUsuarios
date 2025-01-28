export $(cat .env | xargs)

zip -r "$REPORT_FILENAME" tmp
curl -F "file=@$REPORT_FILENAME" \
    -F "initial_comment=$(cat tmp/test.log)" \
    -F "channels=$SLACK_CHANNEL" \
    -H "Authorization: Bearer $SLACK_TOKEN" \
    https://slack.com/api/files.upload
