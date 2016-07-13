module.exports = function (event, dis, urlRoot) {
    event.preventDefault();
    var self = dis;
    $.ajax({
      url: urlRoot + "/exercise/" + self.data("url"),
      error: function () {
        alert("Failed to load exercise, click again");
      },
      success: function (resp) {
        buildLayout(resp);
      }
    });

    //function which builds the problem layout
    function buildLayout(obj) {
      window.viewModel = obj;
      var vm = window.viewModel;
      if (vm.hasOwnProperty("executionContext")) {
        for (var k in vm.executionContext) {
          var v = eval(vm.executionContext[k]);
          vm.executionContext[k] = v;
          vm.text = vm.text.replace("{{" + k + "}}", v);
          for (var i = 0; i < vm.testResults.length; i++){
            vm.testResults[i] =
              vm.testResults[i].replace("{{" + k + "}}", v);
            if (vm.hasOwnProperty("testCases")){
              vm.testCases[i] =
                vm.testCases[i].replace("{{" + k + "}}", v);
            }
          }
        }
      }
      $("#problem-title").html(obj.shortName);
      $("#problem-div p").html(obj.text);
      $("#textarea-solution").val(obj.functionHeader);
      $("tbody").find("tr").remove();
    }
  };
