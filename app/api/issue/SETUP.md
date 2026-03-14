# SETUP

- Create "bot" GitHub account that issues will be posted as
- Generate GitHub fine-grained personal access token
  - Increase expiration as desired
  - Grant access to relevant repo
  - Grant write permissions for issues
  - Store password somewhere secure
- Manually deploy cloud func
  - Go to project in Google Cloud Console
  - Create a new inline cloud run function
  - Give it descriptive name/URL
  - Use latest Node runtime
  - Allow unauthenticated requests from the internet
  - Under container variables & secrets, create a new environment variable with name GITHUB_TOKEN and value of token
  - Set other settings as desired
  - Copy/paste script and package files in this folder into source
  - Rename "function entry point" to match http function name in script file
  - Save and redeploy
  - Use endpoint URL in site source code as appropriate
