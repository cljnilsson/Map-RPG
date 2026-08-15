<script lang="ts">
import WindowController from "#lib/controller/window.svelte.js";
import RollWindow from "#lib/features/window/windows/roll/roll.svelte";

let rollResult: number = $state(-1);

async function roll() {
	WindowController.getByName("Roll").visible = true;
}

function onRollResult(result: number, success: boolean) {
	console.log("outer result callback: ", result, success);
	rollResult = result;
}
</script>

<div class="wrapper page-surface mt-5 mx-5 px-3">
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
