function save_options() {
	var boardE = document.getElementById('board_1').value;
	var boardD = document.getElementById('board_2').value;
	var boardC = document.getElementById('board_3').value;

	chrome.storage.sync.set({
		boardE: boardE,
		boardD: boardD,
		boardC: boardC
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
		boardC: '---'
	  }, function(items) {
	    document.getElementById('option1').value = items.boardE;
	    document.getElementById('option1').innerHTML = items.boardE;
	    document.getElementById('option2').value = items.boardD;
	    document.getElementById('option2').innerHTML = items.boardD;
	    document.getElementById('option3').value = items.boardC;
	    document.getElementById('option3').innerHTML = items.boardC;
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
	var board_keys = Object.keys(board_hash);
	reg = /"id": "(.*?)"/g;
	for (i = 0; i < board_keys.length; i++){
		var id = reg.exec(text);
		board_hash[board_keys[i]] = id[1];
	}
	return board_hash;
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