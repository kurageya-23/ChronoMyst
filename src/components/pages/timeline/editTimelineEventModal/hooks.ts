// src/hooks/useTimelineEvent.ts
import { useMemo, useCallback } from "react";

import {
  type TimelineEvent,
  type Timeline,
  type TimelineEventFormData,
  solveTimelineEvent,
  assignTimelineEventId,
  type TimelineConfig,
  formToCalendar,
} from "../../../../features/models";
import { CALENDAR_INIT_DATE } from "../../../../app/appConstants";

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
    console.log("useTimelineEvent:event", event, config);
    return event!;
  }, [event]);

  // TODO: 重複しているので共通化 2. フォーム送信前にキャラクターと場所を解決
  const buildPayload = useCallback(
    (values: TimelineEventFormData): TimelineEventFormData => {
      return solveTimelineEvent(values, config);
    },
    [config]
  );

  // TODO: 重複しているので共通化 3. 新規作成時はIDを補完するラッパー
  const finalizeTimelineEvent = useCallback(
    (values: TimelineEventFormData, isNew: boolean): TimelineEvent => {
      const formWithId = assignTimelineEventId(values, isNew);
      return formToCalendar(formWithId);
    },
    []
  );

  type TimeItem = { value: string; label: string };
  type GroupedTimeOptions = {
    group: string;
    items: TimeItem[];
  }[];

  const useTimeOptions = (
    config: Pick<
      TimelineConfig,
      "timelineStartTime" | "timelineEndTime" | "interval"
    >
  ): GroupedTimeOptions => {
    return useMemo<GroupedTimeOptions>(() => {
      // "HH:mm" → 分
      const toMinutes = (hm: string) => {
        const [h, m] = hm.split(":").map(Number);
        return h * 60 + m;
      };

      const startMin = toMinutes(config.timelineStartTime);
      const endMin = toMinutes(config.timelineEndTime);
      const stepMin = toMinutes(config.interval);

      // カレンダー初期日付の午夜をベースにする
      const baseDate = new Date(`${CALENDAR_INIT_DATE}T00:00:00`);

      type Flat = { group: string; value: string; label: string };
      const flat: Flat[] = [];

      for (let t = startMin; t <= endMin; t += stepMin) {
        const rawH = Math.floor(t / 60);
        const m = t % 60;
        const labelH = rawH % 24;
        const hh = String(labelH).padStart(2, "0");
        const mm = String(m).padStart(2, "0");

        // 何日目か = (rawH / 24 の切り捨て) + 1
        const dayNum = Math.floor(rawH / 24) + 1;
        const group = `${dayNum}日目`;
        const label = `${hh}:${mm}`;

        // baseDate をコピーして日数をずらす
        const dt = new Date(baseDate);
        dt.setDate(dt.getDate() + (dayNum - 1));
        // 時刻をセット
        dt.setHours(labelH, m, 0, 0);

        // ローカル時刻を ISO UTC 文字列に
        const value = dt.toISOString();

        flat.push({ group, value, label });
      }

      // グループ化して返却
      const map = new Map<string, TimeItem[]>();
      flat.forEach(({ group, value, label }) => {
        if (!map.has(group)) {
          map.set(group, []);
        }
        map.get(group)!.push({ value, label });
      });

      return Array.from(map, ([group, items]) => ({ group, items }));
    }, [config.timelineStartTime, config.timelineEndTime, config.interval]);
  };

  return {
    initialValues,
    buildPayload,
    finalizeTimelineEvent,
    useTimeOptions,
  };
};
