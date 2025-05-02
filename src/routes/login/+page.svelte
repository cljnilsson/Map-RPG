<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<div class="container mt-3">
	<div class="row justify-content-center">
		<div class="col-auto">
			<h1>Login/Register</h1>
			<form method="post" action="?/login" use:enhance>
				<div>	
					<label>
						Username
						<input class="form-control" name="username" />
					</label>
				</div>
				<div>
					<label>
						Password
						<input class="form-control" type="password" name="password" />
					</label>
				</div>
				<div class="mt-3 text-center">
					<button class="btn btn-primary">Login</button>
					<button class="btn btn-primary" formaction="?/register">Register</button>
				</div>
			</form>
			<p style="color: red">{form?.message ?? ''}</p>
		</div>
	</div>
</div>

<style>
	.container {
		background: rgba(235, 235, 235, 0.6);
		border-radius: 10px;
		padding-top: 0.75rem;
		padding-bottom: 0.75rem;
	}
</style>
