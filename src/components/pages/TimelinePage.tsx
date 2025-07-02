import { ActionIcon, Affix, Grid, Group, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import EditEventModal from "../EditEventModal";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useSelector } from "react-redux";
import { timelineSlice } from "../../features/timelines/timelineSlice";
import type { RootState } from "../../app/store";
import "./TimelinePage.css";
import type { Timeline } from "../../features/models";
import CustomCalendarEvent from "../CustomCalendarEvent";

function TimelinePage() {
  const { calendarEvents, config } = useSelector(
    (state: RootState) => state[timelineSlice.reducerPath]
  ) as Timeline;

  // イベント登録モーダル
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      {/* カレンダーヘッダー */}
      <Grid py={0}>
        <Grid.Col span={1}></Grid.Col>
        {config.characters.map((c) => (
          <Grid.Col span="auto" flex="center" pt={0} px={0} key={c.id}>
            <Group justify="center">
              <Text
                style={{
                  textDecoration: "underline",
                  textDecorationColor: c.color,
                  textDecorationThickness: "2px",
                }}
              >
                {c.name}
              </Text>
            </Group>
            <Group justify="center">
              <Text size="xs" color="dimmed">
                {c.playerName}
              </Text>
            </Group>
          </Grid.Col>
        ))}
      </Grid>

      {/* カレンダーコンテンツ */}
      {/* <ScrollArea
        scrollbars="y"
        style={{
          maxHeight: "calc(100vh - 100px)",
        }}
      > */}
      <Grid mx={12}>
        {/* 時間目盛り表示用 */}
        <Grid.Col span={1} px={0} className="axis-only">
          <FullCalendar
            plugins={[timeGridPlugin]}
            initialView="timeGridDay"
            locale="en"
            allDaySlot={false}
            dayHeaders={false}
            headerToolbar={false}
            dayHeaderContent={() => null}
            contentHeight="auto"
            slotLabelContent={(arg) => {
              const date = arg.date;
              const hour = date.getHours();
              const minute = String(date.getMinutes()).padStart(2, "0");
              return `${hour}:${minute}`;
            }}
            slotMinTime={config.startTime}
            slotMaxTime={config.endTime}
            scrollTime={config.startTime}
            events={[]}
          />
        </Grid.Col>
        {config.characters.map((c) => {
          const filteredEvents = calendarEvents.filter((ev) =>
            ev.extendedProps.characters.some((ch) => ch.id === c.id)
          );

          return (
            <Grid.Col span="auto" px={0} key={c.id}>
              <FullCalendar
                plugins={[timeGridPlugin]}
                initialView="timeGridDay"
                locale="ja"
                allDaySlot={false}
                dayHeaders={false}
                headerToolbar={false}
                dayHeaderContent={() => null}
                contentHeight="auto"
                slotLabelContent={() => null}
                slotMinTime={config.startTime}
                slotMaxTime={config.endTime}
                scrollTime={config.startTime}
                eventContent={CustomCalendarEvent}
                events={filteredEvents}
              />
            </Grid.Col>
          );
        })}
      </Grid>
      {/* </ScrollArea> */}
      <Affix position={{ bottom: 40, right: 40 }}>
        <Group>
          <Text size="sm">イベントの登録</Text>
          <ActionIcon color="blue" radius="xl" size="lg" onClick={open}>
            <IconPlus stroke={1.5} size={32} />
          </ActionIcon>
        </Group>
      </Affix>
      <EditEventModal opened={opened} onClose={close} />
    </>
  );
}

export default TimelinePage;
