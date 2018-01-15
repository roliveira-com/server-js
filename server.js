var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;
var jwt = require("jsonwebtoken");

var CONTACTS_COLLECTION = "contacts";

var app = express();
app.use(bodyParser.json());

var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017" , function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

// CONTACTS API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

handleAuthorization = (req, resp, next) => {
  const token = extractToken(req);
  if(!token) {
    resp.setHeader('WWW-Authenticate', 'Bearer token_type="JWT"');
    resp.status(401).json({'error': 'Você precisa se autenticar'});
  }else{
    jwt.verify(token, 'server-api-pass', (error, decoded) => {
      if(decoded) {
        next();
      }else{
        return handleError(res, "FORBBIDEN", "Não Autorizado");
      }
    })
  }
}

function extractToken(req){
  let token = undefined;
  if(req.headers && req.headers.authorization){
    const parts = req.headers.authorization.split(' ');
    if(parts.length === 2 && parts[0] === 'Bearer'){
      token = parts[1];
    }
  }
  return token;
}

/*  "/api/contacts"
 *    GET: finds all contacts
 *    POST: creates a new contact
 */

function handleDupes(data, res, email){
  db.collection(CONTACTS_COLLECTION).find({"email": email }).toArray(function(err, docs) {
    if (err) {
      return handleError(res, err.message, "Não foi possível acessar os dados");
    }  else if (docs.length >= 1) {
      return handleError(res, "Email Já Cadastrado", "Email já Cadastrado!");
    } else {

      db.collection(CONTACTS_COLLECTION).insertOne(data, function(err, doc) {
        if (err) {
          return handleError(res, err.message, "Failed to create new contact.");
        } else {
          res.status(201).json(doc.ops[0]);
        }
      });

    }
  });
}

app.post("/api/login", function(req, res) {
  var user = req.body;

  if(!user.email || !user.senha) {
    return handleError(res, "DADOS INVÁLIDOS", "É necessário informar email e senha para efetuar o login", 400);
  }

  db.collection(CONTACTS_COLLECTION).find({"email": user.email }).toArray(function(err, docs) {
    if (err) {
      return handleError(res, err.message, "Não foi possível acessar os dados");
    } else if (docs.length == 0) {
      return handleError(res, "Email não encontrado", "E-mail incorreto");
    } else if (docs.length != 1){
      return handleError(res, "Dados Duplicados", "Não foi possível efetuar o login, contate-nos");
    } else if (docs.length == 1){
      if(user.senha == docs[0].senha){
        var token = jwt.sign({sub: docs[0].email, iss: 'server-api'}, 'server-api-pass');
        res.status(200).json({
          name: docs[0].nome,
          email: docs[0].email,
          token: token  
        })
      }else{
        return handleError(res, "FORBIDDEN", "Senha incorreta", 403);
      }
    }
  });
});


app.get("/api/contacts", function(req, res) {
  db.collection(CONTACTS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get contacts.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post("/api/contacts", handleAuthorization, function(req, res) {
  var newContact = req.body;
  newContact.createDate = new Date();

  if (!req.body.email) {
    return handleError(res, "Invalid user input", "É necessário informar o email", 400);
  }

  if (req.body.email) {
    handleDupes(newContact, res, req.body.email);
  }

  // db.collection(CONTACTS_COLLECTION).insertOne(newContact, function(err, doc) {
  //   if (err) {
  //     handleError(res, err.message, "Failed to create new contact.");
  //   } else {
  //     res.status(201).json(doc.ops[0]);
  //   }
  // });
});

/*  "/api/contacts/:id"
 *    GET: find contact by id
 *    PUT: update contact by id
 *    DELETE: deletes contact by id
 */

app.get("/api/contacts/:id", function(req, res) {
  db.collection(CONTACTS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get contact");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.put("/api/contacts/:id", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;

  db.collection(CONTACTS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update contact");
    } else {
      updateDoc._id = req.params.id;
      res.status(200).json(updateDoc);
    }
  });
});

app.delete("/api/contacts/:id", function(req, res) {
  db.collection(CONTACTS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete contact");
    } else {
      res.status(200).json(req.params.id);
    }
  });
});

