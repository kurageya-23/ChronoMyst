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
