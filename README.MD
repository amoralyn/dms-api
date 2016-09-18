
# DOCUMENT MANAGEMENT SYSTEM
[![Code Climate](https://codeclimate.com/github/andela-ltijesunimi-israel/dms-api/badges/gpa.svg)](https://codeclimate.com/github/andela-ltijesunimi-israel/dms-api)

[![Build Status](https://travis-ci.org/andela-ltijesunimi-israel/dms-api.svg?branch=master)](https://travis-ci.org/andela-ltijesunimi-israel/dms-api)

[![Test Coverage](https://codeclimate.com/github/andela-ltijesunimi-israel/dms-api/badges/coverage.svg)](https://codeclimate.com/github/andela-ltijesunimi-israel/dms-api/coverage)

Document Management System is an application that helps users manage their documents in an organized way. A User can upload a document, edit and share it with other users. Aside from enabling users to properly document their work with regard to category, the application permits users to work collaboratively on documents.

## Development

This application has been created using [Nodejs](www.nodejs.org) environment and implementing [Express](http://expressjs.com/) as the routing framework and [Mongoose](http://mongoosejs.com/), an object modeling package, to interact with [MongoDB](https://www.mongodb.com/). [JWT](https://jwt.io/) tokens have also been used to authenticate routes.

## Installation.

- Install [Nodejs](www.nodejs.org) and [MongoDB](www.mongodb.org)

- Clone this repo or download the zipped file.

- Navigate to the master branch.

- Run

```bash
npm install
```

This will install the required dependencies.

- Run

```bash
npm test
```

to run the tests

- Run

```bash
npm start
```

Use [Postman](https://www.getpostman.com/) to consume the API.

- Enjoy the ride... :wink:

### Code Example

#### Create a new user

```bash
POST - /api/user

Post data
{
  username: 'username',
  email: 'example@host.com'
  name: {
    last: 'lastname',
    first: 'firstname'
  }
  password: 'password',
  role: 'dummy role' // Role has to be created before assignation. viewer role is available by default
}
```

#### Login a user

```bash
POST - /api/users/login

Post data
{
  username: 'username',
  password: 'password'
}
```
#### Create a new document

Documnent is created by an existing and authenticated user.

```bash
POST - /api/documents

Post data
{
  title: 'Documnent title',
  content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut  enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
}
```
#### Create a new role - Superadmin operation

Role is created by an Authorized and Authenticated user (superadmin).

```bash
POST - /api/role

Post data
{
  title: 'Trainer'
}
```
### API Reference

API endpoints currently supported.

#### Users

Request type  |	Endpoint  |	Action
-----------	  | --------  | ------
POST  |	/api/users  |	Create a new user
GET   |	/api/users  |	Get all users
GET	  |/api/users:id |	Get a specific user
PUT	|/api/users/:id |	Update user information
DELETE |	/api/users/:id |	Remove a user from storage

#### Documents

Request type |	Endpoint |	Action
------------ |  -------- | -------
POST |	/api/documents |	Create a new document
GET |	/api/documents |	Retrieve all documents
GET |	/api/documents/:id |	Retrieve a specific document
GET |	/api/users/:id/documents |	Retrieve all documents created by a user
GET |	/api/documents/documents/role/:role |	Retrieve all documents within a specific limit
PUT |	/api/documents/:id |	Update a specific document
DELETE |	/api/documents/:id |	Remove a specific document from storage

#### Roles

Request type |	Endpoint |	Action
------------ |  -------- |  ------
POST |	/api/roles |	Create a new role
GET	 | /api/roles |	Retrieve all roles

#### Testing.

This application has been tested using [supertest](https://www.npmjs.com/package/supertest), which is a Super-agent driven library for testing Node.js.

Thank You.

### Lovelyn Tijesunimi-Israel | Andela #TIA