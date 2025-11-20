import axios from "axios"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

export const sendRequest = async (method, params, url, redir = '') => {
    let res = {
        success: false,
        status: null,
        data: null,
        message: ""
    };

    try {

        console.log(url)
        console.log(params)

        const response = await axios({
            method,
            url,
            data: params,
            // withCredentials: true // Si más adelante necesitas cookies
        });

        // Detecta automáticamente msg o data desde el backend
        res.success = true;
        res.status = response.status;
        res.data = response.data.data ?? response.data; // si el backend envía {data:...}
        res.message = response.data.msg ?? response.data.message ?? "Operación exitosa";

        // Mostrar alerta solo si hay mensaje y no es GET
        if (method !== "GET" && res.message) {
            showAlert(res.message, "success");
        }

        if (redir) {
            setTimeout(() => window.location.href = redir, 500);
        }
    } catch (error) {
        // Error de servidor o de red
        if (error.response && error.response.data) {
            res.status = error.response.status;
            res.data = error.response.data.data ?? error.response.data;
            res.message = error.response.data.msg 
                        ?? error.response.data.message 
                        ?? error.response.data.error?.message 
                        ?? error.response.data.error 
                        ?? "Error desconocido";
        } else {
            res.message = error.message ?? "Error desconocido";
        }

        showAlert(res.message, "error");

        if (redir) {
            setTimeout(() => window.location.href = redir, 500);
        }
    }

    return res;
};


export const sendRequestOLD = async(method,params,url,redir='',token=true)=>{
    /*if(token){
        const authToken = storage.get("authToken")
        console.log("AuthToken Bearer to send: " + authToken)
        //axios.default.headers.common["Authorization"] = "Bearer " + authToken //NO FUNCIONA!!
        axios.defaults.headers = {
            Authorization: 'Bearer ' + authToken
        }
    }*/

    //axios.defaults.withCredentials = true

    console.log("SEND REQUEST")
    console.log(method)
    console.log(url)
    console.log(params)
    let res = null
    //await axios({method:method,url:url,data:params, withCredentials:true}).then(
    await axios({method:method,url:url,data:params}).then(
        response => {
            //Cualquier EXITO con código 200, entrará aquí
            console.log("INI SERVICES")
            console.log(response.data)
            console.log("FIN SERVICES")
            res = response.data,
            (method != "GET") ? showAlert(response.data.msg, "success"):"",
            setTimeout(()=>           
            (redir !== "") ? window.location.href = redir: "", 500)
        }).catch((errors)=>{
            //Cualquier error de servidor (400,401,404,500...) entrará aquí
            //console.log(err)
            //let desc = ""
            //res = response.data.error.errors,
            //response.data.error.errors.map((e)=>{desc = desc + " " + e})
            //res = response.data   
            //res = err         
            //showAlert(desc,"error")
            //showAlert(response.data.error.message,"error")

            //Cualquier error de servidor (400,401,404,500...) entrará aquí
            console.log("ERROREEEEEESSSS")
            console.log(errors)
            //////errors.response.data.error

            //let desc = errors.response.data.error.message || errors.response.data.error || errors.message
            let desc = ""
            if(errors.response && errors.response.data.error){
                if(errors.response.data.error.message){
                    desc = errors.response.data.error.message
                }else{
                    desc = errors.response.data.error
                }
                res = errors.response.data
            }else if(errors.message){
                desc = errors.message
                res = errors
            }

            //errors.response.data.errors.map((e)=>{desc = desc + " " + e})            
            console.log(desc)
            showAlert(desc,"error")
            
            setTimeout(()=>           
            (redir !== "") ? window.location.href = redir: "", 500)
        })
       

    return res
}


export function showAlert(msg, iconImage, focusElem=""){
    const MySwal = withReactContent(Swal)
    MySwal.fire({
        title:msg,
        icon:iconImage,
        buttonsStyling:true
    })
}


export const confirmation = async(name,url,redir)=>{
    const alert= Swal.mixin({buttonsStyling:true})
    alert.fire({
        title:"Seguro que desea eliminar '" + name + "'?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-check"></i> Sí, elminar',
        cancelButtonText: '<i class="fa-solid fa-ban"></i> Cancelar'
    }).then((result)=>{
        if(result.isConfirmed){
            sendRequest("DELETE",{},url,redir)
        }
    })
}

/**
 * Solicita username y password mediante SweetAlert2.
 * Devuelve un objeto {username, password} si el usuario confirma,
 * o null si cancela.
 */
export const promptCredentials = async () => {
    const MySwal = withReactContent(Swal);

    const { value: formValues } = await MySwal.fire({
        title: 'Autenticación SAO',
        html:
            '<input id="swal-username" class="swal2-input" placeholder="Usuario">' +
            '<input id="swal-password" type="password" class="swal2-input" placeholder="Contraseña">',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const username = document.getElementById('swal-username').value;
            const password = document.getElementById('swal-password').value;
            if (!username || !password) {
                Swal.showValidationMessage('Por favor ingresa usuario y contraseña');
            }
            return { username, password };
        }
    });

    if (!formValues) return null; // usuario canceló
    return formValues;
};