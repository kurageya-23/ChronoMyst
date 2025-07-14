// src/hooks/useTimelineEvent.ts
import { useMemo, useCallback } from "react";

import {
  type Place,
  type TimelineEvent,
  type Timeline,
  type TimelineEventFormData,
  solveTimelineEvent,
  assignTimelineEventId,
  type Character,
} from "../../../../features/models";
import { COLOR_EVENT_DEFAULT } from "../../../../app/appConstants";

/**
 * カスタムフック
 * @param event 選択中の EventApi または null
 * @param config Timeline.config（characters, places 等）
 */
export const useTimelineEvent = (
  event: TimelineEventFormData | null,
  config: Timeline["config"]
) => {
  // 1. 初期値をメモ化
  const initialValues: TimelineEventFormData = useMemo(() => {
    if (event?.id) return event;
    if (event?.startTime) return event;

    return {
      id: "",
      startTime: "",
      endTime: "",
      days: "1",
      detail: "",
      color: COLOR_EVENT_DEFAULT,
      witnessId: "",
      witness: {} as Character,
      characterIds: [],
      characters: [],
      placeId: "",
      place: {} as Place,
    };
  }, [event]);

  // 2. フォーム送信前にキャラクターと場所を解決
  const buildPayload = useCallback(
    (values: TimelineEventFormData): TimelineEventFormData => {
      return solveTimelineEvent(values, config);
    },
    [config]
  );

  // 3. 新規作成時はIDを補完するラッパー
  const finalizeTimelineEvent = useCallback(
    (values: TimelineEventFormData, isNew: boolean): TimelineEvent => {
      return assignTimelineEventId(values, isNew);
    },
    []
  );

  /** 開始時間、終了時間TimeInputのプリセットを生成 */
  const getTimePresets = (days: number) => {
    const toMinutes = (hm: string) => {
      const [h, m] = hm.split(":").map(Number);
      return h * 60 + m;
    };
    const toHmString = (min: number) => {
      const h = Math.floor(min / 60);
      const m = min % 60;
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    };

    const startMin = toMinutes(config.startTime);
    const endMin = toMinutes(config.endTime);
    const stepMin = toMinutes(config.interval);
    const fullStart = toMinutes("00:00");
    const fullEnd = toMinutes("24:00"); // 1440 分

    const times: string[] = [];
    // 1日表示 or 単一日モード
    if (config.days <= 1) {
      for (let t = startMin; t <= endMin; t += stepMin) {
        times.push(toHmString(t));
      }
      return times;
    }

    // 複数日モード
    if (days === 1) {
      // 1日目: startTime → 24:00
      for (let t = startMin; t <= fullEnd; t += stepMin) {
        times.push(toHmString(t));
      }
    } else if (days === config.days) {
      // 最終日: 00:00 → endTime
      for (let t = fullStart; t <= endMin; t += stepMin) {
        times.push(toHmString(t));
      }
    } else {
      // 中間日: 00:00 → 24:00
      for (let t = fullStart; t <= fullEnd; t += stepMin) {
        times.push(toHmString(t));
      }
    }

    return times;
  };

  return {
    initialValues,
    buildPayload,
    finalizeTimelineEvent,
    getTimePresets,
  };
};
