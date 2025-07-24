import type { FormValidateInput } from "@mantine/form";
import type { TimelineEventFormData } from "../../../../features/models";

export const editEventModalValidator: FormValidateInput<TimelineEventFormData> =
  {
    // 開始時刻
    startDateTimeStr: (value: string, values: TimelineEventFormData) => {
      if (!value) {
        return "必須項目です";
      }

      // 終了時間がセットされていれば「開始 < 終了」をチェック
      if (values.endDateTimeStr) {
        const start = new Date(value);
        const end = new Date(values.endDateTimeStr);
        if (start >= end) {
          return "開始時間は終了時間より前にしてください";
        }
      }
      return null;
    },
    // 終了時刻
    endDateTimeStr: (
      value: string | undefined,
      values: TimelineEventFormData
    ) => {
      if (!value) {
        return "必須項目です";
      }

      // 開始時間がセットされていれば「開始 < 終了」をチェック
      if (values.startDateTimeStr) {
        const start = new Date(values.startDateTimeStr);
        const end = new Date(value);
        if (start >= end) {
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
