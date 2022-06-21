<template>
    <div>
        <div class="flex flex-row justify-between items-center align-middle">
            <div class="text-sm text-orange-500">
                <label class="inline-flex items-center w-full mt-1" style="cursor: pointer">
                    <input v-model="radioInput" style="cursor: pointer" type="radio"
                        class="form-radio text-orange-500 focus:ring-orange-500" name="statusRadio" value="day">
                    <span class="ml-2">Ngày</span>
                </label>
                <label class="inline-flex items-center w-full mt-1" style="cursor: pointer">
                    <input v-model="radioInput" style="cursor: pointer" type="radio"
                        class="form-radio text-orange-500 focus:ring-orange-500" name="statusRadio" value="month">
                    <span class="ml-2">Tháng</span>
                </label>
                <label class="inline-flex items-center w-full mt-1" style="cursor: pointer">
                    <input v-model="radioInput" style="cursor: pointer" type="radio"
                        class="form-radio text-orange-500 focus:ring-orange-500" name="statusRadio" value="customer">
                    <span class="ml-2">Khách hàng</span>
                </label>
            </div>
            <div v-if="radioInput == 'customer'" class="w-full text-orange-500 text-sm">
                <label for="ten" class="block">
                    <Multiselect :classes="{
                        container: 'rounded-t-xl multiselect shadow-0 text-sm',
                        containerOpen: 'rounded-xl',
                        containerActive: 'ring-0',
                        optionSelected: 'text-white bg-orange-500',
                        optionSelectedPointed: 'text-white bg-orange-500 opacity-90',
                        search:
                            'rounded-t-xl multiselect-search focus:ring-0 border-0 outline-none shadow-none',
                    }" :canClear="false" :canDeselect="false" v-model="customer_name" placeholder="Chọn . . ."
                        :close-on-select="true" :filter-results="false" :min-chars="1" :resolve-on-load="true"
                        :delay="200" :searchable="true" :options="
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
            <div v-else-if="radioInput == 'month'" class="w-full">
                <datepicker
                    class="rounded-t-xl w-full shadow-0 text-sm ring-0 focus:outline-none border-0 focus:ring-0 text-orange-500"
                    v-model="picked_month" inputFormat="dd/M/yyyy" minimumView="month">
                </datepicker>
            </div>
            <div v-else class="w-full">
                <datepicker
                    class="rounded-t-xl w-full shadow-0 text-sm ring-0 focus:outline-none border-0 focus:ring-0 text-orange-500"
                    v-model="picked" inputFormat="dd/M/yyyy">
                </datepicker>
            </div>
        </div>
        <div class="ring-1 ring-orange-300 hover:ring-orange-500 my-2"></div>
        <div v-if="(picked != '' || customer_name != '') && radioInput != 'month' && ItemOrder && ItemOrder.length > 0"
            class="flex flex-row justify-between items-center align-middle text-sm text-orange-500 pt-2">
            <label class="inline-flex items-center mt-1 mr-7" style="cursor: pointer">
                <input v-model="statusCheck" style="cursor: pointer" type="checkbox"
                    class="form-check text-orange-500 focus:ring-orange-500" name="statusCheck">
                <span class="ml-2">Chưa thanh toán</span>
            </label>
            <div v-if="statusCheck">
                <b><span>Tổng tiền: <span>{{ sumTotal.toLocaleString('vi') }} Vnđ</span></span></b>
            </div>
            <button v-if="statusCheck" @click="updateStatusAll()"
                class="px-5 py-1 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-full">
                Xác nhận tất cả
            </button>
        </div>
        <div v-else-if="radioInput == 'month' && ItemOrder && ItemOrder.length > 0 ">
            <div class="text-orange-500 text-sm flex flex-row justify-between mt-3">
                <b><span>Tổng nợ: <span>{{ sumTotal_.toLocaleString('vi') }} Vnđ</span></span></b>
                <b><span>Tổng trả: <span>{{ sumTotal_s.toLocaleString('vi') }} Vnđ</span></span></b>
            </div>
              <div class="text-orange-500 text-sm flex flex-row justify-end mt-3">
                <b><span>Tổng tiền: <span>{{ (sumTotal_s + sumTotal_).toLocaleString('vi') }} Vnđ</span></span></b>
            </div>
        </div>
        <TransitionGroup name="slide-list" tag="div" class="flex flex-col">
            <div class="card bg-white rounded-3xl p-3 mt-6" v-for="(order, keyOrder) in ItemOrder" :key="keyOrder">
                <div class="flex flex-row overflow-hidden">
                    <div class="ml-4 text-sm w-full text-orange-500">
                        <div class="flex flex-row justify-between align-middle items-center">
                            <label for="ten" class="text-center">
                                <span class="block">Tên</span>
                                <div class="flex justify-between">
                                    <b>
                                        <p class="text-center">
                                            {{ order.customer }}</p>
                                    </b>
                                </div>
                            </label>
                            <label for="ten" class="text-center">
                                <span class="block">Ngày</span>
                                <div class="flex justify-between">
                                    <b>
                                        <p class="text-center">
                                            {{ order.order_date }}</p>
                                    </b>
                                </div>
                            </label>
                            <label for="ten" class="text-center">
                                <span class="block">Trạng thái</span>
                                <div class="flex justify-between text-center">
                                    <b>
                                        <p class="text-center">
                                            <span v-if="order.order_status == 1">Đã thanh toán</span>
                                            <span v-else class="text-red-700 font-bold">Chưa thanh toán</span>
                                        </p>
                                    </b>
                                </div>
                            </label>
                        </div>
                        <div>
                            <p class="mt-2">
                                Ghi chú: <span>{{ order.order_message }} </span>
                            </p>
                        </div>
                        <div class="text-sm flex flex-col justify-between w-full text-orange-500">
                            <div v-for="(item, key) in order.products">
                                <div>
                                    <div class="ring-1 ring-orange-300 hover:ring-orange-500 mb-2"></div>
                                    <h3 class="mt-2 pt-2 mb-2">
                                        Sản phẩm: <span>{{ item.product_id }}</span>
                                    </h3>
                                    <div class="flex flex-row justify-between align-middle items-center">
                                        <label for="ten" class="block">
                                            <span class="block">Số lượng</span>
                                            <div class="flex justify-between">
                                                <b>
                                                    <p class="text-center px-3">
                                                        {{ (item.quantity).toLocaleString('vi') }}</p>
                                                </b>
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
                                                }} Vnđ</p>
                                            </b>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div class="ring-1 ring-orange-300 hover:ring-orange-500 mb-2"></div>
                            <div class="flex flex-row"
                                :class="order.order_status == 0 ? 'justify-between' : 'justify-end'">
                                <div class="pt-2" v-if="order.order_status == 0">
                                    <button @click="updateStatus(keyOrder, order.uuid)"
                                        class="px-5 py-1 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-full">
                                        Xác nhận
                                    </button>
                                </div>
                                <p class="pt-2">
                                    Tổng tiền: <span><b>{{ order.total.toLocaleString('vi') }}</b> Vnđ </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </TransitionGroup>
    </div>
</template>

<script>
import AlertVue from "@/views/components/libs/AlertVue";
import Multiselect from "@vueform/multiselect";
import Datepicker from 'vue3-datepicker'
import {
    watch,
    ref,
    computed,
    onMounted,
} from "vue";
import databaseRecord from "@/libs/firebaseAdd";
import getDatabase from "@/libs/getDatabase";
export default {
    name: "OrderAdd",
    components: {
        Datepicker,
        Multiselect,
        AlertVue
    },
    setup() {
        const {
            updateRecordStatus
        } = databaseRecord();
        const {
            getAlldatabasePrefix,
            getorderByDaySearch,
            getorderByMonthSearch,
            items
        } = getDatabase();
        const picked = ref(new Date())
        const picked_month = ref(new Date())
        const customer_name = ref('')
        const statusCheck = ref(false)
        const itemData = ref([])
        const sumTotal = ref(0)
        const isAlert = ref(false);
        const radioInput = ref('day')
        const radioValue = ref(1)
        const isLoading = ref(false)
        onMounted(async () => {
            await getorderByDaySearch(`${picked.value.getFullYear()}/${String(picked.value.getMonth() + 1).padStart(2, '0')}/${String(picked.value.getDate()).padStart(2, '0')}`, 'order_date', "appjs/orders")
        })
        watch(picked, () => {
            statusCheck.value = false
            const newDate = new Date(picked.value)
            getorderByDaySearch(`${newDate.getFullYear()}/${String(newDate.getMonth() + 1).padStart(2, '0')}/${String(newDate.getDate()).padStart(2, '0')}`, 'order_date', "appjs/orders")
        })

        watch(picked_month, () => {
            statusCheck.value = false
            const newDate = new Date(picked_month.value)
            getorderByMonthSearch(`${newDate.getFullYear()}/${String(newDate.getMonth() + 1).padStart(2, '0')}/${String(newDate.getDate()).padStart(2, '0')}`, `${newDate.getFullYear()}/${String(newDate.getMonth() + 1).padStart(2, '0')}/31`, 'order_date', "appjs/orders")
        })
        watch(customer_name, () => {
            statusCheck.value = false
            getorderByDaySearch(customer_name.value, 'customer', "appjs/orders")
        })

        watch(radioInput, () => {
            statusCheck.value = false
            if (radioInput.value == 'customer') {
                getorderByDaySearch(customer_name.value, 'customer', "appjs/orders")
            }
            else if(radioInput == 'day') {
                const newDate = new Date(picked.value)
                getorderByDaySearch(`${newDate.getFullYear()}/${String(newDate.getMonth() + 1).padStart(2, '0')}/${String(newDate.getDate()).padStart(2, '0')}`, 'order_date', "appjs/orders")
            }
            else{
                const newDate = new Date(picked_month.value)
                getorderByMonthSearch(`${newDate.getFullYear()}/${String(newDate.getMonth() + 1).padStart(2, '0')}/${String(newDate.getDate()).padStart(2, '0')}`, `${newDate.getFullYear()}/${String(newDate.getMonth() + 1).padStart(2, '0')}/31`, 'order_date', "appjs/orders")
            }
        })

        const sumTotal_ = computed(() => {
            let sum = 0;
            items.value.forEach((item) => {
                if(item.order_status == 0){
                    sum += item.total
                }
            })
            return sum
        })
        const sumTotal_s = computed(() => {
            let sum = 0;
            items.value.forEach((item) => {
                if(item.order_status == 1){
                    sum += item.total
                }
            })
            return sum
        })

        watch(statusCheck, () => {
            if (statusCheck.value == true && items.value) {
                itemData.value = items.value
                sumTotal.value = 0
                items.value = items.value.filter((item, key) => {
                    if (item.order_status == false) {
                        sumTotal.value += item.total
                        return item
                    }
                })
            }
            else { items.value = itemData.value }
            return items.value
        })

        const ItemOrder = computed(() => {
            if (items.value) {
                return items.value
            }
        });
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
        function updateStatus(index, uuid) {
            updateRecordStatus(uuid, 'appjs/orders')
            items.value[index].order_status = 1
        }

        function updateStatusAll(uuids) {
            items.value.forEach((item, index) => {
                updateRecordStatus(item.uuid, 'appjs/orders')
                items.value[index].order_status = 1
            })
        }
        return {
            radioInput,
            customer_name,
            picked,
            picked_month,
            statusCheck,
            sumTotal,
            sumTotal_,
            sumTotal_s,
            ItemOrder,
            isLoading,
            radioValue,
            isAlert,
            searchUsers,
            updateStatus,
            updateStatusAll
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
</style>
