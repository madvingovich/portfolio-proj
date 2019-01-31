"use strict";

$(document).ready(function () {
    let skills = $('.skills__level'),
        skillPercent = skills.find('p'),
        menu = $('.header__menu-list'),
        menuItem = menu.find('.header__menu-item'),
        portfolioButtons = $('.portfolio__button'),
        portfolioItems = $('.portfolio__item'),
        itemsAnimated = false,
        skillsShowed = false;


    $('body, html').smoothWheel();

    showItemsOnscroll();

    $(window)
        .on('scroll', showItemsOnscroll)
        .on('resize', function () {
            menu.removeClass('header__menu-list_visible');
        });

    $('.burger').on('click', function () {
        menu.toggleClass('header__menu-list_visible');
        $(this).toggleClass('burger__active');
    });
    
    menuItem.on('click', function (e) {
        e.preventDefault();
        let id = $(this).find('a').attr('href');
        let scroll = $(`${id}`).offset().top;
        $('html,body').animate({
            scrollTop: scroll
        }, "slow");
    });

    portfolioButtons.on('click', function () {
        if(itemsAnimated) return;
        itemsAnimated = true;
        portfolioButtons.removeClass('portfolio__button_active');
        $(this).addClass('portfolio__button_active');
        let data = $(this).attr('data-label');
        portfolioItems.each(function (i, item) {
            if(data === 'all') {
                showItem(item);
                itemsAnimated = false;
                return;
            }
            if($(item).attr('data-label') !== data) {
                $(item).addClass('hidden');
                setTimeout(() => {
                    $(this).css('display','none');
                    itemsAnimated = false;
                },1000)
            } else {
                setTimeout(() => {
                    showItem(item);
                    itemsAnimated = false;
                },1000);
            }
        });
    });

    function showItem (item) {
        $(item).css('display','block');
        setTimeout(() => {
            $(item).removeClass('hidden').addClass('showed');
        },1);
    }

    function showItemsOnscroll () {
        showSkills($('.skills .section__item'));

        showHeaders($('.services .section__header'));
        showHeaders($('.team .section__header'));
        showHeaders($('.skills .section__header'));
        showHeaders($('.portfolio .section__header'));
        showHeaders($('.reviews .section__header'));
        showHeaders($('.contact-us .section__header'));

        showElement($('.services .section__item'));
        showElement($('.team .section__item'));
        showElement($('.skills .section__item'));
        showElement($('.portfolio .section__item'));
        showElement($('.reviews .section__item'));
        showElement($('.contact-us form'));
    }

    function animateSkillsCircles (j) {
        let item = $(skills[j]);
        let percent = parseInt($(item).find('p').html()); // get percent
        if(percent < 51) {
            let deg = 360 / 100 * percent; // deg to rotate;
            $(item).find('.diagram-right').css({'transform':`rotate(${deg}deg)`});
        }
        else {
            let deg = (360 / 100 * percent) - 180; // deg to rotate;
            $(item).find('.diagram-right').addClass('diagram-fast').css('transform','rotate(180deg)');
            setTimeout(function () {
                let currentItemColor = $(`.skills__level_${j + 1}`).css('background').toString(); // same item but another class
                let index = currentItemColor.indexOf(')');                                        // to get background
                let rgba = currentItemColor.slice(0,index + 1);
                $(item).find('.diagram-left').addClass('diagram-momental') // remove transition
                    .css({
                        'transform':'rotate(180deg)', // move to the right
                        'background':`${rgba}`        // color like parrent block
                    });
                $(item).find('.diagram-right')
                    .removeClass('diagram-momental')
                    .addClass('diagram-fast')          // add transition
                    .css('transform',`rotate(${180 + deg}deg)`); // rotate to deg
            },601);
        }
    }

    function animatePercents (j) {
        let percent = parseInt($(skillPercent[j]).html());
        let start = 0;
        let timer = setInterval(function () {
            if(start > percent) clearInterval(timer);
            $(skillPercent[j]).html(`<p>${start++}<span>%</span></p>`);
            if(start > percent) clearInterval(timer);
        },1200/percent);
    }

    function showElement (elements) {
        if(($(window).height() + $(window).scrollTop() - 100) > elements.offset().top) {
            let i = 0;
            let timer = setInterval(() => {
                $(elements[i]).addClass('showed');
                i++;
                if(i === elements.length) clearInterval(timer);
            },300);
        }
    }
    function showHeaders (element) {
        if(($(window).height() + $(window).scrollTop() - 50) > element.offset().top) {
            element.find('.hide').addClass('hide_start_animate');
            setTimeout(function () {
                element.find('h2, p').addClass('showed');
                element.find('.hide').addClass('hide_finish_animate');
            },300);
        }
    }

    function showSkills (skills) {
        if(!skillsShowed) {
            if(($(window).height() + $(window).scrollTop() - 200) > skills.offset().top) {
                skillsShowed = true;
                let i = 0;
                let timer = setInterval(() => {
                    $(skills[i]).addClass('showed');
                    animatePercents(i);
                    animateSkillsCircles(i);
                    i++;
                    if(i === skills.length) clearInterval(timer);
                },300);
            }
        }
    }
});

(function ($) {

    var self = this, container, running=false, currentY = 0, targetY = 0, oldY = 0, maxScrollTop= 0, minScrollTop, direction, onRenderCallback=null,
        fricton = 0.95, // higher value for slower deceleration
        vy = 0,
        stepAmt = 1,
        minMovement= 0.1,
        ts=0.1;

    var updateScrollTarget = function (amt) {
        targetY += amt;
        vy += (targetY - oldY) * stepAmt;

        oldY = targetY;

    }
    var render = function () {
        if (vy < -(minMovement) || vy > minMovement) {
            currentY = (currentY + vy);
            if (currentY > maxScrollTop) {
                currentY = vy = 0;
            } else if (currentY < minScrollTop) {
                vy = 0;
                currentY = minScrollTop;
            }

            $('html,body').scrollTop(-currentY);

            vy *= fricton;

            //   vy += ts * (currentY-targetY);
            // scrollTopTweened += settings.tweenSpeed * (scrollTop - scrollTopTweened);
            // currentY += ts * (targetY - currentY);

            if(onRenderCallback){
                onRenderCallback();
            }
        }
    }
    var animateLoop = function () {
        if(! running)return;
        requestAnimFrame(animateLoop);
        render();
        //log("45","animateLoop","animateLoop", "",stop);
    }
    var onWheel = function (e) {
        e.preventDefault();
        var evt = e.originalEvent;

        var delta = evt.detail ? evt.detail * -1 : evt.wheelDelta / 40;
        var dir = delta < 0 ? -1 : 1;
        if (dir != direction) {
            vy = 0;
            direction = dir;
        }

        //reset currentY in case non-wheel scroll has occurred (scrollbar drag, etc.)
        // console.log('--->', $('html,body').scrollTop());
        // setTimeout(function() {
        //     currentY = $('html,body').scrollTop();
        // }, 10)
        // console.log('--->', $('html,body').scrollTop());

        updateScrollTarget(delta);
    }

    /*
     * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
     */
    window.requestAnimFrame = (function () {
        return  window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };


    })();

    /*
     * http://jsbin.com/iqafek/2/edit
     */
    var normalizeWheelDelta = function () {
        // Keep a distribution of observed values, and scale by the
        // 33rd percentile.
        var distribution = [], done = null, scale = 30;
        return function (n) {
            // Zeroes don't count.
            if (n == 0) return n;
            // After 500 samples, we stop sampling and keep current factor.
            if (done != null) return n * done;
            var abs = Math.abs(n);
            // Insert value (sorted in ascending order).
            outer: do { // Just used for break goto
                for (var i = 0; i < distribution.length; ++i) {
                    if (abs <= distribution[i]) {
                        distribution.splice(i, 0, abs);
                        break outer;
                    }
                }
                distribution.push(abs);
            } while (false);
            // Factor is scale divided by 33rd percentile.
            var factor = scale / distribution[Math.floor(distribution.length / 3)];
            if (distribution.length == 500) done = factor;
            return n * factor;
        };
    }();


    $.fn.smoothWheel = function () {
        //  var args = [].splice.call(arguments, 0);
        var options = jQuery.extend({}, arguments[0]);
        return this.each(function (index, elm) {

            if(!('ontouchstart' in window)){
                container = $(this);
                container.bind("mousewheel", onWheel);
                container.bind("DOMMouseScroll", onWheel);

                //set target/old/current Y to match current scroll position to prevent jump to top of container
                targetY = oldY = container.scrollTop();
                currentY = -targetY;

                minScrollTop = container.clientHeight - container.scrollHeight;
                if(options.onRender){
                    onRenderCallback = options.onRender;
                }
                if(options.remove){
                    log("122","smoothWheel","remove", "");
                    running=false;
                    container.unbind("mousewheel", onWheel);
                    container.unbind("DOMMouseScroll", onWheel);
                }else if(!running){
                    running=true;
                    animateLoop();
                }

            }
        });
    };


})(jQuery);
