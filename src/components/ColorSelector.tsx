import { useState } from "react";
import { Popover, ColorSwatch, ColorPicker } from "@mantine/core";
import { COLOR_SET } from "../app/appConstants";

type ColorSelectorProps = {
  value: string;
  onChange: (color: string) => void;
};

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  value,
  onChange,
}) => {
  const [opened, setOpened] = useState(false);

  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      position="bottom"
      withArrow
      shadow="md"
    >
      <Popover.Target>
        <ColorSwatch
          color={value}
          onClick={() => setOpened((o) => !o)}
          style={{ cursor: "pointer", width: 30, height: 30 }}
        />
      </Popover.Target>
      <Popover.Dropdown>
        <ColorPicker
          value={value}
          onChange={onChange}
          format="hex"
          swatchesPerRow={7}
          swatches={COLOR_SET}
        />
      </Popover.Dropdown>
    </Popover>
  );
};
