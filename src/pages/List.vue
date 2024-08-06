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
import { SimplifiedCharacter } from "../interfaces/character";

const charactersStore = useCharactersStore();
const characters = ref<SimplifiedCharacter[]>([]);
const shipData = ref<{ [key: string]: any }>({});

const router = useRouter();

const loadCharactersFromStore = () => {
  characters.value = charactersStore.characters;
  fetchAllStarships(characters.value);
};

const fetchAllStarships = async (characters: SimplifiedCharacter[]) => {
  for (const character of characters) {
    if (character.starships.length >= 1 && character.starships[0] !== "") {
      const starshipUrl = character.starships[0];
      // Ensure that the starship is not already in shipData
      if (!shipData.value[starshipUrl]) {
        const starship = charactersStore.starships.find(
          (st) => st.url === starshipUrl
        );
        if (starship) {
          shipData.value[starshipUrl] = starship;
        }
      }
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
  loadCharactersFromStore();
};

onMounted(() => {
  if (charactersStore.characters.length > 0) {
    loadCharactersFromStore();
  } else {
    loadCharactersFromStore();
  }
});
</script>
