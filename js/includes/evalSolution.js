module.exports = evalSolution;

function evalSolution(viewModel) {
  $("#tests-div").find("tbody").html("");
  var solutionStr = $("#textarea-solution").val();
  if (viewModel.hasOwnProperty("testCases")) {
    viewModel.testCases.forEach(function (elem, i) {
      try {
        var result = eval( elem + solutionStr);
      } catch (e) {
        result = e;
      }
      $("#tests-div").find("tbody")
        .append("<tr><td>" + elem + "</td><td>" + result + "</td>" +
          "<td>" + viewModel.testResults[i] + "</td><tr>");
    });
  } else {
    //evaluate code without test cases
    console.log("answer: " + viewModel.testResults[0]);
    var studentRes = evalConsole(solutionStr, viewModel.executionContext);
    console.log(studentRes);
    for (var i in viewModel.testResults){
      var good = studentRes == evalConsole(viewModel.testResults[i], viewModel.executionContext);
      good = good ? "correct" : "Your output:<br>"+studentRes;
      $("#tests-div").find("tbody")
        .append("<tr><td>run</td><td>" + good + "</td>" +
          "<td>" + good + "</td><tr>");

    }
      
  }
  gradeSolution();

  function evalConsole(str, ctx) {
    if (ctx){
      for (var i in ctx)
        eval(""+i+"="+ctx[i]);
    }
    var stdout = "";
    var console = {
      log: function (str) {
        stdout += str + "\n";
      }
    };
    try {
      var result = eval(str);
    } catch (e) {
      return e;
    }
    return stdout.length>0? stdout : result;
  }
  
  function gradeSolution(){
    //here is where we compare expected to actual for each TD and put red
    //or green in each
    var arr = $("#tests-div tbody").find("td");
    var g = "rgba(0,150,0,.5)";
    var r = "rgba(250,0,0,.5)";
    var correct = true;
    for (var i =0; i < arr.length; i+=3){
      if (arr[i+1].innerHTML === arr[i+2].innerHTML){
        $(arr[i]).css("background-color", g);
        $(arr[i+1]).css("background-color", g);
        $(arr[i+2]).css("background-color", g);
      }
      else{
        correct = false;
        console.log("Error in solution: ");
        console.log("|"+arr[i+1].innerHTML+"| vs |"+arr[i+2].innerHTML +"|");
        $(arr[i]).css("background-color", r);
        $(arr[i+1]).css("background-color", r);
        $(arr[i+2]).css("background-color", r);
      }
    }
    //here i need to talk to the server and let it know that
    //if the answer was correct this guy should get some points or something
  }

}