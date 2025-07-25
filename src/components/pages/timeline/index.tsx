import "./style.css";
import { ActionIcon, Group, Text, Tooltip } from "@mantine/core";
import { IconNotebook } from "@tabler/icons-react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, {
  type DateClickArg,
} from "@fullcalendar/interaction";
import { useSelector } from "react-redux";
import { calendarToForm, type Timeline } from "../../../features/models";
import { timelineSlice } from "../../../features/timelines/timelineSlice";
import CustomTimelineEvent from "../../CustomTimelineEvent";
import type { RootState } from "../../../app/store";
import EditTimelineEventModal from "./editTimelineEventModal";
import { useTimeline } from "./hooks";
import EditCharacterMemoModal from "./editCharacterMemoModal";
import { CALENDAR_INIT_DATE } from "../../../app/appConstants";

/** タイムラインページ */
function TimelinePage() {
  const { timelineEvents, config } = useSelector(
    (state: RootState) => state[timelineSlice.reducerPath]
  ) as Timeline;

  // colgroup 用に「時間軸＋キャラ列」を定義
  const cols = [
    <col key="time" style={{ width: 50 }} />,
    ...config.characters.map((c) => (
      <col key={c.id} style={{ width: "auto" }} />
    )),
  ];

  // カスタムフックからロジックを取得
  const {
    handleEventDrop,
    handleEventResize,
    handleClickTimeline,
    selectedEvent,
    setSelectedEvent,
    isEditTimelineEventModalOpen,
    EditTimelineEventOpen,
    handleEditTimelineEventClose,
    selectedCharacter,
    setSelectedCharacter,
    isEditCharacterMemoModalOpen,
    EditCharacterMemoModalOpen,
    handleEditCharacterMemoClose,
  } = useTimeline(config);

  return (
    <div className="timeline-container">
      <table className="timeline-table">
        <colgroup>{cols}</colgroup>
        {/* タイムラインヘッダー */}
        <thead>
          <tr>
            <th></th>
            {config.characters.map((c) => (
              <th key={c.id}>
                {/* キャラクター名 */}
                <Group justify="center" gap={4}>
                  <Tooltip
                    label={c.memo}
                    styles={{
                      tooltip: {
                        whiteSpace: "pre-line", // 改行コード \n を反映
                        maxWidth: 200, // 必要に応じて幅を制限
                        fontSize: "12px",
                      },
                    }}
                    disabled={!c.memo}
                  >
                    <Text
                      style={{
                        textDecoration: "underline",
                        textDecorationColor: c.color,
                        textDecorationThickness: "2px",
                      }}
                    >
                      {c.name}
                    </Text>
                  </Tooltip>
                  <ActionIcon
                    variant="filled"
                    color={c.color}
                    size="sm"
                    aria-label="Settings"
                    onClick={() => {
                      setSelectedCharacter(c);
                      EditCharacterMemoModalOpen();
                    }}
                  >
                    <IconNotebook
                      style={{ width: "80%", height: "80%" }}
                      stroke={1.5}
                    />
                  </ActionIcon>
                </Group>
                {/* プレイヤー名 */}
                <Group justify="center">
                  <Text size="xs" color="dimmed">
                    {c.playerName}
                  </Text>
                </Group>
              </th>
            ))}
          </tr>
        </thead>

        {/* タイムラインコンテンツ */}
        <tbody>
          <tr>
            {/* --- 時間軸だけの FullCalendar --- */}
            <td style={{ height: "100%" }} className="axis-only">
              <FullCalendar
                plugins={[timeGridPlugin]}
                initialView="timeGridDay"
                locale="en"
                initialDate={CALENDAR_INIT_DATE}
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
                slotLabelInterval={config.interval}
                slotDuration={config.interval}
                slotMinTime={config.timelineStartTime}
                slotMaxTime={config.timelineEndTime}
                scrollTime={config.timelineStartTime}
                events={[]}
              />
            </td>

            {/* --- 各キャラクターごとの FullCalendar --- */}
            {config.characters.map((c) => {
              const filteredEvents = timelineEvents.filter((ev) =>
                ev.extendedProps.characters.some((ch) => ch.id === c.id)
              );
              return (
                <td
                  key={c.id}
                  style={{ height: "100%" }}
                  className="character-timeline"
                >
                  <FullCalendar
                    plugins={[timeGridPlugin, interactionPlugin]}
                    initialView="timeGridDay"
                    locale="ja"
                    initialDate={CALENDAR_INIT_DATE}
                    allDaySlot={false}
                    dayHeaders={false}
                    headerToolbar={false}
                    dayHeaderContent={() => null}
                    contentHeight="auto"
                    slotLabelContent={() => null}
                    slotMinTime={config.timelineStartTime}
                    slotMaxTime={config.timelineEndTime}
                    scrollTime={config.timelineStartTime}
                    eventContent={CustomTimelineEvent}
                    events={filteredEvents}
                    eventClick={(info) => {
                      info.jsEvent.preventDefault();
                      setSelectedEvent(calendarToForm(info.event));
                      EditTimelineEventOpen();
                    }}
                    dateClick={(args: DateClickArg) => {
                      handleClickTimeline(args, c);
                    }}
                    slotLabelInterval={config.interval}
                    slotDuration={config.interval}
                    editable
                    eventDrop={handleEventDrop}
                    eventResize={handleEventResize}
                    eventMinHeight={50}
                  />
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>

      {/* イベント登録モーダル */}
      <EditTimelineEventModal
        opened={isEditTimelineEventModalOpen}
        onClose={handleEditTimelineEventClose}
        selectedEvent={selectedEvent}
      />

      {/* キャラクターメモ編集モーダル */}
      <EditCharacterMemoModal
        opened={isEditCharacterMemoModalOpen}
        onClose={handleEditCharacterMemoClose}
        selectedCharacter={selectedCharacter}
      />
    </div>
  );
}

export default TimelinePage;
