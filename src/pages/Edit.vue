<template>
  <div>
    <h2 class="list-name">Редактировать персонажей</h2>
    <div class="edit">
      <div v-if="characters.length > 0" class="edit-list">
        <ul>
          <li v-for="character in characters" :key="character.id">
            <div v-if="isEditing(character.id)">
              <OwnInput
                class="edit-input"
                label="Имя"
                v-model="editingCharacter.name"
              />
              <OwnInput
                class="edit-input"
                label="Год рождения"
                v-model="editingCharacter.birth_year"
              />
              <OwnSelect
                v-model:selectedStarship="editingCharacter.starships[0]"
                @update:selectedStarship="updateStarship"
              />
              <div class="button__wrapper">
                <button @click="saveCharacter(character.id)">Сохранить</button>
                <button @click="cancelEditing">Отмена</button>
              </div>
            </div>
            <div v-else class="character">
              <div class="character-info">
                <div class="character-name">
                  {{ character.name }}
                </div>
                <div class="character-birth-year">
                  ({{ character.birth_year }})
                </div>
              </div>
              <button class="edit-button" @click="startEditing(character.id)">
                Редактировать
              </button>
            </div>
            <button
              class="delete-button"
              @click="removeCharacter(character.id)"
            >
              Удалить
            </button>
          </li>
        </ul>
      </div>
      <div v-else>
        <p>Нет персонажей для отображения.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useCharactersStore } from "../stores/characters";
// import OwnInput from "./OwnInput.vue";
import OwnSelect from "../components/OwnSelect.vue";
import OwnInput from "../components/OwnInput.vue";
// import OwnSelect from "./OwnSelect.vue";
import { SimplifiedCharacter } from "../interfaces/character";

const charactersStore = useCharactersStore();
const characters = ref<SimplifiedCharacter[]>([]);
const editingId = ref<number | null>(null);
const editingCharacter = ref<SimplifiedCharacter | null>(null);

onMounted(() => {
  characters.value = charactersStore.characters;
});

const startEditing = (id: number) => {
  editingId.value = id;
  const character = characters.value.find((c) => c.id === id);
  if (character) {
    editingCharacter.value = { ...character };
  }
};

const cancelEditing = () => {
  editingId.value = null;
  editingCharacter.value = null;
};

const saveCharacter = (id: number) => {
  if (editingCharacter.value) {
    charactersStore.updateCharacter(id, editingCharacter.value);
    characters.value = charactersStore.characters;
    cancelEditing();
  }
};

const updateStarship = (starship: any) => {
  if (editingCharacter.value) {
    editingCharacter.value.starships = [starship.url]; // Update with new starship URL
  }
};

const isEditing = (id: number) => {
  return editingId.value === id;
};

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
  width: inherit;
}

li {
  display: flex;
  justify-content: space-between;
  margin: 0.5rem 0;
}

.delete-button {
  background-color: red;
  color: white;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
}

.delete-button:hover {
  background-color: darkred;
}

.edit-input {
  margin-bottom: 10px;
  text-align: left;
}

.button__wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-top: 10px;
}

.character {
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  gap: 10px;
}
</style>
