import { AppShell, Group } from "@mantine/core";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm" }}
      padding="md"
    >
      {/* ヘッダーメニュー */}
      <AppShell.Header>
        <Group h="100%" px="md"></Group>
      </AppShell.Header>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};
