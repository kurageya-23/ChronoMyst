import {
  Button,
  Container,
  Grid,
  Group,
  Modal,
  TextInput,
  Text,
  Fieldset,
  ActionIcon,
} from "@mantine/core";
import type React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  type Character,
  type Place,
  type Timeline,
  type TimelineConfig,
} from "../features/models";
import type { RootState } from "../app/store";
import { useForm } from "@mantine/form";
import {
  getTimeRange,
  isTimeAfter,
  TimeInput,
  TimePicker,
} from "@mantine/dates";
import { IconTrash } from "@tabler/icons-react";
import { timelineSlice } from "../features/timelines/timelineSlice";

export type ConfigModalProps = {
  opened: boolean;
  onClose: () => void;
};

/**
 * 設定モーダル
 */
const ConfigModal: React.FC<ConfigModalProps> = ({ opened, onClose }) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      size="100%"
      withinPortal
      title="設定"
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

  const form = useForm<TimelineConfig>({
    mode: "controlled",
    initialValues: {
      interval: config.interval,
      startTime: config.startTime,
      endTime: config.endTime,
      characters: config.characters,
      places: config.places,
    },

    validate: {},
  });

  return (
    <Container my="lg">
      <form
        onSubmit={form.onSubmit((values) => {
          dispatch(timelineSlice.actions.updateConfig(values));
        })}
      >
        <Fieldset legend="時間">
          {/* 間隔 */}
          <TimeInput
            withAsterisk
            label="間隔"
            placeholder="ex1. 01:00 | ex2. 0:30"
            minTime="00:10"
            key={form.key("interval")}
            {...form.getInputProps("interval")}
          />

          <Grid align="flex-end">
            <Grid.Col span={5}>
              {/* 開始 */}
              <TimePicker
                label="開始"
                withAsterisk
                withDropdown
                presets={getTimeRange({
                  startTime: "00:00",
                  endTime: "24:00",
                  interval: isTimeAfter(form.values.interval, "00:10")
                    ? form.values.interval
                    : "00:10",
                })}
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
                presets={getTimeRange({
                  startTime: "00:00",
                  endTime: "24:00",
                  interval: isTimeAfter(form.values.interval, "00:10")
                    ? form.values.interval
                    : "00:10",
                })}
                key={form.key("endTime")}
                {...form.getInputProps("endTime")}
              />
            </Grid.Col>
          </Grid>
        </Fieldset>

        {/* 登場人物 */}
        <Fieldset legend="登場人物">
          {form.getValues().characters.map((c, index) => (
            <Group key={c.name} mt="xs">
              <Text size="sm">{index + 1}.</Text>
              <TextInput
                placeholder="キャラクター名"
                key={form.key(`characters.${index}.name`)}
                {...form.getInputProps(`characters.${index}.name`)}
              />
              <TextInput
                placeholder="プレイヤー名"
                key={form.key(`characters.${index}.playerName`)}
                {...form.getInputProps(`characters.${index}.playerName`)}
              />
              <ActionIcon variant="filled" color="red" aria-label="Settings">
                <IconTrash
                  style={{ width: "70%", height: "70%" }}
                  stroke={1.5}
                />
              </ActionIcon>
            </Group>
          ))}
          <Group justify="flex-start" mt="md">
            <Button
              onClick={() =>
                form.insertListItem("characters", {
                  name: "",
                  playerName: "",
                  memo: "",
                } as Character)
              }
            >
              キャラクター追加
            </Button>
          </Group>
        </Fieldset>

        {/* 場所 */}
        <Fieldset legend="場所">
          {form.getValues().places.map((p, index) => (
            <Group key={p.name} mt="xs">
              <Text size="sm">{index + 1}.</Text>
              <TextInput
                placeholder="場所名"
                key={form.key(`places.${index}.name`)}
                {...form.getInputProps(`places.${index}.name`)}
              />
              <TextInput
                placeholder="メモ"
                key={form.key(`places.${index}.memo`)}
                {...form.getInputProps(`places.${index}.memo`)}
              />
              <ActionIcon variant="filled" color="red" aria-label="Settings">
                <IconTrash
                  style={{ width: "70%", height: "70%" }}
                  stroke={1.5}
                />
              </ActionIcon>
            </Group>
          ))}
          <Group justify="flex-start" mt="md">
            <Button
              onClick={() =>
                form.insertListItem("places", {
                  name: "",
                  memo: "",
                } as Place)
              }
            >
              場所追加
            </Button>
          </Group>
        </Fieldset>

        <Group justify="flex-end" mt="md">
          <Button type="submit" color="teal">
            設定を反映する
          </Button>
        </Group>
      </form>
    </Container>
  );
};

export default ConfigModal;
