<template lang="">
  <footer class="h-16 bg-white	position: fixed bottom-0 left-0 lg:left-0 lg:right-0 w-screen lg:w-10/12 lg:m-auto"
  >
    <ul
      class=" columns-4 py-5"
    >
      <li class="text-center">
        <router-link to="/customer-list" class="text-2xl text text-orange-500 hover:text-orange-600"><i  class="fa-solid fa-user"></i></router-link>
      </li>
      <li class="text-center">
         <router-link to="/product-list" class="text-2xl text text-orange-500 hover:text-orange-600"><i class="fa-solid fa-certificate"></i></router-link>
      </li>
      <li class="text-center">
         <router-link to="/" class=" text-2xl text text-orange-500 hover:text-orange-600"><i class="fa-solid fa-cart-arrow-down"></i></router-link>
      </li>
      <li class="text-center">
        <router-link to="/list-list" class="text-2xl text text-orange-500 hover:text-orange-600"><i class="fa-solid fa-bars"></i></router-link>
      </li>
    </ul>
  </footer>
</template>
<script>
export default {
    
};
</script>
<style lang=""></style>
