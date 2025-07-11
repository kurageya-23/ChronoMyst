import {
  Button,
  Container,
  Group,
  Modal,
  Stack,
  Textarea,
} from "@mantine/core";
import type {
  Character,
  EditCharacterMemoFormData,
} from "../../../../features/models";
import { useEditCharacterMemoModal } from "./hooks";
import { useForm } from "@mantine/form";
import { useEffect } from "react";

export type EditCharacterMemoModalProps = {
  opened: boolean;
  onClose: () => void;
  selectedCharacter: Character | null;
};
/** キャラクターメモ編集モーダル */
export default function EditCharacterMemoModal({
  opened,
  onClose,
  selectedCharacter,
}: EditCharacterMemoModalProps) {
  const { initialValues, handleSubmit } = useEditCharacterMemoModal(
    selectedCharacter,
    onClose
  );

  /** フォームデータ */
  const form = useForm<EditCharacterMemoFormData>({
    initialValues,
    mode: "controlled",
  });

  // モーダル開閉でリセット＋初期化
  useEffect(() => {
    if (!opened) {
      form.reset();
    } else {
      form.setValues(initialValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, initialValues]);

  return (
    // モーダル
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      size="100%"
      withinPortal
      title={`${selectedCharacter?.name} のメモ`}
    >
      <Container my="lg">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap={4}>
            {/* メモ */}
            <Textarea
              label="メモ"
              maxLength={2000}
              {...form.getInputProps("memo")}
              autosize
              minRows={8}
              resize="block"
            />
            <Group justify="space-between" mt="md">
              <Button type="submit" color="indigo">
                更新
              </Button>
            </Group>
          </Stack>
        </form>
      </Container>
    </Modal>
  );
}
