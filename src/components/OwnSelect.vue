<template>
  <div v-if="starships.length > 0">
    <select v-model="selectedStarship" @change="updateSelection">
      <option
        v-for="starship in allStarships"
        :key="starship.url"
        :value="starship"
      >
        {{ starship.name }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps, defineEmits, watch } from "vue";
import axios from "axios";

const starships = ref<any[]>([]);
const selectedStarship = ref<any>(null);

const props = defineProps({
  initialStarshipUrl: {
    type: String,
    default: "",
  },
});

const allStarships = ref<any[]>([]);

const fetchStarships = async () => {
  try {
    const response = await axios.get("https://swapi.dev/api/starships/");
    starships.value = response.data.results;

    // Combine general starships list with the initial starship (if any)
    if (props.initialStarshipUrl) {
      const initialStarshipResponse = await axios.get(props.initialStarshipUrl);
      const initialStarship = initialStarshipResponse.data;

      if (
        !starships.value.some(
          (starship) => starship.url === initialStarship.url
        )
      ) {
        starships.value.push(initialStarship);
      }

      selectedStarship.value = initialStarship;
    }

    allStarships.value = starships.value;
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
