import type { PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "../../app/createAppSlice";

// シナリオ
export type Scenario = {
  name: string;
  memo: string;
};

// タイムライン
export type Timeline = {
  // シナリオ情報
  scenario: Scenario;
  // 時間（ex. 11:00）
  times: string[];
  // キャラクターリスト
  characters: Character[];
  // 場所
  places: Place[];
  // 出来事リスト
  events: TimelineEvent[];
};

// キャラクター
export type Character = {
  name: string;
  playerName: string;
  color: string;
  memo: string;
};

// 場所
export type Place = {
  name: string;
  color: string;
  memo: string;
};

// 出来事
export type TimelineEvent = {
  startTime: string;
  endTime?: string;
  place: Place;
  characters: Character[];
  color: string;
  detail: string;
};

// タイムライン設定
export type TimelineConfig = {
  interval: string;
  startTime: string;
  endTime: string;
  characters: Character[];
  places: Place[];
};

const initialTimeline: Timeline = {
  scenario: {
    name: "とあるマーダーミステリー",
    memo: "おもろそう",
  } as Scenario,
  times: ["10:00", "10:30", "11:00", "11:30", "12:00", "12:30"],
  characters: [
    {
      name: "キャラクターA",
      playerName: "プレイヤーA",
      memo: "つよそう",
    } as Character,
    {
      name: "キャラクターB",
      playerName: "プレイヤーB",
      memo: "よわそう",
    } as Character,
    {
      name: "キャラクターC",
      playerName: "プレイヤーC",
      memo: "かわいい",
    } as Character,
  ],
  places: [
    { name: "エントランス", memo: "" } as Place,
    { name: "Aの部屋", memo: "" } as Place,
    { name: "倉庫", memo: "" } as Place,
  ],
  events: [
    {
      startTime: "10:00",
      place: { name: "エントランス", memo: "広い" },
      characters: [
        {
          name: "キャラクターA",
          playerName: "プレイヤーA",
          memo: "つよそう",
        } as Character,
        {
          name: "キャラクターB",
          playerName: "プレイヤーB",
          memo: "よわそう",
        } as Character,
      ],
      detail: "A,Bが会ってた",
    } as TimelineEvent,
    {
      startTime: "11:00",
      endTime: "12:00",
      place: { name: "Aの部屋", memo: "狭い" },
      characters: [
        {
          name: "キャラクターC",
          playerName: "プレイヤーC",
          memo: "かわいい",
        } as Character,
      ],
      detail: "Cがひとり",
    } as TimelineEvent,
    {
      startTime: "11:30",
      place: { name: "倉庫", memo: "散らかっている" },
      detail: "謎の音",
      color: "red",
    } as TimelineEvent,
  ],
};

export const timelineSlice = createAppSlice({
  name: "timeline",
  initialState: initialTimeline,
  reducers: (create) => ({
    save: create.reducer((_state, action: PayloadAction<Timeline>) => {
      return action.payload;
    }),
    updateScenarioName: create.reducer(
      (state, action: PayloadAction<string>) => {
        state.scenario.name = action.payload;
      }
    ),
    updateConfig: create.reducer(
      (state, action: PayloadAction<TimelineConfig>) => {
        const { startTime, endTime, interval } = action.payload;

        // "HH:mm" → 分数に変換
        const toMinutes = (hm: string) => {
          const [h, m] = hm.split(":").map(Number);
          return h * 60 + m;
        };

        // 分数 → "HH:mm" フォーマットに変換
        const toHmString = (min: number) => {
          const h = Math.floor(min / 60);
          const m = min % 60;
          return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
        };

        const start = toMinutes(startTime);
        const end = toMinutes(endTime);
        const step = toMinutes(interval);

        // 範囲チェック
        if (step <= 0 || end < start) {
          // 異常値は無視 or 既存の state.times をそのまま返す
          return;
        }

        // 新しい times 配列を生成
        const newTimes: string[] = [];
        for (let t = start; t <= end; t += step) {
          newTimes.push(toHmString(t));
        }

        state.times = newTimes;

        // キャラクター、プレイヤー、場所
        const { characters, places } = action.payload;
        state.characters = characters;
        state.places = places;
      }
    ),
  }),
  selectors: {
    selectTimeline: (timeline) => timeline,
  },
});
