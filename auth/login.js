var jwt = require("jsonwebtoken");

exports.loginHandler = function(req,res,docs){
  if (docs.length == 0) {
    res.status(401).json({error: "Email não encontrado"})
  
  } else if (docs.length != 1) {
    res.status(401).json({error: "Não foi possível efetuar o login, contate-nos"})
  
  } else if (docs.length == 1) {
    if (req.body.senha == docs[0].senha) {
      var token = jwt.sign({ sub: docs[0].email, iss: 'server-api' }, 'server-api-pass');
      res.status(200).json({
        name: docs[0].nome,
        email: docs[0].email,
        token: token
      })
    } else {
      res.status(403).json({error: "Senha incorreta"})
    }
  }
}