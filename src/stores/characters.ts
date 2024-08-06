import { defineStore } from "pinia";
import { SimplifiedCharacter } from "../interfaces/character";

export const useCharactersStore = defineStore("characters", {
  state: () => ({
    characters: [] as SimplifiedCharacter[],
    starships: [] as any[], // Добавляем состояние для истребителей
    nextId: 1,
  }),
  actions: {
    setCharacters(characters: SimplifiedCharacter[]) {
      this.characters = characters.map((char, index) => ({
        ...char,
        id: index + 1,
      }));
      this.nextId = characters.length + 1;
    },
    addCharacter(character: SimplifiedCharacter) {
      character.id = this.nextId;
      this.characters.push(character);
      this.nextId++;
    },
    removeCharacter(id: number) {
      this.characters = this.characters.filter(
        (character) => character.id !== id
      );
      this.updateIds();
    },
    updateCharacter(id: number, updatedCharacter: SimplifiedCharacter) {
      const index = this.characters.findIndex(
        (character) => character.id === id
      );
      if (index !== -1) {
        this.characters[index] = { ...updatedCharacter, id }; // Ensure id is preserved
      }
    },
    updateIds() {
      this.characters = this.characters.map((char, index) => ({
        ...char,
        id: index + 1,
      }));
      this.nextId = this.characters.length + 1;
    },
    setStarships(starships: any[]) {
      this.starships = starships;
    },
    addStarship(starship: any) {
      this.starships.push(starship);
    },
  },
  persist: {
    enabled: true,
  },
});
