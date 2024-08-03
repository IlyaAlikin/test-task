<template>
  <div v-if="starships.length > 0">
    <select v-model="selectedStarship" @change="updateSelection">
      <option value="">Выберите истребитель</option>
      <option
        v-for="starship in starships"
        :key="starship.url"
        :value="starship"
      >
        {{ starship.name }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineEmits, watch } from "vue";
import axios from "axios";

const starships = ref<any[]>([]);
const selectedStarship = ref<any>(null);

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

const updateSelection = () => {
  emit("update:selectedStarship", selectedStarship.value);
};

// Watch the selectedStarship to emit changes
watch(selectedStarship, (newValue) => {
  emit("update:selectedStarship", newValue);
});
</script>

<style scoped>
select {
  width: 100%;
  padding: 0.5rem;
  box-sizing: border-box;
}
</style>
