import axios from "axios"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"



export const sendRequest = async (method, params, url, skipComponentReset = false, redir = '', mostrarMensaje = true) => {
    let res = {
        success: false,
        status: null,
        data: null,
        message: ""
    };

    try {

        console.log(method)
        console.log(url);
        console.log(params);

        const response = await axios({
            method,
            url,
            data: params,
            // withCredentials: true
        });

        console.log(response);

        // Caso éxito
        res.success = true;
        res.status = response.status;
        res.data = response.data.data ?? response.data;
        res.message = response.data.msg ?? response.data.message ?? "Operación exitosa";

        /*if (method !== "GET" && res.message && mostrarMensaje) {
            await showAlert(res.message, "success");
        }*/

        if (redir) {
            setTimeout(() => window.location.href = redir, 500);
        }

    } catch (error) {

        console.log("ERROR:");
        console.log(error);
        console.log(".......................");

        // Tabla de mensajes útiles según HTTP status
        const httpStatusMessages = {
            400: "Solicitud incorrecta (400)",
            401: "No autorizado (401)",
            403: "Acceso prohibido (403)",
            404: "Recurso no encontrado (404)",
            500: "Error interno del servidor (500)"
        };

        // --- Caso 1: El servidor respondió con código 4xx o 5xx ---
        if (error.response) {
            res.status = error.response.status;

            const backendMsg =
                error.response.data?.msg ||
                error.response.data?.message ||
                error.response.data?.error ||
                error.response.data?.error?.message ||
                error.response.data?.err ||
                error.response.data?.err?.message;
            
            //console.log("backendMsg:", backendMsg);
            
                // Obtén mensaje genérico según el código HTTP
            const genericMsg = httpStatusMessages[error.response.status] || "Error inesperado del servidor";

            // Combina el genérico con el detalle del backend si existe
            res.message = backendMsg ? `${genericMsg}:\n ${backendMsg}` : genericMsg;

            /*res.message =
                backendMsg ||
                httpStatusMessages[error.response.status] ||
                "Error inesperado del servidor";*/

            res.data = error.response.data;
        }

        // --- Caso 2: No hubo respuesta del servidor ---
        else if (error.request) {
            res.message = "El servidor no responde. Verifica tu conexión.";
        }

        // --- Caso 3: Error al preparar la solicitud ---
        else {
            res.message = error.message || "Error inesperado";
        }

        if(mostrarMensaje){
          showAlert(res.message, "error");
        }

        if (redir) {
            setTimeout(() => window.location.href = redir, 500);
        }
    }

    res.skipComponentReset = skipComponentReset;

    return res;
};



export const sendRequestOLDv2 = async (method, params, url, redir = '') => {
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

        console.log(response)

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
        console.log("ERROR:")
        console.log(error)
        console.log(".......................")

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


export function showAlertOLD(msg, iconImage, focusElem=""){
    const MySwal = withReactContent(Swal)
    return MySwal.fire({
        title:msg,
        icon:iconImage,
        buttonsStyling:true
    })
}

export function showAlert(msg, icon = "success") {

    const MySwal = withReactContent(Swal)

    return MySwal.fire({

        title: msg,
        icon,

        confirmButtonText: "Aceptar",

        buttonsStyling: false,

        customClass: {
            popup: "fctm-modal",
            confirmButton: "fctm-btn"
        }

    })
}


export const confirmationOLD = async (title = "¿Seguro que quieres eliminar este dato?") => {
  const alert = Swal.mixin({ buttonsStyling: true });

  const result = await alert.fire({
    title,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: '<i class="fa-solid fa-check"></i> Sí, eliminar',
    cancelButtonText: '<i class="fa-solid fa-ban"></i> Cancelar'
  });

  return result.isConfirmed; // 👉 DEVUELVE true o false
};

export const confirmation = async (
  title = "¿Seguro que quieres eliminar este dato?"
) => {
  const result = await Swal.fire({
    title,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Aceptar",
    cancelButtonText: "Cancelar",
    buttonsStyling: false,
    customClass: {
      popup: "fctm-modal",
      confirmButton: "fctm-btn",
      cancelButton: "fctm-btn-cancel",
      actions: "swal2-actions" // <--- Forzamos la clase del contenedor
    }
  });

  return result.isConfirmed;
};

/**
 * Solicita username y password mediante SweetAlert2.
 * Devuelve un objeto {username, password} si el usuario confirma,
 * o null si cancela.
 */
/*export const promptCredentials = async (mostrarCheckTodasFCTs = false) => {
    const MySwal = withReactContent(Swal);

    const { value: formValues } = await MySwal.fire({
        title: 'Autenticación SAO',
        html:
            '<input id="swal-username" class="swal2-input" placeholder="Usuario">' +
            '<input id="swal-password" type="password" class="swal2-input" placeholder="Contraseña">',
            mostrarCheckTodasFCTs ? '<input id="swal-todasFCTs" type="checkbox" class="swal2-input">':'',
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
};*/
export const promptCredentials = async (mostrarCheckTodasFCTs = false) => {
    const MySwal = withReactContent(Swal);

    const { value: formValues } = await MySwal.fire({
        title: 'Autenticación SAO',
        html: `
            <div style="position: relative; margin-bottom: 10px;">
                <input id="swal-username" class="swal2-input custom-input" placeholder="Usuario" style="margin: 0; width: 100%;">
            </div>
            
            <div style="position: relative;">
                <input id="swal-password" type="password" class="swal2-input custom-input" placeholder="Contraseña" style="margin: 0; width: 100%;">
                <i id="toggle-password-icon" class="bi bi-eye-slash" 
                   style="position: absolute; right: 20px; top: 50%; transform: translateY(-50%); cursor: pointer; z-index: 10; font-size: 1.2rem; color: #666;">
                </i>
            </div>
            
            ${
                mostrarCheckTodasFCTs
                    ? `
                    <div style="margin-top: 15px; text-align: left;">
                        <label style="display: flex; align-items: center; cursor: pointer; gap: 10px; font-size: 0.9rem; justify-content: flex-start;">
                            <input id="swal-todasFCTs" type="checkbox" style="margin: 0; width: auto; height: auto;">
                            <span style="color: #555;">Sincronizar Todas las FCTs (solo admin.)</span>
                        </label>
                    </div>
                    `
                    : ''
            }
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        didOpen: () => {
            const toggleIcon = document.getElementById('toggle-password-icon');
            const passwordInput = document.getElementById('swal-password');

            if (toggleIcon && passwordInput) {
                toggleIcon.addEventListener('click', () => {
                    const isPassword = passwordInput.type === 'password';
                    passwordInput.type = isPassword ? 'text' : 'password';
                    toggleIcon.classList.toggle('bi-eye');
                    toggleIcon.classList.toggle('bi-eye-slash');
                });
            }
        },
        preConfirm: () => {
            const username = document.getElementById('swal-username').value;
            const password = document.getElementById('swal-password').value;
            const todasFCTs = mostrarCheckTodasFCTs
                ? document.getElementById('swal-todasFCTs').checked
                : false;

            if (!username || !password) {
                Swal.showValidationMessage('Por favor ingresa usuario y contraseña');
                return false;
            }

            return { username, password, todasFCTs };
        }
    });

    if (!formValues) return null;
    return formValues;
};

export const promptCredentials_OLD = async (mostrarCheckTodasFCTs = false) => {
    const MySwal = withReactContent(Swal);

    const { value: formValues } = await MySwal.fire({
        title: 'Autenticación SAO',
        html: `
            <input id="swal-username" class="swal2-input custom-input" placeholder="Usuario">
            <input id="swal-password" type="password" class="swal2-input custom-input" placeholder="Contraseña">
            
            ${
                mostrarCheckTodasFCTs
                    ? `
                    <div class="swal-checkbox-container">
                        <label class="swal-checkbox">
                            <input id="swal-todasFCTs" type="checkbox">
                            <span>Sincronizar Todas las FCTs (solo admin.)</span>
                        </label>
                    </div>
                    `
                    : ''
            }
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const username = document.getElementById('swal-username').value;
            const password = document.getElementById('swal-password').value;
            const todasFCTs = mostrarCheckTodasFCTs
                ? document.getElementById('swal-todasFCTs').checked
                : false;

            if (!username || !password) {
                Swal.showValidationMessage('Por favor ingresa usuario y contraseña');
                return false;
            }

            return { username, password, todasFCTs };
        }
    });

    if (!formValues) return null; // usuario canceló
    return formValues;
};


export const normalizeFromApi = (data, configs = []) => {
  let normalized = { ...data };

    // Definimos la lógica de fecha internamente para usarla cuando se necesite
    const formatToInputDate = (value) => {
        if (!value || typeof value !== "string") return "";
        return value.includes("T") ? value.split("T")[0] : value;
    };

  configs.forEach(config => {
    const {
      field,
      options = [],
      optionValue = "_id",
      optionLabel = "label",
      type = "single"
    } = config;

    if (!normalized[field]) {
      normalized[field] = type === "multi" ? [] : null;
      return;
    }


    // --- NUEVA LÓGICA PARA FECHAS ---
    if (type === "date") {
      normalized[field] = formatToInputDate(normalized[field]);
      return;
    }

    if (type === "multi") {
      normalized[field] = normalized[field]
        .map(item => {

          // 🔥 Soporta ID simple o objeto populado
          const id = typeof item === "object" && item !== null
            ? item[optionValue]
            : item;

          const match = options.find(opt => opt[optionValue] === id);

          return match
            ? { value: match[optionValue], label: match[optionLabel] }
            : null;
        })
        .filter(Boolean);

    } else {
      const item = normalized[field];

      const id = typeof item === "object" && item !== null
        ? item[optionValue]
        : item;

      const match = options.find(opt => opt[optionValue] === id);

      normalized[field] = match
        ? { value: match[optionValue], label: match[optionLabel] }
        : null;
    }
  });

  return normalized;
};


export const normalizeToApi = (data, configs = []) => {
  let normalized = { ...data };

  configs.forEach(config => {
    const { field, type = "single" } = config;

    // SI EL CAMPO NO ESTÁ EN LOS DATOS QUE QUEREMOS ENVIAR, NO HACEMOS NADA
    if (!(field in normalized)) {
      return; 
    }

    if (!normalized[field]) {
      normalized[field] = type === "multi" ? [] : null;
      return;
    }

    if (type === "date") {
      // date input gives "YYYY-MM-DD" string — send as-is, Mongoose parses it
      return;
    }

    if (type === "multi") {
      normalized[field] = normalized[field].map(item => item.value);
    } else {
      normalized[field] = normalized[field]?.value || null;
    }
  });

  return normalized;
};

export const pickFCTMFields = (data) => {
  return Object.keys(data)
    .filter(key => key.startsWith("FCTM_"))
    .reduce((acc, key) => {
      acc[key] = data[key];
      return acc;
    }, {});
};

export const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Usamos HSL para asegurar que los colores sean legibles (Saturación 70%, Luminosidad 80% para tonos pastel)
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 70%, 85%)`; 
};


export const formatDateDDMMYYYY = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
};

export const formatDateDDMMYYYYHHmm = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  
  return date.toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false // Fuerza el formato de 24 horas
  }).replace(",", ""); // Opcional: elimina la coma que separa fecha y hora en algunos navegadores
};

/**
 * Genera la URL base del backend combinando el protocolo y el host de entorno.
 * @returns {string} URL completa (ej: https://api.tuweb.com)
 */
export const getBackendHost = () => {
    const host = import.meta.env.VITE_BASE_URL_BACKEND || '';
    // Intentamos obtener el protocolo, con un fallback a 'https' si la constante no existe
    const protocol = typeof __DEV_SERVER_PROTOCOL__ !== 'undefined' 
        ? __DEV_SERVER_PROTOCOL__ 
        : 'https';

    // Aseguramos que el protocolo termine en ://
    //const formattedProtocol = protocol.endsWith('://') ? protocol : `${protocol}://`;
    
    return `${protocol}${host}`;
};

export const validateStrongPassword = (password) => {
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._\-#])[A-Za-z\d@$!%*?&._\-#]{8,}$/;

  return strongPasswordRegex.test(password);
};

export const extractSkillNames = (skills) => {
  if (!skills) return [];

  return skills.map(s => {
    let name = null;

    if (typeof s === "string") name = s;
    else if (s.label) name = s.label;
    else if (s.FCTM_skill_name) name = s.FCTM_skill_name;

    return name ? name.trim().toUpperCase() : null;
  }).filter(Boolean);
};

export const ensureSkills = async (skills) => {

  const names = extractSkillNames(skills);

  const res = await sendRequest(
    "POST",
    { names },
    "/skills/ensure",
    false,
    "",
    false
  );

  if (!res.success) {
    throw new Error("Error ensuring skills");
  }

  return res.data; // ids
};



export const getProfilePath = (userRole, userId) => {
    switch (userRole) {
        case 'ADMINISTRADOR': return `/administrators/${userId}`;
        case 'PROFESOR':      return `/teachers/${userId}`;
        case 'ALUMNO':        return `/students/${userId}`;
        case 'EMPRESA':       return `/companies/${userId}`;
        default:              return '/dashboard';
    }
};


/**
 * Realiza el logout en el servidor y ejecuta las limpiezas locales.
 * @param {Function} clearUser - La función del store (Zustand) para limpiar datos.
 * @param {Function} navigate - La función de navegación de React Router.
 */
export const externLogout = async (clearUser, navigate) => {
    // 1. Llamada al servidor (usando tu sendRequest ya existente)
    // Pasamos mostrarMensaje=false porque solemos poner un Swal antes o no queremos ruido
    const res = await sendRequest("POST", null, "/auth/logout", false, "", false);

    if (res?.success) {
        // ◄ NUEVO: Limpiar por completo el sessionStorage del navegador (filtros, búsqueda, paginación...)
        sessionStorage.clear();

        // 2. Limpiar el store de Zustand
        if (typeof clearUser === 'function') {
            clearUser();
        }

        // 3. Redirigir al login o raíz
        if (typeof navigate === 'function') {
            navigate('/');
        }
        return true;
    }
    
    return false;
};