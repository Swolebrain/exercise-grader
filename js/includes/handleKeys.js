var wedgeAtCursor = require("./wedgeAtCursor.js");
module.exports = handleKeys;

//functions to handle tabs, enters, etc
function handleKeys(evt){
    if (evt.keyCode === 13){
        handleEnters(evt);
    }
    else if (evt.keyCode === 125){ //tab
        handleCloseBraces();
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
}



