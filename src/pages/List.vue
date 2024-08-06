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
    </div>
  </div>
  <div>
    <button class="add_button" @click="createCharacter">
      Добавить нового персонажа
    </button>
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

const editCharacter = (id: number) => {
  router.push({ name: "Edit", params: { id } });
};

const createCharacter = () => {
  router.push({ name: "Edit" });
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
.add_button {
  margin-top: 10px;
}
</style>
