import express from 'express';
const app = express();
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";
import cors from 'cors';

import dbConnect from "./db/dbConnect.js";
import  User  from "./db/UserModel.js";
//import Ticket from './db/TicketModel.js';
import auth from "./auth.js";
import { getPayment, createOrder,	callback, } from "./src/controllers/Payment.js";
import { default as mongodb } from 'mongodb';
let MongoClient = mongodb.MongoClient;
var uri = process.env.DATABASE_URL;
let ObjectId = mongodb.ObjectID;
// execute database connection

dbConnect();

var corsOptions = {
  origin: 'https://www.premiamosvoce.store/',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
// Curb Cores Error by adding a header here
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/user/:email", cors(corsOptions), async(request, response, next) => {
  await User.findOne({ email: request.params.email }).then((user) =>{
      response.json({id: `${user.email}`});
      next();
    }
  ).catch((e) => {
    console.log(e)
    response.status(400).send({
      message: "User not found, check spelling",
      error: e
    });
  })
});

app.get("/ticket/:id", cors(corsOptions),  (request, response, next) => {
  Ticket.findOne({ _id: request.params.id }).then((ticket) =>{
    console.log(ticket)
      response.json({data: ticket});
      next();
    }
  ).catch((e) => {
    console.log(e)
    response.status(400).send({
      message: "Ticket not found, check spelling",
      error: e
    });
  })
});



app.get("/arara", cors(corsOptions), (request, response, next) => {
  response.json({ message: "terceira mudança na string connection!" });
  console.log('pingou aqui');
  next();
});

app.post("/buy", cors(corsOptions), async(request, response, next) =>{
  console.log('ok');
  const publicKey ="APP_USR-9f550f39-c9ff-417c-aa4a-f45c1e305e6f";
  axios.get('https://dog.ceo/api/breeds/list/all').then(result => {
    console.log(result.data.message)
  });
  

  response.sendStatus(200);
});


// register endpoint
app.post("/register", cors(corsOptions), (request, response) => {
  console.log('ok');
  // hash the password
  bcrypt
    .hash(request.body.password, 10)
    .then((hashedPassword) => {
      // create a new user instance and collect the data
      const user = new User({
        email: request.body.email,
        password: hashedPassword,
        name: request.body.name,
        lastname: request.body.lastname,
        cpf: request.body.cpf
      });

      // save the new user
      user
        .save()
        // return success if the new user is added to the database successfully
        .then((result) => {
          response.status(201).send({
            message: "User Created Successfully",
            result: result.email,
          });
        })
        // catch erroe if the new user wasn't added successfully to the database
        .catch((error) => {
          console.log(error)
          response.status(500).send({
            message: "Error creating user",
            error,
          });
        });
    })
    // catch error if the password hash isn't successful
    .catch((e) => {
      console.log(e);
      response.status(500).send({
        message: "Password was not hashed successfully",
        e,
      });
    });
});

// register ticket
app.post("/ticket", cors(corsOptions), (request, response) => {
  const ticket = new Ticket({
    Descricao: request.body.descricao || "-",
    IdSorteio: request.body.idSorteio,
    IdSorteado: request.body.idSorteado,
    Status: "Aguardando"
  });
  ticket
        .save()
        // return success if the new user is added to the database successfully
        .then((result) => {
          response.status(201).send({
            message: "Ticket Created Successfully",
            result: result.descricao,
          });
        })
        // catch erroe if the new user wasn't added successfully to the database
        .catch((error) => {
          console.log(error)
          response.status(500).send({
            message: "Error creating ticket",
            error,
          });
        });
        next();
});

// login endpoint
app.post("/login", cors(corsOptions), async(request, response) => {
  // check if email exists
  await User.findOne({ email: request.body.email })
  
    // if email exists
    .then((user) => {
      // compare the password entered and the hashed password found
      bcrypt
        .compare(request.body.password, user.password)

        // if the passwords match
        .then((passwordCheck) => {

          // check if password matches
          if(!passwordCheck) {
            return response.status(400).send({
              message: "Passwords does not match",
              error,
            });
          }

          //   create JWT token
          const token = jwt.sign(
            {
              userId: user._id,
              userEmail: user.email,
            },
            "RANDOM-TOKEN",
            { expiresIn: "24h" }
          );

          //   return success response
          response.status(200).send({
            message: "Login Successful",
            email: user.email,
            token,
          });
        })
        // catch error if password do not match
        .catch((error) => {
          response.status(400).send({
            message: "Passwords does not match",
            error,
          });
        });
    })
    // catch error if email does not exist
    .catch((e) => {
      response.status(404).send({
        message: "Email not found",
        e,
      });
    });
    
});

// free endpoint
app.get("/free-endpoint", cors(corsOptions), (request, response) => {
  response.json({ message: "You are free to access me anytime" });
  next();
});


app.get("/userbyid/:idUser", cors(corsOptions), auth, (request, response) => {
  var query = { IdSorteado: request.params.idUser.trim()};
  var data = [] 
  MongoClient.connect(uri, async function(err, client) {
    if(err){
      console.log(err);      
      next();
    }
    var collection = client.db("isaac").collection("convenios").find(query);
    var documentArray = await collection.toArray();
    data = documentArray;
  });
  User.findById(request.params.idUser.trim())
  .then((user) => {

    // check if password matches
    if(!user) {
      return response.status(400).send({
        message: "User not found",
        error,
      });
    }else{
      return response.status(201).send({
        user: user,
        tickets: data
      });
    }
    
  })
  .catch((error) => {
    return response.status(400).send({
      message: "User not found",
      error,
    });
  });
});
// authentication endpoint
app.get("/auth-endpoint", cors(corsOptions),  (request, response) => {
  response.send({ message: "Meu nome eh arara" });
});

app.post("/api/payment/create", cors(corsOptions), createOrder);
app.post("/api/payment", cors(corsOptions), getPayment);
app.post("/api/callback", cors(corsOptions), callback);

export default app;
