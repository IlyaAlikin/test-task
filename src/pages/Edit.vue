<template>
  <div>lorem*100</div>
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
