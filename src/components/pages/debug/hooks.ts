import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import { mapSlice } from "../../../features/map/mapSlice";
import { timelineSlice } from "../../../features/timelines/timelineSlice";
import type { MapData, MapMarker } from "../../../features/models";
import { useMemo } from "react";

/**
 * デバッグビューに関するカスタムフック
 */
export const useDebugView = () => {
  const timeline = useSelector((s: RootState) => s[timelineSlice.reducerPath]);
  // マップデータ依存関係の解決
  const mapStoreData = useSelector((s: RootState) => s[mapSlice.reducerPath]);
  const mapData = useMemo(() => {
    const markers = mapStoreData.mapMarkers.map((m) => {
      const place = timeline.config.places.find((p) => p.id === m.placeId);
      return { placeId: m.placeId, place: place, pos: m.pos } as MapMarker;
    });
    return { mapImage: mapStoreData.mapImage, mapMarkers: markers } as MapData;
  }, [mapStoreData, timeline.config.places]);

  // Jsonに変換
  const json = {
    timeline: timeline,
    mapData: mapData,
  };

  return {
    json,
  };
};
