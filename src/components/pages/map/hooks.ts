import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import { mapSlice } from "../../../features/map/mapSlice";
import type { FileWithPath } from "@mantine/dropzone";
import {
  getTimeSlots,
  timelineSlice,
} from "../../../features/timelines/timelineSlice";
import { mapSelectors } from "../../../features/map/selectors";
import { useMemo } from "react";
import type { SelectOption } from "../../../features/models";

/**
 * マップビューに関するカスタムフック
 */
export const useMapView = () => {
  const dispatch = useDispatch();
  const timeline = useSelector((s: RootState) => s[timelineSlice.reducerPath]);
  const mapData = useSelector(mapSelectors.selectMapData);

  /** ファイル選択イベントハンドラ */
  const onFileDrop = (files: FileWithPath[]) => {
    const file = files[0];
    if (!file) {
      dispatch(mapSlice.actions.updateMapImage(""));
      return;
    }
    dispatch(mapSlice.actions.updateMapImage(URL.createObjectURL(file)));
  };

  /** マップ時間変更イベントハンドラ */
  const onTimeChange = (value: string | null) => {
    dispatch(mapSlice.actions.updateSelectedTime(value ?? ""));
  };

  const timeSlots = useMemo<SelectOption[]>(
    () => getTimeSlots(timeline.config),
    [timeline.config]
  );

  return {
    mapData,
    onFileDrop,
    timeSlots,
    onTimeChange,
  };
};
