# Digital Derby

<img src='src/assets/readme/digital-derby-logo.png'>

## Overview
 The Horse Racing Betting Simulator is a virtual betting app where users can participate in horse races by placing bets on their favorite horses. The app provides a realistic simulation of horse racing events, allowing users to experience the thrill of betting without real-world risks.

 **Deployed Frontend** - https://digital-derby.netlify.app/

**Deployed Backend** - 
https://digitalderby-backend-dev-58dcf88cbcc5.herokuapp.com/

## Key Features
**Real-Time Betting:** Users can place bets in real-time on the same set of horses and races.

**Randomly Generated Races:** Each race features approximately 100 randomly generated horses for variety and excitement.

**Wallet Management:** Users have a virtual wallet where they can track their remaining balance and manage their funds for betting.

**User Profile:** The app includes a user profile section displaying important information such as username, user ID, remaining balance, betting history, and the number of times the user's account went bankrupt.

## Technologies Used

### Frontend:
| Name              | Description          |
|-------------------|----------------------|
| React.js          | User Interface       |
| Socket.io         | Framework for efficient bidirectional communication between clients and servers   |
| FontAwesome       | Icons                |
| CSS Modules       | Styling              |

### Backend:
| Name      | Description
|-----------|---------------------------------------------------------------------------------|
| MongoDB   | NoSQL database service                                                          |
| Mongoose  | ORM for MongoDB                                                                 |
| Express   | Unopinionated Javascript-based HTTP server                                      |
| Socket.IO | Framework for efficient bidirectional communication between clients and servers |
| SwaggerUI | Live API documentation generated from a configuration file                      |
| Heroku    | Platform-as-a-service used to deploy this application                           |

## Usage
1. Sign up or log in to the app to access your user profile and wallet.
2. Navigate to the betting section to view upcoming races and place bets on horses.
3. Watch the races in real-time and see the outcomes of your bets.
4. Monitor your user profile to track your betting history, remaining balance, and account status.

## Credits
Socket.io for real-time communication and updates.

FontAwesome for icons used in the app.

## Contributors
**Will:**  [Link to GitHub](https://github.com/Fekinox)

**Fergus:**  [Link to GitHub](https://github.com/dfergusbrown)

**Adonis:**  [Link to GitHub](https://github.com/nebstech)

**Lando:**  [Link to GitHub](https://github.com/vitrineofcode)


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


## Future Enhancements
- Adding sound effects for the race game.
- Implementing UI for the weather effects 
