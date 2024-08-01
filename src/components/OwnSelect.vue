<template>
  <div v-if="!state.isLoading">
    <div>{{ state.data.name }}</div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive } from "vue";
import axios from "axios";

const props = defineProps({
  link: String,
});

console.log(props.link);

const state = reactive({
  data: {},
  isLoading: true,
});

const getShips = async () => {
  try {
    const url = props.link;
    console.log("url", url);
    const response = await axios.get(url); // No need for template literals here
    console.log(response); // Access fetched data here
    state.data = response.data;
    state.isLoading = !state.isLoading;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

onMounted(() => {
  getShips();
});
</script>
<style scoped></style>
