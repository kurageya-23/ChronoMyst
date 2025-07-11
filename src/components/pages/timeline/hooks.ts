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
import { type EventApi, type EventDropArg } from "@fullcalendar/core";
import { type EventResizeDoneArg } from "@fullcalendar/interaction";
import { useDispatch } from "react-redux";
import { timelineSlice } from "../../../features/timelines/timelineSlice";
import { useDisclosure } from "@mantine/hooks";

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

  /** イベント編集モーダル */
  const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null);
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
