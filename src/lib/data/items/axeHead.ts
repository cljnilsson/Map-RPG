import type { CraftItem } from "$lib/types/item";

const axeHead = {
  type: "craft",
  id: "axe-head",
  name: "Axe Head",
  iconPath: "/items/axeHead.png",
  iconClass: "",
  unique: false,
  description: "Simple but sharp, component of an axe.",
  quality: "common",
  components: [
    {
      item: "iron-bar",
      quantity: 2,
      requiredQuality: false,
    },
  ],
  resourceCosts: [],
} satisfies CraftItem;

export default axeHead;
