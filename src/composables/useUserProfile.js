import { onMounted, ref } from "vue";
import { getUserProfileByPK } from "../services/user-profile";

export default function useUserProfile(id) {
    const user = ref({
        id,
        email: null,
        bio: null,
        display_name: null,
        career: null,
    });
    const loading = ref(false);

    onMounted(async () => {
        try {
            loading.value = true;
            user.value = await getUserProfileByPK(id);
            loading.value = false;
        } catch (error) {
            // TODO...
        }
    });

    return {
        user,
        loading,
    }
}