var aws = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3');
var configs = require('../configs');

var s3 = new aws.S3();

s3.config.update({
  secretAccessKey: configs.aws.secretKey,
  accessKeyId: configs.aws.accessKey
});

exports.uploadS3 = multer({
  storage: multerS3({
      s3: s3,
      bucket: configs.aws.bucket,
      acl: 'public-read',
      contentDisposition: 'inline',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      storageClass: 'REDUCED_REDUNDANCY',
      key: function (req, file, cb) {
          cb(null, Date.now().toString()+'_'+file.originalname);
      }
  })
});

exports.uploadAvatar = exports.uploadS3.single('avatar');
