"use strict";

$(document).ready(function () {
    let skills = $('.skills__level'),
        skillPercent = skills.find('p'),
        menu = $('.header__menu-list'),
        menuItem = menu.find('header__menu-item'),
        portfolioButtons = $('.portfolio__button'),
        portfolioItems = $('.portfolio__item'),
        itemsAnimated = false,
        skillsShowed = false;



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
    
    menuItem.on('click', function () {
        console.log($(this))
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