import { create } from "zustand";
import { sendRequest } from "../utils/functions";

const useEnumStore = create((set, get) => ({
  enums: {},  

  cargarEnums: async () => {
    const res = await sendRequest("GET",null, "/enums");

    if (res.success) {
      set({ enums: res.data }); 
    }
  },

  //helper para obtener un array específico de un enumerado por su nombre
  getEnumArray: (name) => {
    const enums = get().enums;
    return enums[name] || []; 
  }
}))

export default useEnumStore;


