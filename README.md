# Server-js
This is a simple REST API server that stores people's data using Express and MongoDB and deployed on Heroku.  

> **Disclaimer**
> This is an experimental project. Improvements in security and performance are still needed. Use it carefully!

## Functionalities
- GET, POST, PUT and DELETE methods for contacts under the endpoint;
- Contacts image avatar upload using Amazon S3 (under implementation)
- Authentication via JWT;

## Endpoints
- **Login** via http request `POST` at endpoint `/api/login`
- **Geting Contacts** via http request `GET` at endpoint `/api/contacts`
- **Adding Contacts** via http request `POST` at endpoint `/api/contacts` (require authetication)
- **Updating Contacts** via http request `PUT` at endpoint `/api/contacts/contactId` (require authetication)
- **Deleting Contacts** via http request `DELETE` at endpoint `/api/contacts/contactId` (require authetication)
- **Upload Contact Avatar** via http request `POST` at endpoint `/api/contacts/contactId` (require authetication)*  
*under implementation  


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
- [ ] Password encoding
- [ ] Better model validation
- [ ] Image upload with Amazon S3
- [ ] Implement MVC logic and structure

## Useful Articles
- [MongoDB Connection Pooling with Node.js Modules](https://wesleytsai.io/2015/08/02/mongodb-connection-pooling-in-nodejs/)
- [MongoDB connection pooling for Express applications](https://blog.mlab.com/2017/05/mongodb-connection-pooling-for-express-applications/)
- [Create a Web App and RESTful API Server Using the MEAN Stack](https://devcenter.heroku.com/articles/mean-apps-restful-api)
- [Authenticate a Node.js API with JSON Web Tokens](https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens)
- [Create and deploy a RESTful API in 10 minutes](https://www.youtube.com/watch?v=6x-ijyG-ack)
- [Enable CORS](https://github.com/expressjs/cors#simple-usage-enable-all-cors-requests)




