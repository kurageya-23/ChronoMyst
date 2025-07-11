import { useState } from "react";
import type { RootState } from "../../app/store";
import type { Timeline } from "../../features/models";
import { timelineSlice } from "../../features/timelines/timelineSlice";
import { useSelector } from "react-redux";
import { useDebouncedValue } from "@mantine/hooks";
import { getTodayString, sanitizeFilename } from "../../app/util";

export const useLayout = () => {
  const timeline = useSelector(
    (state: RootState) => state[timelineSlice.reducerPath]
  ) as Timeline;
  const [scenarioName, setScenarioName] = useState(timeline.scenario.name);
  const [debounced] = useDebouncedValue(scenarioName, 1000);

  const handleImport = () => {
    // TODO: ここでファイルダイアログを開いてjsonファイルをインポート（要バリデーション）
    console.log("handleImport");
  };

  const handleExport = () => {
    // 1. エクスポート用データ生成
    const exportData = {
      appName: "ChronoMyst",
      version: "0.0.1",
      data: timeline,
    };

    // 2. ファイル名を組み立て
    const dateStr = getTodayString();
    const scenarioName = sanitizeFilename(timeline.scenario.name);
    const filename = `${dateStr}_${scenarioName}.json`;

    // 3. Blob を作ってダウンロード用リンクを生成
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // 4. 仮の <a> 要素でダウンロードをトリガー
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    // 5. 後片付け
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return {
    timeline,
    scenarioName,
    setScenarioName,
    debounced,
    handleImport,
    handleExport,
  };
};
