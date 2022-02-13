// Declarations
let generateBtnEl = document.getElementById('generate-btn');
let marketplaceBtnEl = document.getElementById('marketplace-btn');
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

// Generate Button
generateBtnEl.addEventListener('click',function(){
    window.location.href = 'generate.html';
})

marketplaceBtnEl.addEventListener('click',function(){
    window.location.href = 'marketplace.html';
})

// Callings
navbarBurger();