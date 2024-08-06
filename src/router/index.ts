import { createRouter, createWebHistory } from "vue-router";
import List from "../pages/List.vue";
import Edit from "../pages/Edit.vue";
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "List",
      component: List,
    },
    {
      path: "/edit/:id?",
      name: "Edit",
      component: Edit,
      props: true,
    },
  ],
});

export default router;
