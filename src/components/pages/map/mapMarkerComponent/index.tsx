import { useDraggable } from "@dnd-kit/core";
import { Badge } from "@mantine/core";
import type { MapMarker } from "../../../../features/models";

type MapMarkerComponentProps = {
  marker: MapMarker;
  size: string;
};

/**
 * マップ上のマーカー
 */
export const MapMarkerComponent: React.FC<MapMarkerComponentProps> = ({
  marker,
  size,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: marker.placeId,
  });

  // ドラッグにカーソルを追従させる
  const dragStyle = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 999,
      }
    : {};

  return (
    <div
      ref={setNodeRef}
      style={{
        position: "absolute",
        left: `${marker.pos.x}px`,
        top: `${marker.pos.y}px`,
        cursor: "move",
        ...dragStyle,
      }}
      {...attributes}
      {...listeners}
    >
      <Badge size={size} color="red">
        {marker.place?.name}
      </Badge>
    </div>
  );
};
