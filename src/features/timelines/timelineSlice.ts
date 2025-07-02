import { createSelector, type PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "../../app/createAppSlice";
import {
  charactersSample,
  placesSample,
  type CalendarEvent,
  type Character,
  type Place,
  type Scenario,
  type Timeline,
  type TimelineConfig,
  type TimelineEvent,
} from "../models";
import type { RootState } from "../../app/store";

// 日付変換
const today = new Date();
const toToday = function (timeStr: string): string {
  const [h, m] = timeStr.split(":").map((s) => Number(s));

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

/** タイムラインイベントからカレンダーイベントへの変換 */
const timelineToCalendar = function (timeline: TimelineEvent) {
  return {
    id: generateCalendarEventId(timeline),
    title: timeline.detail,
    start: toToday(timeline.startTime),
    end: timeline.endTime ? toToday(timeline.endTime) : timeline.endTime,
    borderColor: timeline.color,
    backgroundColor: timeline.color,
    extendedProps: {
      characters: timeline.characters,
      place: timeline.place,
    },
  } as CalendarEvent;
};

/** タイムラインイベントからカレンダーIDを生成 */
const generateCalendarEventId = function (timeline: TimelineEvent): string {
  return (
    timeline.characters.map((c) => c.id).join(",") +
    "|" +
    new Date().toISOString()
  );
};

// Stateの初期化
const initialTimeline: Timeline = {
  scenario: {
    name: "無題",
    memo: "おもろそう",
  } as Scenario,
  calendarEvents: [
    timelineToCalendar({
      startTime: "22:00",
      endTime: "23:00",
      detail: "AとBが談笑していた",
      characters: [
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
      ],
      place: { id: 1, name: "エントランス", memo: "" } as Place,
      color: "#868e96",
    } as TimelineEvent),
  ],
  config: {
    interval: "01:00",
    startTime: "18:00",
    endTime: "23:00",
    characters: charactersSample,
    places: placesSample,
  } as TimelineConfig,
};

export const timelineSlice = createAppSlice({
  name: "timeline",
  initialState: initialTimeline,
  reducers: (create) => ({
    save: create.reducer((_state, action: PayloadAction<Timeline>) => {
      return action.payload;
    }),
    /** シナリオ名更新 */
    updateScenarioName: create.reducer(
      (state, action: PayloadAction<string>) => {
        state.scenario.name = action.payload;
      }
    ),
    /** 設定更新 */
    updateConfig: create.reducer(
      (state, action: PayloadAction<TimelineConfig>) => {
        state.config = action.payload;
      }
    ),
    /** イベント登録 */
    createTimelineEvent: create.reducer(
      (state, action: PayloadAction<TimelineEvent>) => {
        state.calendarEvents.push(timelineToCalendar(action.payload));
      }
    ),
  }),
  selectors: {
    selectTimeline: (timeline) => timeline,
  },
});

/** 開始時間と終了時間と間隔から時間の選択肢を生成 */
export const selectTimes = createSelector(
  (state: RootState) => state[timelineSlice.reducerPath].config,
  (config) => {
    const toMinutes = (hm: string) => {
      const [h, m] = hm.split(":").map(Number);
      return h * 60 + m;
    };
    const toHmString = (min: number) => {
      const h = Math.floor(min / 60);
      const m = min % 60;
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    };

    const start = toMinutes(config.startTime);
    const end = toMinutes(config.endTime);
    const step = toMinutes(config.interval);

    const arr: string[] = [];
    for (let t = start; t <= end; t += step) {
      arr.push(toHmString(t));
    }
    return arr;
  }
);
