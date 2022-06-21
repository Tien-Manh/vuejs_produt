import {
    database
} from '@/configs/firebase'
import {
    ref,
    get,
    child,
    query,
    limitToLast,
    onValue,
    orderByChild,
    endAt,
    startAt,
    equalTo
} from 'firebase/database'
import {
    ref as refVue
} from 'vue'
const getDatabase = () => {
    const items = refVue(null)
    async function getAlldatabase(querySeach, prefix) {
        let starRef = query(ref(database, prefix), limitToLast(15))
        if (querySeach != '') {
            starRef = query(ref(database, prefix), orderByChild('name'), startAt(querySeach), endAt(querySeach + "\uf8ff"), limitToLast(15))
        }
        onValue(starRef, (snapshot) => {
            if (snapshot.val()) {
                return items.value = Array.prototype.reverse.call(Object.values(snapshot.val())).filter((item, key) => {
                    item.uuid = Array.prototype.reverse.call(Object.keys(snapshot.val()))[key]
                    item.price = item.price.toLocaleString('vi')
                    item.quantity = item.quantity.toLocaleString('vi')
                    return item
                })
            } else {
                return items.value = null
            }
        });

    }
    async function getAllNotLimit(prefix) {
        let starRef = ref(database, prefix)
        onValue(starRef, (snapshot) => {
            if (snapshot.val()) {
                return items.value = Array.prototype.reverse.call(Object.values(snapshot.val())).filter((item, key) => {
                    item.uuid = Array.prototype.reverse.call(Object.keys(snapshot.val()))[key]
                    return item
                })
            } else {
                return items.value = null
            }
        });
    }
    async function getAlldatabaseCustomer(querySeach, prefix) {
        let starRef = query(ref(database, prefix), limitToLast(3))
        if (querySeach != '') {
            starRef = query(ref(database, prefix), orderByChild('name'), startAt(querySeach), endAt(querySeach + "\uf8ff"), limitToLast(15))
        }
        onValue(starRef, (snapshot) => {
            if (snapshot.val()) {
                return items.value = Array.prototype.reverse.call(Object.values(snapshot.val())).filter((item, key) => {
                    item.uuid = Array.prototype.reverse.call(Object.keys(snapshot.val()))[key]
                    return item
                })
            } else {
                return items.value = null
            }
        });
    }

    async function getAlldatabasePrefix(querySeach, prefix) {
        let arrays = [];
        let starRef = query(ref(database, prefix), limitToLast(15))
        if (querySeach != null) {
            starRef = query(ref(database, prefix), orderByChild('name'), startAt(querySeach.toLowerCase()), endAt(querySeach.toLowerCase() + "\uf8ff"), limitToLast(15))
        }
        await get(starRef).then((snapshot) => {
            if (snapshot.exists()) {
                arrays = snapshot
            } else {
                arrays = []
            }
        }).catch((error) => {
            console.error(error);
        });
        return arrays
    }
    async function getOneByUuid(uuid, prefix) {
        let array = []
        const starRef = ref(database, prefix + '/' + uuid)
        await get(starRef).then((snapshot) => {
            if (snapshot.exists()) {
                array = snapshot.val()
            } else {
                array = []
            }
        })
        return array
    }

    async function getName(uuid, prefix) {
        let name = []
        const starRef = ref(database, prefix + '/' + uuid)
        await get(starRef).then((snapshot) => {
            if (snapshot.exists()) {
                name = snapshot.val()
            } else {
                name = [null]
            }
        })
        return name
    }
    async function getOneDatabaseByUuid(uuid, prefix) {
        const starRef = child(ref(database, prefix), uuid)
        onValue(starRef, (snapshot) => {
            if (snapshot.val()) {
                items.value = snapshot.val()
            }
            return items
        })
    }
    async function getorderByMonthSearch(day, dayEnd,  keyName,  prefix) {
        const starRef = query(ref(database, prefix), orderByChild(keyName), startAt(day), endAt(dayEnd))
        await get(starRef).then(async (snapshot) => {
            if (snapshot.exists()) {
                return items.value = Object.values(snapshot.val()).filter(async (item, key) => {
                    const child_ = query(ref(database, 'appjs/order_details'), orderByChild('order_id'), equalTo(Object.keys(snapshot.val())[key]))
                    item.uuid = Object.keys(snapshot.val())[key]
                    item.order_status = item.order_status == 1 ? true : false
                    item.products = []
                    const customer = await getName(item.customer, 'appjs/customers')
                    if(customer.name != undefined){
                        items.value[key].customer = customer.name
                    }
                    await get(child_).then((snapshotChild) => {
                        if (snapshotChild.val()) {
                            if(items.value && items.value.length > 0){
                                return items.value[key].products = Object.values(snapshotChild.val()).filter(async (itemChild, keyChild) => {
                                    itemChild.uuid = Object.keys(snapshotChild.val())[keyChild]
                                    const itemName = await getName(itemChild.product_id, 'appjs/products')
                                    if(itemName.name != undefined && items.value &&  items.value.length > 0){
                                        items.value[key].products[keyChild].product_id = itemName.name
                                    }
                                    return itemChild
                                })
                            }
                        }
                    })

                })
            } else {
                return items.value = null
            }
        })
    }
    async function getorderByDaySearch(day, keyName,  prefix) {
        const starRef = query(ref(database, prefix), orderByChild(keyName), equalTo(day))
        await get(starRef).then(async (snapshot) => {
            if (snapshot.exists()) {
                return items.value = Object.values(snapshot.val()).filter(async (item, key) => {
                    const child_ = query(ref(database, 'appjs/order_details'), orderByChild('order_id'), equalTo(Object.keys(snapshot.val())[key]))
                    item.uuid = Object.keys(snapshot.val())[key]
                    item.order_status = item.order_status == 1 ? true : false
                    item.products = []
                    const customer = await getName(item.customer, 'appjs/customers')
                    if(customer.name != undefined && items.value){
                        items.value[key].customer = customer.name
                    }
                    await get(child_).then((snapshotChild) => {
                        if (snapshotChild.val()) {
                            if(items.value && items.value.length > 0){
                                return items.value[key].products = Object.values(snapshotChild.val()).filter(async (itemChild, keyChild) => {
                                    itemChild.uuid = Object.keys(snapshotChild.val())[keyChild]
                                    const itemName = await getName(itemChild.product_id, 'appjs/products')
                                    if(itemName.name != undefined && items.value &&  items.value.length > 0){
                                        items.value[key].products[keyChild].product_id = itemName.name
                                    }
                                    return itemChild
                                })
                            }
                        }
                    })

                })
            } else {
                return items.value = null
            }
        })
    }
    async function getorderByDay(day, prefix) {
        const starRef = query(ref(database, prefix), orderByChild('order_date'), startAt(day.toLowerCase()), endAt(day.toLowerCase() + "\uf8ff"))
        onValue(starRef, (snapshot) => {
            if (snapshot.val()) {
                return items.value = Object.values(snapshot.val()).filter((item, key) => {
                    const child_ = query(ref(database, 'appjs/order_details'), orderByChild('order_id'), equalTo(Object.keys(snapshot.val())[key]))
                    item.uuid = Object.keys(snapshot.val())[key]
                    item.order_status = item.order_status == 1 ? true : false
                    item.errMsg = ''
                    item.isSuccess = true
                    item.colorClass = "text-pink-600 text-sm"
                    item.isShow = true
                    item.products = []
                    onValue(child_, (snapshotChild) => {
                        if (snapshotChild.val()) {
                            if (items.value != null) {
                                return items.value[key].products = Object.values(snapshotChild.val()).filter((itemChild, keyChild) => {
                                    itemChild.uuid = Object.keys(snapshotChild.val())[keyChild]
                                    return itemChild
                                })
                            } else {
                                return item.products = Object.values(snapshotChild.val()).filter((itemChild, keyChild) => {
                                    itemChild.uuid = Object.keys(snapshotChild.val())[keyChild]
                                    return itemChild
                                })
                            }
                        }
                    })
                    return item
                })
            } else {
                return items.value = [{
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
                }]
            }
        })
    }
    return {
        getAlldatabase,
        getOneDatabaseByUuid,
        getAlldatabaseCustomer,
        getAllNotLimit,
        getAlldatabasePrefix,
        getOneByUuid,
        getorderByDay,
        getorderByDaySearch,
        getorderByMonthSearch,
        items
    }
}
export default getDatabase

// snapshot.forEach(function(item){
//     let configItem = item.val()
//     configItem['uuid'] = item.key
//     configItem.price = configItem.price.toLocaleString('vi');
//     items.push(configItem)
// })