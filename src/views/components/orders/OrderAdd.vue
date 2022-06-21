<template>
    <div>
        <div class="flex flex-row justify-between items-center align-middle">
            <h3 v-if="dateDay" class="text-center text-orange-500 font-bold text-md mb-2">
                {{ dateDay }}
            </h3>
            <router-link to="/list-orders"
                class="px-10 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-3xl text-xs">
                Danh sách tìm kiếm
            </router-link>
        </div>
        <TransitionGroup name="slide-list" tag="div">
            <form v-for="(order, keyOrder) in ItemOrder" @submit.prevent="onSubmid(keyOrder)" class="mx-auto"
                :key="keyOrder">
                <div class="flex flex-row justify-between items-center">
                    <p class="mt-4 pb-1 text-orange-500"><span>Đơn hàng : </span>{{ keyOrder + 1 }}</p>
                    <button @click="showAndHide(keyOrder)" type="button"
                        class="px-5 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-3xl text-xs">
                        <span v-if="ItemOrder[keyOrder].isShow">Ẩn</span>
                        <span v-else>Hiện</span>
                    </button>
                </div>
                <div class="ring ring-orange-300 hover:ring-orange-500 mb-2"></div>
                <span :class="ItemOrder[keyOrder].colorClass" v-if="ItemOrder[keyOrder].errMsg" class="font-bold mt-2">
                    {{ ItemOrder[keyOrder].errMsg }}</span>
                <div class="flex flex-col pt-2" v-if="ItemOrder[keyOrder].isShow">
                    <div class="w-full text-orange-500 mb-3 text-sm">
                        <label for="ten">
                            <span class="block">Tên</span>
                            <Multiselect :classes="{
                                container: 'rounded-t-xl multiselect shadow-0 text-sm',
                                containerOpen: 'rounded-xl',
                                containerActive: 'ring-0',
                                optionSelected: 'text-white bg-orange-500',
                                optionSelectedPointed: 'text-white bg-orange-500 opacity-90',
                                search:
                                    'rounded-t-xl multiselect-search focus:ring-0 border-0 outline-none shadow-none',
                            }" :canClear="false" :canDeselect="false" v-model="ItemOrder[keyOrder].list"
                                placeholder="Chọn . . ." :close-on-select="true" :filter-results="false" :min-chars="1"
                                :resolve-on-load="true" :delay="200" :searchable="true" :options="
                                async function (query) {
                                    return await searchLists(query);
                                }" @open="(select$) => { if (select$.noOptions) { select$.resolveOptions(); } }
    " />
                        </label>
                    </div>
                    <div class="w-full text-orange-500 mb-3 text-sm">
                        <label for="ten" class="block">
                            <span class="block">Khách hàng</span>
                            <Multiselect :classes="{
                                container: 'rounded-t-xl multiselect shadow-0 text-sm',
                                containerOpen: 'rounded-xl',
                                containerActive: 'ring-0',
                                optionSelected: 'text-white bg-orange-500',
                                optionSelectedPointed: 'text-white bg-orange-500 opacity-90',
                                search:
                                    'rounded-t-xl multiselect-search focus:ring-0 border-0 outline-none shadow-none',
                            }" :canClear="false" :canDeselect="false" v-model="ItemOrder[keyOrder].customer"
                                placeholder="Chọn . . ." :close-on-select="true" :filter-results="false" :min-chars="1"
                                :resolve-on-load="true" :delay="200" :searchable="true" :options="
                                async function (query) { return await searchUsers(query); }"
                                @open="(select$) => { if (select$.noOptions) { select$.resolveOptions(); } }">
                                <template v-slot:singlelabel="{ value }">
                                    <div class="multiselect-single-label">
                                        <img class="character-label-icon" :src="value.icon" />
                                        {{ value.label }}
                                    </div>
                                </template>
                                <template v-slot:option="{ option }">
                                    <img class="character-option-icon" :src="option.icon" />
                                    {{ option.label }}
                                </template>
                            </Multiselect>
                        </label>
                    </div>
                    <div class="w-full text-orange-500 mb-3 text-sm">
                        <label for="ten" class="block">
                            <span class="block">Sản phẩm</span>
                            <TransitionGroup name="slide-list" tag="div">
                                <template v-for="(item, key) in ItemOrder[keyOrder].products" :key="key">
                                    <div>
                                        <Multiselect :classes="{
                                            container: 'rounded-t-xl multiselect shadow-0 text-sm mb-2 mt-2',
                                            containerOpen: 'rounded-xl',
                                            containerActive: 'ring-0',
                                            optionSelected: 'text-white bg-orange-500',
                                            optionSelectedPointed:
                                                'text-white bg-orange-500 opacity-90',
                                            search:
                                                'rounded-t-xl multiselect-search focus:ring-0 border-0 outline-none shadow-none',
                                        }" :canClear="false" :canDeselect="false" disabledProp="disabled"
                                            v-model="ItemOrder[keyOrder].products[key].product_id"
                                            placeholder="Chọn . . ." :close-on-select="true" :filter-results="false"
                                            :min-chars="1" :resolve-on-load="true" :delay="200" :searchable="true"
                                            :options="
                                            async function (query) { return await searchProducts(query); }"
                                            @open="(select$) => { if (select$.noOptions) { select$.resolveOptions(); } }"
                                            @select="(select$, option) => { getSelectedProductItem(select$, option, key, keyOrder) }">
                                            <template v-slot:singlelabel="{ value }">
                                                <div class="multiselect-single-label">
                                                    <img class="character-label-icon" :src="value.icon" />
                                                    {{ value.label }}
                                                </div>
                                            </template>
                                            <template v-slot:option="{ option }">
                                                <img class="character-option-icon" :src="option.icon" />
                                                {{ option.label }}
                                            </template>
                                        </Multiselect>
                                        <div class="text-orange-500 mb-1">
                                            <div class="flex flex-row justify-between align-middle items-center">
                                                <label for="ten" class="block">
                                                    <span class="block">Số lượng</span>
                                                    <div class="flex justify-between">
                                                        <button type="button"
                                                            @click="item.quantity <= 1 ? item.quantity = 1 : item.quantity -= radioValue"
                                                            class="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-3xl text-xs">
                                                            <i class="fa-solid fa-minus"></i>
                                                        </button>
                                                        <b>
                                                            <p class="text-center px-3">
                                                                {{ (item.quantity).toLocaleString('vi') }}</p>
                                                        </b>
                                                        <button type="button" @click="item.quantity += radioValue"
                                                            class="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-3xl text-xs">
                                                            <i class="fa-solid fa-plus"></i>
                                                        </button>
                                                    </div>
                                                </label>
                                                <label for="ten" class="block">
                                                    <span class="block">&nbsp;</span>
                                                    <b>
                                                        <p>X</p>
                                                    </b>
                                                </label>
                                                <label for="ten" class="block">
                                                    <span class="block text-center">Giá</span>
                                                    <b>
                                                        <p class="text-center">{{ (item.price).toLocaleString('vi') }}
                                                        </p>
                                                    </b>
                                                </label>
                                                <label for="ten" class="block">
                                                    <span class="block">&nbsp;</span>
                                                    <b>
                                                        <p>=</p>
                                                    </b>
                                                </label>
                                                <label for="ten" class="block">
                                                    <span class="block text-center">Tổng</span>
                                                    <b>
                                                        <p class="text-center">{{ (item.price *
                                                                item.quantity).toLocaleString('vi')
                                                        }}</p>
                                                    </b>
                                                </label>
                                                <label for="ten" class="block">
                                                    <span class="block text-center">&nbsp;</span>
                                                    <button v-if="ItemOrder[keyOrder].products.length > 1"
                                                        type="button" @click="deleteProduct(keyOrder, key, item.uuid)"
                                                        class="px-5 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-3xl text-xs">
                                                        Xoá
                                                    </button>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                                <div class="text-orange-500 mb-3" :key="0">
                                    <label for="ten" class="block">
                                        <span class="block mb-2">Ghi chú</span>
                                        <textarea class="
                                        form-control
                                        block
                                        w-full
                                        px-3
                                        py-1.5
                                        text-base
                                        font-normal
                                        text-gray-700
                                        bg-white bg-clip-padding
                                        border border-solid border-gray-300
                                        rounded-xl
                                        transition
                                        ease-in-out
                                        m-0 focus:bg-white focus:border-orange-500 focus:ring-orange-500 focus:outline-none
                                    " rows="2" placeholder="Ghi chú"
                                            v-model="ItemOrder[keyOrder].order_message"></textarea>
                                    </label>
                                </div>
                                <div class="flex justify-between mb-3 mt-3" :key="0">
                                    <div v-for="(valueItem, index) in 8">
                                        <label class="inline-flex items-center" style="cursor: pointer">
                                            <input @change="setRadio(valueItem)" style="cursor: pointer" type="radio"
                                                class="form-radio text-orange-500 focus:ring-orange-500" name="radio"
                                                :value="valueItem" :checked="radioValue == valueItem">
                                            <span class="ml-2">{{ valueItem }}</span>
                                        </label>
                                    </div>
                                </div>
                                <div class="flex justify-between items-center" :key="0">
                                    <button key="0" type="button" @click="addProduct(keyOrder)"
                                        class="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-3xl text-xs">
                                        Thêm
                                    </button>
                                    <div>
                                        <span class="block text-center">Thanh toán:
                                            <b>{{ (caCuLaTorItem[keyOrder]).toLocaleString('vi') }}</b> Vnđ</span>
                                    </div>
                                </div>
                                <div class="flex flex-row justify-between items-center align-middle mt-4" key="0">
                                    <label class="inline-flex items-center w-full" style="cursor: pointer">
                                        <input v-model="ItemOrder[keyOrder].order_status" style="cursor: pointer"
                                            type="checkbox" class="form-radio text-orange-500 focus:ring-orange-500"
                                            name="statusOrder" :value="1">
                                        <span class="ml-2">Đã thanh toán</span>
                                    </label>
                                    <div key="0" class="w-full">
                                        <button v-if="ItemOrder[keyOrder].isSuccess"
                                            class="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-3xl w-full">
                                            <span v-if="ItemOrder[keyOrder].uuid">Thanh toán</span>
                                            <span v-else>Lưu</span>
                                        </button>
                                        <div v-else
                                            class="relative px-5 py-2 bg-orange-500 hover:bg-orange-600 text-center text-white rounded-3xl w-full">
                                            Đang tải . . .
                                            <span
                                                class="opacity-100 loader animation-spin h-3 w-3 bg-transparent absolute text-left box-border transition-all duration-500 ease-in-out mx-auto rounded-full">
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </TransitionGroup>
                        </label>
                    </div>
                </div>
            </form>
        </TransitionGroup>
        <button v-if="isLoading"
            class="isLoading px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full fixed left-0 right-0 m-auto w-12 bottom-10 z-50">
            <i class="fa-solid fa-plus"></i>
        </button>
        <button disabled v-else-if="ItemOrder && ItemOrder[ItemOrder.length - 1].uuid == undefined"
            class="isLoading px-4 py-3 bg-orange-700 hover:bg-orange-600 text-white rounded-full fixed left-0 right-0 m-auto w-12 bottom-10 z-50">
            <i class="fa-solid fa-plus"></i>
        </button>
        <button v-else @click="addOrders"
            class="px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full fixed left-0 right-0 m-auto w-12 bottom-10 z-50">
            <i class="fa-solid fa-plus"></i>
        </button>
        <Transition name="fade">
            <alert-vue class="z-40" v-if="isAlert" @Confirm-Send-Data="isConfirmSendData"></alert-vue>
        </Transition>
    </div>
</template>

<script>
import AlertVue from "@/views/components/libs/AlertVue";
import Multiselect from "@vueform/multiselect";
import {
    ref,
    computed,
    onMounted,
} from "vue";
import databaseRecord from "@/libs/firebaseAdd";
import getDatabase from "@/libs/getDatabase";
export default {
    name: "OrderAdd",
    components: {
        Multiselect,
        AlertVue
    },
    setup() {
        const {
            addRecordOrders,
            removeReocordOrder
        } = databaseRecord();
        const {
            getAlldatabasePrefix,
            getorderByDay,
            items
        } = getDatabase();
        const dateDay = ref("");
        const dateMonth = ref("")
        const isAlert = ref(false);
        const radioValue = ref(1)
        const ordersKey = ref(null)
        const productsIndex = ref(null)
        const productUuid = ref(null)
        const isLoading = ref(false)
        const weekday = [
            "Chủ nhật",
            "Thứ hai",
            "Thứ ba",
            "Thứ tư",
            "Thứ năm",
            "Thứ sáu",
            "Thứ bảy",
        ];
        const current = new Date();
        dateMonth.value = `${current.getFullYear()}/${String(current.getMonth() + 1).padStart(2, '0')}/${String(current.getDate()).padStart(2, '0')}`
        console.log(dateMonth.value)
        dateDay.value = `${weekday[current.getDay()]} : ${String(current.getDate()).padStart(2, '0')}/${String(current.getMonth() + 1).padStart(2, '0')
            }/${current.getFullYear()}`;

        onMounted(async () => {
            await getorderByDay(dateMonth.value, "appjs/orders")
        })

        const ItemOrder = computed(() => {
            return items.value
        });
        async function searchProducts(query) {
            let arrays = [];
            const snapshot = await getAlldatabasePrefix(query, "appjs/products");
            snapshot.forEach((item) => {
                arrays.push({
                    value: item.key,
                    label: item.val().name,
                    icon: item.val().fileImage,
                    price: item.val().price,
                });
            });
            return arrays;
        }

        async function searchUsers(query) {
            let arrays = [];
            const snapshot = await getAlldatabasePrefix(query, "appjs/customers");
            snapshot.forEach((item) => {
                arrays.push({
                    value: item.key,
                    label: item.val().name,
                    icon: item.val().fileImage,
                });
            });
            return arrays;
        }
        async function searchLists(query) {
            let arrays = [];
            const snapshot = await getAlldatabasePrefix(query, "appjs/lists");
            snapshot.forEach((item) => {
                arrays.push({
                    value: item.val().name,
                    label: item.val().name,
                });
            });
            return arrays;
        }

        function addOrders() {
            isLoading.value = true
            setTimeout(() => {
                ItemOrder.value.push({
                    order_status: false,
                    list: '',
                    customer: '',
                    order_message: '',
                    products: [{
                        product_id: "",
                        price: 0,
                        quantity: 1
                    }],
                    errMsg: '',
                    isSuccess: true,
                    colorClass: "text-pink-600 text-sm",
                    isShow: true
                })
                isLoading.value = false
            }, 1000)
            setTimeout(() => {
                document.getElementById("bouling").scrollTo({
                    top: 999999,
                    behavior: "smooth"
                });
            }, 1700)
        }

        function addProduct(keyOrder) {
            ItemOrder.value[keyOrder].products.push({
                product_id: "",
                price: 0,
                quantity: 1
            });
        }

        function deleteProduct(keyOrder, index, uuid) {
            isAlert.value = true
            productUuid.value = uuid
            ordersKey.value = keyOrder
            productsIndex.value = index
        }

        function isConfirmSendData(evt) {
            if (evt == true) {
                if (productUuid.value != null) {
                    removeReocordOrder(productUuid.value, 'appjs/order_details')
                }
                else {
                    ItemOrder.value[ordersKey.value].products.splice(productsIndex.value, 1)
                }
            }
            isAlert.value = false;
        }

        function setRadio(index) {
            radioValue.value = index
        }

        function showAndHide(keyOrder) {
            ItemOrder.value[keyOrder].isShow = !ItemOrder.value[keyOrder].isShow
        }
        async function getSelectedProductItem(uuid, item, key, keyOrder) {
            ItemOrder.value[keyOrder].products[key].price = item.price;
            Object.values(ItemOrder.value[keyOrder].products).some((value, index) => {
                if (ItemOrder.value[keyOrder].products[index].product_id == uuid && index != key) {
                    ItemOrder.value[keyOrder].products[index].quantity += ItemOrder.value[keyOrder].products[key].quantity
                    ordersKey.value = keyOrder
                    productsIndex.value = key
                    isConfirmSendData(true)
                    return true
                }
            })
        }
        const caCuLaTorItem = computed(() => {
            let orderTotal = []
            ItemOrder.value.forEach((products, key) => {
                orderTotal[key] = 0
                ItemOrder.value[key].products.forEach((item) => {
                    orderTotal[key] += (item.price * item.quantity)
                })
                return orderTotal[key]
            })
            return orderTotal
        })
        async function onSubmid(keyOrder) {
            ItemOrder.value[keyOrder].errMsg = "";
            ItemOrder.value[keyOrder].isSuccess = false;
            await setTimeout(async () => {
                const records = {
                    uuid: ItemOrder.value[keyOrder].uuid ? ItemOrder.value[keyOrder].uuid : null,
                    order_date: dateMonth.value,
                    order_message: ItemOrder.value[keyOrder].order_message,
                    order_status: ItemOrder.value[keyOrder].order_status == true ? 1 : 0,
                    sub_total: caCuLaTorItem.value[keyOrder],
                    total: caCuLaTorItem.value[keyOrder],
                    customer: ItemOrder.value[keyOrder].customer,
                    list: ItemOrder.value[keyOrder].list,
                }
                await addRecordOrders(records, ItemOrder.value[keyOrder].products, "appjs/orders");
                ItemOrder.value[ItemOrder.value.length - 1].errMsg = "Lưu thành công !";
                ItemOrder.value[ItemOrder.value.length - 1].colorClass = "text-green-400 text-sm";
                ItemOrder.value[ItemOrder.value.length - 1].isSuccess = true;
            }, 2000)
        }
        return {
            onSubmid,
            ItemOrder,
            isLoading,
            dateDay,
            radioValue,
            caCuLaTorItem,
            isAlert,
            isConfirmSendData,
            searchLists,
            searchUsers,
            searchProducts,
            getSelectedProductItem,
            addProduct,
            addOrders,
            deleteProduct,
            setRadio,
            showAndHide
        };
    },
};
</script>

<style>
.character-option-icon,
.character-label-icon {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    margin-right: 1rem;
}

.card div{
    height: max-content;
}
.slide-list-move,
/* apply transition to moving elements */
.slide-list-enter-active,
.slide-list-leave-active {
    transition: all 0.5s ease-in-out;
}
.slide-list-enter-active.card div{
    opacity: 0;
}
.card div{
    transition: opacity 0.2s ease-in-out;
    opacity: 1;
}
.slide-list-enter-from,
.slide-list-leave-to {
    opacity: 0;
    transform: translateY(-30px);
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.isLoading {
    animation: rotaTe 1s linear infinite;
}

@keyframes rotaTe {
    100% {
        transform: rotateZ(720deg);
    }
}
</style>
