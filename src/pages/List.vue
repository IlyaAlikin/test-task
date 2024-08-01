<template>
  <div class="">Список персонажей</div>
  <div class="" v-if="state.data">
    <div class="list">
      <div v-for="item in state.data" class="card">
        <div class="card__name">
          {{ item.name }}
        </div>
        <div class="card__birth_year">
          {{ item.birth_year }}
        </div>
        <div class="starship">
          <div v-if="item.starships.length >= 1">
            <OwnSelect :link="item.starships[0]" />
          </div>
        </div>
      </div>
      <div class="add_button">+</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive } from "vue";
import axios from "axios";

import OwnSelect from "../components/OwnSelect.vue";

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
<style scoped>
.list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.card {
  background: #000;
  border-radius: 20px;
  padding: 20px;
}
</style>
