<!-- <template>
  <div>
    <h1>Редактирование персонажей</h1>
    <div v-if="characters.length > 0">
      <div class="list">
        <div v-for="item in characters" :key="item.url" class="card">
          <div class="card__name card-field">
            <p>Имя:</p>
            <input v-model="item.name" />
          </div>
          <div class="card__birth_year card-field">
            <p>Год рождения:</p>
            <input v-model="item.birth_year" />
          </div>
          <div class="starship" v-if="item.starships.length >= 1">
            <div v-if="item.starships[0] && item.starships[0] !== ''">
              <div>Название корабля: {{ item.starships[0].name }}</div>
            </div>
          </div>
          <div class="edit-buttons">
            <button @click="saveCharacter(item)">Сохранить</button>
            <button @click="deleteCharacter(item.url)">Удалить</button>
          </div>
        </div>
        <div v-if="showNewCharacterForm" class="new-character">
          <h2 class="new-character__title">Добавить нового персонажа</h2>
          <form @submit.prevent="createCharacter" class="new-character__wrapper">
            <div>
              <label for="name">Имя:</label>
              <input type="text" id="name" v-model="newCharacter.name" required />
            </div>
            <div>
              <label for="birth_year">Год рождения:</label>
              <input type="text" id="birth_year" v-model="newCharacter.birth_year" required />
            </div>
            <div class="new-character__starship">
              <label for="starships">Корабль:</label>
              <OwnSelect @update:selectedStarship="updateSelectedStarship" />
            </div>
            <div class="new-characters__buttons">
              <button type="submit">Создать</button>
              <button type="button" @click="showNewCharacterForm = false">Отменить</button>
            </div>
          </form>
        </div>
        <div class="add_button" @click="showNewCharacterForm = true">+</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useCharactersStore } from "../stores/characters";
import axios from "axios";
import OwnSelect from "../components/OwnSelect.vue";
import { SimplifiedCharacter } from "../interfaces/character";

const charactersStore = useCharactersStore();
const characters = ref<SimplifiedCharacter[]>([]);
const showNewCharacterForm = ref(false);
const newCharacter = ref<SimplifiedCharacter>({
  name: "",
  birth_year: "",
  starships: [],
});
const selectedStarship = ref(null);

const fetchCharacters = async () => {
  try {
    const response = await axios.get("https://swapi.dev/api/people/");
    const simplifiedCharacters = response.data.results.map(
      (char: any) =>
        ({
          name: char.name,
          birth_year: char.birth_year,
          starships: char.starships,
          url: char.url,
        } as SimplifiedCharacter)
    );
    charactersStore.setCharacters(simplifiedCharacters);
    characters.value = charactersStore.characters;
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

const updateSelectedStarship = (starship: any) => {
  selectedStarship.value = starship;
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
};

const saveCharacter = (character: SimplifiedCharacter) => {
  charactersStore.updateCharacter(character);
};

const deleteCharacter = (url: string) => {
  charactersStore.removeCharacter(url);
};

onMounted(() => {
  if (charactersStore.characters.length > 0) {
    characters.value = charactersStore.characters;
    fetchAllStarships(characters.value);
  } else {
    fetchCharacters();
  }
});
</script> -->
<template>
  <div>
    <h2>Редактировать персонажей</h2>
    <div v-if="characters.length > 0">
      <ul>
        <li v-for="character in characters" :key="character.id">
          <span>{{ character.name }} ({{ character.birth_year }})</span>
          <button @click="removeCharacter(character.id)">Удалить</button>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>Нет персонажей для отображения.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useCharactersStore } from "../stores/characters";

const charactersStore = useCharactersStore();
const characters = ref<SimplifiedCharacter[]>([]);

onMounted(() => {
  characters.value = charactersStore.characters;
});

const removeCharacter = (id: number) => {
  charactersStore.removeCharacter(id);
  characters.value = charactersStore.characters; // Update local state after removal
};
</script>

<style scoped>
/* Добавьте свои стили */
ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
  margin: 0.5rem 0;
}

button {
  background-color: red;
  color: white;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
}

button:hover {
  background-color: darkred;
}
</style>
