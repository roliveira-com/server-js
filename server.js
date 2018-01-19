var express = require("express");
var bodyParser = require("body-parser");
var route = require('./routes')
var auth = require('./auth')
// var upload = require('./upload');

var aws = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3');
var configs = require('./configs');

var s3 = new aws.S3();

s3.config.update({
  secretAccessKey: configs.aws.secretKey,
  accessKeyId: configs.aws.accessKey
});

var upload = multer({
  storage: multerS3({
      s3: s3,
      bucket: configs.aws.bucket,
      acl: 'public-read',
      contentDisposition: 'attachment',
      key: function (req, file, cb) {
          console.log(file);
          cb(null, file.originalname);
      }
  })
});

var app = express();
app.use(bodyParser.json());

route.connect(function() {

  app.get('/api/tokens', route.getTokens);

  app.post('/api/login', route.login);

  app.get('/api/contacts', route.getContacts);

  app.get('/api/contacts/:id', route.getContactById);

  app.put('/api/contacts/:id', route.provideAuthorization, route.updateUser)

  app.post('/api/contacts', route.provideAuthorization, route.registerUser);

  app.post('/api/upload/avatar', upload.array('avatar',1), function(req, res, next){
    res.status(201).json({"success": req.files[0]});
  });

  console.log(process.env.S3_BUCKET_NAME);

  app.delete('/api/contacts/:id', route.provideAuthorization, route.deleteUser);

  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("Servidor disponível na porta: ", port);
  });
});


