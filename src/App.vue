<template>
  <div class="main h-screen lg:w-10/12 lg:m-auto">
    <div
      class="article rounded-3xl h-full bg-stone-200 pb-20 overflow-hidden relative"
    >
      <router-view
        id="bouling"
        @scroll="getPosition"
        v-slot="{ Component }"
        class="cticle-v overflow-auto h-full px-4 bg-stone-200 rounded-3xl pt-8 pb-20 w-full"
      >
        <Transition :name="transitionDirective" >
          <component :is="Component"/>
        </Transition>
      </router-view>
    </div>
  </div>
  <footer-app v-if="isLogin == true" />
  <div>
    <button
      v-if="isButtonTop"
      @click="toTop"
      class="p-2 bg-orange-500 text-white fixed right-8 bottom-16"
    >
      <i class="fa-solid fa-arrows-to-dot"></i>
    </button>
  </div>
</template>
<script>
import { ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { auth } from "@/configs/firebase";
import SideBar from "@/components/shares/SideBar.vue";
import FooterApp from "@/components/shares/FooterApp.vue";
export default {
  components: { SideBar, FooterApp },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const isLogin = ref(false);
    const isButtonTop = ref(false);
    const transitionDirective = ref("swipe-right");
    const toDepth = ref(route.meta.depth);

    watch(route, () => {
      transitionDirective.value = toDepth.value < route.meta.depth ? "swipe-right" : "swipe-left";
      toDepth.value = route.meta.depth;
    });
    auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/login");
      } else {
        isLogin.value = true;
        if (route.path == "/login") {
          router.push("/");
        }
      }
    });

    function getPosition(evt) {
      isButtonTop.value = evt.target.scrollTop >= 450 ? true : false;
    }

    function toTop() {
      document
        .getElementById("bouling")
        .scrollTo({ top: 0, behavior: "smooth" });
    }
    return { isLogin, transitionDirective, toTop, getPosition, isButtonTop};
  },
};
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  overflow: hidden;
}
.swipe-left-enter-active,
.swipe-left-leave-active,
.swipe-right-enter-active,
.swipe-right-leave-active {
  transition: transform 0.3s ease-in-out;
}
.swipe-left-enter-from {
  transform: translateX(100%);
}
.swipe-left-enter-to {
  transform: translateX(0);
}
.swipe-left-leave-from {
  transform: translateX(0);
}
.swipe-left-leave-to {
  transform: translateX(-100%);
}

.swipe-right-enter-from {
  transform: translateX(-100%);
}
.swipe-right-enter-to {
  transform: translateX(0);
}
.swipe-right-leave-from {
  transform: translateX(0);
}
.swipe-right-leave-to {
  transform: translateX(100%);
}
.cticle-v {
  position: absolute;
}
</style>
