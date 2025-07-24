import { type PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "../../app/createAppSlice";
import { type MapData, type MapMarker } from "../models";

// Stateの初期化
const initialMapData: MapData = {
  mapImage: "",
  mapMarkers: [],
  selectedTime: "",
};

export const mapSlice = createAppSlice({
  name: "map",
  initialState: initialMapData,
  reducers: (create) => ({
    save: create.reducer((_state, action: PayloadAction<MapData>) => {
      return action.payload;
    }),
    /** マップ画像更新 */
    updateMapImage: create.reducer((state, action: PayloadAction<string>) => {
      console.debug("[reducer] updateMapImage start.", action.payload);
      state.mapImage = action.payload;
      console.debug("[reducer] updateMapImage end.");
    }),
    /** マップマーカーの追加 */
    addMapMarker: create.reducer((state, action: PayloadAction<MapMarker>) => {
      console.debug("[reducer] addMapMarker start.", action.payload);
      state.mapMarkers = [...state.mapMarkers, action.payload];
      console.debug("[reducer] addMapMarker end.");
    }),
    /** マップマーカーの更新 */
    updateMapMarker: create.reducer(
      (state, action: PayloadAction<MapMarker>) => {
        console.debug("[reducer] updateMapMarker start.", action.payload);
        const updated = action.payload;
        const marker = state.mapMarkers.find(
          (m) => m.placeId === updated.placeId
        );
        if (!marker) return;

        Object.assign(marker, updated);
        console.debug("[reducer] updateMapMarker end.");
      }
    ),
    /** マップマーカーの削除 */
    deleteMapMarker: create.reducer((state, action: PayloadAction<string>) => {
      console.debug("[reducer] deleteMapMarker start.", action.payload);
      state.mapMarkers = state.mapMarkers.filter(
        (m) => m.placeId !== action.payload
      );
      console.debug("[reducer] deleteMapMarker end.");
    }),
    /** selectedTimeの更新 */
    updateSelectedTime: create.reducer(
      (state, action: PayloadAction<string>) => {
        console.debug("[reducer] updateSelectedTime start.", action.payload);
        state.selectedTime = action.payload;
        console.debug("[reducer] updateSelectedTime end.");
      }
    ),
  }),
  selectors: {
    selectMapData: (mapData) => mapData,
  },
});
