var wedgeAtCursor = require("./wedgeAtCursor.js");
module.exports = handleTabs;

function handleTabs(e){
  if (e.keyCode === 9){
    e.preventDefault();
    wedgeAtCursor("    ", $("textarea")[0]);
  }
}