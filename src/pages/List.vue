<template>
  <div class="">Список персонажей</div>
  {{ characters.length }}
  <div v-if="characters.length > 0">
    <div class="list">
      <div v-for="item in characters" class="card" :key="item.url">
        <div class="card__name card-field">
          <p>Имя:</p>
          <p>
            {{ item.name }}
          </p>
        </div>
        <div class="card__birth_year card-field">
          <p>Год рождения:</p>
          <p>
            {{ item.birth_year }}
          </p>
        </div>
        <div class="starship" v-if="item.starships.length >= 1">
          <div v-if="item.starships[0] && item.starships[0] !== ''">
            <div
              v-if="
                shipData[item.starships[0]] && shipData[item.starships[0]].name
              "
            >
              <div>Ship Name: {{ shipData[item.starships[0]].name }}</div>
            </div>
            <div v-else>Loading Starship...</div>
          </div>
        </div>
      </div>
      <div v-if="showNewCharacterForm" class="new-character">
        <h2 class="new-character__title">Add New Character</h2>
        <form @submit.prevent="createCharacter" class="new-character__wrapper">
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
            <label for="starships">Starships:</label>
            <OwnSelect @update:selectedStarship="updateSelectedStarship" />
          </div>
          <div class="new-characters__buttons">
            <button type="submit">Create Character</button>
            <button type="button" @click="showNewCharacterForm = false">
              Cancel
            </button>
          </div>
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
  starships: [],
});
const shipData = ref<{ [key: string]: any }>({});
const selectedStarship = ref("");

const fetchCharacters = async () => {
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
    characters.value = simplifiedCharacters;
    charactersStore.setCharacters(simplifiedCharacters);
    await fetchAllStarships(simplifiedCharacters);
  } catch (error) {
    console.error("Error fetching characters:", error);
  }
};

const fetchStarship = async (url: string) => {
  try {
    const response = await axios.get(url);
    shipData.value[url] = response.data;
  } catch (error) {
    console.error("Error fetching ship data:", error);
  }
};

const fetchAllStarships = async (characters: SimplifiedCharacter[]) => {
  for (const character of characters) {
    if (character.starships.length >= 1 && character.starships[0] !== "") {
      await fetchStarship(character.starships[0]);
    }
  }
};

const updateSelectedStarship = (starshipUrl: string) => {
  selectedStarship.value = starshipUrl;
  if (starshipUrl && !shipData.value[starshipUrl]) {
    fetchStarship(starshipUrl);
  }
};

const createCharacter = () => {
  if (selectedStarship.value) {
    newCharacter.value.starships.push(selectedStarship.value);
  }
  charactersStore.addCharacter(newCharacter.value);
  newCharacter.value = {
    name: "",
    birth_year: "",
    starships: [],
  };
  showNewCharacterForm.value = false;
  saveToLocalStorage();
};

const saveToLocalStorage = () => {
  localStorage.setItem("characters", JSON.stringify(characters.value));
};

onMounted(() => {
  const storedCharacters = localStorage.getItem("characters");
  if (storedCharacters) {
    characters.value = JSON.parse(storedCharacters) as SimplifiedCharacter[];
    charactersStore.setCharacters(characters.value);
    fetchAllStarships(characters.value);
  } else {
    fetchCharacters();
  }
});
</script>
