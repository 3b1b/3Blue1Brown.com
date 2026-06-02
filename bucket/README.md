Set your current directory to this folder:

`cd bucket`

# Bucket setup and configuration

Install `gcloud` CLI tool:

https://docs.cloud.google.com/sdk/docs/install-sdk

Authenticate `gcloud` with your Google account:

```shell
gcloud auth login
```

Enable versioning on bucket:

```shell
gcloud storage buckets update gs://3blue1brown-website-bucket --versioning
```

Enable lifecycle rules on bucket (downgrade all non-current objects to cold storage after a bit):

```shell
gcloud storage buckets update gs://3blue1brown-website-bucket --lifecycle-file=lifecycle.json
```

Enable soft delete on bucket (protects against full bucket delete or commands that bypass versioning):

```shell
gcloud storage buckets update gs://3blue1brown-website-bucket --soft-delete-duration=30d
```

Check bucket setup:

```shell
gcloud storage buckets describe gs://3blue1brown-website-bucket --format="yaml"
```

## Rclone setup and setup

Install `rclone`:

https://rclone.org/

Configure `rclone` to add a remote named `gcs`:

```shell
rclone config
# new remote
# name                  gcs
# storage               google cloud storage
# client_id             (leave blank)
# client_secret         (leave blank)
# project number        92197834749
# anonymous             false
# object_acl            authenticatedRead
# bucket_acl            authenticatedRead
# bucket_policy_only    true
# location              us-central1
# storage_class         (leave blank)
# env_auth              false
# advanced config?      n
# web browser auth?     y
```

Use web browser to grant `rclone` access.

Locate your `rclone.conf` file:

```shell
rclone config file
```

Your `rclone.conf` file should look something like this:

```ini
[gcs]
type = google cloud storage
bucket_policy_only = true
project_number = 92197834749
object_acl = authenticatedRead
bucket_acl = authenticatedRead
location = us-central1
token = {"access_token":"...","token_type":"Bearer","refresh_token":"...","expiry":"...","expires_in":...}
```

# Sync local folder with bucket

Pull changes from bucket to local:

```shell
./pull.sh
```

Push changes from local to bucket:

```shell
./push.sh
```
