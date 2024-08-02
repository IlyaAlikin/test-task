<template>
  <div v-if="starships">
    <select>
      <option value="">Select a Starship</option>
      <option v-for="starship in starships" :key="starship.name">
        {{ starship.name }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from "vue";
import axios from "axios";

const state = reactive({
  data: {},
  isLoading: true,
});

const starships = ref([]);
const starshipData = ref<{ [key: string]: any }>({}); // Store starship data by URL
const selectedStarship = ref("");

const fetchStarships = async () => {
  try {
    const response = await axios.get("https://swapi.dev/api/starships/");
    console.log("starships", response);
    starships.value = response.data.results;
    console.log(starships.value);
  } catch (error) {
    console.error("Error fetching starships:", error);
  }
};

onMounted(() => {
  fetchStarships();
});
</script>
