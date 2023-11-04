const hamburger=document.querySelector('.hamburgerbutton');
const navlinks=document.querySelector('.nav--links2')


hamburger.addEventListener('click',()=>{
    navlinks.classList.toggle('open')
})