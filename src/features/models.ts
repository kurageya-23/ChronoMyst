import type { EventApi } from "@fullcalendar/core";
import { v4 as uuidv4 } from "uuid";

/** --------データモデル-------- */
// プルダウンのオプション（ライブラリ準拠）
export type SelectOption = {
  value: string;
  label: string;
};

// シナリオ
export type Scenario = {
  name: string;
  memo: string;
};

// キャラクター
export type Character = {
  id: string;
  name: string;
  playerName: string;
  color: string;
  memo: string;
  sort: number;
};

// 場所
export type Place = {
  id: string;
  name: string;
  color: string;
  memo: string;
  sort: number;
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
  startDateTime: Date | null;
  startDateTimeStr: string;
  startTime: string;
  endDateTime: Date | null;
  endDateTimeStr: string;
  endTime: string;
  placeId: string;
  place: Place;
  witnessId: string;
  witness: Character;
  characterIds: string[];
  characters: Character[];
  color: string;
  detail: string;
};

/** キャラクターメモ専用データ定義 */
export type EditCharacterMemoFormData = {
  selectedCharacterId: string;
  memo: string;
};

// カレンダーイベントの拡張プロパティ
export type ExtendedCalenderEventProp = {
  witness: Character;
  characters: Character[];
  place?: Place;
};

// タイムライン設定
export type TimelineConfig = {
  // 時間間隔
  interval: string;
  // 行動時間量
  timeAmount: string;
  // 行動開始 タイムライン時間
  timelineStartTime: string;
  // 行動終了 タイムライン時間 = 行動開始 タイムライン時間 + 行動時間量
  timelineEndTime: string;
  witnesses: Character[];
  characters: Character[];
  places: Place[];
  prologue: string;
  timeSlots: SelectOption[];
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

/** タイムラインデータのJson定義 */
export type TimelineJson = {
  appName: string;
  version: string;
  data: Timeline;
};

/** ******** マップ関連 ******** */
export type MapData = {
  mapImage: string;
  mapMarkers: MapMarker[];
  selectedTime: string;
};

/** マップマーカーの位置 */
export type MapMarkerPos = { x: number; y: number };

/** マップマーカー */
export type MapMarker = {
  placeId: string;
  place: Place | undefined;
  pos: MapMarkerPos;
};

/** --------モデルに関する処理-------- */
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
    startDateTime: event.start,
    startDateTimeStr: event.start?.toISOString() ?? "",
    startTime: event.startStr ? isoToHM(event.startStr) : "",
    endDateTime: event.end,
    endDateTimeStr: event.end?.toISOString() ?? "",
    endTime: event.endStr ? isoToHM(event.endStr) : "",
    detail: event.title,
    color: event.backgroundColor,
    witnessId: (event.extendedProps.witness as Character)?.id ?? "",
    witness: event.extendedProps.witness as Character,
    characterIds: ((event.extendedProps.characters as Character[]) ?? []).map(
      (c) => c.id
    ),
    characters: (event.extendedProps.characters as Character[]) ?? [],
    placeId: (event.extendedProps.place as Place)?.id ?? "",
    place: event.extendedProps.place as Place,
  };
};

/** フォームの型 → FullCalendar 用イベント型 */
export const formToCalendar = (form: TimelineEventFormData) =>
  ({
    id: form.id,
    title: form.detail,
    start: form.startDateTimeStr,
    end: form.endDateTimeStr,
    borderColor: form.color,
    backgroundColor: form.color,
    extendedProps: {
      witness: form.witness,
      characters: form.characters,
      place: form.place,
    },
  } as TimelineEvent);

/** 証言者、関係者、場所を解決 */
export const solveTimelineEvent = (
  values: TimelineEventFormData,
  config: TimelineConfig
): TimelineEventFormData => {
  // 証言者
  const witness = config.witnesses.find(
    (w: Character) => w.id === values.witnessId
  )!;
  // キャラクター
  const characters = values.characterIds
    .map(
      (id: string) =>
        config.characters.find((c: Character) => String(c.id) === id)!
    )
    .filter(Boolean);
  // 場所
  const place = config.places.find((p: Place) => p.id === values.placeId)!;
  return { ...values, witness, characters, place };
};

/** 新規のイベントIDを採番します */
export const assignTimelineEventId = (
  values: TimelineEventFormData,
  isNew: boolean
): TimelineEventFormData => {
  const formWithId =
    isNew && !values.id
      ? ({ ...values, id: uuidv4() } as unknown as TimelineEventFormData)
      : values;
  return formWithId;
};
