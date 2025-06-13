import {
  HiOutlineHomeModern,
  HiOutlinePencilSquare,
  HiOutlineCheckCircle,
  HiOutlineBookmark,
  HiOutlineArrowRightOnRectangle,
  HiOutlineChartBarSquare,
} from "react-icons/hi2";

export const SIDE_MENU_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: HiOutlineHomeModern,
    path: "/dashboard",
  },
  {
    id: "02",
    label: "Create Poll",
    icon: HiOutlineChartBarSquare,
    path: "/create-polls",
  },
  {
    id: "03",
    label: "My Polls",
    icon: HiOutlinePencilSquare,
    path: "/my-polls",
  },
  {
    id: "04",
    label: "Voted Poll",
    icon: HiOutlineCheckCircle,
    path: "/voted-polls",
  },
  {
    id: "05",
    label: "BookMarks",
    icon: HiOutlineBookmark,
    path: "/bookmarked-polls",
  },
  {
    id: "06",
    label: "Logout",
    icon: HiOutlineArrowRightOnRectangle,
    path: "logout",
  },
];


export const POLL_TYPE = [
  { 
    id:"01",
    label:"Yes/No",
    value:"yes/no"
  },
  {
    id:"02",
    label:"Single Choice",
    value:"single-choice"
  },
  {
    id:"03",
    label:"Rating",
    value:"rating"
  },
  {
    id:"04",
    label:"Image Based",
    value:"image-based"
  },
  {
    id:"05",
    label:"Open Ended",
    value:"open-ended"
  }
]