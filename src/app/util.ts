/** 日付文字列を「yyyyMMdd」形式で返すヘルパー関数 */
export const getTodayString = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}${mm}${dd}`;
};

/** ファイル名に使えない文字を _ に置換 */
export const sanitizeFilename = (name: string) =>
  name.replace(/[/\\?%*:|"<> ]/g, "_");

/** "hh:ss"から分を算出（検証なし） */
export const toMinute = (timeStr: string) => {
  const [ih, im] = timeStr.split(":").map(Number);
  return ih * 60 + im;
};

/** 日付に分を足し合わせる */
export const addMinutes = (date: Date, min: number): Date => {
  return new Date(date.getTime() + min * 60 * 1000);
};

/**
 * startTime + timeAmount を合算して endTime を返す
 * 例: startTime="22:00:00", timeAmount="04:00" → "26:00:00"
 *
 * @param startTime "HH:mm:ss"
 * @param timeAmount "HH:mm"
 * @returns result "H…:mm:ss"（時間部分は 2 桁以上可）
 */
export function computeEndTime(startTime: string, timeAmount: string): string {
  const [sh, sm] = startTime.split(":").map(Number);
  const [ah, am] = timeAmount.split(":").map(Number);

  // 分と時間を合算
  const totalMinutes = sm + am;
  const carryHours = Math.floor(totalMinutes / 60);
  const endMinutes = totalMinutes % 60;
  const endHours = sh + ah + carryHours;

  // フォーマット
  const hh = String(endHours).padStart(2, "0");
  const mm = String(endMinutes).padStart(2, "0");

  return `${hh}:${mm}:00`;
}
