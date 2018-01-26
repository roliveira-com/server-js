var aws = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3');
var configs = require('../configs');

var s3 = new aws.S3();

s3.config.update({
  secretAccessKey: configs.aws.secretKey,
  accessKeyId: configs.aws.accessKey
});

exports.form = multer().single('avatar');

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

// exports.uploadAvatar = exports.uploadS3.single('avatar');

exports.uploadAvatar = function(req, res){
  params = { 
    Bucket: configs.aws.bucket, 
    ContentDisposition: 'inline',
    ContentType: req.file.mimetype,
    ACL: 'public-read',
    // Metadata: {
    //   '<owner>': req.body.uid
    // },
    Key: Date.now().toString() + '_' + req.file.originalname, 
    Body: req.file.buffer
  };

  success = {
    filename: req.file.originalname,
    filetype: req.file.mimetype,
    filesize: req.file.size,
    bucket: params.Bucket,
    key: params.Key,
    url: exports.makeS3Url(params.Bucket, params.Key)
  }

  s3.putObject(params, function (err, data) {
    if(err){
      res.status(500).json({"error": err})
    }else{
      res.status(201).json({ "success" : success } )
    }
  })
}

exports.makeS3Url = function (bucket, key) {
  var protocol = 'https://';
  var baseUrl = '.s3.amazonaws.com/'
  return protocol+bucket+baseUrl+key;
}
