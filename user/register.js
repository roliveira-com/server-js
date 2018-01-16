exports.register = function(docs){

  if(docs.length >= 1){
    return false
  } 

  if(docs.length == 0){
    return docs;
  } else {
    return false
  }

}