import React, { useMemo } from "react";
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
import type { RootState } from "../app/store";
import {
  selectTimes,
  timelineSlice,
} from "../features/timelines/timelineSlice";
import type { Place, Timeline, TimelineEvent } from "../features/models";
import { COLOR_SET } from "../app/appConstants";

export type EditEventModalProps = {
  opened: boolean;
  onClose: () => void;
};

export default function EditEventModal({
  opened,
  onClose,
}: EditEventModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      size="100%"
      withinPortal
      title="イベントの登録"
      styles={{
        header: {
          height: 20,
          paddingTop: 4,
          paddingBottom: 4,
          // タイトル行の高さを揃える
          "& .mantine-Modal-title": {
            lineHeight: 1,
            fontSize: "1rem",
          },
          // クローズボタンのサイズを調整
          '& button[aria-label="Close modal"]': {
            padding: 4,
          },
        },

        body: {
          backgroundColor: "#fafafa",
        },
      }}
    >
      <ModalContent onClose={onClose} />
    </Modal>
  );
}

type ModalContentProps = { onClose: () => void };

const ModalContent: React.FC<ModalContentProps> = ({ onClose }) => {
  const dispatch = useDispatch();
  const { config } = useSelector(
    (s: RootState) => s[timelineSlice.reducerPath]
  ) as Timeline;
  const times = useSelector(selectTimes);

  // 初期フォーム値
  const initialValues = useMemo<TimelineEvent>(
    () => ({
      startTime: "",
      endTime: "",
      detail: "",
      characterIds: [],
      characters: [],
      placeId: "",
      place: {} as Place,
      color: "#868e96",
    }),
    []
  );

  const form = useForm<TimelineEvent>({ mode: "controlled", initialValues });

  // 送信前のマッピング
  const buildEventPayload = (values: TimelineEvent): TimelineEvent => {
    const characters = values.characterIds
      .map((id) => config.characters.find((c) => String(c.id) === id)!)
      .filter(Boolean);
    const place = config.places.find((p) => String(p.id) === values.placeId)!;
    return { ...values, characters, place };
  };

  const handleSubmit = (values: TimelineEvent) => {
    const payload = buildEventPayload(values);
    dispatch(timelineSlice.actions.createTimelineEvent(payload));
    onClose();
  };

  return (
    <Container my="lg">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap={4}>
          <TimeRangePicker times={times} form={form} />
          <TextareaInput form={form} />
          <ListChipSelector
            label="関係者（複数選択可）"
            multiple
            data={config.characters.map((c) => ({
              value: String(c.id),
              label: c.name,
              color: c.color,
            }))}
            value={form.values.characterIds}
            onChange={(v) => form.setFieldValue("characterIds", v as string[])}
          />
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
          <Group justify="flex-end" mt="md">
            <Button type="submit" color="teal">
              登録
            </Button>
          </Group>
        </Stack>
      </form>
    </Container>
  );
};

// コンポーネント分割
type TimeRangePickerProps = {
  times: string[];
  form: ReturnType<typeof useForm<TimelineEvent>>;
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
  form: ReturnType<typeof useForm<TimelineEvent>>;
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
