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
    removeCharacter(url: string) {
      this.characters = this.characters.filter(
        (character) => character.url !== url
      );
    },
    updateCharacter(updatedCharacter: SimplifiedCharacter) {
      const index = this.characters.findIndex(
        (character) => character.url === updatedCharacter.url
      );
      if (index !== -1) {
        this.characters[index] = updatedCharacter;
      }
    },
  },
  persist: {
    enabled: true,
  },
});
