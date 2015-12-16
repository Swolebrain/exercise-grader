module.exports = evalSolution;

function evalSolution(viewModel) {
  $("#tests-div").find("tbody").html("");
  var solutionStr = $("#textarea-solution").val();
  if (viewModel.hasOwnProperty("testCases")) {
    viewModel.testCases.forEach(function (elem, i) {
      try {
        var result = eval(solutionStr + elem);
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
    var good = evalConsole(solutionStr) == evalConsole(viewModel.testResults[0]);
    var good = good ? "correct" : "incorrect"
    $("#tests-div").find("tbody")
      .append("<tr><td>run</td><td>" + good + "</td>" +
        "<td>" + good + "</td><tr>");

  }

  function evalConsole(str) {
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

}