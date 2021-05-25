FROM python:3.8-alpine

# https://github.com/s3tools/s3cmd/blob/master/NEWS

RUN apk add --update bash

RUN pip install s3cmd python-dateutil python-magic

ADD entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
