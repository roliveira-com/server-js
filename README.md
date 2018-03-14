## Server-js
This is a simple REST API server that stores people's data using Express and MongoDB and deployed on Heroku.  

> **Disclaimer**  
> This is an experimental project. Improvements in security and performance are still needed. Use it carefully!

## Functionalities
- GET, POST, PUT and DELETE methods for contacts under the endpoint;
- Contacts image avatar upload using Amazon S3
- Authentication with JWT;

## Endpoints
- **Login** via http request `POST` at endpoint `/api/login`
- **Geting Contacts** via http request `GET` at endpoint `/api/contacts`
- **Adding Contacts** via http request `POST` at endpoint `/api/contacts` (requires authetication)
- **Updating Contacts** via http request `PUT` at endpoint `/api/contacts/contactId` (requires authetication)
- **Deleting Contacts** via http request `DELETE` at endpoint `/api/contacts/contactId` (requires authetication)
- **Upload Contact Avatar** via http request `POST` at endpoint `/api/contacts/contactId` (requires authetication)

## Setup
Clone this repo  
`git clone https://github.com/roliveira-com/server-js.git`  

Install dependencies  
`npm install`  

Launch the server locally  
`npm start`  

## Heroku Deployment
Available soon!

## Roadmap
- [x] Contacts CRUD
- [x] Authentication
- [x] Password encoding
- [x] Image upload with Amazon S3
- [ ] Password recover by email
- [ ] Improve overrall logic andstructure
- [ ] Better model validation with Mongoose
- [ ] Implement socket IO

## Issues

- When updating an user, you must pass all the user data, otherwise that paramenters you haven't passed will be erased from DB 
- When updating an user, the update is performed even when an email that already exists at db is specified
- When updating an user, a non handled error appears when the user ID is not valid or non existing at database
- Handle the error the ID passed for delete, update and other ID related active is not an 24 hex string

## Useful Articles
- [Sending Email Using Node.js](https://www.sitepoint.com/sending-email-using-node-js/)
- [Sending HTML Email in Nodejs/Express](https://www.codementor.io/joshuaaroke/sending-html-message-in-nodejs-express-9i3d3uhjr)
- [Limitless file uploading to Amazon S3 with Node & Express](https://www.terlici.com/2015/05/23/uploading-files-S3.html)
- [Uploading files locally with Node & Express](https://www.terlici.com/2015/05/16/uploading-files-locally.html)
- [Best practices for Express app structure](https://www.terlici.com/2014/08/25/best-practices-express-structure.html)
- [MongoDB Connection Pooling with Node.js Modules](https://wesleytsai.io/2015/08/02/mongodb-connection-pooling-in-nodejs/)
- [MongoDB connection pooling for Express applications](https://blog.mlab.com/2017/05/mongodb-connection-pooling-for-express-applications/)
- [Create a Web App and RESTful API Server Using the MEAN Stack](https://devcenter.heroku.com/articles/mean-apps-restful-api)
- [Authenticate a Node.js API with JSON Web Tokens](https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens)
- [Enable CORS](https://github.com/expressjs/cors#simple-usage-enable-all-cors-requests)
