<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import axios from "axios";

const fetchData = async () => {
  try {
    const response = await axios.get("https://swapi.dev/api/starships/");
    console.log(response.data); // Access fetched data here
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

onMounted(() => {
  fetchData();
});
</script>
<style scoped></style>
