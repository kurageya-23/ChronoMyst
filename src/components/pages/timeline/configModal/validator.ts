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
  startTime: (value: string, values: TimelineConfig) => {
    if (!value) {
      return "必須項目です";
    }

    // 終了時間がセットされていれば「開始 < 終了」をチェック
    if (values.endTime) {
      const [sh, sm] = value.split(":").map(Number);
      const [eh, em] = values.endTime.split(":").map(Number);
      if (sh * 60 + sm >= eh * 60 + em) {
        return "開始時間は終了時間より前にしてください";
      }
    }
    return null;
  },
  // 終了時刻
  endTime: (value: string, values: TimelineConfig) => {
    if (!value) {
      return "必須項目です";
    }

    // 開始時間がセットされていれば「開始 < 終了」をチェック
    if (values.startTime) {
      const [sh, sm] = values.startTime.split(":").map(Number);
      const [eh, em] = value.split(":").map(Number);
      if (sh * 60 + sm >= eh * 60 + em) {
        return "終了時間は開始時間より後にしてください";
      }
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
