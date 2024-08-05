<template>
  <h2 class="list-name">Число персонажей: {{ characters.length }}</h2>
  <div v-if="characters.length > 0">
    <div class="list">
      <div v-for="item in characters" class="card" :key="item.id">
        <div class="card__name card-field">
          <p>Имя:</p>
          <p>{{ item.name }}</p>
        </div>
        <div class="card__birth_year card-field">
          <p>Год рождения:</p>
          <p>{{ item.birth_year }}</p>
        </div>
        <div class="starship" v-if="item.starships.length >= 1">
          <div v-if="shipData[item.starships[0]]">
            <div>Название корабля: {{ shipData[item.starships[0]].name }}</div>
          </div>
        </div>
        <div class="card__actions">
          <button @click="editCharacter(item.id)">Изменить</button>
          <button class="delete-button" @click="removeCharacter(item.id)">
            Удалить
          </button>
        </div>
      </div>
      <div v-if="showNewCharacterForm" class="new-character">
        <h2 class="new-character__title">Добавить нового персонажа</h2>
        <form @submit.prevent="createCharacter" class="new-character__wrapper">
          <div class="new-field">
            <label class="label" for="name">Имя:</label>
            <input type="text" id="name" v-model="newCharacter.name" required />
          </div>
          <div class="new-field">
            <label class="label" for="birth_year">Год рождения:</label>
            <input
              type="text"
              id="birth_year"
              v-model="newCharacter.birth_year"
              required
            />
          </div>
          <div class="new-character__starship">
            <label for="starships">Корабль:</label>
            <OwnSelect @update:selectedStarship="updateSelectedStarship" />
          </div>
          <div class="new-characters__buttons">
            <button type="submit">Создать</button>
            <button type="button" @click="showNewCharacterForm = false">
              Отменить
            </button>
          </div>
        </form>
      </div>
      <div class="add_button" @click="showNewCharacterForm = true">
        Добавить
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCharactersStore } from "../stores/characters";
import axios from "axios";
import OwnSelect from "../components/OwnSelect.vue";
import { SimplifiedCharacter } from "../interfaces/character";

const charactersStore = useCharactersStore();
const characters = ref<SimplifiedCharacter[]>([]);
const showNewCharacterForm = ref(false);
const newCharacter = ref<SimplifiedCharacter>({
  id: Date.now(),
  name: "",
  birth_year: "",
  starships: [],
});
const selectedStarship = ref(null);
const shipData = ref<{ [key: string]: any }>({});

const router = useRouter();

const fetchCharacters = async () => {
  try {
    const response = await axios.get("https://swapi.dev/api/people/");
    const simplifiedCharacters = response.data.results.map(
      (char: any, index: number) =>
        ({
          id: index,
          name: char.name,
          birth_year: char.birth_year,
          starships: char.starships,
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

const createCharacter = async () => {
  if (selectedStarship.value) {
    newCharacter.value.starships.push(selectedStarship.value.url);
    await fetchStarship(selectedStarship.value.url);
  }
  newCharacter.value.id = Date.now();
  charactersStore.addCharacter(newCharacter.value);
  newCharacter.value = {
    id: Date.now(),
    name: "",
    birth_year: "",
    starships: [],
  };
  showNewCharacterForm.value = false;
};

const editCharacter = (id: number) => {
  router.push({ name: "Edit", params: { id } });
};

const removeCharacter = (id: number) => {
  charactersStore.removeCharacter(id);
  characters.value = charactersStore.characters;
};

onMounted(() => {
  if (charactersStore.characters.length > 0) {
    characters.value = charactersStore.characters;
    fetchAllStarships(characters.value);
  } else {
    fetchCharacters();
  }
});
</script>

<style scoped>
.label {
  text-align: left;
}
.new-characters__buttons {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}
.new-field {
  display: flex;
  flex-direction: column;
}
.new-field input {
  width: 100%;
}
.card__actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}
</style>
