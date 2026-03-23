import React, { useState } from 'react'

const UserAvatarUploader = ({ userId, avatarUrl }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // 1. Construcción de la URL según requisitos
  let host = import.meta.env.VITE_BASE_URL_BACKEND;
  const protocol = window.location.protocol.replace(':', ''); // 'http' o 'https'
  const defaultImage = "https://via.placeholder.com/120"; // Imagen por defecto
  
  const fullUrl = avatarUrl ? `${protocol}://${host}${avatarUrl}` : defaultImage;

  // 2. Manejo del archivo seleccionado
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Crea preview temporal
    }
  };

  // 3. Envío al Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('files', selectedFile);
    formData.append('userId', userId);
    formData.append('type', 'AVATAR');
    formData.append('visible_to_profiles', JSON.stringify(["ADMINISTRADOR","PROFESOR","ALUMNO","EMPRESA"]));

    try {
      // Aquí harías el fetch o axios.post('/documents/upload', formData)
      console.log("Enviando archivo para el usuario:", userId);
      // Tras el éxito, podrías limpiar el preview o avisar al usuario
    } catch (error) {
      console.error("Error al subir", error);
    }
  };

  return (
    <div className="avatar-uploader-container" style={{ textAlign: 'center', padding: '20px' }}>
      <img 
        src={previewUrl || fullUrl} 
        alt="Avatar" 
        style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover' }} 
      />
      
      <form onSubmit={handleSubmit} style={{ marginTop: '10px' }}>
        <input 
          type="file" 
          onChange={handleFileChange} 
          accept="image/*"
          className="form-control" 
        />
        <div style={{ marginTop: '10px' }}>
          <button type="submit" className="btn btn-primary">Guardar Cambios</button>
          <button type="button" className="btn btn-danger" onClick={() => {setSelectedFile(null); setPreviewUrl(null)}}>
            Eliminar
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserAvatarUploader

/* 

Vas a crear un COMPONENTE genérico reutilizable llamado UserAvatarUploader, que se encargará de mostrar el avatar del usuario (Alumno, Profesor, Administrador o Empresa) y permitir al usuario subir una nueva imagen de avatar o eliminar la imagen actual.
Este componente se usará en los SHOW de Alumnos, Profesores, Administradores y Empresas, justo debajo del ShowHeader y antes del primer ShowEditableForm (SAO).

¿Dónde usarlo en los SHOW de Alumnos, Profesores, Administradores y Empresas?

ShowStudent/Company/Teacher/Admin...
   │
   ├── ShowHeader
   │
   ├── UserAvatarUploader   👈 AQUÍ
   │
   ├── ShowEditableForm (SAO)
   │
   └── ShowEditableForm (FCTM)

NO HAY QUE TOCAR nada en el ShowEditableForm, solo añadir el componente UserAvatarUploader entre el ShowHeader y el primer ShowEditableForm. Lo mismo para los otros SHOWs de Profesores, Administradores y Empresas.

Controles de este componente:

<img> IMAGEN actual del avatar (si existe) o una imagen por defecto si no existe.
INPUT type="file" para subir la imagen, con un preview de la imagen actual (si existe) y un botón para eliminar la imagen (que pondría el avatar a null o a una imagen por defecto).
INPUT type="submit" para guardar los cambios, que haría una petición al backend para actualizar el avatar del usuario.


CSS: Estilos iguales que el resto de botones e inputs de la aplicación.

Endpoint del backend para actualizar el avatar: 
    POST /documents/upload
Body:
    files --> Archivo de la imagen subida
    userId --> id del usuaio de MongoDB que viene del Show (useParams) - Tendrás que pasarlo como PROP al componente UserAvatarUploader desde el Show
    type=AVATAR --> Importante: El tipo del archivo debe ser AVATAR
    visible_to_profiles=["ADMINISTRADOR","PROFESOR","ALUMNO","EMPRESA"] --> Visible para todos los perfiles

Ejemplo de llamada a este componente desde el ShowStudent:

<UserAvatarUploader
  userId={data._id}
  avatarUrl={data.avatarUrl}
/>

avatarUrl es la URL del avatar actual del usuario, que se muestra en el componente. Si no existe, se muestra una imagen por defecto.
Esta URL vendrá del BackEnd, después de hacer GET /students/:id GET/comanies/:id, GET/admins/:id y GET/teachers/:id. 
Tras esta llamada, debería venir el array de FCTM_Documents con populate desde el backend y la información de la URL de los documentos. Si no es así, MODIFICA EL BACKEND para aplicar dicho POPULATE.
Una vez obtenido el array de FCTM_Documents asociados al usuario, hay que filtrar el array para obtener solo el documento de tipo AVATAR (FCTM_document_type = "AVATAR") y mostrar su URL en el componente UserAvatarUploader. Si no existe ningún documento de tipo AVATAR, se muestra la imagen por defecto.

Ejemplo de resultado posible:

{
 "_id":"...",
 "SAO_name":"Miguel",
 "avatarUrl":"/uploads/avatar_123.png"
}

La url del avatar es relativa al backend, por lo que para mostrarla en el frontend hay que concatenar la URL base del backend con la URL relativa del avatar. Por ejemplo, si el backend está en http://localhost:5000 y la URL relativa del avatar es /uploads/avatar_123.png, la URL completa para mostrar el avatar sería http://localhost:5000/uploads/avatar_123.png.
En nuestro caso, deberás contatenarla de esta forma:

let host = import.meta.env.VITE_BASE_URL_BACKEND
const protocol = __DEV_SERVER_PROTOCOL__  // 'http' o 'https'
host = `${protocol}${host}${avatarUrl}`

Es sólo de esta forma como se mostraría el avatar en el componente UserAvatarUploader, utilizando la URL completa del avatar obtenida del backend.


NO TOQUES el NavBar todavía, pues antes se deben realizar unas implementaciones con Zustand para gestionar el usuario logueado y su avatar, y que el NavBar se actualice automáticamente al cambiar el avatar del usuario. Esto lo haremos en una siguiente iteración, una vez que el componente UserAvatarUploader esté funcionando correctamente en los SHOWs de Alumnos, Profesores, Administradores y Empresas.
NO SUBAS cambios realizados en los Show de Alumno, Profesor, Administrador y Empresa. Estos cambios quédatelos para hacer tus pruebas.

Pequeño croquis del componente, usándolo dentro de los Show...

┌───────────────────────────────────────────────┐
│       SHOW STUDENT/TEACHER/ADMIN/COMPANY      │
└───────────────────────────────────────────────┘


            ┌──────────────────────┐
            │                      │
            │      ( FOTO )        │
            │                      │
            │      120 x 120       │
            │    border-radius     │
            │                      │
            └──────────────────────┘

                [ Subir nueva foto ]

              ┌───────────────────┐
              │   Elegir archivo  │
              └───────────────────┘

                     [ Subir ]



*/