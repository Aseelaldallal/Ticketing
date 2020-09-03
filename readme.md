**Dockerignore**
Add node_modules to dockerignore so we don't load node_modules into container as its being built. Basically When we run "COPY . .", don't copy node_modules
node_modules can contain binaries compiled for your host OS, and if it’s different then the container OS, you’ll get errors trying to run your app when you’re bind-mounting it from the host for development.

Steps:

- Create Auth Folder
- Create Dockerfile for auth
- Create K8s folder
- Create auth depl and service k8s config
- Setup skaffold config file
- ingress-nginx setup so we can do manual testing (create ingress-srv.yaml, update hosts file for development)
- Setup Everything to use cloud environment for development
  - Download Google Cloud SDK
  - Create Project on Google Cloud, Create Cluster, Setup Nodes
  - Install Google Cloud Context, configure kubectl to use it
  - Update Skaffold Config
- Create route backbones
- implement error handling
- Create model
- Decide on auth mechanism and implement
  - Install cookie-session, jsonwebtoken
- Testing infrastructure setup
- Work on front end
  - Install NextJS
  - Create Dockerfile
  - Setup k8s (create dep file for client, add stuff to skaffold.yaml)
- Refactor app for code sharing --> Create common folder, publish to npm, use in services

Common Module: https://github.com/Aseelaldallal/Ticketing-common
