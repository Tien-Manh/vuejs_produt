<template>
   <div>
    <div class="flex flex-col justify-between lg:flex-row">
      <div class="flex flex-colum justify-center lg:w-5/12">
        <router-link
        to="/customer-add"
        class="w-full mb-4 text-center bg-orange-500 hover:bg-orange-600 px-6 py-2 leading-6 rounded-l-3xl text-white"
      >
        <span>Thêm</span>
      </router-link>
        <button @click="getAllCustomer"
        class="w-full mb-4 text-center bg-orange-500 hover:bg-orange-600 px-6 py-2 leading-6 rounded-r-3xl text-white"
      >
        <span>Hiển thị tất cả</span>
      </button>
      </div>
      <input
        v-model="keySearch"
        placeholder="Tìm kiếm"
        type="text"
        class="mt-2 lg:mt-0 lg:mb-4 bg-white focus:ring-0 placeholder-slate-400 rounded-2xl border-0 block lg:w-5/12"
      />
    </div>
    <div class="mt-2">
      <div class="flex flex-col lg:grid lg:gap-x-4 lg:gap-y-2 lg:grid-cols-2">
        <div
          class="card bg-white rounded-3xl p-3 mt-6"
          v-for="(item, key) in searchItems"
          :key="key"
        >
          <div class="flex flex-row overflow-hidden">
            <div class="image">
              <img class="rounded-2xl" :src="item.fileImage" alt="" />
            </div>
            <div class="ml-4 text-sm flex flex-col justify-between w-full">
              <div>
                <h3 class="break-all">{{ item.name }}</h3>
                <p class="mt-2">
                  Địa chỉ: <span>{{ item.address }}</span>
                </p>
                <p class="mt-2">
                  Điện thoại: <span>{{ item.phone }}</span>
                </p>
              </div>
              <div class="text-right">
                <button
                  @click="editItem(item.uuid)"
                  class="px-4 py-1 bg-orange-500 text-white rounded-xl text-sm mr-3 hover:bg-orange-600"
                >
                  <span>Sửa</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import getDatabase from "@/libs/getDatabase";
import { useRouter } from "vue-router";
import { computed, ref } from "vue";
export default {
  setup() {
    const { getAlldatabaseCustomer, items, getAllNotLimit} = getDatabase();
    const keySearch = ref("");
    const uuid = ref(null);
    const urlImg = ref(null);
    const router = useRouter();
    const showAllItem = ref(false);
    const searchItems = computed(() => {
      getAlldatabaseCustomer(keySearch.value.toLowerCase(), 'appjs/customers');
      if(showAllItem.value){
           getAllNotLimit( 'appjs/customers')
           showAllItem.value = false
      }
      if (items.value) {
        return items.value;
      }
    });
    function editItem(uuid) {
      router.push({ path: "/customer-list/edit", query: { uuid: uuid } });
    }
    function getAllCustomer() {
      showAllItem.value = true
    }
    return {
      searchItems,
      keySearch,
      editItem,
      getAllCustomer,
      showAllItem
    };
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