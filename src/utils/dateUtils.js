import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

// Kích hoạt plugin và locale
dayjs.extend(relativeTime);
dayjs.locale("vi");

/**
 * Format thời gian dạng relative (tương đối)
 * @param {string|Date} timestamp - ISO string hoặc Date object
 * @returns {string} - "2 phút trước", "1 giờ trước", "3 ngày trước"
 */
export const formatRelativeTime = (timestamp) => {
  return dayjs(timestamp).fromNow();
};

/**
 * Format thời gian dạng giờ:phút (cho tin nhắn)
 * @param {string|Date} timestamp
 * @returns {string} - "14:30", "09:15"
 */
export const formatMessageTime = (timestamp) => {
  const messageDate = dayjs(timestamp);
  const today = dayjs();
  const yesterday = dayjs().subtract(1, "day");

  // Nếu là hôm nay
  if (messageDate.isSame(today, "day")) {
    return messageDate.format("HH:mm");
  }

  // Nếu là hôm qua
  if (messageDate.isSame(yesterday, "day")) {
    return `Hôm qua ${messageDate.format("HH:mm")}`;
  }

  // Nếu trong tuần này
  if (messageDate.isAfter(today.subtract(7, "day"))) {
    const weekday = messageDate.format("dddd"); // ← Viết thường
    const time = messageDate.format("HH:mm");
    const capitalizedWeekday =
      weekday.charAt(0).toUpperCase() +
      weekday.slice(1, 4) +
      weekday.charAt(4).toUpperCase() +
      weekday.slice(5);
    return `${capitalizedWeekday} ${time}`;
  }

  // Nếu xa hơn
  return messageDate.format("DD/MM/YYYY HH:mm");
};
