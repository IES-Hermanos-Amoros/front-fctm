import { create } from "zustand"
import { sendRequest } from "../utils/functions"

const useUserStore = create((set, get) => ({
  user: null,
  loading: false,

  fetchUser: async () => {
    if (get().user) return

    set({ loading: true })

    try {
      const res = await sendRequest("GET", null, "/auth/me")

      console.log("Respuesta /auth/me:", res)

      if (res?.success && res?.user) {
        set({ user: res.user, loading: false })
      } 

      else if (res?.success && res?.data) {
        set({ user: res.data, loading: false })
      } 
      else {
        console.warn("No se pudo obtener el usuario correctamente")
        set({ user: null, loading: false })
      }

    } catch (error) {
      console.error("Error al obtener usuario:", error)
      set({ user: null, loading: false })
    }
  },

  clearUser: () => {
    set({ user: null })
  },

  isAuthenticated: () => {
    return !!get().user
  },

  getUserProfile: () => {
    return get().user?.profile || null
  }
}))

export default useUserStore