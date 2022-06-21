<template>
  <div>
    <form @submit.prevent="onSubmid" class="mx-auto">
      <h1 class="text-center text-orange-500 font-bold text-2xl mb-2">Thêm</h1>
      <span :class="colorClass" v-if="errMsg" class="font-bold">{{
        errMsg
      }}</span>
      <div class=" lg:grid lg:gap-x-4 lg:gap-y-2 lg:grid-cols-2">
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
import { ref } from "vue";
import databaseRecord from "@/libs/firebaseAdd";
export default {
  setup() {
    const { addRecord } = databaseRecord();
    const name = ref("");
    const errMsg = ref("");
    const isSuccess = ref(true);
    const colorClass = ref("text-pink-600 text-sm");

    async function onSubmid() {
      errMsg.value = "";
      if (name.value == "") {
        errMsg.value = "Lỗi chưa nhập tên !";
        colorClass.value = "text-pink-600 text-sm";
        return false;
      } else {
        isSuccess.value = false;
        const records = {
          name: name.value.toLowerCase(),
        };
        await addRecord(records, "appjs/lists");
        name.value = "";
        errMsg.value = "Thêm thành công !";
        colorClass.value = "text-green-400";
      }
      isSuccess.value = true;
    }
    return {
      onSubmid,
      name,
      errMsg,
      colorClass,
      isSuccess,
    };
  },
};
</script>
<style lang=""></style>
