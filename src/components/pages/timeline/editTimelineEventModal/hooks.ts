// src/hooks/useTimelineEvent.ts
import { useMemo, useCallback } from "react";
import type { EventApi } from "@fullcalendar/core";

import { v4 as uuidv4 } from "uuid";
import type {
  Character,
  Place,
  TimelineEvent,
  Timeline,
} from "../../../../features/models";

/** イベント登録専用データ定義 */
export type TimelineEventFormData = {
  id: string;
  startTime: string;
  endTime?: string;
  placeId: string;
  place: Place;
  characterIds: string[];
  characters: Character[];
  color: string;
  detail: string;
};

/** 時刻文字列 → 今日の日付ISO */
const toToday = (timeStr: string): string => {
  const today = new Date();
  const [h, m] = timeStr.split(":").map(Number);
  return new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    h,
    m,
    0,
    0
  ).toISOString();
};

/** FullCalendar EventApi → フォームの型 */
const calendarToForm = (event: EventApi): TimelineEventFormData => {
  const isoToHM = (iso: string) => {
    const d = new Date(iso);
    return (
      `${String(d.getHours()).padStart(2, "0")}:` +
      `${String(d.getMinutes()).padStart(2, "0")}`
    );
  };

  return {
    id: event.id,
    startTime: event.startStr ? isoToHM(event.startStr) : "",
    endTime: event.endStr ? isoToHM(event.endStr) : "",
    detail: event.title,
    color: event.backgroundColor,
    characterIds: ((event.extendedProps.characters as Character[]) ?? []).map(
      (c) => String(c.id)
    ),
    characters: (event.extendedProps.characters as Character[]) ?? [],
    placeId: String((event.extendedProps.place as Place)?.id ?? ""),
    place: event.extendedProps.place as Place,
  };
};

/** フォームの型 → FullCalendar 用イベント型 */
const formToCalendar = (form: TimelineEventFormData) =>
  ({
    id: form.id,
    title: form.detail,
    start: toToday(form.startTime),
    end: form.endTime ? toToday(form.endTime) : "",
    borderColor: form.color,
    backgroundColor: form.color,
    extendedProps: {
      characters: form.characters,
      place: form.place,
    },
  } as TimelineEvent);

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
      const characters = values.characterIds
        .map(
          (id: string) =>
            config.characters.find((c: Character) => String(c.id) === id)!
        )
        .filter(Boolean);
      const place = config.places.find(
        (p: Place) => String(p.id) === values.placeId
      )!;
      return { ...values, characters, place };
    },
    [config]
  );

  // 3. 新規作成時はIDを補完するラッパー
  const finalizeTimelineEvent = useCallback(
    (values: TimelineEventFormData, isNew: boolean): TimelineEvent => {
      const formWithId =
        isNew && !values.id ? { ...values, id: uuidv4() } : values;
      return formToCalendar(formWithId);
    },
    []
  );

  return {
    initialValues,
    buildPayload,
    finalizeTimelineEvent: finalizeTimelineEvent,
  };
};
