<template>
  <div>
    <div class="flex flex-col justify-between">
      <router-link
        to="/list-add"
        class="w-full mb-4 text-center bg-orange-500 hover:bg-orange-600 px-6 py-2 leading-6 rounded-3xl text-white lg:w-4/12"
      >
        <span>Thêm</span>
      </router-link>
    </div>
    <div class="mt-2">
      <div class="flex flex-col  lg:grid lg:gap-x-4 lg:gap-y-2 lg:grid-cols-3">
        <div
          v-if="items"
          class="card bg-white rounded-3xl p-3 mt-6"
          v-for="(item, key) in items"
          :key="key"
        >
          <div class="flex flex-row overflow-hidden">
            <div class="ml-4 text-sm flex flex-col justify-between w-full">
              <div>
                <h3 class="break-all">{{ item.name }}</h3>
              </div>
              <div class="text-right"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import getDatabase from "@/libs/getDatabase";
import { computed, ref } from "vue";
export default {
  setup() {
    const { items, getAllNotLimit } = getDatabase();
    getAllNotLimit("appjs/lists");
    return { items };
  },
};
</script>
<style>
.image {
  width: 110px;
  height: 110px;
  min-width: 110px;
  overflow: hidden;
}
</style>
