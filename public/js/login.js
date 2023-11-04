
import axios from 'axios'
import { showAlert } from './alert'
export const login = async (email, password) => {
    try {
        // console.log('insidetry')
        const res = await axios({
            method: 'POST',
            url: '/api/v1/user/login',
            data: {
                email,
                password
            }
        })
        // console.log(res.data.status);
        if (res.data.status === 'success') {
            showAlert('success', 'log In successfully!');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500)
        }

    } catch (err) {

        showAlert('error', err.response.data.message);
    }
}


export const logout =async () => {
    try {
      
        const res = await axios({
            method: 'GET',
            url: '/api/v1/user/logout',
            
        })
        // console.log(res.data.status);
        if (res.data.status === 'success') {
            location.reload(true)
        }

    } catch (err) {
  showAlert('error','opps Somthing is wrong please try again!');
    }


}