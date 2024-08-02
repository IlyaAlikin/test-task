<!-- <template>
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
</script> -->
<template>
  <div v-if="starships.length > 0">
    <select v-model="selectedStarship">
      <option value="">Select a Starship</option>
      <option
        v-for="starship in starships"
        :key="starship.name"
        :value="starship.url"
      >
        {{ starship.name }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, defineEmits } from "vue";
import axios from "axios";

const starships = ref([]);
const selectedStarship = ref("");

const fetchStarships = async () => {
  try {
    const response = await axios.get("https://swapi.dev/api/starships/");
    starships.value = response.data.results;
  } catch (error) {
    console.error("Error fetching starships:", error);
  }
};

onMounted(() => {
  fetchStarships();
});

const emit = defineEmits(["update:selectedStarship"]);
watch(selectedStarship, (newValue) => {
  emit("update:selectedStarship", newValue);
});
</script>
