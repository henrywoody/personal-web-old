// // Hide Header on on scroll down
// var didScroll;
// var lastScrollTop = 0;
// var delta = 10;
// var navbarHeight = $('header').outerHeight();

// $(window).scroll(function(event){
//     didScroll = true;
// });

// setInterval(function() {
//     if (didScroll) {
//         hasScrolled();
//         didScroll = false;
//     }
// }, 250);

// function hasScrolled() {
//     var st = $(this).scrollTop();
    
//     // Make sure they scroll more than delta
//     if(Math.abs(lastScrollTop - st) <= delta)
//         return;
    
//     // If they scrolled down and are past the navbar, add class .nav-up.
//     // This is necessary so you never see what is "behind" the navbar.
//     if (st > lastScrollTop && st > navbarHeight){
//         // Scroll Down
//         $('header').switchClass('nav-down', 'nav-up', 300, "easeInOutQuad");
//     } else {
//         // Scroll Up
//         if(st + $(window).height() < $(document).height()) {
//             $('header').switchClass('nav-up', 'nav-down', 300, "easeInOutQuad");
//         }
//     }
    
//     lastScrollTop = st;
// }

function toggleNavDrawer() {
    var nav = $('nav.drawer')[0];
    if (nav.style.width == "" || nav.style.width == "0px") {
        nav.style.width = "45%";
    } else {
        nav.style.width = "0";
    }
}