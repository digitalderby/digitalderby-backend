# Digital Derby Backend

Backend for the Digital Derby 

## Technologies Used


| Name      | Description
|-----------|---------------------------------------------------------------------------------|
| MongoDB   | NoSQL database service                                                          |
| Mongoose  | ORM for MongoDB                                                                 |
| Express   | Unopinionated Javascript-based HTTP server                                      |
| Socket.IO | Framework for efficient bidirectional communication between clients and servers |
| SwaggerUI | Live API documentation generated from a configuration file                      |
| Heroku    | Platform-as-a-service used to deploy this application                           |


## Build Instructions

Run `npm install` to install all dependencies, and then run `npm run build` to compile the TypeScript.

Create a .env file populated with the following elements:
* `PORT` - Port on which you would like to run the server.
* `AUTH_SECRET` - Secret code for JWT authentication.
* `ADMIN_PASSWORD` - Password for the admin dashboard.
* `DATABASE_URI` - URI for the MongoDB database on which you would like persistent data.

## Run Instructions

Run `npm run main`. You may pass additional arguments as follows:
* `--read-only` - Does not write to the database.

## API Documentation

Access the API documentation after starting the server by accessing the `/api-docs` endpoint.
