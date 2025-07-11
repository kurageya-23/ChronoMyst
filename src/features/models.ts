import type { EventApi } from "@fullcalendar/core";
import { v4 as uuidv4 } from "uuid";

/** --------データモデル-------- */
// シナリオ
export type Scenario = {
  name: string;
  memo: string;
};

// キャラクター
export type Character = {
  id: number;
  name: string;
  playerName: string;
  color: string;
  memo: string;
};

// 場所
export type Place = {
  id: number;
  name: string;
  color: string;
  memo: string;
};

// 出来事
export type TimelineEvent = {
  id: string;
  gourpId: string;
  start: string; // RTKの要件上、シリアライズ不能なDate型は使えないので、コンポーネント側でnew Date(str)する
  end: string;
  title: string;
  url: string;
  classNames: string[];
  editable: boolean;
  startEditable: boolean;
  durationEditable: boolean;
  resourceEditable: boolean;
  display:
    | "auto"
    | "block"
    | "list-item"
    | "background"
    | "inverse-background"
    | "none";
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  extendedProps: ExtendedCalenderEventProp;
};

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

// カレンダーイベントの拡張プロパティ
export type ExtendedCalenderEventProp = {
  characters: Character[];
  place?: Place;
};

// タイムライン設定
export type TimelineConfig = {
  interval: string;
  startTime: string;
  endTime: string;
  characters: Character[];
  places: Place[];
};

// タイムライン
export type Timeline = {
  // シナリオ情報
  scenario: Scenario;
  // 出来事リスト
  timelineEvents: TimelineEvent[];
  // 設定
  config: TimelineConfig;
};

/** --------モデルに関する処理-------- */
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
export const calendarToForm = (event: EventApi): TimelineEventFormData => {
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
export const formToCalendar = (form: TimelineEventFormData) =>
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

/** キャラクターと場所を解決 */
export const solveTimelineEvent = (
  values: TimelineEventFormData,
  config: TimelineConfig
): TimelineEventFormData => {
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
};

export const assignTimelineEventId = (
  values: TimelineEventFormData,
  isNew: boolean
) => {
  const formWithId =
    isNew && !values.id
      ? ({ ...values, id: uuidv4() } as unknown as TimelineEventFormData)
      : values;
  return formToCalendar(formWithId);
};

/** -------サンプルデータ-------- */
// キャラクターデータのサンプル
export const charactersSample = [
  {
    id: 1,
    name: "キャラクターA",
    playerName: "プレイヤーA",
    memo: "つよそう",
    color: "#fa5252",
  } as Character,
  {
    id: 2,
    name: "キャラクターB",
    playerName: "プレイヤーB",
    memo: "よわそう",
    color: "#fa5252",
  } as Character,
  {
    id: 3,
    name: "キャラクターC",
    playerName: "プレイヤーC",
    memo: "かわいい",
    color: "#fa5252",
  } as Character,
];

// 場所データのサンプル
export const placesSample = [
  { id: 1, name: "エントランス", memo: "" } as Place,
  { id: 2, name: "調理室", memo: "" } as Place,
  { id: 3, name: "倉庫", memo: "" } as Place,
];
