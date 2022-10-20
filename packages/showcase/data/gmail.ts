import { ComponentType } from "react";
import * as icons from "react-icons/md";

export type GmailItem = {
  id: string;
  name: string;
  icon: ComponentType;
  unread?: number;
  children?: GmailItem[];
};

export const gmailData: GmailItem[] = [
  {
    id: "1",
    name: "Inbox",
    unread: 1,
    icon: icons.MdInbox,
  },
  {
    id: "2",
    name: "Starred",
    unread: 0,
    icon: icons.MdStarOutline,
  },
  {
    id: "3",
    name: "Snoozed",
    unread: 0,
    icon: icons.MdAccessTime,
  },
  {
    id: "4",
    name: "Sent",
    unread: 0,
    icon: icons.MdSend,
  },
  {
    id: "5",
    name: "Drafts",
    unread: 14,
    icon: icons.MdOutlineDrafts,
  },
  {
    id: "6",
    name: "Spam",
    unread: 54,
    icon: icons.MdOutlineReportGmailerrorred,
  },
  {
    id: "7",
    name: "Important",
    unread: 0,
    icon: icons.MdLabelImportantOutline,
  },
  {
    id: "8",
    name: "Chats",
    unread: 0,
    icon: icons.MdOutlineChat,
  },
  {
    id: "9",
    name: "Scheduled",
    unread: 0,
    icon: icons.MdOutlineScheduleSend,
  },
  {
    id: "10",
    name: "All Mail",
    unread: 0,
    icon: icons.MdOutlineMail,
  },
  {
    id: "11",
    name: "Trash",
    unread: 0,
    icon: icons.MdOutlineDelete,
  },
  {
    id: "12",
    name: "Categories",
    icon: icons.MdOutlineLabel,
    children: [
      {
        id: "13",
        name: "Social",
        unread: 946,
        icon: icons.MdPeopleOutline,
      },
      {
        id: "14",
        name: "Updates",
        unread: 4580,
        icon: icons.MdOutlineInfo,
      },
      {
        id: "15",
        name: "Forums",
        unread: 312,
        icon: icons.MdChatBubbleOutline,
      },
      {
        id: "16",
        name: "Promotions",
        unread: 312,
        icon: icons.MdOutlineLocalOffer,
      },
    ],
  },
];
