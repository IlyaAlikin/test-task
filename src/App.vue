<template>
  <nav class="nav">
    <router-link to="/">List</router-link>
    <router-link to="/edit">Edit</router-link>
  </nav>
  <RouterView />
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import { RouterView, RouterLink } from "vue-router";
import axios from "axios";

const fetchData = async () => {
  try {
    const response = await axios.get("https://swapi.dev/api/");
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

onMounted(() => {
  fetchData();
});
</script>
<style scoped>
.nav {
  display: flex;
  align-items: center;
  gap: 40px;
}
</style>
