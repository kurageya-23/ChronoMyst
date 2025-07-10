import { useMemo, useCallback, useEffect } from "react";
import { useForm } from "@mantine/form";
import { useSelector, useDispatch } from "react-redux";
import { getTimeRange, isTimeAfter } from "@mantine/dates";
import { timelineSlice } from "../../../../features/timelines/timelineSlice";
import type { RootState } from "../../../../app/store";
import type { TimelineConfig } from "../../../../features/models";
import { configModalValidator } from "./validator";

export const useTimelineConfig = (opened: boolean, onClose: () => void) => {
  const dispatch = useDispatch();
  const config = useSelector(
    (s: RootState) => s[timelineSlice.reducerPath] as { config: TimelineConfig }
  ).config;

  const initialValues = useMemo<TimelineConfig>(
    () => ({
      interval: config.interval,
      startTime: config.startTime,
      endTime: config.endTime,
      characters: config.characters.map((c) => ({ ...c })),
      places: config.places.map((p) => ({ ...p })),
    }),
    [config]
  );

  const form = useForm<TimelineConfig>({
    mode: "controlled",
    initialValues,
    validate: configModalValidator,
  });

  // opened フラグが true に変わった瞬間だけ、フォーム値を初期値に上書きする
  useEffect(() => {
    if (opened) {
      form.setValues(initialValues);
    }
  }, [opened]);

  // interval に合わせてプリセット生成
  const presets = useMemo(() => {
    const interval = isTimeAfter(form.values.interval, "00:10")
      ? form.values.interval
      : "00:10";

    return getTimeRange({
      startTime: "00:00",
      endTime: "24:00",
      interval,
    });
  }, [form.values.interval]);

  const handleSubmit = useCallback(
    (values: TimelineConfig) => {
      dispatch(timelineSlice.actions.updateConfig(values));
      onClose();
    },
    [dispatch, onClose]
  );

  return { form, presets, handleSubmit };
};
