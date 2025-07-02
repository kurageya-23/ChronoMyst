import {
  Button,
  Container,
  Fieldset,
  Grid,
  Group,
  Modal,
  Text,
  MultiSelect,
  Select,
  ColorInput,
  Textarea,
} from "@mantine/core";
import type React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  type Character,
  type Place,
  type Timeline,
  type TimelineEvent,
} from "../features/models";
import type { RootState } from "../app/store";
import { useForm } from "@mantine/form";
import { TimePicker } from "@mantine/dates";
import {
  selectTimes,
  timelineSlice,
} from "../features/timelines/timelineSlice";

export type EditEventModalProps = {
  opened: boolean;
  onClose: () => void;
};

/**
 * イベント登録モーダル
 */
const EditEventModal: React.FC<EditEventModalProps> = ({ opened, onClose }) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      size="100%"
      withinPortal
      title="イベントの登録"
    >
      <ModalMain />
    </Modal>
  );
};

const ModalMain: React.FC = () => {
  const dispatch = useDispatch();
  const { config } = useSelector(
    (state: RootState) => state[timelineSlice.reducerPath]
  ) as Timeline;

  const times = useSelector(selectTimes);

  const form = useForm<TimelineEvent>({
    mode: "controlled",
    initialValues: {
      startTime: "",
      endTime: "",
      detail: "",
      characterIds: [] as string[],
      characters: [] as Character[],
      placeId: "",
      place: {} as Place,
      color: "#868e96",
    },

    validate: {},
  });
  return (
    <>
      <Container my="lg">
        <form
          onSubmit={form.onSubmit((values) => {
            // Form送信前に関連データを生成
            values.characters = form.values.characterIds
              .map(
                (idStr) => config.characters.find((c) => `${c.id}` === idStr)!
              )
              .filter(Boolean);

            values.place = config.places.find(
              (p) => `${p.id}` === form.values.placeId
            )!;

            dispatch(timelineSlice.actions.createTimelineEvent(values));
          })}
        >
          {/* 時間 */}
          <Fieldset legend="時間">
            <Grid align="flex-end">
              <Grid.Col span={5}>
                {/* 開始 */}
                <TimePicker
                  label="開始"
                  withAsterisk
                  withDropdown
                  presets={times}
                  key={form.key("startTime")}
                  {...form.getInputProps("startTime")}
                />
              </Grid.Col>

              <Grid.Col span={1}>
                <Text mb={6}>ー</Text>
              </Grid.Col>

              <Grid.Col span={5}>
                {/* 終了 */}
                <TimePicker
                  label="終了"
                  withDropdown
                  withAsterisk
                  presets={times}
                  key={form.key("endTime")}
                  {...form.getInputProps("endTime")}
                />
              </Grid.Col>
            </Grid>
          </Fieldset>

          {/* メモ */}
          <Textarea
            label="メモ"
            key={form.key("detail")}
            {...form.getInputProps("detail")}
          />

          {/* 関係者 */}
          <MultiSelect
            label="関係者"
            placeholder="1人以上の関係者を選択してください"
            withAsterisk
            data={config.characters.map((c) => ({
              value: String(c.id),
              label: c.name,
            }))}
            key={form.key("characterIds")}
            {...form.getInputProps("characterIds")}
          />

          {/* 場所 */}
          <Select
            label="場所"
            data={config.places.map((p) => ({
              value: String(p.id),
              label: p.name,
            }))}
            key={form.key("placeId")}
            {...form.getInputProps("placeId")}
          />

          <ColorInput
            label="カラー"
            swatches={[
              "#2e2e2e",
              "#868e96",
              "#fa5252",
              "#e64980",
              "#be4bdb",
              "#7950f2",
              "#4c6ef5",
              "#228be6",
              "#15aabf",
              "#12b886",
              "#40c057",
              "#82c91e",
              "#fab005",
              "#fd7e14",
            ]}
            disallowInput
            key={form.key("color")}
            {...form.getInputProps("color")}
          />

          <Group justify="flex-end" mt="md">
            <Button type="submit" color="teal">
              登録
            </Button>
          </Group>
        </form>
      </Container>
    </>
  );
};
export default EditEventModal;
