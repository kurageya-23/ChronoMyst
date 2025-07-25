import { Button, Fieldset, Group } from "@mantine/core";
import type { Place } from "../../../../features/models";

type NewMarkerListProps = {
  places: Place[];
  handleAddMarker: (p: Place) => void;
};

/**
 * 未選択のマーカーリスト
 */
export const MapNewMarkerList: React.FC<NewMarkerListProps> = ({
  places,
  handleAddMarker,
}) => {
  return (
    <Fieldset legend="クリックでマップに追加します" p="xs">
      <Group>
        {places.map((p) => (
          <Button
            key={p.id}
            size="sm"
            color="red"
            onClick={() => handleAddMarker(p)}
          >
            {p.name}
          </Button>
        ))}
      </Group>
    </Fieldset>
  );
};
