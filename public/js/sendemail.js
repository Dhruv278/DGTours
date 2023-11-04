import axios from 'axios'
import { showAlert } from './alert'


export const sendmail = async (email) => {
    try {
      
        const result = await axios({
            method: 'POST',
            url: '/api/v1/user/forgotPassword',
            data: {
                email: email
            }

        })
    
        
        if (result.data.status === 'success') {
            showAlert('success', 'We send Mail On your Account ,Please check!');
           
        }

    } catch (err) {
            // console.log(err.response)
        showAlert('error', err.response.data.message);
    }
}

export const reset=async(Password,confirm_password,token)=>{
    try{
        // console.log('inside heloo')
const res=await axios({
    method:'patch',
    url:`/api/v1/user/resetPassword/${token}`,
    data:{
        password:Password,
        confirm_password:confirm_password
    }
})

  
if (res.data.status === 'success') {
    showAlert('success', 'Your Password has been changed');
    window.setTimeout(() => {
        location.assign('/');
    }, 1500)
   
}

} catch (err) {

showAlert('error', err.response.data.message);
}
}