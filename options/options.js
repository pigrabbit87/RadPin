var all_boards = [];

function save_options() {
	var boardE = document.getElementById('board_1').value;
	var boardD = document.getElementById('board_2').value;
	var boardC = document.getElementById('board_3').value;

	chrome.storage.sync.set({
		boardE: boardE,
		boardD: boardD,
		boardC: boardC,
		allBoards: all_boards
	}, function() {
		// Update status to let user know options were saved.
		var status = document.getElementById('status');
		status.textContent = 'Options saved.';
	});
}

function restore_options(){
	chrome.storage.sync.get({
	    boardE: '---',
		boardD: '---',
		boardC: '---',
		allBoards: []
	  }, function(items) {
	  	format_dropdown(items);
	  });
}

function get_page(link, callback){
	var xhr = new XMLHttpRequest();
	xhr.open("GET", link, true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			callback(xhr.responseText);
		}
	};
	xhr.send(null);
}

function parse_xml(text){
	var reg = /"layout": "default", "name": "(.*?)"/g;
	var board_hash = {};
	var name = reg.exec(text);
	while (name != null){
		board_hash[name[1]] = "";
		name = reg.exec(text);
	}
	all_boards = Object.keys(board_hash);
	reg = /"id": "(.*?)"/g;
	for (i = 0; i < all_boards.length; i++){
		var id = reg.exec(text);
		board_hash[all_boards[i]] = id[1];
	}
	return board_hash;
}

function format_dropdown(all_items){
	all_boards = all_items.allBoards;
	var option1 = "";
	var option2 = "";
	var option3 = "";
	var boardE = '<option value="' + all_items.boardE + '" selected="selected">' + all_items.boardE + '</option>';
	var boardD = '<option value="' + all_items.boardD + '" selected="selected">' + all_items.boardD + '</option>';
	var boardC = '<option value="' + all_items.boardC + '" selected="selected">' + all_items.boardC + '</option>';

	for (i = 0; i < all_boards.length; i++){
		if (all_boards[i] == all_items.boardE){
			option1 += boardE;
		}
		else{
			option1 += '<option value="' + all_boards[i] + '">' + all_boards[i] + '</option>';		
		}
	}

	for (i = 0; i < all_boards.length; i++){
		if (all_boards[i] == all_items.boardD){
			option2 += boardD;
		}
		else{
			option2 += '<option value="' + all_boards[i] + '">' + all_boards[i] + '</option>';		
		}
	}

	for (i = 0; i < all_boards.length; i++){
		if (all_boards[i] == all_items.boardC){
			option3 += boardC;
		}
		else{
			option3 += '<option value="' + all_boards[i] + '">' + all_boards[i] + '</option>';		
		}
	}

	document.getElementById('board_1').innerHTML = option1;
	document.getElementById('board_2').innerHTML = option2;
	document.getElementById('board_3').innerHTML = option3;
}

function format_boardname(board_hash){
	var formatted_string = "";
	var board_names = Object.keys(board_hash);
	for (i = 0; i < board_names.length; i++){
		formatted_string += '<option value="' + board_names[i] + '">' + board_names[i] + '</option>';
	}

	for (i = 1; i < 4; i++){
		var board_target = "board_" + i.toString();
		document.getElementById(board_target).innerHTML = formatted_string;
	}

}

function get_board_name(){
	var board_url = document.getElementById('pinterest_home').value;
	get_page("https://www.pinterest.com/" + board_url, function(text){
		var reg = /(?:)"all_boards": (.*), "resource":(?:\s)/g;
		var match = reg.exec(text);	
		var board_hash = parse_xml(match[0]);
		format_boardname(board_hash);
	});
}

document.addEventListener('DOMContentLoaded', restore_options);

window.onload = function(){
	document.getElementById('find_board').addEventListener('click', get_board_name);	
	document.getElementById('save').addEventListener('click', save_options);
}