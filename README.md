# Logo goes here

# Digital Derby Backend

Welcome to the backend for Digital Derby.  Digital Derby is a highly addictive horse race betting application.  Users are able create an account, place a bet on a horse and watch the horses race in real time.  The results for the race are displayed at the end with stats about how each horse did.

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

Deployed Backend - 
https://digitalderby-backend-dev-58dcf88cbcc5.herokuapp.com/

Link to the frontend - https://digital-derby.netlify.app/

## Contributors
Will F. 

[https://github.com/Fekinox](https://github.com/Fekinox)

Fergus  

[https://github.com/dfergusbrown](https://github.com/dfergusbrown)

Adonis 

[https://github.com/nebstech](https://github.com/nebstech)

Lando 

[https://github.com/vitrineofcode](https://github.com/vitrineofcode)



## Technologies Used


| Name      | Description
|-----------|---------------------------------------------------------------------------------|
| MongoDB   | NoSQL database service                                                          |
| Mongoose  | ORM for MongoDB                                                                 |
| Express   | Unopinionated Javascript-based HTTP server                                      |
| Socket.IO | Framework for efficient bidirectional communication between clients and servers |
| SwaggerUI | Live API documentation generated from a configuration file                      |
| Heroku    | Platform-as-a-service used to deploy this application                           |


## Future Enhancements
- Adding sound effects for the race game.
- Adding abilites for the horses
- Adding a real-time commentary log to dictate the places of the horses
- Select a favorite horse
- Log how many times a user goes bankrupt
