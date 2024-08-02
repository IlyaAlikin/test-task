import { defineStore } from "pinia";

export const useCharactersStore = defineStore("characters", {
  state: () => ({
    characters: [],
  }),
  actions: {
    setCharacters(characters) {
      this.characters = characters;
    },
    addCharacter(character) {
      this.characters.push(character);
    },
  },
});
