export const hide=()=>{
    const el =document.querySelector('.alert')
    if(el)el.parentElement.removeChild(el)
}


export const showAlert=(type,msg,time = 6)=>{
    hide()
    const markup=`<div class="alert alert--${type}">${msg}</div>`
    document.querySelector('body').insertAdjacentHTML('afterbegin',markup)
    window.setTimeout(hide,time*1000);
}