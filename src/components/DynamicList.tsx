import { ActionIcon, Button, Group, Text } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";

/**
 * 汎用リストレンダラー
 */
type DynamicListProps<T> = {
  items: T[];
  onInsert: () => void;
  onRemove: (index: number) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  max: number;
  min: number;
  errorMessage?: string;
};

export default function DynamicList<T>({
  items,
  onInsert,
  onRemove,
  renderItem,
  max,
  min,
  errorMessage,
}: DynamicListProps<T>) {
  const canAdd = items.length < max;
  const canRemove = items.length > min;

  return (
    <>
      {items.map((item, index) => (
        <Group key={index} mt="xs" m="sm" align="center">
          {renderItem(item, index)}
          {/* 削除ボタンは items.length > min のときのみ表示 */}
          {canRemove && (
            <ActionIcon
              color="red"
              onClick={() => onRemove(index)}
              aria-label="delete"
            >
              <IconTrash size={16} />
            </ActionIcon>
          )}
        </Group>
      ))}
      {/* 追加ボタンは items.length < max のときのみ表示 */}
      {canAdd && (
        <Group mt="sm">
          <Button variant="light" onClick={onInsert}>
            追加
          </Button>
        </Group>
      )}
      {/* リスト全体のエラーを表示 */}
      {errorMessage && (
        <Text color="red" size="sm" mt="xs">
          {errorMessage}
        </Text>
      )}
    </>
  );
}
