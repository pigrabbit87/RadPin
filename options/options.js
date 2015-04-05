var all_boards = [];
var boardE = "";
var boardD = "";
var boardC = "";

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
	var reg = /"all_boards":[^\]]*/g;
	var myboards = reg.exec(text)[0];

	reg = /"layout": "default", "name": "(.*?)"/g;
	var board_hash = {};
	var name = reg.exec(myboards);
	while (name != null){
		board_hash[name[1]] = "";
		name = reg.exec(myboards);
	}
	all_boards = Object.keys(board_hash);
	return board_hash;
}

function format_boardname(board_hash){
	var formatted_string = "";
	var board_names = Object.keys(board_hash);
	for (i = 0; i < board_names.length; i++){
		formatted_string += '<option value="' + board_names[i] + '">' + board_names[i] + '</option>';
	}

	for (i = 1; i < 10; i++){
		var board_target = "board_" + i.toString();
		document.getElementById(board_target).innerHTML = formatted_string;
	}

	document.getElementById('option1box').checked = false;
	document.getElementById('option2box').checked = false;
	document.getElementById('option3box').checked = false;

}

function get_board_name(){
	get_page("https://www.pinterest.com/", function(text){
		var reg = /(?:)"all_boards": (.*), "resource":(?:\s)/g;
		var match = reg.exec(text);	
		var board_hash = parse_xml(match[0]);
		format_boardname(board_hash);
	});
}

function fade_out(){
	document.getElementById('status').textContent = "";
}

function save_options() {
	var boardE1 = document.getElementById('board_1').value;
	var boardD1 = document.getElementById('board_2').value;
	var boardC1 = document.getElementById('board_3').value;
	var boardE2 = document.getElementById('board_4').value;
	var boardD2 = document.getElementById('board_5').value;
	var boardC2 = document.getElementById('board_6').value;
	var boardE3 = document.getElementById('board_7').value;
	var boardD3 = document.getElementById('board_8').value;
	var boardC3 = document.getElementById('board_9').value;
	var checkBox1 = document.getElementById('option1box').checked;
	var checkBox2 = document.getElementById('option2box').checked;
	var checkBox3 = document.getElementById('option3box').checked;
	if (checkBox1){
		boardE = boardE1;
		boardD = boardD1;
		boardC = boardC1;
	}
	else if (checkBox2){
		boardE = boardE2;
		boardD = boardD2;
		boardC = boardC2;
	}
	else if (checkBox3){
		boardE = boardE3;
		boardD = boardD3;
		boardC = boardC3;
	}

	chrome.storage.sync.set({
		boardE1: boardE1,
		boardD1: boardD1,
		boardC1: boardC1,
		boardE2: boardE2,
		boardD2: boardD2,
		boardC2: boardC2,
		boardE3: boardE3,
		boardD3: boardD3,
		boardC3: boardC3,
		boardE: boardE,
		boardD: boardD,
		boardC: boardC,
		checkBox1: checkBox1,
		checkBox2: checkBox2,
		checkBox3: checkBox3,
		allBoards: all_boards
	}, function() {
		// Update status to let user know options were saved.
		var status = document.getElementById('status');
		status.textContent = 'Options saved. Refresh your pinterest page and happy pinning :D';
		setTimeout(fade_out, 1500);
	});
}

function restore_options(){
	chrome.storage.sync.get({
	    boardE1: '---',
		boardD1: '---',
		boardC1: '---',
		boardE2: '---',
		boardD2: '---',
		boardC2: '---',
		boardE3: '---',
		boardD3: '---',
		boardC3: '---',
		checkBox1: false,
		checkBox2: false,
		checkBox3: false,
		allBoards: []
	  }, function(items) {
	  	format_dropdown(items);
	  });
}

function format_dropdown(all_items){
	all_boards = all_items.allBoards;
	var option1 = "";
	var option2 = "";
	var option3 = "";
	var option4 = "";
	var option5 = "";
	var option6 = "";
	var option7 = "";
	var option8 = "";
	var option9 = "";
	var boardE1 = '<option value="' + all_items.boardE1 + '" selected="selected">' + all_items.boardE1 + '</option>';
	var boardD1 = '<option value="' + all_items.boardD1 + '" selected="selected">' + all_items.boardD1 + '</option>';
	var boardC1 = '<option value="' + all_items.boardC1 + '" selected="selected">' + all_items.boardC1 + '</option>';
	var boardE2 = '<option value="' + all_items.boardE2 + '" selected="selected">' + all_items.boardE2 + '</option>';
	var boardD2 = '<option value="' + all_items.boardD2 + '" selected="selected">' + all_items.boardD2 + '</option>';
	var boardC2 = '<option value="' + all_items.boardC2 + '" selected="selected">' + all_items.boardC2 + '</option>';
	var boardE3 = '<option value="' + all_items.boardE3 + '" selected="selected">' + all_items.boardE3 + '</option>';
	var boardD3 = '<option value="' + all_items.boardD3 + '" selected="selected">' + all_items.boardD3 + '</option>';
	var boardC3 = '<option value="' + all_items.boardC3 + '" selected="selected">' + all_items.boardC3 + '</option>';

	for (i = 0; i < all_boards.length; i++){
		if (all_boards[i] == all_items.boardE1){
			option1 += boardE1;
		}
		else{
			option1 += '<option value="' + all_boards[i] + '">' + all_boards[i] + '</option>';		
		}
	}

	for (i = 0; i < all_boards.length; i++){
		if (all_boards[i] == all_items.boardD1){
			option2 += boardD1;
		}
		else{
			option2 += '<option value="' + all_boards[i] + '">' + all_boards[i] + '</option>';		
		}
	}

	for (i = 0; i < all_boards.length; i++){
		if (all_boards[i] == all_items.boardC1){
			option3 += boardC1;
		}
		else{
			option3 += '<option value="' + all_boards[i] + '">' + all_boards[i] + '</option>';		
		}
	}

	for (i = 0; i < all_boards.length; i++){
		if (all_boards[i] == all_items.boardE2){
			option4 += boardE2;
		}
		else{
			option4 += '<option value="' + all_boards[i] + '">' + all_boards[i] + '</option>';		
		}
	}

	for (i = 0; i < all_boards.length; i++){
		if (all_boards[i] == all_items.boardD2){
			option5 += boardD2;
		}
		else{
			option5 += '<option value="' + all_boards[i] + '">' + all_boards[i] + '</option>';		
		}
	}

	for (i = 0; i < all_boards.length; i++){
		if (all_boards[i] == all_items.boardC2){
			option6 += boardC2;
		}
		else{
			option6 += '<option value="' + all_boards[i] + '">' + all_boards[i] + '</option>';		
		}
	}

		for (i = 0; i < all_boards.length; i++){
		if (all_boards[i] == all_items.boardE3){
			option7 += boardE3;
		}
		else{
			option7 += '<option value="' + all_boards[i] + '">' + all_boards[i] + '</option>';		
		}
	}

	for (i = 0; i < all_boards.length; i++){
		if (all_boards[i] == all_items.boardD3){
			option8 += boardD3;
		}
		else{
			option8 += '<option value="' + all_boards[i] + '">' + all_boards[i] + '</option>';		
		}
	}

	for (i = 0; i < all_boards.length; i++){
		if (all_boards[i] == all_items.boardC3){
			option9 += boardC3;
		}
		else{
			option9 += '<option value="' + all_boards[i] + '">' + all_boards[i] + '</option>';		
		}
	}

	document.getElementById('board_1').innerHTML = option1;
	document.getElementById('board_2').innerHTML = option2;
	document.getElementById('board_3').innerHTML = option3;
	document.getElementById('board_4').innerHTML = option4;
	document.getElementById('board_5').innerHTML = option5;
	document.getElementById('board_6').innerHTML = option6;
	document.getElementById('board_7').innerHTML = option7;
	document.getElementById('board_8').innerHTML = option8;
	document.getElementById('board_9').innerHTML = option9;

	if (all_items.checkBox1){
		document.getElementById('option1box').checked = true;
	}
	else if (all_items.checkBox2){
		document.getElementById('option2box').checked = true;
	}
	else if (all_items.checkBox3){
		document.getElementById('option3box').checked = true;
	}
}

function show_box(){
	document.getElementById('bio_box').style.visibility = "visible";
}

function hide_box(){
	document.getElementById('bio_box').style.visibility = "hidden";	
}

document.addEventListener('DOMContentLoaded', restore_options);

window.onload = function(){
	if (all_boards.length == 0){
		get_board_name();
	}
	document.getElementById('save').addEventListener('click', save_options);
	document.getElementById('about').addEventListener('click', show_box);
	document.getElementById('cancel_but').addEventListener('click', hide_box);
}