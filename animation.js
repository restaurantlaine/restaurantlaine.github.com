function slideSwitch() {
    var active = $('#slideshow img.active');

    if ( active.length == 0 ) active = $('#slideshow img:last');
    
    var sibs  = active.siblings();
    var rndNum = Math.floor(Math.random() * sibs.length );
    var next  = $( sibs[ rndNum ] );


    active.addClass('last-active');

    next.css({opacity: 0.0})
        .addClass('active')
        .animate({opacity: 1.0}, 1500, function() {
            active.removeClass('active last-active');
        });
}

$(function() {
    setInterval( "slideSwitch()", 6000 );
});