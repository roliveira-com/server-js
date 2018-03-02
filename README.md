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
- [x] Better model validation
- [x] Image upload with Amazon S3
- [ ] Password recover by email
- [ ] Implement Socket
- [ ] Implement MVC logic and structure

## Issues

- When updating an user, you must pass all the user data, otherwise that one you dont pass will be erased form DB 
- When updating an user, the update is performed even when an email that already exists at db is specified
- When updating an user, a server error happens when the user ID is not valid or non existing at database
- Handle the error the ID passed for delete, update and other ID related active is not an 24 hex string

## Useful Articles
- [Use Socket.io for Real Time Client/Server Communication](https://www.youtube.com/watch?v=ndRMTdZRA4I)
- [Create Real time Chat Application Using Angular, Node.JS and Socket.IO](https://www.youtube.com/watch?v=vpQDkEgO-kA)
- [Real Time Apps with TypeScript: Integrating Web Sockets, Node & Angula](https://medium.com/dailyjs/real-time-apps-with-typescript-integrating-web-sockets-node-angular-e2b57cbd1ec1)
- [Build a real time app with MEAN2, angular-cli and socket.io](https://hackernoon.com/build-real-time-app-with-mean2-angular-cli-and-socket-io-cedf1dc02fec)
- [Limitless file uploading to Amazon S3 with Node & Express](https://www.terlici.com/2015/05/23/uploading-files-S3.html)
- [Uploading files locally with Node & Express](https://www.terlici.com/2015/05/16/uploading-files-locally.html)
- [Best practices for Express app structure](https://www.terlici.com/2014/08/25/best-practices-express-structure.html)
- [MongoDB Connection Pooling with Node.js Modules](https://wesleytsai.io/2015/08/02/mongodb-connection-pooling-in-nodejs/)
- [MongoDB connection pooling for Express applications](https://blog.mlab.com/2017/05/mongodb-connection-pooling-for-express-applications/)
- [Create a Web App and RESTful API Server Using the MEAN Stack](https://devcenter.heroku.com/articles/mean-apps-restful-api)
- [Authenticate a Node.js API with JSON Web Tokens](https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens)
- [Enable CORS](https://github.com/expressjs/cors#simple-usage-enable-all-cors-requests)
