// Functions
// Navbar Burger
function navbarBurger(){
    var burger = document.querySelector('.burger');
    var nav = document.querySelector('#'+burger.data)

    burger.addEventListener('click', function(){
        burger.classList.toggle('is-active');
        nav.classList.toggle('is-active');
    })
}

// Callings
navbarBurger();