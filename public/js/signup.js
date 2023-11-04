



import axios from 'axios'
import { showAlert } from './alert'
export const signup=async(form)=>{
try {
    // console.log(form)
   const res=await axios.post('/api/v1/user/signup',form)


  
    if (res.data.status === 'success') {
        showAlert('success','sign In successfully!');
        window.setTimeout(() => {
            location.assign('/');
        }, 1500)
    }

} catch (err) {
    // console.log(err);
    
    showAlert('error',err.response.data.message)
    
}
}


