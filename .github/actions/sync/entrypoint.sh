#!/bin/bash

if [ -z "$BUCKET" ]; then
  echo -e 'BUCKET variable is not set. Quitting.'
  exit 1
fi

if [ -z "$ACCESS_KEY" ]; then
  echo -e 'ACCESS_KEY is not set. Quitting.'
  exit 1
fi

if [ -z "$SECRET_KEY" ]; then
  echo -e 'SECRET_KEY is not set. Quitting.'
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
echo "access_key=$ACCESS_KEY" >> "$HOME/.s3cfg"
echo "secret_key=$SECRET_KEY" >> "$HOME/.s3cfg"
echo "host_base = $REGION.linodeobjects.com" >> "$HOME/.s3cfg"
echo "host_bucket = %(bucket)s.$REGION.linodeobjects.com" >> "$HOME/.s3cfg"
echo "website_endpoint = http://%(bucket)s.website-$REGION.linodeobjects.com" >> "$HOME/.s3cfg"

echo "Generated .s3cfg for key $ACCESS_KEY"

# TODO: move to variable 
echo '**/*.jpg' > "$HOME/sync-patterns"
echo '**/*.jpeg' >> "$HOME/sync-patterns"
echo '**/*.png' >> "$HOME/sync-patterns"
echo '**/*.mp4' >> "$HOME/sync-patterns"
echo '**/*.mov' >> "$HOME/sync-patterns"

echo "Generated sync include patterns"

s3cmd --no-mime-magic --acl-public --delete-removed --delete-after --exclude "*" --include-from $HOME/sync-patterns sync $SOURCE_DIR s3://$BUCKET

echo 'Removing .s3cfg credentials'
rm "$HOME/.s3cfg"
