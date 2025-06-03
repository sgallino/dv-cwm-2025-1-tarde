import { nextTick } from "vue";

export default async function useScroll(templateRef) {
    async function moveScrollToBottom() {
        console.log("Template ref: ", templateRef);
        await nextTick();
        templateRef.value.scrollTop = templateRef.value.scrollHeight;
    }

    return {
        moveScrollToBottom,
    }
}