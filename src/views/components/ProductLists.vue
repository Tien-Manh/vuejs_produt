<template>
  <div>
    <div class="flex flex-col justify-between lg:flex-row">
      <router-link
        to="/product-add"
        class="mb-4 text-center bg-orange-500 hover:bg-orange-600 px-6 py-2 leading-6 rounded-3xl text-white lg:w-5/12"
      >
        <span>Thêm</span>
      </router-link>
      <input
        v-model="keySearch"
        placeholder="Tìm kiếm"
        type="text"
        class="mt-2 lg:mt-0 lg:mb-4 bg-white focus:ring-0 placeholder-slate-400 rounded-2xl border-0 block lg:w-5/12"
      />
    </div>
    <div class="mt-2">
      <div class="flex flex-col  lg:grid lg:gap-x-4 lg:gap-y-2 lg:grid-cols-2">
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
                  Số lượng: <span>{{ item.quantity }}</span>
                </p>
                <p class="mt-2">
                  Giá: <span>{{ item.price }} VNĐ</span>
                </p>
              </div>
              <div class="text-right">
                <button
                  @click="editItem(item.uuid)"
                  class="px-4 py-1 bg-orange-500 text-white rounded-xl text-sm mr-3 hover:bg-orange-600"
                >
                  <span>Sửa</span>
                </button>
                <button
                  @click="removeItem(item.uuid, item.fileImage)"
                  class="px-4 py-1 bg-orange-500 text-white rounded-xl text-sm hover:bg-orange-600"
                >
                  <span>Xoá</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Transition name="fade">
    <alert-vue
      v-if="isAlert"
      @Confirm-Send-Data="isConfirmSendData"
    ></alert-vue>
    </Transition>
  </div>
</template>
<script>
import getDatabase from "@/libs/getDatabase";
import databaseRecord from "@/libs/firebaseAdd";
import AlertVue from "@/views/components/libs/AlertVue";
import { useRouter } from "vue-router";
import { computed, ref, onMounted, watch } from "vue";
export default {
  components: { AlertVue },
  setup() {
    const { getAlldatabase, items } = getDatabase();
    const { removeReocord } = databaseRecord();
    const keySearch = ref("");
    const isAlert = ref(false);
    const uuid = ref(null);
    const urlImg = ref(null);
    const router = useRouter();
    onMounted(() => {
      getAlldatabase(keySearch.value.toLowerCase(), 'appjs/products');
    })
    watch(keySearch, () => {
       getAlldatabase(keySearch.value.toLowerCase(), 'appjs/products');
    })
    const searchItems = computed(() => {
        return items.value;
        //   return items.value.filter(res => {
        //   return String(res.name).toLowerCase().includes(keySearch.value.toLowerCase())
        //   })
    });
    function editItem(uuid) {
      router.push({ path: "/product-list/edit", query: { uuid: uuid } });
    }
    function removeItem(key, img) {
      isAlert.value = true;
      uuid.value = key;
      urlImg.value = img;
    }

    function isConfirmSendData(evt) {
      if (evt == true) {
        removeReocord(uuid.value, urlImg.value, 'appjs/products');
      }
      isAlert.value = false;
    }
    return {
      searchItems,
      keySearch,
      removeItem,
      isAlert,
      isConfirmSendData,
      editItem,
    };
  },
};
</script>
<style scoped>
.image {
  width: 110px;
  height: 110px;
  min-width: 110px;
  overflow: hidden;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.7s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
