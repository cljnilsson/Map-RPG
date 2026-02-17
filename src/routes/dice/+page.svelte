<script lang="ts">
import WindowController from "$lib/controller/window.svelte";
import RollWindow from "$lib/features/window/windows/roll/roll.svelte";

let rollResult: number = $state(-1);

async function roll() {
	WindowController.getByName("Roll").visible = true;
}

function onRollResult(result: number, success: boolean) {
	console.log("outer result callback: ", result, success);
	rollResult = result;
}
</script>

<div class="wrapper mt-5 mx-5 px-3">
	<div class="text-center my-5">
		<button type="button" class="btn btn-outline-dark" onclick={roll}>Roll</button>
	</div>
</div>
<RollWindow header="Cool roll"
    onRollResult={onRollResult}
   	diceCount={1}
   	toBeat={15}
   	mod={4}
    canClose={true}
    disable={rollResult >= 0} />

<style>
	.wrapper {
		background: rgba(235, 235, 235, 0.6);
		border-radius: 10px;
		padding-top: 0.75rem;
		padding-bottom: 0.75rem;
	}
</style>
