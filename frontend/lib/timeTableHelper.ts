import { Schedule } from "../../shared/models/responses/getCohortsResponse";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const monthDiff = (firstMonth: Date, lastMonth: Date) => {
  let months;
  months = (lastMonth.getFullYear() - firstMonth.getFullYear()) * 12;
  months -= firstMonth.getMonth();
  months += lastMonth.getMonth();
  return months <= 0 ? 0 : months;
}

const dayDiff = (startDate: string, endDate: string) => {
  const difference =
    new Date(endDate).getTime() - new Date(startDate).getTime();
  const days = Math.ceil(difference / (1000 * 3600 * 24)) + 1;
  return days;
}

const weekDiff = (startDate: string, endDate: string) => {
  const difference = dayDiff(startDate, endDate);
  return Math.ceil(difference / 7);
}

const getWeeksInMonth = (year: number, month: number) => {
  const firstDate = new Date(year, month, 1).toString();
  const lastDate = new Date(year, month + 1, 0).toString();;
  const numDays = dayDiff(firstDate, lastDate);
  const numWeeks = Math.ceil(numDays / 7);
  return numWeeks;
}

const createFormattedWeekFromStr = (startDate: string) => {
  const curYear = new Date(startDate).getFullYear();
  const curMonth = new Date(startDate).getMonth() + 1;
  const numWeeks = Math.ceil(new Date(startDate).getDate() / 7);
  return `${curYear}-${curMonth}-Week${numWeeks}`;
}

const currentStatusColor = (item: Schedule) => {
  const today = new Date();
  const endDate = new Date(item.endDate);
  const startDate = new Date(item.startDate);
  let color = "var(--blue)";
  if (endDate >= today && startDate <= today) {
    color = "var(--green)";
  } else if (endDate < today) {
    color = "var(--gray)";
  }

  if (item.course.name === "Break") {
    color = "var(--pink)";
  }
  return color;
};

export {
  months,
  monthDiff,
  getWeeksInMonth,
  createFormattedWeekFromStr,
  currentStatusColor,
  weekDiff,
};
