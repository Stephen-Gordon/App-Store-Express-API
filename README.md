# App-Store-Express-API

## Try out the API with [Swagger Docs](https://express-app-store-api-6f6c8ec32640.herokuapp.com/api/docs/)

## Description

An Express API built to serve app store data. The data was obtained from Kaggle. I cleaned up the app data in Jupyter Notebook. JSON Web Token is used for authorization and role-based authentication. I created several seeders using Faker JS to create users and reviews. Inside the seeders, I created the relationships between apps and users. Middleware is used for checking a user's role and for protecting routes. Creating the API routes and serving the data was not too hard; however, creating references in multiple documents was tricky. Validating requests to make sure only a user can delete their review, account, etc., took a bit of time.

### Relationships

- An App can have many reviews.
- A User can have many reviews.
- An App can have many users.
- A User can have many Apps.
- A Review has an App and a User.

## Tech Stack

- Express JS
- MongoDB
- Insomnia
- JSON Web Token
- Jupyter Notebook
- Faker Js
- Swagger
- Heroku

## Resources

- [Kaggle Data](https://www.kaggle.com/datasets/ramamet4/app-store-apple-data-set-10k-apps?select=appleStore_description.csv)
- [Swagger Docs](https://blog.logrocket.com/documenting-express-js-api-swagger/#connect-swagger-node-js)
- [Faker JS Library](https://fakerjs.dev/)
- [DB Seeders](https://dev.to/fredabod/how-to-easily-seed-data-into-mongodb-using-faker-2fni)
- Mongoose:
  - [Update Many in Mongoose](https://stackoverflow.com/questions/54992810/update-many-in-mongoose)
  - [MongoDB Push Operator](https://www.mongodb.com/docs/manual/reference/operator/update/push/)
  - [Mongoose Exists](https://www.educative.io/answers/what-is-exists-in-mongoose)
