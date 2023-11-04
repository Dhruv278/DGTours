import '@babel/polyfill'
import { showAlert } from './alert'
import { login, logout } from './login'
import {signup} from './signup'
import { updateme } from './updateuser'
import {sendmail,reset} from './sendemail'
import { booktour } from './stripe'

const hamberger = document.querySelector('.hamberger');
const Navlinks = document.querySelector('.navlinks');
const links = document.querySelectorAll('.navlinks li');


hamberger.addEventListener('click', () => {
    Navlinks.classList.toggle('open');
})

if (document.querySelector('#loginForm')) {
// console.log('inside login')
    document.querySelector('#loginForm').addEventListener('submit', el => {
        el.preventDefault();
        const email = document.getElementById('exampleInputEmail1').value
        const password = document.getElementById('exampleInputPassword1').value
      
        login(email, password);
    })
}
if (document.querySelector('#signupForm')){
  
    document.querySelector('#signupForm').addEventListener('submit', async el => {
        el.preventDefault()
        const infile = document.querySelector('#inputImage')
        const email = document.querySelector('#exampleInputEmail1').value
        const password = document.querySelector('#exampleInputPassword1').value
        const confirm_password = document.querySelector('#exampleInputPassword2').value
        const name = document.querySelector('#inputName').value
        const form = new FormData();
        // console.log(infile.files[0])
        form.append('file', infile.files[0])
        form.append('email', email)
        form.append('password', password)
        form.append('confirm_password', confirm_password)
        form.append('name', name)

        signup(form);


    });
}

if (document.getElementById('logoutlink')) {
    document.getElementById('logoutlink').addEventListener('click', (e) => {

        logout()
    })
}

if(document.querySelector('.nav--links2')){
const hamburger=document.querySelector('.hamburgerbutton');
const navlinks=document.querySelector('.nav--links2')


hamburger.addEventListener('click',()=>{
    navlinks.classList.toggle('open')
})
}

if(document.querySelector('.form-user-data')){
    document.querySelector('#saveaccountsettings').addEventListener('click',(e)=>{
        e.preventDefault()
        const name=document.querySelector('#name').value
        const email=document.querySelector('#email').value
        const file=document.querySelector('#updatedimage').files[0]
        const form=new FormData()
        form.append('name',name)
        form.append('email',email)
        form.append('file',file)
        updateme(form,'data');
    })
}
if(document.querySelector('.form-user-settings')){
    document.getElementById('savepassword').addEventListener('click',async(e)=>{
        e.preventDefault();
        document.getElementById('savepassword').textContent='Updating..'
        const currentPassword=document.getElementById('password-current').value
        const Password=document.getElementById('password').value
       const confirm_password=document.getElementById('password-confirm').value

      await updateme({currentPassword,Password,confirm_password},'password')
      document.getElementById('password-current').value=''
      document.getElementById('password').value=''
      document.getElementById('password-confirm').value=''
      document.getElementById('savepassword').textContent='SAVE PASSWORD'
    })
}
if(document.querySelector('#ForgotPassForm')){

    document.querySelector('#ForgotPassButton').addEventListener('click',(e)=>{
        e.preventDefault()
        const email=document.getElementById('exampleInputEmail3').value;
       sendmail(email)
    
    })
}

if(document.querySelector('#resetpassForm2')){
    document.querySelector('#resetpassButton').addEventListener('click',(e)=>{
       e.preventDefault()
      const arr=JSON.stringify(window.location.pathname).split('/')
      const token=arr[2].replace('"','')
      const password=document.getElementById('resetpassword').value
      const confirm_password=document.getElementById('resetpassConfirm').value
reset(password,confirm_password,token)
    })
}

if(document.getElementById('bookTour')){
   
    document.getElementById('bookTour').addEventListener('click',(e)=>{
        e.target.textContent='Processing...'
        const { tourId }=e.target.dataset;
        booktour(tourId)

    })
}


const alertMessage=document.querySelector('body').dataset.alert
// console.log(alertMessage)
if(alertMessage) showAlert('success',alertMessage,10)