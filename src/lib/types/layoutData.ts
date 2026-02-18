type LayoutData = {
  user: {
    id: string;
    username: string;
  } | null;
  userFlags: { name: string; value: number }[];
};

export type { LayoutData };
