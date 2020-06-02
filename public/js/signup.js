



import axios from 'axios'
import { showAlert } from './alert'
export const signup=async(form)=>{
try {
    
   const res=await axios.post('http://127.0.0.1:3000/api/v1/user/signup',form)


  
    if (res.data.status === 'success') {
        showAlert('success','sign In successfully!');
        window.setTimeout(() => {
            location.assign('/');
        }, 1500)
    }

} catch (err) {
    console.log(err);
    
    showAlert('error',err.response.data.message)
    
}
}


