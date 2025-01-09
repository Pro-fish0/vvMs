import { parse, isValid } from "date-fns";

export const parseDate = (dateStr: string) => {
  const formats = ["d/M/yyyy", "dd-MM-yyyy", "yyyy-MM-dd"];
  for (const format of formats) {
    const parsed = parse(dateStr, format, new Date());
    if (isValid(parsed)) return parsed;
  }
  return null;
};
