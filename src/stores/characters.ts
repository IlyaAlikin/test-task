import { defineStore } from "pinia";
import { SimplifiedCharacter } from "../interfaces/character";

export const useCharactersStore = defineStore("characters", {
  state: () => ({
    characters: [] as SimplifiedCharacter[],
  }),
  actions: {
    setCharacters(characters: SimplifiedCharacter[]) {
      this.characters = characters;
    },
    addCharacter(character: SimplifiedCharacter) {
      this.characters.push(character);
    },
  },
  persist: {
    enabled: true, // Enable persistence
  },
});
