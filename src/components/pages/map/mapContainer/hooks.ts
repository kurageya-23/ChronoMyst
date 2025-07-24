import type { ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import type { MapMarker, Place } from "../../../../features/models";
import { useDispatch, useSelector } from "react-redux";
import { mapSlice } from "../../../../features/map/mapSlice";
import type { DragEndEvent } from "@dnd-kit/core";
import type { RootState } from "../../../../app/store";
import { timelineSlice } from "../../../../features/timelines/timelineSlice";
import { useMemo } from "react";
import { mapSelectors } from "../../../../features/map/selectors";

/**
 * マップコンテナに関するカスタムフック
 */
export const useMapContainer = (
  transformWrapperRef: React.RefObject<ReactZoomPanPinchRef | null>
) => {
  const dispatch = useDispatch();
  const timeline = useSelector((s: RootState) => s[timelineSlice.reducerPath]);
  const mapData = useSelector(mapSelectors.selectMapData);

  /** 未配置の場所リスト */
  const markerPlaces = useMemo(() => {
    return timeline.config.places.filter(
      (p) => !mapData.mapMarkers.some((m) => p.id === m.placeId)
    );
  }, [mapData.mapMarkers, timeline.config.places]);

  /** マーカー追加 */
  const handleAddMarker = (place: Place) => {
    const wrapper = transformWrapperRef?.current;
    if (!wrapper?.instance.wrapperComponent) return;

    const { scale, positionX, positionY } = wrapper.state;

    // ビューワーコンテナの実サイズを取得
    const { width, height } =
      wrapper.instance.wrapperComponent.getBoundingClientRect();

    // ビューの中心座標を画像上の相対座標に変換
    const x = (width / 2 - positionX) / scale;
    const y = (height / 2 - positionY) / scale;

    dispatch(
      mapSlice.actions.addMapMarker({
        placeId: place.id,
        place: place,
        pos: { x, y },
      } as MapMarker)
    );
  };

  /** マーカー位置更新 */
  const handleUpdateMarker = (event: DragEndEvent) => {
    const { active, delta } = event;
    const placeId = active.id as string;
    const marker = mapData.mapMarkers.find((m) => m.placeId === placeId);

    if (marker && delta) {
      const wrapper = transformWrapperRef.current;
      if (!wrapper?.instance?.wrapperComponent) return;

      const { scale, positionX, positionY } = wrapper.state;

      // ドラッグ後の絶対座標 data.x, data.y を相対座標に逆変換
      const x = (marker.pos.x + delta.x - positionX) / scale;
      const y = (marker.pos.y + delta.y - positionY) / scale;

      dispatch(
        mapSlice.actions.updateMapMarker({
          placeId: marker.placeId,
          place: marker.place,
          pos: { x, y },
        } as MapMarker)
      );
    }
  };

  return {
    mapData,
    markerPlaces,
    handleAddMarker,
    handleUpdateMarker,
  };
};
