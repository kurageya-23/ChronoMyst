import { ActionIcon, Badge } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import type { MapMarker } from "../../../../features/models";
export type MapMarkerBadgeProps = {
  marker: MapMarker;
  handleDelete: (placeId: string) => void;
  handleMoveStart: (m: MapMarker) => (e: React.MouseEvent) => void;
};

/** マップ上のマーカー */
export const MapMarkerBadge: React.FC<MapMarkerBadgeProps> = ({
  marker,
  handleDelete,
  handleMoveStart,
}: MapMarkerBadgeProps) => (
  <Badge
    size="lg"
    variant="filled"
    color="red"
    draggable
    style={{
      position: "absolute",
      left: marker.pos.x,
      top: marker.pos.y,
      transform: "translate(-50%, -100%)",
      display: "flex",
      alignItems: "center",
      cursor: "move",
    }}
    onMouseDown={handleMoveStart(marker)}
  >
    {marker.place?.name}
    <ActionIcon
      size="xs"
      color="gray"
      variant="transparent"
      onClick={() => handleDelete(marker.placeId)}
      style={{ marginLeft: 4 }}
    >
      <IconX size={12} />
    </ActionIcon>
  </Badge>
);
