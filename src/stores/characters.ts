import { defineStore } from "pinia";
import { SimplifiedCharacter } from "../interfaces/chracter";

export const useCharactersStore = defineStore("characters", {
  state: () => ({
    characters: [] as SimplifiedCharacter[],
  }),
  actions: {
    setCharacters(characters: SimplifiedCharacter[]) {
      this.characters = characters;
      localStorage.setItem("characters", JSON.stringify(characters)); // Save to local storage
    },
    addCharacter(character: SimplifiedCharacter) {
      this.characters.push(character);
      localStorage.setItem("characters", JSON.stringify(this.characters)); // Save to local storage
    },
  },
  persist: true, // This line is crucial for Pinia's local storage persistence
});
