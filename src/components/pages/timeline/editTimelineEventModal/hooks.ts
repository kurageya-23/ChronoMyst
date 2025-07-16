import { useMemo } from "react";
import {
  type Timeline,
  type TimelineEventFormData,
  solveTimelineEvent,
  assignTimelineEventId,
  type TimelineConfig,
  formToCalendar,
} from "../../../../features/models";
import { CALENDAR_INIT_DATE } from "../../../../app/appConstants";
import { useDispatch } from "react-redux";
import { timelineSlice } from "../../../../features/timelines/timelineSlice";

/**
 * カスタムフック
 * @param selectedEvent 選択中の EventApi または null
 * @param config Timeline.config（characters, places 等）
 */
export const useTimelineEvent = (
  selectedEvent: TimelineEventFormData | null,
  config: Timeline["config"],
  onClose: () => void
) => {
  // 初期値をメモ化
  const initialValues: TimelineEventFormData = useMemo(() => {
    return selectedEvent!;
  }, [selectedEvent]);

  const dispatch = useDispatch();

  /** フォームデータの送信 */
  const handleSubmit = (values: TimelineEventFormData) => {
    // 依存関係を解決
    const mapped = solveTimelineEvent(values, config);
    // IDの新規採番
    const formWithId = assignTimelineEventId(mapped, !selectedEvent?.id);
    // イベントデータに変換
    const soleved = formToCalendar(formWithId);
    if (selectedEvent?.id) {
      dispatch(timelineSlice.actions.updateTimelineEvent(soleved));
    } else {
      dispatch(timelineSlice.actions.createTimelineEvent(soleved));
    }
    onClose();
  };

  /** イベントデータの削除 */
  const handleDelete = (
    values: TimelineEventFormData,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    // FIXME: formのsubmit発火を防止
    e.preventDefault();

    if (window.confirm("本当にこのイベントを削除しますか？" + values.id)) {
      dispatch(timelineSlice.actions.deleteTimelineEvent(values.id));
    }
    onClose();
  };

  type TimeItem = { value: string; label: string };
  type GroupedTimeOptions = {
    group: string;
    items: TimeItem[];
  }[];

  const useTimeOptions = (
    config: Pick<
      TimelineConfig,
      "timelineStartTime" | "timelineEndTime" | "interval"
    >
  ): GroupedTimeOptions => {
    return useMemo<GroupedTimeOptions>(() => {
      // "HH:mm" → 分
      const toMinutes = (hm: string) => {
        const [h, m] = hm.split(":").map(Number);
        return h * 60 + m;
      };

      const startMin = toMinutes(config.timelineStartTime);
      const endMin = toMinutes(config.timelineEndTime);
      const stepMin = toMinutes(config.interval);

      // カレンダー初期日付の午夜をベースにする
      const baseDate = new Date(`${CALENDAR_INIT_DATE}T00:00:00`);

      type Flat = { group: string; value: string; label: string };
      const flat: Flat[] = [];

      for (let t = startMin; t <= endMin; t += stepMin) {
        const rawH = Math.floor(t / 60);
        const m = t % 60;
        const labelH = rawH % 24;
        const hh = String(labelH).padStart(2, "0");
        const mm = String(m).padStart(2, "0");

        // 何日目か = (rawH / 24 の切り捨て) + 1
        const dayNum = Math.floor(rawH / 24) + 1;
        const group = `${dayNum}日目`;
        const label = `${hh}:${mm}`;

        // baseDate をコピーして日数をずらす
        const dt = new Date(baseDate);
        dt.setDate(dt.getDate() + (dayNum - 1));
        // 時刻をセット
        dt.setHours(labelH, m, 0, 0);

        // ローカル時刻を ISO UTC 文字列に
        const value = dt.toISOString();

        flat.push({ group, value, label });
      }

      // グループ化して返却
      const map = new Map<string, TimeItem[]>();
      flat.forEach(({ group, value, label }) => {
        if (!map.has(group)) {
          map.set(group, []);
        }
        map.get(group)!.push({ value, label });
      });

      return Array.from(map, ([group, items]) => ({ group, items }));
    }, [config.timelineStartTime, config.timelineEndTime, config.interval]);
  };

  return {
    initialValues,
    useTimeOptions,
    handleSubmit,
    handleDelete,
  };
};
