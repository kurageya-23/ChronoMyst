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
import type { RootState } from "../app/store";
import {
  selectTimes,
  timelineSlice,
} from "../features/timelines/timelineSlice";
import type {
  CalendarEvent,
  Character,
  Place,
  Timeline,
} from "../features/models";
import { COLOR_SET } from "../app/appConstants";
import { type EventApi } from "@fullcalendar/core";
import { v4 as uuidv4 } from "uuid";

/** イベント登録専用データ定義 */
type FormEvent = {
  id: string;
  startTime: string;
  endTime?: string;
  placeId: string;
  place: Place;
  characterIds: string[];
  characters: Character[];
  color: string;
  detail: string;
};

/** イベントを今日日付に変換 */
const toToday = function (timeStr: string): string {
  const today = new Date();
  const [h, m] = timeStr.split(":").map((s) => Number(s));

  return new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    h,
    m,
    0,
    0
  ).toISOString();
};

/** カレンダーイベントからフォームデータへの変換 */
const calendarToForm = (event: EventApi): FormEvent => {
  /** ISO文字列 → "HH:mm" に変換 */
  const isoToTimeString = (iso: string): string => {
    const d = new Date(iso);
    const hh = d.getHours().toString().padStart(2, "0");
    const mm = d.getMinutes().toString().padStart(2, "0");
    return `${hh}:${mm}`;
  };

  return {
    id: event.id,
    startTime: event.start ? isoToTimeString(event.startStr) : "",
    endTime: event.end ? isoToTimeString(event.endStr) : "",
    detail: event.title,
    color: event.backgroundColor,
    characters: event.extendedProps.characters ?? [],
    characterIds: (event.extendedProps.characters ?? []).map((c: Character) =>
      String(c.id)
    ),
    place: event.extendedProps.place ?? ({} as Place),
    placeId: String(event.extendedProps.place?.id ?? ""),
  };
};

/** フォームイベントからカレンダーイベントへの変換 */
const formToCalendar = function (form: FormEvent) {
  return {
    id: form.id,
    title: form.detail,
    start: toToday(form.startTime),
    end: form.endTime ? toToday(form.endTime) : "",
    borderColor: form.color,
    backgroundColor: form.color,
    extendedProps: { characters: form.characters, place: form.place },
  } as CalendarEvent;
};

export type EditEventModalProps = {
  opened: boolean;
  onClose: () => void;
  selectedEvent: EventApi | null;
};
/** イベント登録・編集モーダル */
export default function EditEventModal({
  opened,
  onClose,
  selectedEvent,
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
        body: {
          backgroundColor: "#fafafa",
        },
      }}
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
const ModalContent: React.FC<EditEventModalProps> = ({
  opened,
  onClose,
  selectedEvent,
}) => {
  const dispatch = useDispatch();
  const { config } = useSelector(
    (s: RootState) => s[timelineSlice.reducerPath]
  ) as Timeline;
  const times = useSelector(selectTimes);

  // フォームデータ
  const form = useForm<FormEvent>({
    mode: "controlled",
    initialValues: getInitialValues(selectedEvent),
  });

  // モーダルの開閉検知フック
  useEffect(() => {
    if (!opened) {
      // モーダルが閉じたらフォームを初期化
      form.reset();
    } else {
      // モーダルが開いたら、selectedEvent に合わせて初期値をリセット
      form.setValues(getInitialValues(selectedEvent));
    }
  }, [opened, selectedEvent]);

  // データストア送信前のマッピング
  const buildEventPayload = (values: FormEvent): FormEvent => {
    const characters = values.characterIds
      .map((id) => config.characters.find((c) => String(c.id) === id)!)
      .filter(Boolean);
    const place = config.places.find((p) => String(p.id) === values.placeId)!;
    return { ...values, characters, place };
  };

  /** イベントデータの登録・更新 */
  const handleSubmit = (values: FormEvent) => {
    const payload = formToCalendar(buildEventPayload(values));
    if (selectedEvent) {
      // 更新
      dispatch(timelineSlice.actions.updateTimelineEvent(payload));
    } else {
      // 新規
      payload.id = uuidv4();
      dispatch(timelineSlice.actions.createTimelineEvent(payload));
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

// 初期値取得ユーティリティ
function getInitialValues(event: EventApi | null): FormEvent {
  if (!event) {
    return {
      id: "",
      startTime: "",
      endTime: "",
      detail: "",
      characterIds: [],
      characters: [],
      placeId: "",
      place: {} as Place,
      color: "#868e96",
    };
  }
  return calendarToForm(event);
}

// コンポーネント分割
type TimeRangePickerProps = {
  times: string[];
  form: ReturnType<typeof useForm<FormEvent>>;
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
  form: ReturnType<typeof useForm<FormEvent>>;
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
