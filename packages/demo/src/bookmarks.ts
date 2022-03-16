import { nanoid } from "nanoid";

const bookmarks = {
  id: nanoid(),
  name: "Bookmarks",
  isOpen: true,
  children: [
    {
      id: nanoid(),
      name: "Brim Github",
      isOpen: true,
      children: [
        {
          id: nanoid(),
          name: "brim/pulls",
        },
        {
          id: nanoid(),
          name: "zed/pulls",
        },
        {
          id: nanoid(),
          name: "brim/releases",
        },
        {
          id: nanoid(),
          name: "brim/zson",
        },
        {
          id: nanoid(),
          name: "Level 3",
          isOpen: true,
          children: [
            { id: nanoid(), name: "amazon" },
            { id: nanoid(), name: "apple" },
            { id: nanoid(), name: "facebook" },
          ],
        },
      ],
    },
    {
      id: nanoid(),
      name: "Brim Zenhub",
      isOpen: true,
      children: [
        { id: nanoid(), name: "My Issues" },
        { id: nanoid(), name: "Brim All Issues" },
        { id: nanoid(), name: "MVP 0" },
        { id: nanoid(), name: "Manual Brim Test Cases" },
      ],
    },
    {
      id: nanoid(),
      name: "Meetings",
      isOpen: true,
      children: [
        { id: nanoid(), name: "Thursday" },
        { id: nanoid(), name: "Saturday" },
      ],
    },
    {
      id: nanoid(),
      name: "Personal",
      isOpen: true,
      children: [
        { id: nanoid(), name: "Imbox" },
        { id: nanoid(), name: "Facebook Marketplace" },
        { id: nanoid(), name: "Bank of America" },
        { id: nanoid(), name: "Mint" },
        { id: nanoid(), name: "Learn UI Design" },
      ],
    },
  ],
};

export default bookmarks;
