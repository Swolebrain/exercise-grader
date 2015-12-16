module.exports = f1;
function f1(urlRoot, populateMenu){
  $.ajax({
    url: urlRoot + "/exercises/all",
    error: function(){
      alert("Error connecting to the server. Try reload");
    },
    success: function(resp){
      populateMenu(resp);
      //I get an array of objects with shortName and url
    }
  });
  //param is an array of objects with shortName and url
  //used to populate the navbar
  function populateMenu(obj){
    console.log("populateMenu - param is type "+ typeof obj)
  obj.forEach(function(elem){
    $("#nav-mobile").append(
        "<li class='bold' data-url='"+elem.url+"'>"+
        "<a href='#'>"+elem.shortName+"</a>"+
        "</li>"
        );    
  });
}
}