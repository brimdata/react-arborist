type DefaultNodeObject = {
  id: string;
  name: string;
  children?: DefaultNodeObject[];
};

export const defaultNodeObjects: DefaultNodeObject[] = [
  {
    id: "1",
    name: "Welcome",
  },
  { id: "2", name: "To" },
  { id: "3", name: "React" },
  { id: "4", name: "Arborist" },
  {
    id: "5",
    name: "References",
    children: [
      {
        id: "6",
        name: "Documentation",
      },
      {
        id: "7",
        name: "Repository",
      },
      {
        id: "8",
        name: "Brim Data",
      },
      {
        id: "9",
        name: "Contact the Author",
        children: [
          {
            id: "10",
            name: "Website",
          },
          {
            id: "11",
            name: "Mastodon",
          },
          {
            id: "12",
            name: "GitHub Profile",
          },
          {
            id: "13",
            name: "Email",
          },
        ],
      },
    ],
  },
];
