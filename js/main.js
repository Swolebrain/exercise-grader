var viewModel;
var urlRoot = "http://www.swolebrain.com:4004";

var menuLoader = require('./includes/menu-loader.js');
var retrieveMenuItems = menuLoader[0];
var populateMenu = menuLoader[1];
var handleKeys = require("./includes/handleKeys.js");
var handleTabs = require("./includes/handleTabs.js");

$(document).ready(function(){
  retrieveMenuItems(urlRoot, populateMenu);
  $("#nav-mobile").on("click", "li", function(event){
    event.preventDefault();
    var self = $(this);
    $.ajax({
      url: urlRoot+"/exercise/"+self.data("url"),
      error: function(){
        alert("Failed to load exercise, click again");
      },
      success: function(resp){
        buildLayout(resp);
      }
    });
  });
  $("#evalSolution").on("click", evalSolution);
  $("textarea").keypress(handleKeys);
  $("textarea").keydown(handleTabs);
});


//function which builds the problem layout
function buildLayout(obj){
      viewModel = obj;
      //console.log(obj.functionHeader);
      if (viewModel.hasOwnProperty("executionContext")){
        for (var k in viewModel.executionContext){
          var v = eval(viewModel.executionContext[k]);
          viewModel.executionContext[k] = v;
          viewModel.text = viewModel.text.replace("{{"+k+"}}", v);
          viewModel.testResults[0] = 
            viewModel.testResults[0].replace("{{"+k+"}}", v);
        }
      }
      $("#problem-title").html(obj.shortName);
      $("#problem-div p").html(obj.text);
      $("#textarea-solution").val(obj.functionHeader);
}

//function which evaluates the solution provided in
//the textarea
function evalSolution(){
  $("#tests-div").find("tbody").html("");
  var solutionStr = $("#textarea-solution").val();
  if (viewModel.hasOwnProperty("testCases")){
    viewModel.testCases.forEach(function(elem, i){
      try{
        var result = eval(solutionStr+elem);
      }
      catch(e){
        result = e;
      }
      $("#tests-div").find("tbody")
        .append("<tr><td>"+elem+"</td><td>"+result+"</td>"+
            "<td>"+viewModel.testResults[i]+"</td><tr>");
    });
  }
  else{
    //evaluate code without test cases
    console.log("answer: "+viewModel.testResults[0]);
    var good = evalConsole(solutionStr) == evalConsole(viewModel.testResults[0]);
    var good = good? "correct" : "incorrect"
      $("#tests-div").find("tbody")
      .append("<tr><td>run</td><td>"+good+"</td>"+
          "<td>"+good+"</td><tr>");   

  }
    function evalConsole(str){
      var stdout = "";
      var console = { 
        log: function(str){stdout += str+"\n";}
      };
      try{
        eval(str);
      }
      catch(e){
        return e;
      }
      return stdout;
    }

}


