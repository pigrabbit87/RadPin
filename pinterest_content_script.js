$(document).ready(function(){
    var board_name = "";
    var boardE = "";
    var boardD = "";
    var boardC = "";

    function sendRequest(){
        chrome.runtime.sendMessage({
        }, function(response){
            boardE = response.response.boardE;
            boardD = response.response.boardD;
            boardC = response.response.boardC;
        })
    }

    sendRequest();

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
        //alert("the message from the background page: " + request.greeing);
        sendResponse({
            response: "Message received"
        });
    });

    function add_style(){
        $("head").append("<style id='remove_modal'>.modalContent{visibility: hidden !important;}.modalMask{visibility: hidden !important;}");
    }

    function pinCreateSucess(){
        if ($('.PinCreateSuccess').length > 0){
            $('style#remove_modal').replaceWith("");
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
            if (search_name == board_name){
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
        pin_button.click();
        setTimeout(click_board, 5);
        // change the css back
    }

    $('.pinImageActionButtonWrapper').mouseover(function(e){
        Mousetrap.bind('shift+e', function(){
            board_name = boardE;
            trigger_form();
        });
        Mousetrap.bind('shift+d', function(){
            board_name = boardD;
            trigger_form();
        });
        Mousetrap.bind('shift+c', function(){
            board_name = boardC;
            trigger_form();
        });
    });
  
    // add the key stroke button
    $('.App.full.AppBase').append('<div class="keyButtonWrapper"><div class="kFooterButtons Module visible"><div class="buttonInoutWrapper addButtonWrapper"><button id="btnE" class="keyStrokeFooter footerIcon Button DropdownButton Module borderless">E</button></div><div class="buttonInoutWrapper addButtonWrapper"><button id="btnD" class="keyStrokeFooter footerIcon Button DropdownButton Module borderless">D</button></div><div class="buttonInoutWrapper addButtonWrapper"><button id="btnC" class="keyStrokeFooter footerIcon Button DropdownButton Module borderless">C</button></div></div></div>');

    $('#btnE').mouseover(function(){
        $('body').append('<div class="positionModuleElement defaultCaret positionLeft keyPopOut" style="top: 61px;right: 60px;"><span class="positionModuleCaret" style="top: 7px;right: -11px;"></span><div class="buttonText">'+ boardE + '</div></div>');
    });

    $('#btnD').mouseover(function(){
        $('body').append('<div class="positionModuleElement defaultCaret positionLeft keyPopOut" style="top: 100px;right: 60px;"><span class="positionModuleCaret" style="top: 7px;right: -11px;"></span><div class="buttonText">'+ boardD + '</div></div>');
    });

    $('#btnC').mouseover(function(){
        $('body').append('<div class="positionModuleElement defaultCaret positionLeft keyPopOut" style="top: 140px;right: 60px;"><span class="positionModuleCaret" style="top: 7px;right: -11px;"></span><div class="buttonText">'+ boardC + '</div></div>');
    });

    $('.buttonInoutWrapper').mouseout(function(){
        $('.keyPopOut').replaceWith("");
    });

});
