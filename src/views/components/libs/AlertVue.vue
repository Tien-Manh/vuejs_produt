<template>
   <div class="fixed top-0 left-0 w-full px-4 min-h-screen flex items-center md:justify-center">
    <div class="bg-black opacity-40 w-full h-full absolute z-10 inset-0"></div>
    <div class="bg-white rounded-3xl md:max-w-md md:mx-auto p-4 fixed inset-x-0 z-50 mb-64 mx-4 md:relative">
      <div class="md:flex items-center">
        <div class="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
          <p class="font-bold text-orange-500">Xác nhận xoá</p>
        </div>
      </div>
      <div class="text-center md:text-right mt-6 flex justify-end">
        <button @click="acTiveSubmid" class="inline-block w-auto px-8 py-2 bg-red-200 text-red-700 rounded-3xl text-sm mr-2 order-1">Xoá</button>
        <button @click="canCelSubmid" class="inline-block w-auto px-8 py-2 bg-gray-200 rounded-3xl  text-sm mt-0 order-1">Huỷ</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
    setup(props, context){
      function canCelSubmid(){
          context.emit('confirm-send-data', false)
      }
      function acTiveSubmid(){
          context.emit('confirm-send-data', true)
      }
       return {canCelSubmid, acTiveSubmid}
    }
}
</script>
<style lang="">
    
</style>