var aws = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3');
var configs = require('../configs');

var s3 = new aws.S3();

aws.config.update({
  secretAccessKey: configs.aws.secretKey,
  accessKeyId: configs.aws.accessKey,
  region: 'us-east-1'
});

var upload = multer({
  storage: multerS3({
      s3: s3,
      bucket: configs.aws.bucket,
      key: Date.now().toString()
  })
});

exports.s3Upload = function(formFieldName){
  upload.array(formFieldName,1)
}
