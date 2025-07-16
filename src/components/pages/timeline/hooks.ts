import { useState } from "react";
import {
  assignTimelineEventId,
  calendarToForm,
  formToCalendar,
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
  const dispatch = useDispatch();

  /** TODO: 一度フォームデータにする必要は？ イベントデータの整形 */
  const solveData = (
    info: EventDropArg | EventResizeDoneArg
  ): TimelineEvent => {
    // フォームデータに変換
    const ev = calendarToForm(info.event);
    // 依存関係を解決
    const mapped = solveTimelineEvent(ev, config);
    // IDの新規採番
    const formWithId = assignTimelineEventId(mapped, !event);
    // カレンダーデータに戻す
    return formToCalendar(formWithId);
  };

  /** ドロップイベントハンドラ */
  const handleEventDrop = (info: EventDropArg) => {
    const soleved = solveData(info);
    dispatch(timelineSlice.actions.updateTimelineEvent(soleved));
  };

  /** リサイズイベントハンドラ */
  const handleEventResize = (info: EventResizeDoneArg) => {
    const soleved = solveData(info);
    dispatch(timelineSlice.actions.updateTimelineEvent(soleved));
  };

  /** タイムライン上の直接クリックイベントハンドラ */
  const handleClickTimeline = (info: DateClickArg, charcter: Character) => {
    // 開始時間はクリック箇所、終了時間は開始時間 + 時間間隔
    const intervalMin = toMinute(config.interval);
    setSelectedEvent({
      startDateTime: info.date,
      startDateTimeStr: info.date.toISOString(),
      startTime: info.date.toTimeString().slice(0, 5),
      endDateTime: addMinutes(info.date, intervalMin),
      endDateTimeStr: addMinutes(info.date, intervalMin).toISOString(),
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
