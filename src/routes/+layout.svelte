<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { auth } from '$lib/stores';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
    import Navbar from '$lib/components/Navbar.svelte';

	let { children } = $props();

	onMount(() => {
		if (!$auth.isAuthenticated && $page.url.pathname !== '/login') {
			goto('/login');
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen bg-gray-900 font-sans text-gray-200">
	{#if $auth.isAuthenticated || $page.url.pathname === '/login'}
		<header class="bg-gray-800 shadow-md">
				<Navbar />
		</header>

		<main class="p-6">
			{@render children?.()}
		</main>
	{/if}
	<footer class="mt-8 border-t border-gray-800 p-4 text-center text-gray-500">
		<p>BORME Processor Interface</p>
		<p>&copy; Juan Fuente 2025</p>
	</footer>
</div>
