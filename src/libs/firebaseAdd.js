import { database, storage} from '@/configs/firebase'
import {ref as refStorage, uploadBytes, getDownloadURL, deleteObject} from 'firebase/storage'
import {ref, push, remove ,child, set, update} from 'firebase/database'
const  databaseRecord  = () => {
    function addRecord(records, prefix){
        push(ref(database, prefix), records)
    }

    function updateRecordStatus(uuid, prefix){
        const updates = {};
        updates[prefix + '/' + uuid + '/order_status'] =  1;
        update(ref(database), updates )
    }
    function addRecordOrders(records, records1, prefix){
        let getKey  = ''
        if(records.uuid != null){
            getKey  = records.uuid
            delete records.uuid
            set(ref(database, prefix + '/' + getKey), records)
        }
         else{
            getKey = push(ref(database, prefix), records)
            getKey = getKey.key
         }
        records1.forEach((item) => {
            if(item.uuid == undefined){
                const recordsNew = {
                    order_id: getKey,
                    price: item.price,
                    product_id: item.product_id,
                    quantity:item.quantity,
                }
                push(ref(database, 'appjs/order_details'), recordsNew)
            }
            else{
                const recordsId = {
                    order_id: item.order_id,
                    price: item.price,
                    product_id: item.product_id,
                    quantity:item.quantity,
                }
                set(ref(database, 'appjs/order_details/' + item.uuid), recordsId)
            }
        }) 
    }
    function removeRecordImage(img_url){
        const refUrl = refStorage(storage, img_url)
        deleteObject(refUrl).then(() => {
        }).catch((error) => {
        })
    }
    function removeReocordOrder(key_Id, prefix) {
        const refData = child(ref(database, prefix), key_Id)
        remove(refData)
    }
    function removeReocord(key_Id, img_url, prefix) {
        const refData = child(ref(database, prefix), key_Id)
        remove(refData)
        removeRecordImage(img_url)
    }
    function addRecordImg(img, prefix){
        const storageRef = refStorage(storage, prefix + Math.round(new Date().getTime()/1000)+'_'+ img.name)
        const metadata = {
            contentType: 'image/jpeg',
          };
        return uploadBytes(storageRef, img).then((snapshot) => {
            return getDownloadURL(storageRef).then((downloadURL) => {
               return  downloadURL
              });
          });
    }
    function updateRecord(records, uuid, prefix){
        set(ref(database, prefix + uuid), records)
    }
    return {addRecord, addRecordImg, removeReocord, updateRecord, removeRecordImage,addRecordOrders, removeReocordOrder, updateRecordStatus}
} 

export default databaseRecord