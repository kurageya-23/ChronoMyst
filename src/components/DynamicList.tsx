import { ActionIcon, Button, Fieldset, Group } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";

/**
 * 汎用リストレンダラー
 */
type DynamicListProps<T> = {
  legend: string;
  items: T[];
  onInsert: () => void;
  onRemove: (index: number) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
};

export default function DynamicList<T>({
  legend,
  items,
  onInsert,
  onRemove,
  renderItem,
}: DynamicListProps<T>) {
  return (
    <Fieldset legend={legend} mt="md">
      {items.map((item, index) => (
        <Group key={index} mt="xs" m="sm" align="center">
          {renderItem(item, index)}
          <ActionIcon
            color="red"
            onClick={() => onRemove(index)}
            aria-label="delete"
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      ))}
      <Group mt="sm">
        <Button variant="light" onClick={onInsert}>
          {legend}追加
        </Button>
      </Group>
    </Fieldset>
  );
}
