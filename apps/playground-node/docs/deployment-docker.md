# @twin.org/playground-node - Deployment Docker

## Docker Building

To run the API server in the docker environment there is an example dockerfile in `deploy/dockerfile`:

```shell
# Set the base image
FROM node:20

# Create the app directory
WORKDIR /app

# Copy the package.json
COPY package.json .

# Install only the production dependencies
RUN npm install --omit=dev --ignore-scripts

# Copy the rest of the files to the image
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Set the environment variables that will override the .env file in the package
ENV PLAYGROUND_HOST=0.0.0.0
ENV PLAYGROUND_PORT=3000
ENV PLAYGROUND_STORAGE_FILE_ROOT=/playground/data

# Start the server
CMD ["node", "dist/es/index.js"]
```

You can build and execute this using docker from the root of the package with the following command.

```shell
docker build -t playground-node -f deploy/dockerfile .
```

This will build and deploy an image called `playground-node` to your docker server.

## Bootstrapping

Whenever the server starts it bootstraps all the components. Components can store state during the bootstrap process so they can determine if they need to bootstrap elements or not. If you have any entity storage configured to use `file` storage you should map a folder on the local host to contain the data, so that it remains persistent.

```shell
docker run -t -i -v /home/playground/data:/playground/data -p 3000:3000 playground-node
```

This example will map the local folder `/home/playground/data` and make it available in the docker container as `/playground/data` which is used to configure file entity storage using the environment variable `PLAYGROUND_STORAGE_FILE_ROOT`.

The output from the docker container should be something like the following.

```shell
🌩️ Playground Node v1.0.0

.....

➡️  Starting bootstrap process

INFO [2024-08-08T06:36:15.925Z] Bootstrap FileEntityStorageConnector
INFO [2024-08-08T06:36:15.926Z] Creating directory "/playground/data/vault-key"
INFO [2024-08-08T06:36:15.927Z] Created directory "/playground/data/vault-key"
INFO [2024-08-08T06:36:15.928Z] Bootstrap FileEntityStorageConnector
INFO [2024-08-08T06:36:15.928Z] Creating directory "/playground/data/vault-secret"
INFO [2024-08-08T06:36:15.928Z] Created directory "/playground/data/vault-secret"
INFO [2024-08-08T06:36:15.929Z] Bootstrap FileEntityStorageConnector
INFO [2024-08-08T06:36:15.929Z] Creating directory "/playground/data/wallet-address"
INFO [2024-08-08T06:36:15.929Z] Created directory "/playground/data/wallet-address"
INFO [2024-08-08T06:36:15.930Z] Bootstrap FileEntityStorageConnector
INFO [2024-08-08T06:36:15.930Z] Creating directory "/playground/data/identity-document"
INFO [2024-08-08T06:36:15.930Z] Created directory "/playground/data/identity-document"
INFO [2024-08-08T06:36:15.930Z] Bootstrap FileEntityStorageConnector
INFO [2024-08-08T06:36:15.931Z] Creating directory "/playground/data/identity-profile"
INFO [2024-08-08T06:36:15.932Z] Created directory "/playground/data/identity-profile"
INFO [2024-08-08T06:36:15.932Z] Bootstrap FileEntityStorageConnector
INFO [2024-08-08T06:36:15.932Z] Creating directory "/playground/data/log-entry"
INFO [2024-08-08T06:36:15.932Z] Created directory "/playground/data/log-entry"
INFO [2024-08-08T06:36:15.933Z] Bootstrap FileEntityStorageConnector
INFO [2024-08-08T06:36:15.933Z] Creating directory "/playground/data/telemetry-metric"
INFO [2024-08-08T06:36:15.933Z] Created directory "/playground/data/telemetry-metric"
INFO [2024-08-08T06:36:15.934Z] Bootstrap FileEntityStorageConnector
INFO [2024-08-08T06:36:15.934Z] Creating directory "/playground/data/telemetry-metric-value"
INFO [2024-08-08T06:36:15.934Z] Created directory "/playground/data/telemetry-metric-value"
INFO [2024-08-08T06:36:15.935Z] Bootstrap FileBlobStorageConnector
INFO [2024-08-08T06:36:15.935Z] Creating directory "/playground/data/blob-storage"
INFO [2024-08-08T06:36:15.935Z] Created directory "/playground/data/blob-storage"
INFO [2024-08-08T06:36:15.935Z] Bootstrap FileEntityStorageConnector
INFO [2024-08-08T06:36:15.936Z] Creating directory "/playground/data/nft"
INFO [2024-08-08T06:36:15.936Z] Created directory "/playground/data/nft"
INFO [2024-08-08T06:36:15.936Z] Bootstrap FileEntityStorageConnector
INFO [2024-08-08T06:36:15.936Z] Creating directory "/playground/data/authentication-user"
INFO [2024-08-08T06:36:15.937Z] Created directory "/playground/data/authentication-user"
INFO [2024-08-08T06:36:15.938Z] Generating and storing mnemonic "educate short size soup enact faculty brother move purity robust dose toy crumble jazz lunar hospital response pepper nice ice movie post used icon"
INFO [2024-08-08T06:36:16.016Z] Funding wallet "ent1qqc8saacg65385catgeke7ph36z05cdmwuatekkuqp9n0u5rmzjkq7exhrg"
INFO [2024-08-08T06:36:16.017Z] Generating node identity
INFO [2024-08-08T06:36:16.050Z] Adding attestation verification method
INFO [2024-08-08T06:36:16.075Z] Node identity "did:entity-storage:0xad375455c60b6e6df5f0fbf42d1224732756484dd64758dc9b3d71aa9c6478ed"
INFO [2024-08-08T06:36:16.085Z] Node User Email "admin@node"
INFO [2024-08-08T06:36:16.085Z] Node User Password "MFCUApWEdgr0R4&C"
INFO [2024-08-08T06:36:16.087Z] Node configuration created in "engine-state.json", some of these details will not be shown again, please record them

➡️  Writing JSON file: /playground/data/engine-state.json
➡️  Bootstrap process complete, some of the details logged will not be shown again, please record them
```

You will see it generated a node admin user with password for future use, these should be recorded as they will not be made visible again.

To run the bootstrap again you would have to manually remove the `engine-state.json` from the data folder.

## Docker Running

To run the server we use exactly the same command as before, when the `engine-state.json` exists the component states are passed in to the components.

```shell
docker run -t -i -v /home/playground/data:/playground/data -p 3000:3000 playground-node
```

You should now see output similar to the following:

```shell
🌩️ Playground Node v1.0.0

Debugging Enabled: true

INFO [2024-07-24T08:43:02.989Z] Configuring Information Service
INFO [2024-07-24T08:43:02.992Z] Configuring Vault Connector Factory
INFO [2024-07-24T08:43:02.993Z] Configuring Entity Storage with name "vault-key" using "file" connector
INFO [2024-07-24T08:43:02.993Z] Configuring Entity Storage with name "vault-secret" using "file" connector
INFO [2024-07-24T08:43:02.993Z] Configuring Identity Connector Factory
INFO [2024-07-24T08:43:02.994Z] Configuring Entity Storage with name "identity-document" using "file" connector
INFO [2024-07-24T08:43:02.994Z] Configuring Identity Service
INFO [2024-07-24T08:43:02.994Z] Configuring Entity Storage with name "identity-profile" using "file" connector
INFO [2024-07-24T08:43:02.995Z] Configuring Entity Storage with name "authentication-user" using "file" connector
INFO [2024-07-24T08:43:02.995Z] Starting InformationService
INFO [2024-07-24T08:43:02.997Z] Starting EntityStorageAuthenticationService
INFO [2024-07-24T08:43:02.998Z] Starting EntityStorageAuthenticationProcessor
INFO [2024-07-24T08:43:03.002Z] Building Web Server
INFO [2024-07-24T08:43:03.008Z] Added REST route "/" "GET"
INFO [2024-07-24T08:43:03.009Z] Added REST route "/info" "GET"
INFO [2024-07-24T08:43:03.009Z] Added REST route "/health" "GET"
INFO [2024-07-24T08:43:03.010Z] Added REST route "/spec" "GET"
INFO [2024-07-24T08:43:03.010Z] Added REST route "/authentication/login" "POST"
INFO [2024-07-24T08:43:03.010Z] Added REST route "/identity" "POST"
INFO [2024-07-24T08:43:03.011Z] Added REST route "/identity/profile" "POST"
INFO [2024-07-24T08:43:03.011Z] Added REST route "/identity/profile/:identity" "GET"
INFO [2024-07-24T08:43:03.012Z] Added REST route "/identity/profile/:identity" "PUT"
INFO [2024-07-24T08:43:03.012Z] Added REST route "/identity/profile/:identity" "DELETE"
INFO [2024-07-24T08:43:03.013Z] Added REST route "/identity/profile" "GET"
INFO [2024-07-24T08:43:03.013Z] Starting Web Server at address "0.0.0.0" on port "3000"
INFO [2024-07-24T08:43:03.017Z] The Web Server started on http://0.0.0.0:3000
```

You should now be able to access the server in the browser [http://localhost:3000/info](http://localhost:3000/info).

On successfully communicating with the server you should see something similar to the following returned from the request:

```json
{
  "name": "Playground Node",
  "version": "1.0.0"
}
```

The logging in the docker container should also show the request and response.

```shell
INFO [2024-07-24T08:46:25.283Z] ===> GET /info
INFO [2024-07-24T08:46:25.287Z] <=== 200 GET /info duration: 3987µs {"name":"Playground Node","version":"1.0.0"}
```

The API server responds to the correct terminate signals so that when the docker container is stopped the server will also stop gracefully.
