import type { FormValidateInput } from "@mantine/form";
import type {
  Character,
  Place,
  TimelineConfig,
} from "../../../../features/models";
import {
  CHARACTER_MAX_COUNT,
  CHARACTER_MIN_COUNT,
  PLACE_MAX_COUNT,
} from "../../../../app/appConstants";
import {
  validateCharacterItem,
  validatePlaceItem,
} from "../../../../app/customValidation";

export const configModalValidator: FormValidateInput<TimelineConfig> = {
  interval: (value: string) => {
    if (!value) {
      return "必須項目です";
    }

    return null;
  },
  // 開始時刻
  timelineStartTime: (value: string) => {
    if (!value) {
      return "必須項目です";
    }
    return null;
  },
  characters: (list: Character[]) => {
    // 件数チェック
    if (list.length < CHARACTER_MIN_COUNT) {
      return "登場人物を最低1名追加してください";
    }
    if (list.length > CHARACTER_MAX_COUNT) {
      return "登場人物は最大10名まで登録できます";
    }

    // 各項目チェック
    const errors = list
      .map((ch) => validateCharacterItem(ch))
      .filter((message) => message);
    return errors.length > 0 ? errors[0] : null;
  },
  places: (list: Place[]) => {
    // 件数チェック
    if (list.length > PLACE_MAX_COUNT) {
      return "場所は最大10か所まで登録できます";
    }

    // 各項目チェック
    const errors = list
      .map((p) => validatePlaceItem(p))
      .filter((message) => message);
    return errors.length > 0 ? errors[0] : null;
  },
};
