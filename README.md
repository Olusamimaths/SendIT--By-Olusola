# SendIT--By-Olusola

[![Build Status](https://travis-ci.org/Olusamimaths/SendIT--By-Olusola.svg?branch=develop)](https://travis-ci.org/olusamimaths/SendIT--By-Olusola) [![Coverage Status](https://coveralls.io/repos/github/olusamimaths/SendIT--By-Olusola/badge.svg?branch=develop)](https://coveralls.io/github/olusamimaths/SendIT--By-Olusola?branch=develop)

SendIT API is an API that provides users with ability to create parcel delivery orders, modify them and track their progress.

## How It Works:
* Users can:
  - Create user accounts 
  - Sign in to the app
  - Create a parcel delivery order
  - Get all parcel delivery orders
  - Get a specific parcel delivery order
  - Cancel a parcel delivery order
  - Change the destination of a parcel delivery order

* Admins can:
  - View all parcel delivery orders in the application.
  - Change the status of a parcel delivery order.
  - Change the present location of a parcel delivery order

## Technologies
- Node.js
- Git
- Postgres
- Babel
- Express
- Npm

## Installation
Make sure to have all the technologies installed and then clone the repository. Then you run `npm install` to install all the project dependecies and then run `npm run dev`.If you prefer to first build, run npm run build and the npm start. The api will then be available on your local machine at `http://localhost:3000`.

## Endpoints

| Request       | End Points                    | Functionality |
| ------------- | -------------                 |-------------
| POST          | /api/v1/auth/signup           | Creates an account for a user. |
| POST          | /api/v1/auth/login            | Logs a user in. |
| POST          | /api/v1/parcels               | Creates a parcel delivery order |
| PATCH         | /api/v1/parcels/:parcelId/destination | Changes the destination of a parcel delivery order. |
| PATCH         | /api/v1/parcels/:parcelId/cancel      | Cancels a parcel delivery order. |
| GET           | /api/v1/parcels/:parcelId      | Get the details of a specific parcel order. |
| GET           | /api/v1/parcels                | Gets all parcel orders in the app. |
| GET           | /api/v1/users/:userId/parcels  | Gets all parcel orders by a user. |
| PATCH         | /api/v1/parcels/:parcelId/status| Allows the Admin to change the status of an order. |
| PATCH         | /api/v1/parcels/:parcelId/currentlocation| Allows the Admin to change the destination of an order. |

You can access the api here:  `https://sendit-olusola.herokuapp.com/` or access the web app consuming the api here: 







