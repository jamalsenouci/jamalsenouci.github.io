'use strict';
var animatedHeader = function() {
    var docElem = document.documentElement,
        header = document.querySelector('#header'),
        didScroll = false,
        changeHeaderOn = 10; 
    function init() {

        window.addEventListener( 'scroll', function() {
            if( !didScroll ) {
                didScroll = true;
                setTimeout( scrollPage, 250 );
            }
        }, false );
    }
 
    function scrollPage() {
        var sy = scrollY();
        if ( sy >= changeHeaderOn ) {
            header.classList.add('headerscroll');
        }
        
        else {
            header.classList.remove('headerscroll');
        }
        
        didScroll = false;
    }
 
    function scrollY() {
        return window.pageYOffset || docElem.scrollTop;
    }
 
    init();
 
};

animatedHeader();