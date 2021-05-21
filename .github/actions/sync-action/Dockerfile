FROM python:3.8-alpine

LABEL "com.github.actions.name"="Syncs a directory with Linode Bucket"
LABEL "com.github.actions.description"="The action syncs a source directory with a bucket hosted on Linode Object Storage"
LABEL "com.github.actions.icon"="refresh-cw"
LABEL "com.github.actions.color"="green"

LABEL version="0.1.0"
# LABEL repository=""
# LABEL homepage=""
# LABEL maintainer=""

# https://github.com/s3tools/s3cmd/blob/master/NEWS

RUN apk add --update bash

RUN pip install s3cmd python-dateutil python-magic

ADD entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
