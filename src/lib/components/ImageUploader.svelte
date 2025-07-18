<script lang="ts">
	let { avatar = $bindable() }: { avatar: string } = $props();
	let fileinput: HTMLInputElement;

	async function uploadImage(file: File): Promise<{ path: string; filename: string } | null> {
		const formData = new FormData();
		formData.append("image", file);

		const res = await fetch("/api/upload", {
			method: "POST",
			body: formData
		});

		if (res.ok) {
			const data = await res.json();
			const parts = data.path.split("/");
			const filename = parts[parts.length - 1];
			return { path: data.path, filename };
		} else {
			console.error("Image upload failed");
			return null;
		}
	}

	async function onFileSelected(e: Event) {
		let files = (e.target as HTMLInputElement).files;
		if (!files || !files[0]) return;

		const file = files[0];

		// Preview (optional if you're displaying uploaded version instead)
		const reader = new FileReader();
		reader.onload = (e) => {
			if (e.target) avatar = e.target.result as string;
		};
		reader.readAsDataURL(file);

		// Upload image
		const uploaded = await uploadImage(file);
		if (uploaded) {
			avatar = uploaded.path;
			let filename = uploaded.filename;
			console.log("Stored filename:", filename);
		}
	}
</script>

<div id="app">
	{#if avatar}
		<img class="avatar" src={avatar} alt="profile pic" />
	{:else}
		<h5>Upload Image</h5>
		<img class="avatar" src="https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png" alt="" />
	{/if}

	<button class="btn btn-primary" type="button" onclick={() => fileinput.click()}> Choose Image </button>
	<input style="display: none" type="file" accept="image/*" bind:this={fileinput} onchange={onFileSelected} />
</div>

<style>
	#app {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-flow: column;
	}

	.avatar {
		height: 200px;
		width: 200px;
		object-fit: cover;
		border-radius: 50%;
		margin-bottom: 1rem;
	}
</style>
