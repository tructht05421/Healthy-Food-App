import { useState, useEffect } from "react";

/**
 * Custom hook để lấy mùa hiện tại dựa trên tháng
 * @param {string} hemisphere - 'northern' hoặc 'southern' tương ứng với bắc bán cầu hoặc nam bán cầu
 * @returns {string} - Tên mùa bằng tiếng Anh: 'Spring', 'Summer', 'Fall' hoặc 'Winter'
 */
function useCurrentSeason(hemisphere = "northern") {
  const [season, setSeason] = useState("");

  useEffect(() => {
    // Lấy tháng hiện tại (0-11)
    const currentMonth = new Date().getMonth() + 1;

    // Xác định mùa dựa vào tháng và bán cầu
    if (hemisphere === "northern") {
      // Bắc bán cầu
      if (currentMonth >= 2 && currentMonth <= 4) {
        setSeason("Spring"); // Mùa xuân: tháng 3-5
      } else if (currentMonth >= 5 && currentMonth <= 7) {
        setSeason("Summer"); // Mùa hè: tháng 6-8
      } else if (currentMonth >= 8 && currentMonth <= 10) {
        setSeason("Fall"); // Mùa thu: tháng 9-11
      } else {
        setSeason("Winter"); // Mùa đông: tháng 12-2
      }
    } else {
      // Nam bán cầu (ngược với bắc bán cầu)
      if (currentMonth >= 2 && currentMonth <= 4) {
        setSeason("Fall"); // Mùa thu
      } else if (currentMonth >= 5 && currentMonth <= 7) {
        setSeason("Winter"); // Mùa đông
      } else if (currentMonth >= 8 && currentMonth <= 10) {
        setSeason("Spring"); // Mùa xuân
      } else {
        setSeason("Summer"); // Mùa hè
      }
    }
  }, [hemisphere]);

  return season;
}

export default useCurrentSeason;
