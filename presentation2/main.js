var body = document.getElementsByTagName("BODY")[0];
body.onkeypress = function(a){
  if(a.key===' ') window.location = ((parseInt(document.title)||0)+1)+".html";
};
