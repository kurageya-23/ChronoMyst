import { useDraggable } from "@dnd-kit/core";
import { Text, Badge, Fieldset, Paper, Stack } from "@mantine/core";
import type { MapMarker } from "../../../../features/models";
import { useSelector } from "react-redux";
import { mapSelectors } from "../../../../features/map/selectors";
import { useMemo } from "react";

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
  const mapData = useSelector(mapSelectors.selectMapData);
  const alibiAll = useSelector(mapSelectors.selectAlibi);
  const alibi = useMemo(() => {
    return alibiAll[mapData.selectedTime]?.timelineEvent ?? [];
  }, [mapData.selectedTime, alibiAll]);

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
      {...(attributes ?? {})}
      {...(listeners ?? {})}
    >
      <Paper shadow="sm" radius="md" px={6} py={4}>
        <Text size={size}>{marker.place?.name}</Text>
        {alibi
          .filter((ev) => ev.extendedProps.place?.id === marker.placeId)
          .map((ev) => {
            return (
              <Fieldset key={ev.id} p={4}>
                <Stack gap={2}>
                  {(ev.extendedProps.characters ?? []).map((c) => (
                    <Badge key={c.id} size={size} color={c.color}>
                      {c.name}
                    </Badge>
                  ))}
                </Stack>
              </Fieldset>
            );
          })}
      </Paper>
    </div>
  );
};
