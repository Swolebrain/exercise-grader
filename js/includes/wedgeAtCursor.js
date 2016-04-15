module.exports = wedgeAtCursor;

function wedgeAtCursor(str, txt){
  var cursorPos = txt.selectionStart;
  var tail = txt.value.substr(cursorPos, txt.value.length);
  var finalVal = txt.value.substr(0,cursorPos)+str+ tail;
  txt.value = finalVal;
  txt.selectionStart =cursorPos+str.length;
  txt.selectionEnd =cursorPos+str.length;
}
