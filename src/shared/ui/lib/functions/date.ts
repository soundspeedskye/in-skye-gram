import { formatDistanceToNowStrict } from "date-fns";

export const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  return formatDistanceToNowStrict(date, {
    addSuffix: true, // "전" 또는 "후"를 붙임
  });
};
