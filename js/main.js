var viewModel;
var urlRoot = "http://www.swolebrain.com:4004";

var menuLoader = require('./includes/menu-loader.js');
var retrieveMenuItems = menuLoader[0];
var populateMenu = menuLoader[1];
var handleKeys = require("./includes/handleKeys.js");
var handleTabs = require("./includes/handleTabs.js");

$(document).ready(function () {
  retrieveMenuItems(urlRoot, populateMenu);
  $("#nav-mobile").on("click", "li", function (event) {
    event.preventDefault();
    var self = $(this);
    $.ajax({
      url: urlRoot + "/exercise/" + self.data("url"),
      error: function () {
        alert("Failed to load exercise, click again");
      },
      success: function (resp) {
        buildLayout(resp, viewModel);
      }
    });
  });
  $("#evalSolution").on("click", function(){
    evalSolution(viewModel);
  });
  $("textarea").keypress(handleKeys);
  $("textarea").keydown(handleTabs);
});


//function which builds the problem layout
function buildLayout(obj, viewModel) {
  viewModel = obj;
  //console.log(obj.functionHeader);
  if (viewModel.hasOwnProperty("executionContext")) {
    for (var k in viewModel.executionContext) {
      var v = eval(viewModel.executionContext[k]);
      viewModel.executionContext[k] = v;
      viewModel.text = viewModel.text.replace("{{" + k + "}}", v);
      viewModel.testResults[0] =
        viewModel.testResults[0].replace("{{" + k + "}}", v);
    }
  }
  $("#problem-title").html(obj.shortName);
  $("#problem-div p").html(obj.text);
  $("#textarea-solution").val(obj.functionHeader);
}

//function which evaluates the solution provided in
//the textarea
