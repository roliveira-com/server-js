var aws = require('aws-sdk');
var multer = require('multer');
var configs = require('../configs');
var status = require('../status');
var database = require('../database');

var s3 = new aws.S3();

s3.config.update({
  secretAccessKey: configs.aws.secretKey,
  accessKeyId: configs.aws.accessKey
});

exports.formAvatar = multer().single('avatar');

exports.registerAvatar = function(req, res, owner, db){

  if (!req.file) {
    return status.handleError(res, "DADOS INVALIDOS", configs.messages.uploadParamsRequired, 400);
  }

  if (!req.file.mimetype.includes('image')){
    return status.handleError(res, "DADOS INVALIDOS", configs.messages.uploadWrongFiletype, 400);
  }

  if (owner.length == 0){
    return status.handleError(res, "USUARIO NÃO ENCONTRADO", configs.messages.databaseNoId, 400);
  }

  if(owner.length != 1){
    return status.handleError(res, "EMAIL DUPLICADO NA BASE", configs.messages.loginGeneric, 400);

  }else{
    params = {
      Bucket: configs.aws.bucket,
      ContentDisposition: 'inline',
      ContentType: req.file.mimetype,
      ACL: 'public-read',
      Key: makeS3Key(req.file.originalname),
      Body: req.file.buffer
    };

    success = {
      filename: req.file.originalname,
      filetype: req.file.mimetype,
      filesize: req.file.size,
      bucket: params.Bucket,
      key: params.Key,
      url: makeS3Url(params.Bucket, params.Key)
    }

    owner[0].avatar = success.url;

    s3.putObject(params, function (err, data) {
      if (err) {
        status.handleError(res,"ERRO NO S3", err, 500)
      } else {
        database.updateData(owner[0], { email : owner[0].email }, res, db, configs.collections.contacts, function (contact) {
          status.handleResponse(res, success, 201);
        });
      };
    });
  };

};

function makeS3Url(bucket, key) {
  var protocol = 'https://';
  var baseUrl = '.s3.amazonaws.com/'
  return protocol+bucket+baseUrl+key;
}

function makeS3Key(name) {
  return Date.now().toString() + '_' + name;
}
