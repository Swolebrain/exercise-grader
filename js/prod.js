(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = [ f1, populateMenu ];

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
}
},{}],2:[function(require,module,exports){
var viewModel;
var urlRoot = "http://www.swolebrain.com:4004";

var menuLoader = require('./includes/menu-loader.js');
var retrieveMenuItems = menuLoader[0];
var populateMenu = menuLoader[1];

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

//functions to handle tabs, enters, etc

function handleKeys(evt){
  if (evt.keyCode === 13){
    handleEnters(evt);
  }
  else if (evt.keyCode === 125){ //tab
    handleCloseBraces();
  }
}

function handleTabs(e){
  if (e.keyCode === 9){
    e.preventDefault();
    wedgeAtCursor("    ", $("textarea")[0]);
  }
}
function handleCloseBraces(){
  var txtArea = $("textarea")[0];
  var cursorPos = txtArea.selectionStart;
  var line = "";
  for (var i = cursorPos-1; i > 0; i--){
    if ( txtArea.value[i] === "\n") break;
    else line = txtArea.value[i]+line;
  }

  if (line.match(new RegExp(/^     *$/gi)) ){
    console.log("matched");
    //take off 4 leading spaces
    var head = txtArea.value.substring(0,cursorPos-line.length);
    var tail = line.substr(4)+txtArea.value.substr(cursorPos);
    txtArea.value = head+tail;
    txtArea.selectionStart = cursorPos - 4;
    txtArea.selectionEnd = cursorPos - 4;
  }
}
function handleEnters(evt){
  evt.preventDefault();
  var txt = $("textarea");
  var cursorPos = txt[0].selectionStart;
  var linesStr = txt.val().substr(0, cursorPos);
  var lines = linesStr.split("\n");
  var lastLine = lines[lines.length-1];
  var spcCount = 0;
  for (var i =0; i < lastLine.length; i++){
            if (lastLine[i] != " " ) break;
            else spcCount++;

            }
            //console.log("Spaces in '"+lastLine+"': "+spcCount);
            if (lastLine.charAt(lastLine.length-1) === "{"){
            //console.log("line ended in {");
            spcCount += 4;
            }
            var spaces = "";
            for(var i = 0; i < spcCount; i++){ 
            spaces += " ";                             
            }

            if (spaces.length >= 0){
              wedgeAtCursor("\n"+spaces, txt[0]);
            }

}
function wedgeAtCursor(str, txt){
  var cursorPos = txt.selectionStart;
  var tail = txt.value.substr(cursorPos, txt.value.length);
  var finalVal = txt.value.substr(0,cursorPos)+str+ tail;
  txt.value = finalVal;
  txt.selectionStart =cursorPos+str.length;
  txt.selectionEnd =cursorPos+str.length;
}
},{"./includes/menu-loader.js":1}]},{},[2]);
