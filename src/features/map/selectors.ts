import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { mapSlice } from "./mapSlice";
import type { MapData, MapMarker } from "../models";

// 生の slice 状態を取ってくるセレクタ
const selectRaw = (state: RootState) => state[mapSlice.reducerPath];

// timeline.config.places を取ってくるセレクタ
const selectPlaces = (state: RootState) => state.timeline.config.places;

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
    })
  ),
};
