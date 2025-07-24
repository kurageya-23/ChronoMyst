import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { mapSlice } from "./mapSlice";
import type {
  MapData,
  MapMarker,
  SelectOption,
  TimelineConfig,
  TimelineEvent,
} from "../models";
import { toMinute } from "../../app/util";
import { getTimeSlots } from "../timelines/timelineSlice";
import { useMemo } from "react";
const selectRaw = (state: RootState) => state[mapSlice.reducerPath];
const selectPlaces = (state: RootState) => state.timeline.config.places;
const timelineEvents = (state: RootState) => state.timeline.timelineEvents;
const selectConfig = (state: RootState) => state.timeline.config;

/** マップに関するセレクター */
export const mapSelectors = {
  ...mapSlice.getSelectors<RootState>(selectRaw),
  /** 依存関係解決済みのマップデータを取得する */
  selectMapData: createSelector(
    [selectRaw, selectPlaces],
    (mapStoreData, places): MapData => ({
      mapImage: mapStoreData.mapImage,
      mapMarkers: mapStoreData.mapMarkers.map(
        (m) =>
          ({
            placeId: m.placeId,
            place: places.find((p) => p.id === m.placeId) || null,
            pos: m.pos,
          } as MapMarker)
      ),
      selectedTime: mapStoreData.selectedTime,
    })
  ),
  selectAlibi: createSelector(
    [selectConfig, timelineEvents],
    (config: TimelineConfig, timelineEvents: TimelineEvent[]) => {
      // スロット間隔(ms)を計算
      const intervalMs = toMinute(config.interval) * 60 * 1000;

      const timeSlots = useMemo<SelectOption[]>(
        () => getTimeSlots(config),
        [config]
      );

      // スロットごとにイベントをフィルタ→オブジェクト化
      return timeSlots.reduce<
        Record<string, { timelineEvent: TimelineEvent[] }>
      >((acc, slotIso) => {
        const slotStart = new Date(slotIso.value).getTime();
        const slotEnd = slotStart + intervalMs;

        // slotStart ～ slotEnd の間に一部でもかかるイベントを抽出
        const matched = timelineEvents.filter((evt) => {
          const start = new Date(evt.start).getTime();
          const end = new Date(evt.end).getTime();
          return start < slotEnd && end > slotStart;
        });

        acc[slotIso.value] = { timelineEvent: matched };
        return acc;
      }, {});
    }
  ),
};
