import { createRouter, createWebHistory } from "vue-router";
import Input from "../components/Input.vue";
import Select from "../components/Select.vue";
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/input",
      name: "EventDetails",
      component: Input,
    },
    {
      path: "/select",
      name: "select",
      component: Select,
    },
  ],
});

export default router;
