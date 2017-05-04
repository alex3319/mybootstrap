/**
 * Место для скриптов.
 */

$(document).ready(function () {

    $('.burger_deluxe').on('click', function () {
        console.log(this);
        $(this).toggleClass('open');
        $('.overlay').toggleClass('open');
        $('header').toggleClass('bgStyle2');
        $('html').toggleClass('noScroll');
    });
    $(".link-wrapper a").on('click', function () {
        console.log(this);

        $(".overlay").removeClass("open");
        $(".burger_deluxe").removeClass("open");
        $("html").removeClass("noScroll");
    });
});
