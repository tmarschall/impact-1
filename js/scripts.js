// DOM Ready
$(function() {


//-----------------------------------//
// NOTE: BigText must have doc.ready //
// wrapper in src to work on FF & IE //
//-----------------------------------//


    //------- GLOBAL -------//

    // Avoid `console` errors in browsers that lack a console.
        var method;
        var noop = function () {};
        var methods = [
            'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
            'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
            'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
            'timeStamp', 'trace', 'warn'
        ];
        var length = methods.length;
        var console = (window.console = window.console || {});

        while (length--) {
            method = methods[length];

            // Only stub undefined methods.
            if (!console[method]) {
              console[method] = noop;
            }
        }

    //------- INPUT -------//

    // Scale charity grid properly
    var scaleGrid = function(){
         var w = $('.charity').width();
        $('.charity').css("height", w);
        $('.charity-overlay').fitText(0.7);
        $('.charity-overlay span').each(function(){
            var h = $(this).height();
            var w = $('.charity').width();
            var offset = (w/2) - (h/2);
            $(this).css("margin-top", offset);
        });
    };

    // Trigger visual changes on charity selection
    $('.charity input:radio').change(function(){
        // Show name overlay
        $('.charity.selected').removeClass('selected').find('.charity-overlay').velocity({"opacity": "0"}, 300);
        $(this).closest('label').addClass('selected').find('.charity-overlay').velocity({"opacity": "1"}, 300);

        // Mobile
        setTimeout(function() {
            closeModal();
            showSelected();
        }, 300);
    });

    // Move grid to hidden modal on mobile
    var mobileCharities = function(){
        if ($('.mobile').css('display') == 'block'){
                $('#charities').addClass('charities-mobile');
                $('#charities').hide();
        } else {
            $('#charities').removeClass('charities-mobile');
            $('#charities').show();
        }
    };
    mobileCharities();

    // Close modal function
     var closeModal = function(){
        var headerHeight = $('header').height() + $('.heading').height() + 80;
        $('.charities-mobile').fadeOut(300);
        $('.charities-mobile-overlay').fadeOut(300);
        $('html, body').animate({scrollTop: headerHeight}, 300);
    }

    $('.charities-mobile-overlay').click(function(){
       closeModal();
    });

    // Build modal buttons
    // Scale button
    var scaleModalButton = function(){
        var w = $('.selected-charity').width();
        var spanH = $('.choose-charity span').height();
        var spanOffset = w/2 - spanH/2;
        $('.charities-mobile-button').css("height", w);
        $('.choose-charity span').css("margin-top", spanOffset)

    }
    scaleModalButton();

    // Activate modal button
    $('.charities-mobile-button').click(function(){
        $('.charities-mobile').fadeIn(300);
        $('.charities-mobile-overlay').fadeIn(300);
        $('html, body').animate({scrollTop: 0}, 300);
        scaleGrid();
    });

    // Show selected charity in selected area
    var showSelected = function(){
        $('.selected-charity').empty();
        $('.selected img').clone().appendTo('.selected-charity');
    }




    //------ OUTPUT -----//

    // Prevent FOUC on the Output
    $('.output').hide(); // Faded in on window load (below)

    // Don't show result if no result
   $('.number span:empty').closest('.result').hide();

    // Size and align everything
    var alignResult = function(){
         $(".result-details").each(function(){
            var result = $(this).height();
            var icon = $(".icon").height();
            var offset = (icon/2) - (result/2);
            $(this).css({"margin-top": offset});
        });
     };

    var resultText = function(){
        // Size result text
        var number = $('.result-details .number');
        var numberText = $('.result-details .number span');
        var thing = $('.result-details .thing');
        var thingText = $('.result-details .thing span');
        var numberLength = numberText.html().length;
        if ($('.mobile').css('display') !== 'block'){
            number.css({
                "text-align": "left"
            });
            thing.css({
                "text-align":"left"
            });
            if (numberLength == 1){
                number.css({
                    "width": "18%",
                });
                thing.css({
                    "width": "81%",
                });
                number.bigtext();

                var thingSize = numberText.height()/2.3;
                thingText.fitText(0.19, { maxFontSize: thingSize })
                thingText.html(thingText.html().replace(/(.+?)(\s+)/,"$1<br/>"));

            } else if (numberLength == 2){
                number.css({
                    "width": "36%",
                });
                thing.css({
                    "width": "63%",
                });
                number.bigtext();

                var thingSize = numberText.height()/2.3;
                thingText.fitText(0.19, { maxFontSize: thingSize })
                thingText.html(thingText.html().replace(/(.+?)(\s+)/,"$1<br/>"));
            } else{
                number.css({
                    "width":"100%",
                });
                thing.css({
                    "width":"100%",
                    "margin-top":"0"
                });
                number.bigtext({
                    maxfontsize: 120
                });
                thing.bigtext({
                    maxfontsize: 42
                });
            };
        } else {
             number.css({
                    "width":"100%",
                    "text-align": "center"
                });
                thing.css({
                    "width":"100%",
                    "margin-top":"0",
                    "text-align":"center"
                });
                number.bigtext({
                    maxfontsize: 140
                });
                thing.bigtext();
        }


        // Size info text
        if($('.tablet').css('display') == 'block'){
            $(".result-details .info").fitText(1.4);
        }
        else {
            $(".result-details .info").fitText(1.8);
        };
    };

    var buttonText = function(){
        $('#donate, #learnmore').fitText(2.2);
        if($('.tablet').css('display') == 'block'){
            $('#donate, #learnmore').fitText(1.6);
        };
    };


   //------------  TRIGGERS  -------------//

   // Do stuff that requires everything to be loaded
   $(window).load(function(){
        // Fade in output (prevent FOUC)
        $('.output').fadeIn(300);

        // Hold off sizing and alignment content loaded
        resultText();
        buttonText();
        alignResult();
        scaleGrid();

        // Wait until everything loaded to trigger defaults
        $('#givedirectly').trigger("change");
        $('#amount').val('100');
   });


   // Re-call functions that change on resize
   $(window).resize(function(){
    // Make resize cleaner/more efficient
    clearTimeout($.data(this, 'resizeTimer'));
    $.data(this, 'resizeTimer', setTimeout(function() {
        //do stuff
        scaleGrid();
        mobileCharities();
        scaleModalButton();
        resultText();
        buttonText();
        alignResult();
    }, 100));

   });


});
