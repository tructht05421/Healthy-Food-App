// PHẦN 1: IMPORTS
import Signin from "../screens/Signin";
import Signup from "../screens/Signup";
// ↑ Import các component màn hình sẽ được sử dụng trong navigation

import { ScreensName } from "../constants/ScreensName";
// ↑ Import enum chứa tên các màn hình
// Giúp tránh lỗi typo và dễ dàng quản lý tên màn hình

// PHẦN 2: KHAI BÁO CẤU HÌNH SCREENS
export const ScreensMap = [
  {
    // Cấu hình cho màn hình Signup
    name: ScreensName.signup,
    // ↑ Tên màn hình lấy từ enum, ví dụ: "SIGNUP"

    component: Signup,
    // ↑ Component sẽ được render khi navigate tới màn hình này

    options: {
      tabBarButton: () => null,
      // ↑ Return null để ẩn nút tab của màn hình này trong tabbar
    },

    hiddenBottomTab: true,
    // ↑ Flag để ẩn hoàn toàn tabbar khi ở màn hình này
  },

  {
    // Cấu hình cho màn hình Signin
    name: ScreensName.signin,
    component: Signin,
    options: {
      tabBarButton: () => null,
    },
    hiddenBottomTab: true,

    // Code mẫu về cách cấu hình icon cho tab (đã comment)
    // options: {
    //   tabBarIcon: ({ color, focused }) => (
    //     <Ionicons
    //       name="home-outline"    // Tên icon
    //       size={32}             // Kích thước icon
    //       color={color}         // Màu sắc (active/inactive)
    //     />
    //   ),
    // },
  },
];
