$(document).ready(function(){
    var all_boards = [];
    var board_name = "";
    var boardE = "";
    var boardD = "";
    var boardC = "";

    function sendRequest(){
        chrome.runtime.sendMessage({
        }, function(response){
            all_boards = response.response.allBoards;
            boardE = response.response.boardE;
            boardD = response.response.boardD;
            boardC = response.response.boardC;
            format_dropdown();
        })
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

    function add_dropdown(){
        var option1 = "";
        var option2 = "";
        var option3 = "";

        for (i = 0; i < all_boards.length; i++){
            if (all_boards[i] == boardE){
                option1 += '<option selected="selected" value="' + all_boards[i] + '">' + all_boards[i] + '</option>';
            }
            else{
                option1 += '<option value="' + all_boards[i] + '">' + all_boards[i] + '</option>';      
            }
        }

        for (i = 0; i < all_boards.length; i++){
            if (all_boards[i] == boardD){
                option2 += '<option selected="selected" value="' + all_boards[i] + '">' + all_boards[i] + '</option>';
            }
            else{
                option2 += '<option value="' + all_boards[i] + '">' + all_boards[i] + '</option>';      
            }
        }

        for (i = 0; i < all_boards.length; i++){
            if (all_boards[i] == boardC){
                option3 += '<option selected="selected" value="' + all_boards[i] + '">' + all_boards[i] + '</option>';
            }
            else{
                option3 += '<option value="' + all_boards[i] + '">' + all_boards[i] + '</option>';      
            }
        }

        $("#board_1").html(option1);
        $("#board_2").html(option2);
        $("#board_3").html(option3);
    }

    function get_board_name(){
        get_page("https://www.pinterest.com/", function(text){
            var reg = /(?:)"all_boards": (.*), "resource":(?:\s)/g;
            var match = reg.exec(text); 
            var board_hash = parse_xml(match[0]);
            add_dropdown();
            chrome.storage.sync.set({
                allBoards: all_boards
            }, function(){});
        });
    }

    function add_style(){
        $("head").append("<style id='remove_modal'>.modalContent{visibility: hidden !important;}.modalMask{visibility: hidden !important;}.animatingToModal{visibility: hidden !important;}");
    }

    function pinCreateSucess(){
        if ($('.RepinSuccessToast').length > 0){
            $('style#remove_modal').replaceWith("");
        }
        else{
            setTimeout(function(){pinCreateSucess();}, 150);
        }
    }

    function pick_board(){
        if ($(".BoardPicker").length == 1){
            var all_items = $(".allBoards")[0].querySelectorAll(".item");
            for (i = 0; i < all_items.length; i++){
                var search_name = $.trim(all_items[i].querySelector(".nameAndIcons").textContent);
                if (search_name == board_name){
                    all_items[i].querySelector("button").click();
                    break;
                }
            }
            setTimeout(function(){pinCreateSucess();}, 40);
        }
        else{
            setTimeout(function(){pick_board();}, 5);
        }
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
        setTimeout(function(){pick_board();}, 5);
    }

    function format_dropdown(){
        if (all_boards){
            add_dropdown();
        }else{
            get_board_name();
        }
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
    $('.App.full.AppBase').append('<div class="keyButtonWrapper"><div class="kFooterButtons Module visible"><div class="buttonInoutWrapper addButtonWrapper"><button id="btnE" class="keyStrokeFooter footerIcon Button DropdownButton Module borderless">E</button><span><select id="board_1" class="dropDownList radpin-button" style="top: 0px;right: 15px;position: absolute; visibility: hidden;"><option id="option1" value=""></option></select></span></div><div class="buttonInoutWrapper addButtonWrapper"><button id="btnD" class="keyStrokeFooter footerIcon Button DropdownButton Module borderless">D</button><span><select id="board_2" class="dropDownList radpin-button" style="top: 38px;right: 15px;position: absolute; visibility: hidden;"><option id="option1" value=""></option></select></span></div><div class="buttonInoutWrapper addButtonWrapper"><button id="btnC" class="keyStrokeFooter footerIcon Button DropdownButton Module borderless">C</button><span><select id="board_3" class="dropDownList radpin-button" style="top: 77px;right: 15px;position: absolute; visibility: hidden;"><option id="option1" value=""></option></select></span></div><div class="buttonInoutWrapper addButtonWrapper"><button id="save" class="keyStrokeFooter footerIcon Button DropdownButton Module borderless">✓</button></div></div></div>');

    $('#btnE').click(function(){
        $('#board_1').css('visibility', 'visible');
        $('.keyPopOut').replaceWith("");
    });

    $('#btnD').click(function(){
        $('#board_2').css('visibility', 'visible');
        $('.keyPopOut').replaceWith("");
    });

    $('#btnC').click(function(){
        $('#board_3').css('visibility', 'visible');
        $('.keyPopOut').replaceWith("");
    });

    $('#btnE').mouseover(function(){
        if ($('#board_1').css('visibility') == 'hidden'){       
            $('body').append('<div class="positionModuleElement defaultCaret positionLeft keyPopOut" id="hover1" style="top: 61px;right: 60px;"><span class="positionModuleCaret" style="top: 7px;right: -11px;"></span><div class="buttonText">'+ boardE + '</div></div>');
        }
    });

    $('#btnD').mouseover(function(){
        if ($('#board_2').css('visibility') == 'hidden'){
            $('body').append('<div class="positionModuleElement defaultCaret positionLeft keyPopOut" id="hover2" style="top: 100px;right: 60px;"><span class="positionModuleCaret" style="top: 7px;right: -11px;"></span><div class="buttonText">'+ boardD + '</div></div>');
        }
    });

    $('#btnC').mouseover(function(){
        if ($('#board_3').css('visibility') == 'hidden'){
            $('body').append('<div class="positionModuleElement defaultCaret positionLeft keyPopOut" id="hover3" style="top: 140px;right: 60px;"><span class="positionModuleCaret" style="top: 7px;right: -11px;"></span><div class="buttonText">'+ boardC + '</div></div>');
        }
    });

    $('#save').click(function(){
        boardE = $("#board_1").val();
        boardD = $("#board_2").val();
        boardC = $("#board_3").val();
        chrome.storage.sync.set({
            boardE: boardE,
            boardD: boardD,
            boardC: boardC,
            allBoards: all_boards
        }, function(){
            $(".radpin-button").css("visibility", "hidden");
            $("body").append('<div class="positionModuleElement defaultCaret positionLeft keyPopOut" id="hover3" style="top: 177px;right: 60px;"><span class="positionModuleCaret" style="top: 7px;right: -11px;"></span><div class="buttonText">Option Saved</div></div>')
        });
    });
            
    $('.buttonInoutWrapper').mouseout(function(){
        $('.keyPopOut').replaceWith("");
    });

    sendRequest();

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
        //alert("the message from the background page: " + request.greeing);
        sendResponse({
            response: "Message received"
        });
    });

});