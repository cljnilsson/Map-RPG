import type { VendorNPC } from "$lib/types/npc";

const Store = $state<{ currentVendor: VendorNPC | undefined }>({
	currentVendor: undefined,
});

export default Store;