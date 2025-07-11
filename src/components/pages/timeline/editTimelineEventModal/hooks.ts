// src/hooks/useTimelineEvent.ts
import { useMemo, useCallback } from "react";
import type { EventApi } from "@fullcalendar/core";

import {
  type Place,
  type TimelineEvent,
  type Timeline,
  type TimelineEventFormData,
  calendarToForm,
  solveTimelineEvent,
  assignTimelineEventId,
} from "../../../../features/models";

/**
 * カスタムフック
 * @param event 選択中の EventApi または null
 * @param config Timeline.config（characters, places 等）
 */
export const useTimelineEvent = (
  event: EventApi | null,
  config: Timeline["config"]
) => {
  // 1. 初期値をメモ化
  const initialValues: TimelineEventFormData = useMemo(() => {
    if (!event) {
      return {
        id: "",
        startTime: "",
        endTime: "",
        detail: "",
        color: "#868e96",
        characterIds: [],
        characters: [],
        placeId: "",
        place: {} as Place,
      };
    }
    return calendarToForm(event);
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

  return {
    initialValues,
    buildPayload,
    finalizeTimelineEvent: finalizeTimelineEvent,
  };
};
