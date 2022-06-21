<template>
  <div>
    <form @submit.prevent="onSubmid" class="mx-auto">
      <h1 class="text-center text-orange-500 font-bold text-2xl mb-2">Thêm</h1>
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
          <span class="block">Địa chỉ</span>
          <input
            v-model="address"
            type="text"
            class="bg-white focus:ring-0 placeholder-slate-400 rounded-xl border-0 block w-full"
          />
        </label>
      </div>
      <div class="text-orange-500 mb-3">
        <label for="quantity" class="block">
          <span class="block">Số điện thoại</span>
          <input
            v-model="phone"
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
      </div>
      <div class="mt-4">
        <button
          v-if="isSuccess"
          class="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-3xl w-full lg:w-3/12"
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
    </form>
  </div>
</template>
<script>
import { ref } from "vue";
import databaseRecord from "@/libs/firebaseAdd";
export default {
  setup() {
    const { addRecord, addRecordImg } = databaseRecord();
    const name = ref("");
    const address = ref("");
    const phone = ref("");
    const fileImage = ref("");
    const filePath = ref("");
    const readFile = ref("");
    const errMsg = ref("");
    const isSuccess = ref(true);
    const colorClass = ref("text-pink-600 text-sm");

    async function changeImage(event) {
      const file = event.target.files[0];
      filePath.value = file;
      const reader = new FileReader();
      reader.onload = (res) => {
        readFile.value = res.target.result;
      };
      reader.readAsDataURL(file);
    }
    async function onSubmid() {
      errMsg.value = "";
      if (name.value == "" || address.value == "") {
        errMsg.value = "Lỗi chưa nhập tên hoặc địa chỉ !";
        colorClass.value = "text-pink-600 text-sm";
        return false;
      } else {
        isSuccess.value = false;
        if (filePath.value) {
          const url = await addRecordImg(filePath.value, "customers/");
          fileImage.value = url;
        }
        const records = {
          name: name.value.toLowerCase(),
          address: address.value,
          phone: phone.value ? phone.value : 0,
          fileImage: fileImage.value,
        };
        await addRecord(records, "appjs/customers");
        name.value = "";
        address.value = "";
        phone.value = "";
        fileImage.value = "";
        readFile.value = "";
        errMsg.value = "Thêm thành công !";
        colorClass.value = "text-green-400";
      }
      isSuccess.value = true;
    }
    return {
      onSubmid,
      changeImage,
      name,
      address,
      phone,
      readFile,
      errMsg,
      colorClass,
      filePath,
      isSuccess,
    };
  },
};
</script>
<style lang=""></style>
