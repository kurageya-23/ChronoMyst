import React, { useEffect } from "react";
import {
  Button,
  Container,
  Grid,
  Group,
  Modal,
  Text,
  ColorInput,
  Textarea,
  Chip,
  Stack,
} from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "@mantine/form";
import { TimePicker } from "@mantine/dates";
import type { RootState } from "../../../../app/store";
import {
  selectTimes,
  timelineSlice,
} from "../../../../features/timelines/timelineSlice";
import { COLOR_SET } from "../../../../app/appConstants";
import { type EventApi } from "@fullcalendar/core";
import { useTimelineEvent } from "./hooks";
import { editEventModalValidator } from "./validator";
import type { TimelineEventFormData } from "../../../../features/models";

export type EditTimelineEventModalProps = {
  opened: boolean;
  onClose: () => void;
  selectedEvent: EventApi | null;
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
  const dispatch = useDispatch();
  const { config } = useSelector(
    (s: RootState) => s[timelineSlice.reducerPath]
  );
  const times = useSelector(selectTimes);

  // カスタムフックからロジックを取得
  const {
    initialValues,
    buildPayload,
    finalizeTimelineEvent: finalizeTimelineEvent,
  } = useTimelineEvent(selectedEvent, config);

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

  const handleSubmit = (values: typeof form.values) => {
    const mapped = buildPayload(values);
    const timelineEvent = finalizeTimelineEvent(mapped, !selectedEvent);

    if (selectedEvent) {
      dispatch(timelineSlice.actions.updateTimelineEvent(timelineEvent));
    } else {
      dispatch(timelineSlice.actions.createTimelineEvent(timelineEvent));
    }
    onClose();
  };

  /** イベントデータの削除 */
  const handleDelete = () => {
    if (window.confirm("本当にこのイベントを削除しますか？")) {
      dispatch(timelineSlice.actions.deleteTimelineEvent(form.values.id));
    }
    onClose();
  };

  return (
    <Container my="lg">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap={4}>
          {selectedEvent ? (
            <Text size="xs" color="dimmed">
              ID: {selectedEvent?.id}
            </Text>
          ) : (
            <></>
          )}
          {/* 開始時間、終了時間 */}
          <TimeRangePicker times={times} form={form} />

          {/* メモ */}
          <TextareaInput form={form} />

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
                  <Chip key={String(c.id)} value={String(c.id)} color={c.color}>
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
              value: String(p.id),
              label: p.name,
              color: p.color,
            }))}
            value={form.values.placeId}
            onChange={(v) => form.setFieldValue("placeId", v as string)}
          />
          <ColorInput
            label="カラー"
            swatches={COLOR_SET}
            disallowInput
            {...form.getInputProps("color")}
          />
          {selectedEvent ? (
            <Group justify="space-between" mt="md">
              <Button color="red" onClick={handleDelete}>
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

// コンポーネント分割
type TimeRangePickerProps = {
  times: string[];
  form: ReturnType<typeof useForm<TimelineEventFormData>>;
};

/** 時間選択 */
const TimeRangePicker: React.FC<TimeRangePickerProps> = ({ times, form }) => (
  <Grid align="flex-end">
    <Grid.Col span="auto">
      <TimePicker
        label="開始時間"
        withAsterisk
        withDropdown
        presets={times}
        {...form.getInputProps("startTime")}
      />
    </Grid.Col>
    <Grid.Col span="content">
      <Text mb={6}>ー</Text>
    </Grid.Col>
    <Grid.Col span="auto">
      <TimePicker
        label="終了時間"
        withAsterisk
        withDropdown
        presets={times}
        {...form.getInputProps("endTime")}
      />
    </Grid.Col>
  </Grid>
);

/** メモ */
const TextareaInput: React.FC<{
  form: ReturnType<typeof useForm<TimelineEventFormData>>;
}> = ({ form }) => <Textarea label="メモ" {...form.getInputProps("detail")} />;

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
}) => (
  <>
    <Stack gap={0}>
      <Text size="sm" w={500} mb="xs">
        {label}
      </Text>
      <Chip.Group multiple={multiple} value={value} onChange={onChange}>
        <Group gap="xs" wrap="wrap">
          {data.map((d) => (
            <Chip key={d.value} value={d.value} color={d.color}>
              {d.label}
            </Chip>
          ))}
        </Group>
      </Chip.Group>
    </Stack>
  </>
);
