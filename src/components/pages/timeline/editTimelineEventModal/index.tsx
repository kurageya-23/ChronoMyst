import React, { useEffect } from "react";
import {
  Button,
  Container,
  Group,
  Modal,
  Text,
  ColorInput,
  Textarea,
  Chip,
  Stack,
  Select,
} from "@mantine/core";
import { useSelector } from "react-redux";
import { useForm } from "@mantine/form";
import type { RootState } from "../../../../app/store";
import { timelineSlice } from "../../../../features/timelines/timelineSlice";
import { COLOR_SET } from "../../../../app/appConstants";
import { useTimelineEvent } from "./hooks";
import { editEventModalValidator } from "./validator";
import type { TimelineEventFormData } from "../../../../features/models";

export type EditTimelineEventModalProps = {
  opened: boolean;
  onClose: () => void;
  selectedEvent: TimelineEventFormData | null;
};
/** イベント登録・編集モーダル */
export default function EditTimelineEventModal({
  opened,
  onClose,
  selectedEvent,
}: EditTimelineEventModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      size="100%"
      withinPortal
      title="イベントの登録"
    >
      <ModalContent
        opened={opened}
        onClose={onClose}
        selectedEvent={selectedEvent}
      />
    </Modal>
  );
}

/** モーダルのメインコンテンツ */
const ModalContent: React.FC<EditTimelineEventModalProps> = ({
  opened,
  onClose,
  selectedEvent,
}) => {
  // ストアからシナリオ設定を取得
  const { config } = useSelector(
    (s: RootState) => s[timelineSlice.reducerPath]
  );

  // カスタムフックからロジックを取得
  const { initialValues, useTimeOptions, handleSubmit, handleDelete } =
    useTimelineEvent(selectedEvent, config, onClose);

  // 時間の選択肢
  const timeOptions = useTimeOptions({
    timelineStartTime: config.timelineStartTime,
    timelineEndTime: config.timelineEndTime,
    interval: config.interval,
  });

  // フォームデータ
  const form = useForm<TimelineEventFormData>({
    initialValues,
    mode: "controlled",
    validate: editEventModalValidator,
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
    <Container>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap={4}>
          {selectedEvent ? (
            <Text size="xs" color="dimmed">
              ID: {selectedEvent?.id}
            </Text>
          ) : (
            <></>
          )}
          <Group align="flex-end">
            <Select
              label="開始時間"
              data={timeOptions}
              {...form.getInputProps("startDateTimeStr")}
              searchable={false}
              clearable={false}
            />
            <Text>ー</Text>
            <Select
              label="終了時間"
              data={timeOptions}
              {...form.getInputProps("endDateTimeStr")}
              searchable={false}
              clearable={false}
            />
          </Group>

          {/* 証言者 */}
          <ListChipSelector
            label="証言者"
            multiple={false}
            data={config.witnesses.map((w) => ({
              value: w.id,
              label: w.name,
              color: w.color,
            }))}
            value={form.values.witnessId}
            onChange={(v) => form.setFieldValue("witnessId", v as string)}
          />

          {/* 関係者 */}
          <Stack gap={0}>
            <Text size="sm" w={500} mb="xs">
              関係者（複数選択可）
            </Text>
            <Chip.Group
              multiple
              value={form.values.characterIds}
              {...form.getInputProps(`characterIds`)}
            >
              <Group gap="xs" wrap="wrap">
                {config.characters.map((c) => (
                  <Chip key={c.id} value={c.id} color={c.color}>
                    {c.name}
                  </Chip>
                ))}
              </Group>
            </Chip.Group>
          </Stack>
          {form.errors.characterIds && (
            <Text color="red" size="sm" mt="xs">
              {form.errors.characterIds?.toString()}
            </Text>
          )}

          {/* 場所 */}
          <ListChipSelector
            label="場所"
            multiple={false}
            data={config.places.map((p) => ({
              value: p.id,
              label: p.name,
              color: p.color,
            }))}
            value={form.values.placeId}
            onChange={(v) => form.setFieldValue("placeId", v as string)}
          />

          {/* メモ */}
          <Textarea label="メモ" {...form.getInputProps("detail")} />

          <ColorInput
            label="カラー"
            swatches={COLOR_SET}
            disallowInput
            {...form.getInputProps("color")}
          />
          {selectedEvent?.id ? (
            <Group justify="space-between" mt="md">
              <Button
                type="button"
                color="red"
                onClick={(e) => handleDelete(form.values, e)}
              >
                削除
              </Button>
              <Button type="submit" color="indigo">
                更新
              </Button>
            </Group>
          ) : (
            <Group justify="flex-end" mt="md">
              <Button type="submit" color="teal">
                登録
              </Button>
            </Group>
          )}
        </Stack>
      </form>
    </Container>
  );
};

/** Chip選択 */
type ChipData = { value: string; label: string; color?: string };
type ListChipSelectorProps = {
  label: string;
  multiple: boolean;
  data: ChipData[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
};
const ListChipSelector: React.FC<ListChipSelectorProps> = ({
  label,
  multiple,
  data,
  value,
  onChange,
}) => {
  const handleChipClick = (event: React.MouseEvent<HTMLInputElement>) => {
    // 単一選択 & クリックされた値が既存の値と同じならクリア
    if (!multiple && event.currentTarget.value === value) {
      onChange("");
    }
  };

  return (
    <>
      <Stack gap={0}>
        <Text size="sm" w={500} mb="xs">
          {label}
        </Text>
        <Chip.Group multiple={multiple} value={value} onChange={onChange}>
          <Group gap="xs" wrap="wrap">
            {data.map((d) => (
              <Chip
                key={d.value}
                value={d.value}
                color={d.color}
                onClick={handleChipClick}
              >
                {d.label}
              </Chip>
            ))}
          </Group>
        </Chip.Group>
      </Stack>
    </>
  );
};
