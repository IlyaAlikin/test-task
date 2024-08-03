<template>
  <div>
    <h2>Редактировать персонажей</h2>
    <div v-if="characters.length > 0">
      <ul>
        <li v-for="character in characters" :key="character.id">
          <span v-if="!isEditing(character.id)">
            {{ character.name }} ({{ character.birth_year }})
            <button @click="startEditing(character.id)">Редактировать</button>
          </span>
          <span v-else>
            <OwnInput label="Имя" v-model="editingCharacter.name" />
            <OwnInput
              label="Год рождения"
              v-model="editingCharacter.birth_year"
            />
            <button @click="saveCharacter(character.id)">Сохранить</button>
            <button @click="cancelEditing">Отмена</button>
          </span>
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
import OwnInput from "../components/OwnInput.vue";
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
