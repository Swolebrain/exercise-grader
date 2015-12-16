//var viewModel;
var urlRoot = "http://www.swolebrain.com:4004";

var retrieveMenuItems = require('./includes/menu-loader.js');
var handleKeys = require("./includes/handleKeys.js");
var handleTabs = require("./includes/handleTabs.js");
var evalSolution = require("./includes/evalSolution.js");
var problemLoader = require("./includes/problemLoader.js");

//just attaching event listeners and so on
$(document).ready(function () {
  retrieveMenuItems(urlRoot);
  $("#nav-mobile").on("click", "li", function(event){
    problemLoader(event, $(this), urlRoot);
  });
  $("#evalSolution").on("click", function(){
    evalSolution(window.viewModel);
  });
  $("textarea").keypress(handleKeys);
  $("textarea").keydown(handleTabs);
  $("textarea").unbind('autoresize');
});




