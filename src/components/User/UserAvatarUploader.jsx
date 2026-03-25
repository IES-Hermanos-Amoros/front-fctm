import React, { useState, useEffect } from 'react'
import { sendRequest, showAlert, getBackendHost } from '../../utils/functions'

const UserAvatarUploader = ({ userId, avatarUrl, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // Limpiar estados cuando cambia el avatar real desde el backend
  useEffect(() => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl); // Liberar memoria del preview anterior
      setPreviewUrl(null);
    }
  }, [avatarUrl]);

  // 1. Construcción de la URL segura
  const host = getBackendHost(); // esto ya trae http:// o https://
  const defaultImage = "https://via.placeholder.com/120"; // Imagen por defecto
  
  const fullUrl = avatarUrl ? (avatarUrl.startsWith('http') ? avatarUrl : `${host}${avatarUrl}`) : defaultImage;

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

    setLoading(true);
    const formData = new FormData();
    
    formData.append('files', selectedFile); 
    formData.append('userId', userId);
    formData.append('type', 'AVATAR');
    formData.append('description', 'Foto de perfil de usuario');

    const res = await sendRequest("POST", formData, "/documents/upload", true);

    if (res.success) {
      showAlert("Avatar actualizado con éxito", "success");
      if (onUploadSuccess) onUploadSuccess(); // Esto dispara el fetchStudent() en el Show
    } else {
      showAlert(res.message || "Error al subir el avatar", "error");
      setSelectedFile(null);
      setPreviewUrl(null);
    }
    setLoading(false);
  };

  return (
    <div className="avatar-uploader-container" style={{ textAlign: 'center', padding: '20px' }}>
      <img 
        src={previewUrl || fullUrl} 
        alt="Avatar" 
        style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover' }} 
      />
      
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="d-flex flex-column align-items-center gap-2">
          <input 
            type="file" 
            onChange={handleFileChange} 
            accept="image/*"
            className="form-control form-control-sm"
            style={{ maxWidth: '250px' }}
          />
          
          {selectedFile && (
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
                {loading ? "Guardando..." : "Guardar Foto"}
              </button>
              <button 
                type="button" 
                className="btn btn-outline-danger btn-sm" 
                onClick={() => {setSelectedFile(null); setPreviewUrl(null)}}
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default UserAvatarUploader;