"use strict";var animatedHeader=function(){function e(){window.addEventListener("scroll",function(){a||(a=!0,setTimeout(t,250))},!1)}function t(){var e=n();e>=c?o.classList.add("headerscroll"):o.classList.remove("headerscroll"),a=!1}function n(){return window.pageYOffset||r.scrollTop}var r=document.documentElement,o=document.querySelector("#header"),a=!1,c=10;e()};animatedHeader();