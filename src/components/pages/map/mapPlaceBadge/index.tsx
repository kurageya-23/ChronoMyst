import { Badge } from "@mantine/core";
import type { Place } from "../../../../features/models";
import type React from "react";

export type MapPlaceBadgeProps = {
  place: Place;
  handleDrag: (p: Place) => (e: React.MouseEvent) => void;
};
/** 場所マーカー */
export const MapPlaceBadge: React.FC<MapPlaceBadgeProps> = ({
  place,
  handleDrag,
}) => (
  <Badge
    draggable
    onDragStart={handleDrag(place)}
    size="md"
    color="red"
    variant="filled"
  >
    {place.name}
  </Badge>
);
