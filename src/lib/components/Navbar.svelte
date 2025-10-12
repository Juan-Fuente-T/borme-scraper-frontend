<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores';
	import { setAuthCredentials } from '$lib/api';

	function handleLogout() {
		// 1. Limpia las credenciales.
		setAuthCredentials('', '');
		// 2. Actualiza el estado.
		auth.set({ isAuthenticated: false, username: null });
		// 3. Redirige a la página de login.
		goto('/login');
	}
</script>

<header class="bg-gray-800 shadow-md">
	<nav class="container mx-auto flex items-center justify-end px-6 py-3">
		<ul class="flex items-center space-x-6">
			<li>
				<a href="/" class="text-lg font-semibold text-gray-300 hover:text-white">Dashboard</a>
			</li>
			<li>
				<a href="/companies" class="text-lg font-semibold text-gray-300 hover:text-white"
					>Todas las Compañías</a
				>
			</li>
			<li>
				<a href="/publications" class="text-lg font-semibold text-gray-300 hover:text-white"
					>Publicaciones</a
				>
			</li>
		</ul>

		{#if $auth.isAuthenticated}
			<div class="flex items-center space-x-4 pl-6">
				<span class="text-gray-400">Bienvenido, {$auth.username}</span>
				<button
					on:click={handleLogout}
					class="rounded-md bg-red-800 px-3 py-1 text-sm font-bold text-white transition hover:bg-red-700"
				>
					Logout
				</button>
			</div>
		{/if}
	</nav>
</header>