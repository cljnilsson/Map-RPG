import type { CraftItem } from "$lib/types/item";

const longbow = {
  type: "craft",
  id: "longbow",
  name: "Longbow",
  iconPath: "/items/bow3.jpg",
  iconClass: "",
  unique: false,
  description: "Sturdy, brutally powerful shots from long range.",
  quality: "common",
  components: [],
  resourceCosts: [{ resource: "Wood", amount: 3 }],
} satisfies CraftItem;

export default longbow;
