exports.handleError = function(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({ "error": message });
}

exports.handleResponse = function(res, data, code) {
  res.status(code || 200).json(data || { "success" : "Transação Realizada"});
}