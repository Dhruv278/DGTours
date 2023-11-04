import axios from 'axios'
import {showAlert} from './alert'
export const updateme = async (data,type) => {
    // console.log('insidetry updateuser')
    try {
        // console.log(data)
const url = type==='password'?'/api/v1/user/updatePassword':'/api/v1/user/updateMe'

        const res = await axios({

            method: 'PATCH',
            url,
            data,
        })
        if (res.data.status === 'success') {
            showAlert('success', `${type.toUpperCase()}Update successfully!`,3);
            window.location.reload()
           
        }

    }
    catch (err) {

        showAlert('error', err.response.data.message);
        
    }


} 