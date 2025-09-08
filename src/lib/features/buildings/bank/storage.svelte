<script lang="ts">
	import type { VendorItem } from "$lib/types/item";
	import { getItem } from "$lib/data/items";
    import Tooltip from "$lib/features/tooltip/tooltip.svelte";
	import {q2c} from "$lib/utils/itemQuality";
	import type { Building } from "$lib/types/building";

    let maxLoan = $state(5000);
	let currentLoans: {
		full: number;
		paid: number;
		interestRate: number;
	}[] = $state([]);
	const tabs = [
		{ title: "Loans", target: "loans" },
		{ title: "Storage", target: "storage" },
	];
</script>

stuff