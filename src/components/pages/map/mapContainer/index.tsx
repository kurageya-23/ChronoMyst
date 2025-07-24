import React, { useRef } from "react";
import type { MapData } from "../../../../features/models";
import { DndContext } from "@dnd-kit/core";
import {
  TransformComponent,
  TransformWrapper,
  type ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";
import { Stack } from "@mantine/core";
import { useMapContainer } from "./hooks";
import { MapNewMarkerList } from "../mapNewMarkerList";
import { MapMarkerComponent } from "../mapMarkerComponent";

type MapContainerProps = {
  markerSize: string;
};

/** マップコンテナー */
export const MapContainer: React.FC<MapContainerProps> = ({ markerSize }) => {
  // マッププレビューのref
  const transformWrapperRef = useRef<ReactZoomPanPinchRef>(null);
  const { mapData, markerPlaces, handleAddMarker, handleUpdateMarker } =
    useMapContainer(transformWrapperRef);
  return (
    <DndContext onDragEnd={handleUpdateMarker}>
      <Stack>
        {/* マップビュー */}
        <MapView
          transformWrapperRef={transformWrapperRef}
          mapData={mapData}
          markerSize={markerSize}
        />

        {/* 未配置のマーカーリスト */}
        <MapNewMarkerList
          places={markerPlaces}
          handleAddMarker={handleAddMarker}
        />
      </Stack>
    </DndContext>
  );
};

type MapViewProps = {
  transformWrapperRef: React.RefObject<ReactZoomPanPinchRef | null>;
  mapData: MapData;
  markerSize: string;
};
/** マップビュー */
export const MapView: React.FC<MapViewProps> = ({
  transformWrapperRef,
  mapData,
  markerSize,
}: MapViewProps) => {
  return (
    <TransformWrapper
      onInit={(api) => {
        transformWrapperRef.current = api;
      }}
      panning={{ allowLeftClickPan: false }}
    >
      <TransformComponent>
        <div style={{ position: "relative", display: "inline-block" }}>
          {/* 画像 */}
          <img
            src={mapData.mapImage}
            alt="preview"
            style={{ display: "block", maxWidth: "100%" }}
          />
          {/* マーカー配置 */}
          {mapData.mapMarkers.map((m) => (
            <MapMarkerComponent key={m.placeId} marker={m} size={markerSize} />
          ))}
        </div>
      </TransformComponent>
    </TransformWrapper>
  );
};
