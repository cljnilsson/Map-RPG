<script lang="ts">
    type CharSprite = {
        name: string;
        image: string;
    }
	type Message = {
		text: string;
		from: CharSprite;
	};

    let alice = {
        name: "Alice",
        image: "alice.png"
    }

    let bob = {
        name: "Bob",
        image: "bob.png"
    }

	let msgs: Message[] = [
		{ text: 'Hello, how are you?', from: alice },
		{ text: "I'm good, thanks! How about you?", from: bob },
		{ text: "I'm doing well, just working on some projects.", from: alice },
		{ text: 'That sounds interesting! What kind of projects?', from: bob },
		{ text: 'Just some web development stuff. You know how it is.', from: alice }
	];

	let current = 0;

	function prev() {
		current = current - 1;
	}

	function next() {
		current = (current + 1);
	}
</script>

<div class="mt-5 mx-5 px-3">
    <div class="row justify-content-center">
        <div class="col-6">
            <img src={msgs[current].from.image} alt={msgs[current].from.name} class="img-fluid" style="max-width: 200px; max-height: 200px;" />
        </div>
    </div>
	<div class="row justify-content-center">
		<div class="col-6 wrapper position-relative">
			<h5>{msgs[current].from.name} ({current})</h5>
			<p>{msgs[current].text}</p>

			<div class="button-container">
				<button class="btn btn-dark" on:click={prev} disabled={current === 0}>Previous</button>
				<button class="btn btn-dark" on:click={next} disabled={current === msgs.length - 1}>Next</button>
			</div>
		</div>
	</div>
</div>

<style>
	.wrapper {
		background: rgba(235, 235, 235, 0.6);
		border-radius: 10px;
		padding-top: 0.75rem;
		padding-bottom: 2.5rem; /* Extra space for button overlap */
		position: relative;
		overflow: visible;
	}

	.button-container {
		position: absolute;
		bottom: 0.25rem;
		right: 0.25rem;
		transform: translateY(50%);
		display: flex;
		gap: 0.5rem;
	}
</style>
