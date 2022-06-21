<template>
    <div class="container m-auto pt-16">
            <form @submit.prevent="onSubmib" class="mx-auto w-80">
                <h1 class="text-center text-orange-500	font-bold text-2xl mb-6">Đăng nhập</h1>
                <span class="text-pink-600 text-sm" v-if="errMsg">{{errMsg}}</span>
                <div class="mt-3">
                    <label for="email" class="block text-orange-500">
                        <span class="block mb-2">Email</span>
                        <input v-model="email" type="email" class="mt-1 px-3 py-2 rounded-2xl bg-white w-full border-0 focus:ring-0 peer">
                          <p v-if="email" class="mt-2 invisible peer-invalid:visible text-pink-600 text-sm mb-2">
                            Sai định dạng email.
                            </p>
                    </label>
                </div>
                <div class="mt-3">
                    <label for="email" class="block text-orange-500">
                        <span class="block mb-2">Mật khẩu</span>
                        <input v-model="password" type="password" class="mt-1 px-3 py-2 rounded-3xl bg-white border-0 s w-full  focus:ring-0">
                    </label>
                </div>
                <div class="mt-6">
                    <button class="bg-orange-500 hover:bg-orange-600 px-5 py-3 text-sm leading-5 rounded-3xl w-full text-white">
                    Đăng nhập
                    </button>
                </div>
        </form>
    </div>
</template>
<script>
import {ref} from 'vue'
import {userAuth} from '@/libs/signUp'
import {useRouter} from 'vue-router'
export default {
    setup(){
        const email = ref('')
        const password = ref('')
        const router = useRouter()
        const {errMsg, sigIn} = userAuth()
        function onSubmib() {
           sigIn(email.value, password.value)
           if(errMsg.value == 'true') {
               router.push('/')
           }
        }
        return {errMsg, email, password, onSubmib}
    }
}
</script>
<style lang="">
    
</style>