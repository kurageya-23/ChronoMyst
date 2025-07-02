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

// TODO: 出来事
export type TimelineEvent = {
  startTime: string;
  endTime?: string;
  placeId: string;
  place: Place;
  characterIds: string[];
  characters: Character[];
  color: string;
  detail: string;
};

// TODO: 出来事
export type CalendarEvent = {
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
  // TODO: 出来事リスト
  calendarEvents: CalendarEvent[];
  // 設定
  config: TimelineConfig;
};

// キャラクターデータのサンプル
export const charactersSample = [
  {
    id: 1,
    name: "キャラクターA",
    playerName: "プレイヤーA",
    memo: "つよそう",
  } as Character,
  {
    id: 2,
    name: "キャラクターB",
    playerName: "プレイヤーB",
    memo: "よわそう",
  } as Character,
  {
    id: 3,
    name: "キャラクターC",
    playerName: "プレイヤーC",
    memo: "かわいい",
  } as Character,
];

// 場所データのサンプル
export const placesSample = [
  { id: 1, name: "エントランス", memo: "" } as Place,
  { id: 2, name: "調理室", memo: "" } as Place,
  { id: 3, name: "倉庫", memo: "" } as Place,
];
