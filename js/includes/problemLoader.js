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
          vm.testResults[0] =
            vm.testResults[0].replace("{{" + k + "}}", v);
        }
      }
      $("#problem-title").html(obj.shortName);
      $("#problem-div p").html(obj.text);
      $("#textarea-solution").val(obj.functionHeader);
    }
  };