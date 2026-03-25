import { create } from "zustand"
import { sendRequest } from "../utils/functions"

const useUserStore = create((set, get) => ({
  user: null,
  loading: true,

  fetchUser: async () => {

    set({ loading: true })

    try {

      const res = await sendRequest("GET", null, "/auth/me")

      if (res?.success && res?.user) {
        set({ user: res.user, loading: false })
      } 
      else if (res?.success && res?.data) {
        set({ user: res.data, loading: false })
      } 
      else {
        set({ user: null, loading: false })
      }

    } catch (error) {

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