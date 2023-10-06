import {defineStore} from "pinia";
import {ref} from "vue";

interface adminData {
    admin_id: string;
    name: string;
    account: string;
    point: number;
    route: number;
}
const LoginStore = defineStore(
  "login",
  () => {
    const admin = ref({
        admin_id: "",
        name: "",
        account: "",
        point: -1,
        route: -1,
    });
    const jwt = ref("");

    const setAdmin = (adminNew: adminData) => {
      admin.value = adminNew;
    }
    const setJwt = (jwtNew: string) => {
        jwt.value = jwtNew;
    }

    return {
        admin,
        jwt,

        setAdmin,
        setJwt,
    };
  },
  {
    persist: true,
  }
);

export default LoginStore;
