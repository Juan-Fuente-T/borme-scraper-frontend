<script lang="ts">
	import { auth } from '$lib/stores';
	import { setAuthCredentials, verifyLogin } from '$lib/api'; // <-- Se importan las nuevas armas
	import { goto } from '$app/navigation';

	let username = '';
	let password = '';
	let errorMessage = '';
	let isLoading = false;

	async function handleLogin() {
		isLoading = true;
		errorMessage = '';

		try {
			// Se guardan las credenciales para el interceptor.
			setAuthCredentials(username, password);

			// Se intenta verificar el login, si falla lanza un error 401.
			const response = await verifyLogin();

			// Si llega aquí, el login es válido.
			auth.set({
				isAuthenticated: true,
				username: response.data.username
			});
			goto('/'); // Redirige al dashboard
		} catch (err) {
			errorMessage = 'Credenciales inválidas o error de conexión.';
			setAuthCredentials('', '');
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-900">
	<div class="w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-lg">
		<h1 class="mb-6 text-center text-3xl font-bold text-white">Login</h1>

		<form on:submit|preventDefault={handleLogin}>
			<div class="mb-4">
				<label for="username" class="mb-2 block text-sm font-medium text-gray-300"> Usuario </label>
				<input
					type="text"
					id="username"
					bind:value={username}
					class="w-full rounded-md bg-gray-700 px-3 py-2 text-white"
					required
				/>
			</div>

			<div class="mb-6">
				<label for="password" class="mb-2 block text-sm font-medium text-gray-300">
					Contraseña
				</label>
				<input
					type="password"
					id="password"
					bind:value={password}
					class="w-full rounded-md bg-gray-700 px-3 py-2 text-white"
					required
				/>
			</div>

			{#if errorMessage}
				<div class="mb-4 rounded-md bg-red-900 p-3 text-red-300">
					{errorMessage}
				</div>
			{/if}

			<button
				type="submit"
				disabled={isLoading}
				class="w-full rounded-md bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700 disabled:opacity-50"
			>
				{isLoading ? 'Ingresando...' : 'Ingresar'}
			</button>
		</form>

		<p class="mt-4 text-center text-sm text-gray-400">
			Usuario demo: <strong>processor</strong> / Contraseña: <strong>*****-*********</strong>
		</p>
	</div>
</div>
