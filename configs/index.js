require('dotenv').config();

exports.collections = {
  contacts : "contacts",
  users: "users",
  avatar: "avatars",
  projects: "projects", 
  token : "tokens",
  jobs: "jobs",
  themes: "theme"
}

exports.token = {
  issuer: "roliveira-api",
  passcode: "sds9d8d7s7s9ad7s7a7d67ds8a7d" || process.env.JWT_PASSCODE,
  expire: 3600000 //300000/5mins - 3600000/1hr - 86400000/1d...;
}

exports.database = {
  uri : process.env.MONGODB_URI || "mongodb://127.0.0.1:27017"
}

exports.aws = {
  accessKey : process.env.AWS_ACCESS_KEY_ID,
  secretKey: process.env.AWS_SECRET_ACCESS_KEY,
  bucket: process.env.S3_BUCKET_NAME
}

exports.messages = {
  databaseLogin         : "Não foi possível efetuar o login. Tente mais tarde",
  databaseDelete        : "Não foi possível deletar este registro",
  databaseGet           : "Não foi possível obter este registro",
  databaseUpdate        : "Não foi possível atualizar este registro",
  databaseNoId          : "A transação não poder ser completada, registro inexistente",
  databasePost          : "Não foi possível cadastrar este registro",
  databasePostEmail     : "Email já cadastrado",
  registerParamsRequired: "Faltam parametros na sua solicitação",
  uploadParamsRequired  : "É necessário anexar a imagem do avatar",
  uploadWrongFiletype   : "O arquivo de avatar precisa ser uma imagem",
  loginPassword         : "Senha incorreta",
  loginEmail            : "Email não encontrado",
  loginGeneric          : "Não foi possível efetuar o login, contate-nos",
  loginParamsRequired   : "É necessário informar e-mail e senha para fazer o login",
  authRequired          : "Você precisa se autenticar",
  authGeneric           : "Seu login não foi possível. Contate-nos",
  tokenExpired          : "Token Expirado. Faça um novo login",
  tokenInvalid          : "Token inválido ou expirado"
}