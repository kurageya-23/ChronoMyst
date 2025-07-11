import { createSelector, type PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "../../app/createAppSlice";
import {
  charactersSample,
  placesSample,
  type TimelineEvent,
  type Scenario,
  type Timeline,
  type TimelineConfig,
  type EditCharacterMemoFormData,
} from "../models";
import type { RootState } from "../../app/store";

// Stateの初期化
const initialTimeline: Timeline = {
  scenario: {
    name: "無題",
    memo: "おもろそう",
  } as Scenario,
  timelineEvents: [],
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
        console.debug("[reducer] updateScenarioName start.", action.payload);
        state.scenario.name = action.payload;
        console.debug("[reducer] updateScenarioName end.");
      }
    ),
    /** 設定更新 */
    updateConfig: create.reducer(
      (state, action: PayloadAction<TimelineConfig>) => {
        console.debug("[reducer] updateConfig start.", action.payload);
        state.config = action.payload;
        console.debug("[reducer] updateConfig end.");
      }
    ),
    /** キャラクターメモの更新 */
    updateCharacterMemo: create.reducer(
      (state, action: PayloadAction<EditCharacterMemoFormData>) => {
        console.debug("[reducer] updateCharacterMemo start.", action.payload);
        // キャラクターIDからキャラクターを特定し、メモの内容を更新
        const { selectedCharacterId, memo } = action.payload;
        const character = state.config.characters.find(
          (c) => c.id === selectedCharacterId
        );
        if (character) {
          character.memo = memo;
        }
        console.debug("[reducer] updateCharacterMemo end.");
      }
    ),
    /** イベント登録 */
    createTimelineEvent: create.reducer(
      (state, action: PayloadAction<TimelineEvent>) => {
        console.debug("[reducer] createTilelineEvent start.", action.payload);
        state.timelineEvents.push(action.payload);
        console.debug("[reducer] createTilelineEvent end.");
      }
    ),
    /** イベント更新 */
    updateTimelineEvent: create.reducer(
      (state, action: PayloadAction<TimelineEvent>) => {
        console.debug("[reducer] updateTilelineEvent start.", action.payload);
        const updated = action.payload;
        const event = state.timelineEvents.find((ev) => ev.id === updated.id);
        if (event) {
          Object.assign(event, updated);
          console.debug(
            `[reducer] updateTilelineEvent updated.(${updated.id})`
          );
        } else {
          console.error(
            `[reducer] updateTilelineEvent id not found.(${updated.id})`
          );
        }
        console.debug(
          "[reducer] updateTilelineEvent end.",
          state.timelineEvents
        );
      }
    ),
    /** イベント削除 */
    deleteTimelineEvent: create.reducer(
      (state, action: PayloadAction<string>) => {
        console.debug("[reducer] deleteTimelineEvent start.", action.payload);
        // id をキーに該当イベントを除外
        state.timelineEvents = state.timelineEvents.filter(
          (ev) => ev.id !== action.payload
        );
        console.debug(
          "[reducer] deleteTimelineEvent end.",
          state.timelineEvents
        );
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
