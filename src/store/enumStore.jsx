import { create } from "zustand";
import { sendRequest } from "../utils/functions";

const useEnumStore = create((set, get) => ({
  enums: {},   // aquí guardaremos el objeto completo de enumerados

  cargarEnums: async () => {
    const res = await sendRequest("GET",null, "/enums");

    if (res.success) {
      set({ enums: res.data }); // res.data es un OBJETO con todos los arrays
    }
  },

  //helper para obtener un array específico de un enumerado por su nombre
  getEnumArray: (name) => {
    const enums = get().enums;
    return enums[name] || []; // devuelve el array del enumerado solicitado
  }
}))

export default useEnumStore;


