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

  return {
    initialValues,
    buildPayload,
    finalizeTimelineEvent,
  };
};
