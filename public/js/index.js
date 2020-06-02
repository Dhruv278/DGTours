const hamberger=document.querySelector('.hamberger');
const Navlinks=document.querySelector('.navlinks');
const links=document.querySelectorAll('.navlinks li');
console.log('inside java script')

hamberger.addEventListener('click',()=>{
    Navlinks.classList.toggle('open');
})