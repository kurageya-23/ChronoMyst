import { AppShell, Text, Grid, TextInput, Title, Button } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { timelineSlice } from "../../features/timelines/timelineSlice";
import type { RootState } from "../../app/store";
import { useEffect, useState } from "react";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { IconAdjustments } from "@tabler/icons-react";
import ConfigModal from "../pages/timeline/configModal";
import type { Timeline } from "../../features/models";

export const Layout = () => {
  const { scenario } = useSelector(
    (state: RootState) => state[timelineSlice.reducerPath]
  ) as Timeline;
  const [value, setValue] = useState(scenario.name);
  const [debounced] = useDebouncedValue(value, 1000);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(timelineSlice.actions.updateScenarioName(debounced));
  }, [debounced, dispatch]);

  // 設定モーダル
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <AppShell header={{ height: 40 }} padding="sm">
      {/* ヘッダーメニュー */}
      <AppShell.Header>
        <Grid h="100%" justify="space-between" align="center" px="lg">
          {/* ヘッダー左側 */}
          <Grid.Col span="auto">
            <Grid justify="flex-start" align="center" gutter="xs">
              <Grid.Col span="content">
                <Text color="dimmed" size="xs">
                  マーダーミステリー
                </Text>
                <Text color="dimmed" size="xs">
                  時系列整理ツール
                </Text>
              </Grid.Col>
              <Grid.Col span="content">
                <Title order={3}>ChronoMyst</Title>
              </Grid.Col>
              <Grid.Col span="content">
                <Text size="sm">|</Text>
              </Grid.Col>
              <Grid.Col span="auto">
                {/* シナリオタイトル */}
                <TextInput
                  variant="unstyled"
                  w="100%"
                  maxLength={40}
                  value={value}
                  onChange={(event) => setValue(event.currentTarget.value)}
                ></TextInput>
              </Grid.Col>
            </Grid>
          </Grid.Col>
          {/* ヘッダー右側 */}
          <Grid.Col span="content">
            {/* シナリオ設定ボタン */}
            <Button
              size="xs"
              color="white"
              leftSection={<IconAdjustments />}
              variant="outline"
              onClick={open}
            >
              シナリオ設定
            </Button>
          </Grid.Col>
        </Grid>
      </AppShell.Header>
      <AppShell.Main>
        <Outlet />
        <ConfigModal opened={opened} onClose={close} />
      </AppShell.Main>
    </AppShell>
  );
};
