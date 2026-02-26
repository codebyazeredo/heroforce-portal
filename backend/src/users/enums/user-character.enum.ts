export enum UserCharacter {
  OTHERS = 0,
  SUPERMAN = 1,
  BATMAN = 2,
  IRONMAN = 3,
  SPIDERMAN = 4,
}

export const UserCharacterLabel: Record<UserCharacter, string> = {
  [UserCharacter.OTHERS]: "Outros",
  [UserCharacter.SUPERMAN]: "Superman",
  [UserCharacter.BATMAN]: "Batman",
  [UserCharacter.IRONMAN]: "Iron Man",
  [UserCharacter.SPIDERMAN]: "Spider Man",
};