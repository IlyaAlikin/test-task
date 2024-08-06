<template>
  <div v-if="allStarships.length > 0">
    <select v-model="selectedStarshipUrl" @change="updateSelection">
      <option
        v-for="starship in allStarships"
        :key="starship.url"
        :value="starship.url"
      >
        {{ starship.name }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps, defineEmits, watch } from "vue";
import { useCharactersStore } from "../stores/characters";

const props = defineProps({
  initialStarshipUrl: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:selectedStarship"]);
const charactersStore = useCharactersStore();

const allStarships = ref<any[]>([]);
const selectedStarshipUrl = ref<string>("");

const initializeStarships = async () => {
  // Загрузка истребителей из хранилища
  await charactersStore.loadStarships();
  allStarships.value = charactersStore.starships;

  // Установка выбранного истребителя
  if (props.initialStarshipUrl) {
    selectedStarshipUrl.value = props.initialStarshipUrl;
  }
};

onMounted(() => {
  initializeStarships();
});

const updateSelection = () => {
  const selectedStarship = allStarships.value.find(
    (starship: any) => starship.url === selectedStarshipUrl.value
  );
  emit("update:selectedStarship", selectedStarship);
};

// Watch the selectedStarshipUrl to emit changes
watch(selectedStarshipUrl, (newUrl) => {
  const newStarship = allStarships.value.find(
    (starship: any) => starship.url === newUrl
  );
  emit("update:selectedStarship", newStarship);
});
</script>

<style scoped>
select {
  width: 100%;
  padding: 0.5rem;
  box-sizing: border-box;
}
</style>
