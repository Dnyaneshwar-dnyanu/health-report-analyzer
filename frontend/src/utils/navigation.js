import {
  HiOutlineHome,
  HiOutlineChartBar,
  HiOutlineClock,
  HiOutlineChatBubbleLeftRight,
} from "react-icons/hi2";

import { HiOutlineCloudUpload } from "react-icons/hi";

export const navigation = [
  {
    name: "Home",
    path: "/",
    icon: HiOutlineHome,
  },
  {
    name: "Upload",
    path: "/upload",
    icon: HiOutlineCloudUpload,
  },
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: HiOutlineChartBar,
  },
  {
    name: "History",
    path: "/history",
    icon: HiOutlineClock,
  },
  {
    name: "AI Chat",
    path: "/chat",
    icon: HiOutlineChatBubbleLeftRight,
  },
];