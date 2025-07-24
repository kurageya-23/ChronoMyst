import {
  ActionIcon,
  Drawer,
  Group,
  Select,
  Stack,
  Tooltip,
} from "@mantine/core";
import { IconExchangeFilled } from "@tabler/icons-react";
import { useMapView } from "./hooks";
import { useRef, useState } from "react";
import { MapImageDropZone } from "./mapImageDropzone";
import { MapContainer } from "./mapContainer";
import { SizeSelector } from "../../SizeSelector";

export type MapViewProps = {
  opened: boolean;
  onClose: () => void;
};
/** マップビュー */
export default function MapView({ opened, onClose }: MapViewProps) {
  const dropzoneOpenRef = useRef<() => void>(null);
  const { mapData, onFileDrop, timeSlots, onTimeChange } = useMapView();

  const [markerSize, setMarkerSize] = useState<string>("md");

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
          <Group>
            {/* マップ画像変更アイコン */}
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

            {/* マーカーサイズ変更 */}
            <SizeSelector
              value={markerSize}
              onChange={(v) => setMarkerSize(v ?? "md")}
              tooltip="マーカーサイズ"
            />

            {/* 時間選択 */}
            <Select
              data={timeSlots}
              value={mapData.selectedTime}
              onChange={onTimeChange}
            />
          </Group>

          {/* マップ画像ビュー */}
          <MapContainer markerSize={markerSize} />
        </Stack>
      ) : (
        <></>
      )}
    </Drawer>
  );
}
