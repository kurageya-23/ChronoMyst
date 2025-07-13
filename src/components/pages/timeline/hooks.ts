import { useCallback, useState } from "react";
import {
  assignTimelineEventId,
  calendarToForm,
  solveTimelineEvent,
  type Character,
  type Timeline,
  type TimelineEvent,
  type TimelineEventFormData,
} from "../../../features/models";
import { type EventDropArg } from "@fullcalendar/core";
import {
  type DateClickArg,
  type EventResizeDoneArg,
} from "@fullcalendar/interaction";
import { useDispatch } from "react-redux";
import { timelineSlice } from "../../../features/timelines/timelineSlice";
import { useDisclosure } from "@mantine/hooks";
import { addMinutes, toMinute } from "../../../app/util";
import { COLOR_EVENT_DEFAULT } from "../../../app/appConstants";

/**
 * カスタムフック
 * @param config Timeline.config（characters, places 等）
 */
export const useTimeline = (config: Timeline["config"]) => {
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

  /** タイムライン上の直接クリックイベントハンドラ */
  const handleClickTimeline = (info: DateClickArg, charcter: Character) => {
    // 開始時間はクリック箇所、終了時間は開始時間 + 時間間隔
    const intervalMin = toMinute(config.interval);
    setSelectedEvent({
      startTime: info.date.toTimeString().slice(0, 5),
      endTime: addMinutes(info.date, intervalMin).toTimeString().slice(0, 5),
      detail: "",
      characterIds: [charcter.id],
      color: COLOR_EVENT_DEFAULT,
    } as TimelineEventFormData);
    EditTimelineEventOpen();
  };

  /** イベント編集モーダル */
  const [selectedEvent, setSelectedEvent] =
    useState<TimelineEventFormData | null>(null);
  const [
    isEditTimelineEventModalOpen,
    { open: EditTimelineEventOpen, close: EditTimelineEventClose },
  ] = useDisclosure(false);
  const handleEditTimelineEventClose = () => {
    EditTimelineEventClose();
    setSelectedEvent(null);
  };

  /** キャラクターメモ編集モーダル */
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );
  const [
    isEditCharacterMemoModalOpen,
    { open: EditCharacterMemoModalOpen, close: EditCharacterMemoModalClose },
  ] = useDisclosure(false);
  const handleEditCharacterMemoClose = () => {
    EditCharacterMemoModalClose();
    setSelectedCharacter(null);
  };

  return {
    buildPayload,
    finalizeTimelineEvent,
    handleEventDrop,
    handleEventResize,
    handleClickTimeline,
    // イベント編集モーダル
    selectedEvent,
    setSelectedEvent,
    isEditTimelineEventModalOpen,
    EditTimelineEventOpen,
    handleEditTimelineEventClose,
    // キャラクターメモ編集モーダル
    selectedCharacter,
    setSelectedCharacter,
    isEditCharacterMemoModalOpen,
    EditCharacterMemoModalOpen,
    handleEditCharacterMemoClose,
  };
};
