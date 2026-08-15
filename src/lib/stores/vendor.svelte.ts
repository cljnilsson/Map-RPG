import type { VendorNPC } from "#lib/types/npc.js";

const Store = $state<{ currentVendor: VendorNPC | undefined }>({
	currentVendor: undefined,
});

export default Store;