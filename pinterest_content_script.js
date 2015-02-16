
$(function(){
    var $board_name = "";
    var $pin_image = "";

    function notification(){
        $("body").append('<div class="notificationBox"><img src="' + $pin_image + '" class="noti_image"><span class="noti_info"><div class="pinTo">Pin To</div><div class="noti_board_name">'+ $board_name + '</div></span></div>');
        $(".notificationBox").fadeOut(12000, function() { 
            $(this).remove(); 
        });
    }

    function add_style(){
        $("head").append("<style id='remove_modal'>.modalContent{visibility: hidden !important;}.modalMask{visibility: hidden !important;}");
    }

    function pinCreateSucess(){
        if ($('.PinCreateSuccess').length > 0){
            $('style#remove_modal').replaceWith("");
            notification();
        }
        else{
            setTimeout(pinCreateSucess, 150);
        }
    }

    function remove_style(){
        $('style#remove_modal').replaceWith("<style id='remove_modal'>.modalContent{visibility: hidden !important;}.PinCreateSuccess{visibility: visible !important;}");
        setTimeout(pinCreateSucess, 50);
    }

    function pick_board(){
        // choose a board
        // click on the drop down button
        var ui_list = document.querySelector(".ui-SelectList");
        var all_items = ui_list.querySelectorAll(".item");
        for (i = 0; i < all_items.length; i++){
            var search_name = $.trim(all_items[i].textContent);
            if (search_name == $board_name){
                all_items[i].click();
            }
        }
        // click on the pin button and submit the form
        document.querySelector(".formFooter").querySelector(".repinSmall").click();
        setTimeout(remove_style, 40);
    }

    function click_board(){
        document.querySelector(".BoardPickerDropdownButton").click();
        setTimeout(pick_board, 5);
    }

    function trigger_form(){
        add_style();

        // click on the repin button to get to Pick a board page
        var x = document.querySelectorAll(":hover");
        var pin_button;
        var pin;
        for (i = x.length-1; i >= 0; i--){
            pin = x[i].querySelector(".pinWrapper");
            if (pin) {break};
        }

        pin_button = pin.querySelector(".repinSendButtonWrapper").querySelector(".repinSmall");
        $pin_image = pin.querySelector(".pinUiImage").querySelector("img").src;
        pin_button.click();
        setTimeout(click_board, 5);
        // change the css back
    }

    function sendRequest(key_choice){
        chrome.runtime.sendMessage({
            key: key_choice
        }, function(response){
            $board_name = response.response;
        })
    }

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
        //alert("the message from the background page: " + request.greeing);
        sendResponse({
            response: "Message received"
        });
    });



    $('.pinImageActionButtonWrapper').mouseover(function(e){
        Mousetrap.bind('shift+e', function(){
            sendRequest('E');
            trigger_form();
        });
        Mousetrap.bind('shift+d', function(){
            sendRequest('D');
            trigger_form();
        });
        Mousetrap.bind('shift+c', function(){
            sendRequest('C');
            trigger_form();
        });
    });


});



