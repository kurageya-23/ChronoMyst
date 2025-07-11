import type { FormValidateInput } from "@mantine/form";
import type { TimelineEventFormData } from "./hooks";

export const editEventModalValidator: FormValidateInput<TimelineEventFormData> =
  {
    // 開始時刻
    startTime: (value: string, values: TimelineEventFormData) => {
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
    endTime: (value: string | undefined, values: TimelineEventFormData) => {
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
    // キャラクターID
    characterIds: (values: string[]) => {
      // 最低1人は選択必須
      if (values.length < 1) {
        return "登場人物を最低1名選択してください";
      }

      return null;
    },
  };
