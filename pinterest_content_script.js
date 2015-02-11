var loadfunction = window.onload;
window.onload = function(event){
    var board_name_arr = [];
    var node = document.getElementsByClassName('Board');

    for (var i = 0; i < node.length; ++i){
        var board_name = node[i].getElementsByClassName('boardName')[0].textContent;
        board_name_arr[i] = board_name;
    }

    if (Object.keys(board_name_arr).length){
        chrome.extension.sendRequest({board_name_arr: board_name_arr});
    }

    if (loadfunction) loadfunction(event);
}


