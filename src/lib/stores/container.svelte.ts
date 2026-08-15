import type { ContainerGameObject } from "#lib/types/gameObject.js";

const Store = $state<{ object: ContainerGameObject | null }>({
	object: null,
});

export default Store;