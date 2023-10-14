import { useCallback } from "react";

const useDateFormatter = () => {
  return useCallback((updated_at) => {
    const date = new Date(updated_at);

    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return `${month}月${day}日${hours}:${
      minutes < 10 ? "0" + minutes : minutes
    }`;
  }, []);
};

export default useDateFormatter;
