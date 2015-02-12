$(function(){
    function sendRequest(key_choice){
        chrome.runtime.sendMessage({
            key: key_choice
        }, function(response){
            alert("the response from the background: " + response.response.boardE);
        })
    }

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
        alert("the message from the background page: " + request.greeing);
        sendResponse({
            response: "Message received"
        });
    });

    $('.HomePage').mouseover(function(){
        Mousetrap.bind('shift+e', function(e){
            sendRequest('E');
        });
    });
});


