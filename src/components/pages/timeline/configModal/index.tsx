import React from "react";
import {
  Modal,
  Container,
  Stack,
  Fieldset,
  Grid,
  Text,
  Group,
  Button,
  TextInput,
} from "@mantine/core";
import { TimeInput, TimePicker } from "@mantine/dates";
import DynamicList from "../../../DynamicList";
import { ColorSelector } from "../../../ColorSelector";
import { useTimelineConfig } from "./hooks";

export type ConfigModalProps = {
  opened: boolean;
  onClose: () => void;
};

const ConfigModal: React.FC<ConfigModalProps> = ({ opened, onClose }) => {
  const { form, presets, handleSubmit } = useTimelineConfig(opened, onClose);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      size="100%"
      withinPortal
      title="設定"
    >
      <Container my="lg">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap={4}>
            {/* 時間設定 */}
            <Fieldset legend="時間">
              <TimeInput
                withAsterisk
                label="間隔"
                placeholder="ex1. 01:00 | ex2. 0:30"
                minTime="00:10"
                {...form.getInputProps("interval")}
              />

              <Grid align="flex-end" mt="sm">
                <Grid.Col span="auto">
                  <TimePicker
                    {...form.getInputProps("startTime")}
                    label="開始時間"
                    withAsterisk
                    withDropdown
                    presets={presets}
                  />
                </Grid.Col>

                <Grid.Col span="content">
                  <Text mb={6}>ー</Text>
                </Grid.Col>

                <Grid.Col span="auto">
                  <TimePicker
                    {...form.getInputProps("endTime")}
                    label="終了時間"
                    withAsterisk
                    withDropdown
                    presets={presets}
                  />
                </Grid.Col>
              </Grid>
            </Fieldset>

            {/* 登場人物 */}
            <DynamicList
              legend="登場人物"
              items={form.values.characters}
              onInsert={() =>
                form.insertListItem("characters", {
                  name: "",
                  playerName: "",
                  color: "#228be6",
                  memo: "",
                })
              }
              onRemove={(i) => form.removeListItem("characters", i)}
              renderItem={(c, i) => (
                <>
                  <Text size="sm">{i + 1}.</Text>
                  <TextInput
                    {...form.getInputProps(`characters.${i}.name`)}
                    placeholder="キャラクター名"
                  />
                  <TextInput
                    {...form.getInputProps(`characters.${i}.playerName`)}
                    placeholder="プレイヤー名"
                  />
                  <ColorSelector
                    value={c.color}
                    onChange={(col) =>
                      form.setFieldValue(`characters.${i}.color`, col)
                    }
                  />
                </>
              )}
            />

            {/* 場所 */}
            <DynamicList
              legend="場所"
              items={form.values.places}
              onInsert={() =>
                form.insertListItem("places", { name: "", memo: "" })
              }
              onRemove={(i) => form.removeListItem("places", i)}
              renderItem={(_, i) => (
                <>
                  <Text size="sm">{i + 1}.</Text>
                  <TextInput
                    {...form.getInputProps(`places.${i}.name`)}
                    placeholder="場所名"
                  />
                  <TextInput
                    {...form.getInputProps(`places.${i}.memo`)}
                    placeholder="メモ"
                  />
                </>
              )}
            />

            <Group justify="flex-end" mt="md">
              <Button type="submit" color="teal">
                設定を反映する
              </Button>
            </Group>
          </Stack>
        </form>
      </Container>
    </Modal>
  );
};

export default ConfigModal;
