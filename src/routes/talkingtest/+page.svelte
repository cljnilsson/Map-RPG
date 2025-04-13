<script lang="ts">
	type Message = {
		text: string;
		from: string;
	};

	let msgs: Message[] = [
		{ text: 'Hello, how are you?', from: 'Alice' },
		{ text: "I'm good, thanks! How about you?", from: 'Bob' },
		{ text: "I'm doing well, just working on some projects.", from: 'Alice' },
		{ text: 'That sounds interesting! What kind of projects?', from: 'Bob' },
		{ text: 'Just some web development stuff. You know how it is.', from: 'Alice' }
	];

	let current = 0;

	function prev() {
		current = current > 0 ? current - 1 : msgs.length - 1;
	}

	function next() {
		current = (current + 1) % msgs.length;
	}
</script>

<div class="mt-5 mx-5 px-3">
	<div class="row justify-content-center">
		<div class="col-6 wrapper position-relative">
			<h5>{msgs[current].from}</h5>
			<p>{msgs[current].text}</p>

			<div class="button-container">
				<button class="btn btn-dark" on:click={prev}>Previous</button>
				<button class="btn btn-dark" on:click={next}>Next</button>
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
