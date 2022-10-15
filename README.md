# Table Creator (Walkover Final Project)
#### This is a web application where user can create dynamic tables to collect their data and manage them.
## Features 
* Signup and login eith email via auth0
* Have option to create multiple tables.
* Each table have one user defined unique primary column.
* Table have multiple column of following type:  ○ String   ○ Number  ○ Boolean  ○ Email  ○ Datetime
* Option to filter data based on column type.
* Option to save filter.
* Audit History

#### Website: https://walktable-creator.herokuapp.com/

## Contributers
1. [Juhi Sahu](https://github.com/Juhi2023)
2. [Harsh Nagar](https://github.com/harsh-im)
3. [Nandini Kapure](https://github.com/nandinikapure)
4. Meghraj


## Tech Stack Used
`Frontend:` HTML, CSS, Bootstrap, Javascript, EJS templating engine <br/>
`Backend:` NodeJS <br/>
`Database:` MySQL

<strong> other tools and platforms: </strong> <br/>
`Heroku` (For CI/CD)<br/>
`AWS RDS` (For database) <br/>
`auth0` (Authorization Platform) <br/>
`Balsamiq` design of all pages (User interface design tool) 

## Setup
#### Install Git
* Follow instructions from [Git Website](https://git-scm.com/downloads)
#### Install NodeJs and NPM
* Follow instructions from [NodeJs Website](https://nodejs.org/en/download/)
#### Cloning Repository and Installation
* Open Command Prompt in the Directory You Want to Install.
* Clone the Repository
```
git clone https://github.com/Juhi2023/Table-Creator.git
```
* Change working Directory to the Repository
```bash
cd Table-Creator
```
* Install Dependencies
```bash
npm install
```
* Create .env file in project directory containing
```
SECRET: YOUR_SECRET 
BASEURL: YOUR_BASEURL
CLIENTID: YOUR_CLIENTID
ISSUER: YOUR_ISSUER_BASEURL
```
* Run command
```
node app.js
```
* Goto http://localhost:3000

https://user-images.githubusercontent.com/87862089/195994959-78b9b742-551a-4950-ab11-53d64f4a45ed.mp4



