<!-- <template>
  <div class="">Список персонажей</div>
  {{ characters.length }}
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
            {{ shipData }}
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
import SimplifiedCharacter from "../character";

const characters = ref<SimplifiedCharacter[]>([]);
const charactersStore = useCharactersStore();
const showNewCharacterForm = ref(false);
const newCharacter = ref<SimplifiedCharacter>({
  name: "",
  birth_year: "",
  starships: "",
});

const fetchData = async () => {
  try {
    const response = await axios.get("https://swapi.dev/api/people/");
    const simplifiedCharacters = response.data.results.map(
      (char: any) =>
        ({
          name: char.name,
          birth_year: char.birth_year,
          starships: char.starships,
        } as SimplifiedCharacter)
    );
    characters.value = simplifiedCharacters; // Update ref with simplified data
    charactersStore.setCharacters(simplifiedCharacters); // Update Pinia store
    console.log(characters.value);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const shipData = ref({});

const fetchShipData = async (url: string) => {
  try {
    const response = await axios.get(url);
    shipData.value = response.data;
  } catch (error) {
    console.error("Error fetching ship data:", error);
  }
};

const createCharacter = () => {
  charactersStore.addCharacter(newCharacter.value); // Add to Pinia store
  newCharacter.value = {
    name: "",
    birth_year: "",
    starships: [], // Reset starships
  };
  showNewCharacterForm.value = false;
};

onMounted(() => {
  const storedCharacters = localStorage.getItem("characters");
  if (storedCharacters) {
    characters.value = JSON.parse(storedCharacters) as SimplifiedCharacter[];
    charactersStore.setCharacters(characters.value);
  } else {
    fetchData(); // Fetch initial data if not found in local storage
  }
});
</script> -->
<template>
  <div class="">Список персонажей</div>
  {{ characters.length }}
  <div v-if="characters.length > 0">
    <div class="list">
      <div v-for="item in characters" class="card" :key="item.url">
        <div class="card__name">
          {{ item.name }}
        </div>
        <div class="card__birth_year">
          {{ item.birth_year }}
        </div>
        <div class="starship" v-if="item.starships.length >= 1">
          <template v-if="item.starships[0] && item.starships[0] !== ''">
            <div
              v-if="
                shipData[item.starships[0]] && shipData[item.starships[0]].name
              "
            >
              <!-- Display the starship data -->
              <div>Ship Name: {{ shipData[item.starships[0]].name }}</div>
              <!-- Display other ship details from shipData -->
            </div>
            <template v-else>
              <!-- Display a loading message or placeholder while fetching -->
              Loading Starship...
            </template>
          </template>
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
            <OwnSelect />
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

import SimplifiedCharacter from "../character";

import OwnSelect from "../components/OwnSelect.vue";

const characters = ref<SimplifiedCharacter[]>([]);
const charactersStore = useCharactersStore();
const showNewCharacterForm = ref(false);
const newCharacter = ref<SimplifiedCharacter>({
  name: "",
  birth_year: "",
  starships: [],
});

const shipData = ref<{ [key: string]: any }>({}); // Use an object to store ship data

const fetchData = async () => {
  try {
    const response = await axios.get("https://swapi.dev/api/people/");
    const simplifiedCharacters = response.data.results.map(
      (char: any) =>
        ({
          name: char.name,
          birth_year: char.birth_year,
          starships: char.starships,
        } as SimplifiedCharacter)
    );
    characters.value = simplifiedCharacters; // Update ref with simplified data
    charactersStore.setCharacters(simplifiedCharacters); // Update Pinia store
    console.log(characters.value);

    // Pre-fetch starship data for each character
    for (const character of simplifiedCharacters) {
      if (character.starships.length >= 1 && character.starships[0] !== "") {
        await fetchShipData(character.starships[0]); // Fetch and store ship data
      }
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const fetchShipData = async (url: string) => {
  try {
    const response = await axios.get(url);
    shipData.value[url] = response.data; // Store ship data by URL
  } catch (error) {
    console.error("Error fetching ship data:", error);
  }
};

const createCharacter = () => {
  charactersStore.addCharacter(newCharacter.value); // Add to Pinia store
  newCharacter.value = {
    name: "",
    birth_year: "",
    starships: [], // Reset starships
  };
  showNewCharacterForm.value = false;
};

onMounted(() => {
  const storedCharacters = localStorage.getItem("characters");
  if (storedCharacters) {
    characters.value = JSON.parse(storedCharacters) as SimplifiedCharacter[];
    charactersStore.setCharacters(characters.value);
  }
  fetchData(); // Always fetch data from the API
});
</script>
