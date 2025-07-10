import type { Character, Place } from "../features/models";

/** キャラクター */
export function validateCharacterItem(ch: Character): string | null {
  if (!ch.name) {
    return "キャラクター名は必須です";
  }

  return null;
}

/** 場所 */
export function validatePlaceItem(place: Place): string | null {
  if (!place.name) {
    return "場所名は必須です";
  }

  return null;
}
