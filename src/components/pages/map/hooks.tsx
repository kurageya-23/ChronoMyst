import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import { mapSlice } from "../../../features/map/mapSlice";
import type { FileWithPath } from "@mantine/dropzone";
import { timelineSlice } from "../../../features/timelines/timelineSlice";
import type { MapData, MapMarker, Place } from "../../../features/models";
import { useMemo, useRef } from "react";
import { toMinute } from "../../../app/util";
import { CALENDAR_INIT_DATE } from "../../../app/appConstants";

/**
 * マップビューに関するカスタムフック
 */
export const useMapView = (
  imageContainerRef: React.RefObject<HTMLDivElement | null>
) => {
  const dispatch = useDispatch();
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

  /** 未配置の場所リスト */
  const unselectedPlaces = useMemo(() => {
    return timeline.config.places.filter(
      (p) => !mapData.mapMarkers.some((m) => p.id === m.placeId)
    );
  }, [mapData.mapMarkers, timeline.config.places]);

  /** ファイル選択イベントハンドラ */
  const onFileDrop = (files: FileWithPath[]) => {
    const file = files[0];
    if (!file) {
      dispatch(mapSlice.actions.updateMapImage(""));
      return;
    }
    dispatch(mapSlice.actions.updateMapImage(URL.createObjectURL(file)));
  };

  // 移動中の場所バッジ
  const movingPlace = useRef<Place | null>(null);

  /** 場所バッジの移動開始イベントハンドラ */
  const handlePlaceDrag = (p: Place) => (e: React.MouseEvent) => {
    e.stopPropagation();
    movingPlace.current = { ...p };
    console.debug("handlePlaceDrag", p, movingPlace.current);
  };

  /** 場所バッジもしくはマーカーの移動完了イベントハンドラ */
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    if (!imageContainerRef.current) return;

    // マーカー位置の計算
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 位置更新
    if (movingMarker.current) {
      dispatch(
        mapSlice.actions.updateMapMarker({
          placeId: movingMarker.current.placeId,
          pos: { x, y },
        } as MapMarker)
      );
      console.debug("MarkerDrop", movingMarker.current);

      movingMarker.current = null;
    }

    // マーカー追加
    if (movingPlace.current) {
      dispatch(
        mapSlice.actions.addMapMarker({
          placeId: movingPlace.current.id,
          pos: { x, y },
        } as MapMarker)
      );
      console.debug("PlaceDrop", movingPlace.current);
      movingPlace.current = null;
    }
  };

  /** マーカーの削除イベントハンドラ */
  const handleMarkerDelete = (selectedPlaceId: string) => {
    dispatch(mapSlice.actions.deleteMapMarker(selectedPlaceId));
  };

  // 移動中のマーカーバッジ
  const movingMarker = useRef<MapMarker | null>(null);

  /** マーカーの移動開始イベントハンドラ */
  const handleMarkerMoveStart = (m: MapMarker) => (e: React.MouseEvent) => {
    e.stopPropagation();
    movingMarker.current = { ...m };
    console.debug("handleMarkerMoveStart", m, movingMarker.current);
  };

  /** シナリオの時間リストを生成 */
  const getTimeSlots = useMemo((): string[] => {
    const config = timeline.config;
    const intervalMin = toMinute(config.interval);
    const totalMin = toMinute(config.timeAmount);
    const count = Math.floor(totalMin / intervalMin);

    // ローカルタイムとしてパースし、toISOString()でUTC表記に変換
    const startDate = new Date(
      `${CALENDAR_INIT_DATE}T${config.timelineStartTime}`
    );

    return Array.from({ length: count }, (_, i) => {
      const dt = new Date(startDate.getTime() + i * intervalMin * 60 * 1000);
      return dt.toISOString();
    });
  }, [timeline.config]);

  return {
    timeline,
    mapData,
    unselectedPlaces,
    onFileDrop,
    handlePlaceDrag,
    handleDrop,
    handleMarkerDelete,
    handleMarkerMoveStart,
    getTimeSlots,
  };
};
