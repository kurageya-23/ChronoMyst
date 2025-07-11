import { useCallback } from "react";
import {
  assignTimelineEventId,
  calendarToForm,
  solveTimelineEvent,
  type Timeline,
  type TimelineEvent,
  type TimelineEventFormData,
} from "../../../features/models";
import { type EventApi, type EventDropArg } from "@fullcalendar/core";
import { type EventResizeDoneArg } from "@fullcalendar/interaction";
import { useDispatch } from "react-redux";
import { timelineSlice } from "../../../features/timelines/timelineSlice";

/**
 * カスタムフック
 * @param config Timeline.config（characters, places 等）
 */
export const useTimeline = (
  event: EventApi | null,
  config: Timeline["config"]
) => {
  /** フォーム送信前にキャラクターと場所を解決 */
  const buildPayload = useCallback(
    (values: TimelineEventFormData): TimelineEventFormData => {
      return solveTimelineEvent(values, config);
    },
    [config]
  );

  /** 新規作成時はIDを補完するラッパー */
  const finalizeTimelineEvent = useCallback(
    (values: TimelineEventFormData, isNew: boolean): TimelineEvent => {
      return assignTimelineEventId(values, isNew);
    },
    []
  );

  const dispatch = useDispatch();

  /** ドロップイベントハンドラ */
  const handleEventDrop = (info: EventDropArg) => {
    const ev = calendarToForm(info.event);
    const mapped = buildPayload(ev);
    const timelineEvent = finalizeTimelineEvent(mapped, !event);
    dispatch(timelineSlice.actions.updateTimelineEvent(timelineEvent));
  };

  /** リサイズイベントハンドラ */
  const handleEventResize = (info: EventResizeDoneArg) => {
    const ev = calendarToForm(info.event);
    const mapped = buildPayload(ev);
    const timelineEvent = finalizeTimelineEvent(mapped, !event);
    dispatch(timelineSlice.actions.updateTimelineEvent(timelineEvent));
  };

  return {
    buildPayload,
    finalizeTimelineEvent,
    handleEventDrop,
    handleEventResize,
  };
};
