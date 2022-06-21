import {ref} from 'vue'
import {auth, signInWithEmailAndPassword} from '@/configs/firebase.js'
const errMsg = ref(null)
 function sigIn(email, password) {
         signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            switch (errorCode){
                case 'auth/invalid-email':
                    errMsg.value = 'Chưa nhập tài khoản hoặc mật khẩu !'
                    break
                case 'auth/user-not-found':
                    errMsg.value = 'Tài khoản không tồn tại !'
                    break
                case 'auth/wrong-password':
                    errMsg.value = 'Sai mật khẩu !'
                    break
                default:
                    break
            }
        })
    }
    export function userAuth(){
        return { errMsg, sigIn}
    }


