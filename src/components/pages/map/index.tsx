import {
  ActionIcon,
  Drawer,
  Fieldset,
  Group,
  Stack,
  Tooltip,
} from "@mantine/core";
import { IconExchangeFilled } from "@tabler/icons-react";
import { useMapView } from "./hooks";
import { useRef } from "react";
import type { MapData, MapMarker, Place } from "../../../features/models";
import { MapImageDropZone } from "./mapImageDropzone";
import { MapPlaceBadge } from "./mapPlaceBadge";
import { MapMarkerBadge } from "./mapMarkerBadge";

export type MapViewProps = {
  opened: boolean;
  onClose: () => void;
};
/** マップビュー */
export default function MapView({ opened, onClose }: MapViewProps) {
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const dropzoneOpenRef = useRef<() => void>(null);
  const {
    mapData,
    unselectedPlaces,
    onFileDrop,
    handlePlaceDrag,
    handleDrop,
    handleMarkerDelete,
    handleMarkerMoveStart,
  } = useMapView(imageContainerRef);

  return (
    <Drawer opened={opened} onClose={onClose} size="70%" title="マップ">
      {/* マップ画像のドロップゾーン */}
      <MapImageDropZone
        onDrop={onFileDrop}
        dropzoneOpenRef={dropzoneOpenRef}
        // NOTE: ifで要素を消してしまうと画像の変更が行えないのでdisplay:noneで非表示
        display={!mapData.mapImage}
      />

      {mapData.mapImage ? (
        <Stack gap={2}>
          <Tooltip label="マップ画像の変更">
            <ActionIcon
              variant="subtle"
              size="sm"
              color="#ffffff"
              aria-label="maps"
              onClick={() => dropzoneOpenRef.current?.()}
            >
              <IconExchangeFilled />
            </ActionIcon>
          </Tooltip>
          {/* マップ画像ビュー */}
          <MapImageView
            imageContainerRef={imageContainerRef}
            mapData={mapData}
            unselectedPlaces={unselectedPlaces}
            handlePlaceDrag={handlePlaceDrag}
            handleMoveStart={handleMarkerMoveStart}
            handleDrop={handleDrop}
            handleDelete={handleMarkerDelete}
          />
        </Stack>
      ) : (
        <></>
      )}
    </Drawer>
  );
}

type MapImageViewProps = {
  imageContainerRef: React.RefObject<HTMLDivElement | null>;
  mapData: MapData;
  unselectedPlaces: Place[];
  handlePlaceDrag: (p: Place) => (e: React.MouseEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleDelete: (placeId: string) => void;
  handleMoveStart: (m: MapMarker) => (e: React.MouseEvent) => void;
};
/** マップ画像ビュー */
const MapImageView: React.FC<MapImageViewProps> = ({
  imageContainerRef,
  mapData,
  unselectedPlaces,
  handlePlaceDrag,
  handleDrop,
  handleDelete,
  handleMoveStart,
}: MapImageViewProps) => {
  return (
    <Stack>
      {/* 画像コンテナ */}
      <div
        ref={imageContainerRef}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        style={{
          position: "relative",
          display: "inline-block",
          cursor: "crosshair",
          maxWidth: "100%",
        }}
      >
        {/* 画像 */}
        <img
          src={mapData.mapImage}
          alt="preview"
          style={{ display: "block", maxWidth: "100%" }}
        />

        {/* 場所マーカー */}
        {mapData.mapMarkers.map((m) => (
          <MapMarkerBadge
            key={m.placeId}
            marker={m}
            handleDelete={() => handleDelete(m.placeId)}
            handleMoveStart={handleMoveStart}
          />
        ))}
      </div>

      {/* 場所のマーカーリスト */}
      <Fieldset legend="場所マーカー" p="xs">
        <Group>
          {unselectedPlaces.map((p) => (
            <MapPlaceBadge key={p.id} place={p} handleDrag={handlePlaceDrag} />
          ))}
        </Group>
      </Fieldset>
    </Stack>
  );
};
