var stripe = Stripe('pk_test_PQx2unnyvGEYPS4RtB7SZFi100MGk3TvLk');
import axios from 'axios'
import { showAlert } from './alert';
export const booktour= async(tourid)=>{
  
    try{
    const session=await axios(`/api/v1/booking//checkout-session/${tourid}`)


    stripe.redirectToCheckout({
        sessionId:session.data.data.session.id
    })
}catch(err){
    showAlert('error',err)
}
}