import { createRouter, createWebHistory } from "vue-router";
import OrderAdd from "@/views/components/orders/OrderAdd";
const routes = [
  {
    path: "/",
    name: "order-add",
    component: OrderAdd,
    meta: { depth: 7 },
  },
  {
  path: "/list-orders",
  name: "order-list",
  component: () =>  import("../views/components/orders/OrderList.vue"),
  meta: { depth: 8 },
},
  {
    path: "/customer-list",
    name: "customer-list",
    component: () => import("../views/components/customers/CustomerList.vue"),
    meta: { depth: 0 },
  },
  {
    path: "/customer-add",
    name: "customer-add",
    component: () => import("../views/components/customers/CustomerAdd.vue"),
    meta: { depth: 1 },
  },
  {
    path: "/customer-list/edit",
    name: "customer-edit",
    component: () => import("../views/components/customers/CustomerEdit.vue"),
    meta: { depth: 2 },
  },
  {
    path: "/product-list",
    name: "product-list",
    meta: { depth: 4 },
    component: () => import("../views/components/ProductLists.vue"),
  },
  {
    path: "/product-add",
    name: "product-add",
    meta: { depth: 5 },
    component: () => import("../views/components/AddProduct.vue"),
  },
  {
    path: "/product-list/edit",
    name: "product-edit",
    meta: { depth: 6 },
    component: () => import("../views/components/EditProduct.vue"),
  },
  {
    path: "/list-list",
    name: "list-list",
    component: () => import("../views/components/lists/ListLists.vue"),
    meta: { depth: 10 },
  },
  {
    path: "/list-add",
    name: "list-add",
    component: () => import("../views/components/lists/ListAdd.vue"),
    meta: { depth: 11 },
  },
  {
    path: "/list-list/edit",
    name: "list-edit",
    component: () => import("../views/components/lists/ListEdit.vue"),
    meta: { depth: 12 },
  },
  {
    path: "/login",
    name: "login",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Login.vue"),
    meta: { depth: -1 },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
