import {
  AppShell,
  Text,
  Grid,
  TextInput,
  Title,
  Button,
  Menu,
  Flex,
} from "@mantine/core";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { timelineSlice } from "../../features/timelines/timelineSlice";
import { useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import {
  IconAdjustments,
  IconBookFilled,
  IconFileExport,
  IconFileImport,
} from "@tabler/icons-react";
import ConfigModal from "../pages/timeline/configModal";
import { useLayout } from "./hooks";

export const Layout = () => {
  const {
    appVersion,
    scenarioName,
    setScenarioName,
    debounced,
    handleImport,
    handleExport,
  } = useLayout();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(timelineSlice.actions.updateScenarioName(debounced));
  }, [debounced, dispatch]);

  // 設定モーダル
  const [
    isConfigModalOpen,
    { open: configModalOpen, close: configModalClose },
  ] = useDisclosure(false);

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
                  value={scenarioName}
                  onChange={(event) =>
                    setScenarioName(event.currentTarget.value)
                  }
                ></TextInput>
              </Grid.Col>
            </Grid>
          </Grid.Col>
          {/* ヘッダー右側 */}
          <Grid.Col span="content">
            <Flex gap={6} align={"flex-end"}>
              <Text size="xs" color="dimmed">
                ver.{appVersion}
              </Text>
              {/* システムメニュー */}
              <SystemMenuToggle
                handleImport={handleImport}
                handleExport={handleExport}
                open={configModalOpen}
              />
            </Flex>
          </Grid.Col>
        </Grid>
      </AppShell.Header>
      <AppShell.Main>
        <Outlet />
        <ConfigModal opened={isConfigModalOpen} onClose={configModalClose} />
      </AppShell.Main>
    </AppShell>
  );
};

type SystemMenuToggleProps = {
  handleImport: () => void;
  handleExport: () => void;
  open: () => void;
};

/** システムメニュー */
const SystemMenuToggle: React.FC<SystemMenuToggleProps> = ({
  handleImport,
  handleExport,
  open,
}) => {
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button
          size="xs"
          color="white"
          leftSection={<IconAdjustments />}
          variant="outline"
        >
          システム設定
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item leftSection={<IconBookFilled size={14} />} onClick={open}>
          シナリオ設定
        </Menu.Item>
        <Menu.Divider />
        <Menu.Label>読込/保存</Menu.Label>
        <Menu.Item
          leftSection={<IconFileImport size={14} />}
          onClick={handleImport}
        >
          ファイル(.json)を読み込み
        </Menu.Item>
        <Menu.Item
          leftSection={<IconFileExport size={14} />}
          onClick={handleExport}
        >
          ファイル(.json)に保存
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
