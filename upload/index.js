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
  // Então...
  // Por alguma razão, apesar do request vir com o pararâmeto 'file' até aqui
  // o método uploadS3.single() não consegue fazer o upload conforme esperado.
  // Acho válido, tentar uma nova abordagem usando um wrapper diferente para
  // realizar o upload para o S3.Checar este módulo aqui: https://www.npmjs.com/package/s3
  exports.uploadS3.single(req.file.fieldname);
  res.status(201).json({ "success": req.file.fieldname});
}
