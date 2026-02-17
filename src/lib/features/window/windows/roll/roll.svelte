<script lang="ts">
import Window from "$lib/features/window/window.svelte";
import WindowController from "$lib/controller/window.svelte";
import DieCollection from "$lib/features/die/dieCollection.svelte";
import { PlayerController } from "$lib/controller/character.svelte";

let {
	header,
	diceCount = 1,
	toBeat,
	mod = 0,
	onRollResult,
	disable = false,
	canClose = false,
}: {
	header: string;
	diceCount?: number;
	toBeat: number;
	mod?: number;
	disable?: boolean;
	canClose?: boolean;
	onRollResult: (result: number, success: boolean) => void;
} = $props();
let diceRef: DieCollection;

async function roll() {
	const result = await diceRef?.roll();
	const total = result.reduce((newValue, currentValues) => currentValues + newValue);
	const success = total + mod >= toBeat;
	console.log(total, total + mod, success);

	onRollResult(total + mod, success);
}

let rollWindow = WindowController.getByName("Roll");
</script>

<Window
	uniqueKey="Roll"
	height={400}
	width={600}
	x={rollWindow.x}
	y={rollWindow.y}
	canClose={canClose}
	canLock={false}
	canMinimize={false}
	bind:visibility={rollWindow.visible}
>
	{#snippet title()}
		<h2 class="text-center">Roll!</h2>
	{/snippet}
	{#snippet body()}
	    <p class="text-center">{header}</p>
		<DieCollection num={diceCount} sides={20} modifier={mod} bind:this={diceRef} clickable={false} />
	{/snippet}
	{#snippet footer()}
		<div class="text-center mt-3">
			<button class="btn btn-lg btn-outline-light" onclick={roll} disabled={disable}>Roll</button>
		</div>
	{/snippet}
</Window>
