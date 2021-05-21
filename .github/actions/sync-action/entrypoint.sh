#!/bin/bash

if [ -z "$BUCKET" ]; then
  echo -e 'BUCKET variable is not set. Quitting.'
  exit 1
fi

if [ -z "$LINODE_ACCESS_KEY" ]; then
  echo -e 'LINODE_ACCESS_KEY is not set. Quitting.'
  exit 1
fi

if [ -z "$LINODE_SECRET_KEY" ]; then
  echo -e 'LINODE_SECRET_KEY is not set. Quitting.'
  exit 1
fi

if [ -z "$SOURCE_DIR" ]; then
  echo -e 'SOURCE_DIR is not set. Quitting.'
  exit 1
fi

if [ -z "$REGION" ]; then
  export REGION="us-east-1"
fi

if [ -e "$HOME/.s3cfg" ]; then
  warn '.s3cfg file already exists in home directory and will be overwritten'
fi

echo '[default]' > "$HOME/.s3cfg"
echo "access_key=$LINODE_ACCESS_KEY" >> "$HOME/.s3cfg"
echo "secret_key=$LINODE_SECRET_KEY" >> "$HOME/.s3cfg"
echo "host_base = $REGION.linodeobjects.com" >> "$HOME/.s3cfg"
echo "host_bucket = %(bucket)s.$REGION.linodeobjects.com" >> "$HOME/.s3cfg"

echo "Generated .s3cfg for key $LINODE_ACCESS_KEY"

s3cmd sync $SOURCE_DIR s3://$BUCKET

echo 'Removing .s3cfg credentials'
rm "$HOME/.s3cfg"
