import { createSelector, type PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "../../app/createAppSlice";
import {
  charactersSample,
  placesSample,
  type CalendarEvent,
  type Scenario,
  type Timeline,
  type TimelineConfig,
} from "../models";
import type { RootState } from "../../app/store";

// Stateの初期化
const initialTimeline: Timeline = {
  scenario: {
    name: "無題",
    memo: "おもろそう",
  } as Scenario,
  calendarEvents: [],
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
      (state, action: PayloadAction<CalendarEvent>) => {
        state.calendarEvents.push(action.payload);
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
