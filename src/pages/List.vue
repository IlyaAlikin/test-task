<!-- <template>
  <div class="">Список персонажей</div>
  <div v-if="characters.length > 0">
    <div class="list">
      <div v-for="item in characters" class="card">
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
import { onMounted } from "vue";
import { ref } from "vue";
import { useCharactersStore } from "../stores/characters";
import axios from "axios";

import OwnSelect from "../components/OwnSelect.vue";

const characters = ref([]);
const charactersStore = useCharactersStore();
const fetchData = async () => {
  try {
    const response = await axios.get("https://swapi.dev/api/people/");
    characters.value = response.data.results;
    charactersStore.setCharacters(response.data.results);
    console.log(characters.value);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

onMounted(() => {
  fetchData();
});
</script> -->
<template>
  <div class="">Список персонажей</div>
  <div v-if="characters.length > 0">
    <div class="list">
      <div v-for="item in characters" class="card" :key="item.url">
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
      <div v-if="showNewCharacterForm" class="new-character">
        <h2>Add New Character</h2>
        <form @submit.prevent="createCharacter">
          <div>
            <label for="name">Name:</label>
            <input type="text" id="name" v-model="newCharacter.name" required />
          </div>
          <div>
            <label for="birth_year">Birth Year:</label>
            <input
              type="text"
              id="birth_year"
              v-model="newCharacter.birth_year"
              required
            />
          </div>
          <div>
            <label for="starships">Starships (comma-separated URLs):</label>
            <input
              type="text"
              id="starships"
              v-model="newCharacter.starships"
            />
          </div>
          <button type="submit">Create Character</button>
          <button type="button" @click="showNewCharacterForm = false">
            Cancel
          </button>
        </form>
      </div>
      <div class="add_button" @click="showNewCharacterForm = true">+</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useCharactersStore } from "../stores/characters";
import axios from "axios";

import OwnSelect from "../components/OwnSelect.vue";

const characters = ref([]);
const charactersStore = useCharactersStore();
const showNewCharacterForm = ref(false);
const newCharacter = ref({
  name: "",
  birth_year: "",
  starships: "",
});

const fetchData = async () => {
  try {
    const response = await axios.get("https://swapi.dev/api/people/");
    characters.value = response.data.results;
    charactersStore.setCharacters(response.data.results);
    console.log(characters.value);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const createCharacter = () => {
  charactersStore.addCharacter(newCharacter.value);
  newCharacter.value = {
    name: "",
    birth_year: "",
    starships: "",
  };
  showNewCharacterForm.value = false;
};

onMounted(() => {
  fetchData();
});
</script>
