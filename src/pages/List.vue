<template>
  <div v-for="item in state.data">
    <div class="card">
      <div class="card__name">
        {{ item.name }}
      </div>
      <div class="card__birth_year">
        {{ item.birth_year }}
      </div>
      <div class="starship">
        {{ item.starships }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive } from "vue";
import axios from "axios";

const state = reactive({
  data: {},
});

const fetchData = async () => {
  try {
    const response = await axios.get("https://swapi.dev/api/people/");
    console.log(response.data);
    state.data = response.data.results;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

onMounted(() => {
  fetchData();
});
</script>
<style scoped></style>
