<template>
  <div>
    <form v-if="onSetItem" @submit.prevent="onSubmid" class="mx-auto">
      <h1 class="text-center text-orange-500 font-bold text-2xl mb-2">Sửa</h1>
      <span :class="colorClass" v-if="errMsg" class="font-bold">{{
        errMsg
      }}</span>
      <div class="lg:grid lg:gap-x-4 lg:gap-y-2 lg:grid-cols-2">
      <div class="text-orange-500 mb-3">
        <label for="ten" class="block">
          <span class="block">Tên</span>
          <input
            v-model="name"
            type="text"
            class="bg-white focus:ring-0 placeholder-slate-400 rounded-xl border-0 block w-full"
          />
        </label>
      </div>
      <div class="text-orange-500 mb-3">
        <label for="price" class="block">
          <span class="block">Giá</span>
          <input
            v-model="price"
            type="number"
            class="bg-white focus:ring-0 placeholder-slate-400 rounded-xl border-0 block w-full"
          />
        </label>
      </div>
      <div class="text-orange-500 mb-3">
        <label for="quantity" class="block">
          <span class="block">Số lượng</span>
          <input
            v-model="quantity"
            type="number"
            class="bg-white focus:ring-0 placeholder-slate-400 rounded-xl border-0 block w-full"
          />
        </label>
      </div>
      <div class="flex flex-row cursor-pointer">
        <div class="text-orange-500 mb-3">
          <label for="file" class="block">
            <span class="block">Ảnh</span>
            <i class="fa-solid fa-image text-6xl cursor-pointer"></i>
            <input
              @change="changeImage"
              type="file"
              id="file"
              accept="image/*;capture=camera"
              class="w-0 h-0 overflow-hidden absolute"
            />
          </label>
        </div>
        <div class="pl-10" v-if="readFile" style="width: 220px; height: auto">
          <img class="rounded-xl" :src="readFile" />
        </div>
      </div>
      <div class="camera" v-if="!isMobile">
        <camera-open @SnapShotImage="changeImageSnap" />
      </div>
      <div class="mt-4">
        <button
          v-if="isSuccess"
          class="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-3xl w-full"
        >
          Lưu
        </button>
        <div
          v-else
          class="relative px-5 py-2 bg-orange-500 hover:bg-orange-600 text-center text-white rounded-3xl w-full"
        >
          Đang tải . . .
          <span
            class="opacity-100 loader animation-spin h-3 w-3 bg-transparent absolute text-left box-border transition-all duration-500 ease-in-out mx-auto rounded-full"
          >
          </span>
        </div>
      </div>
      </div>
    </form>
  </div>
</template>
<script>
import CameraOpen from "./children/CameraOpen";
import { ref, onMounted, computed } from "vue";
import databaseRecord from "@/libs/firebaseAdd";
import getDatabase from "@/libs/getDatabase";
import { useRoute } from "vue-router";
export default {
  components: {
    CameraOpen,
  },
  setup() {
    const { getOneDatabaseByUuid, items } = getDatabase();
    const { updateRecord, removeRecordImage, addRecordImg } = databaseRecord();
    const route = useRoute();
    const name = ref("");
    const price = ref("");
    const quantity = ref("");
    const fileImage = ref("");
    const filePath = ref("");
    const readFile = ref("");
    const isMobile = ref(false);
    const errMsg = ref("");
    const isSuccess = ref(true);
    const colorClass = ref("text-pink-600 text-sm");
    const uuid = route.query.uuid;
    getOneDatabaseByUuid(uuid, 'appjs/products');
    onMounted(() => {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent )) {
        return (isMobile.value = true)} else {
        return (isMobile.value = false)}
    });
    const onSetItem = computed(() => {
        if (items.value) {
            name.value = items.value.name
            price.value = items.value.price
            quantity.value = items.value.quantity
            fileImage.value = items.value.fileImage
            readFile.value = items.value.fileImage
            return true
      }
    })
    async function changeImage(event) {
      const file = event.target.files[0];
      filePath.value = file;
      const reader = new FileReader();
      reader.onload = (res) => {
        readFile.value = res.target.result;
      };
      reader.readAsDataURL(file);
    }
    async function changeImageSnap(file) {
      filePath.value = file;
    }

    async function onSubmid() {
        errMsg.value = "";
      if (name.value == "" || price.value == "") {
        errMsg.value = "Lỗi chưa nhập tên hoặc giá !";
        colorClass.value = "text-pink-600 text-sm";
        return false;
      } else {
        isSuccess.value = false;
        if (filePath.value) {
            const oldUrl = fileImage.value
           if(oldUrl){
                await removeRecordImage(oldUrl)
           }  
            const url = await addRecordImg(filePath.value, 'products/');
            fileImage.value = url;
        }
        const records = {
          name: name.value.toLowerCase(),
          price: price.value,
          quantity: quantity.value ? quantity.value : 0,
          fileImage: fileImage.value,
        };
        await updateRecord(records, uuid, 'appjs/products/');
        errMsg.value = "Sửa thành công !";
        colorClass.value = "text-green-400";
      }
      isSuccess.value = true;
    }

    return {
      getOneDatabaseByUuid,
      onSubmid,
      changeImage,
      name,
      price,
      quantity,
      readFile,
      changeImageSnap,
      isMobile,
      errMsg,
      colorClass,
      filePath,
      isSuccess,
      onSetItem
    };
  },
};
</script>
<style>
.loader {
  right: 7rem;
  top: 50%;
  border-top: 2px solid #fff;
  border-left: 2px solid #fff;
  border-bottom: 2px solid #fff;
  border-right: 2px solid rgba(#fff, 0.35);
}

.animation-spin {
  animation-name: spin;
  animation-duration: 0.75s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

@keyframes spin {
  from {
    transform: translateY(-50%) rotate(0deg);
  }
  to {
    transform: translateY(-50%) rotate(360deg);
  }
}
</style>
