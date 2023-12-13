import { ElMessage } from "element-plus";
const baseUtils = {
  roundDownToNearestMultiple(number) {
    if (number === undefined || number === null) return;
    const strNumber = number.toString();
    const mostSignificantDigit = parseInt(strNumber[0]);
    const multiplier = Math.pow(10, strNumber.length - 1);
    return mostSignificantDigit * multiplier;
  },
  successMessage(message) {
    ElMessage({
      message: message,
      type: "success",
    });
  },
  failMessage(message) {
    ElMessage({
      message: message,
      type: "error",
    });
  },
  UnkownErrorMessage(message) {
    ElMessage({
      message: message,
      type: "info",
    });
  },
  formatter: new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZone: "Asia/Shanghai", // 时区设置，根据实际情况调整
  }),
};
export default baseUtils;
