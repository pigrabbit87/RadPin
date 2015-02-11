function display_boardname(board_hash){
	var string = "";
	var i = 1;
	for (var key in board_hash){
		string = string + "<li><a href='#' id= 'board_" + i + "' >" + key + "</a>"; 
	}
	document.getElementById('board').innerHTML = string;
}

function board() {
	var board_hash = chrome.extension.getBackgroundPage().board_hashes;
	if (board_hash) display_boardname(board_hash);
}

window.onload = board;