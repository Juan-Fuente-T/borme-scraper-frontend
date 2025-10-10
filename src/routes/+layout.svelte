<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="bg-gray-900 text-gray-200 min-h-screen font-sans">
    <header class="bg-gray-800 shadow-md">
        <nav class="container mx-auto px-6 py-3">
            <ul class="flex items-center justify-end space-x-6">
                <li>
                    <a href="/" class="text-lg font-semibold text-gray-300 hover:text-white">Dashboard</a>
                </li>
                <li>
                    <a href="/companies" class="text-lg font-semibold text-gray-300 hover:text-white">Todas las Compañías</a>
                </li>
                <li>
                    <a href="/publications" class="text-lg font-semibold text-gray-300 hover:text-white">Publicaciones</a>
                </li>
            </ul>
        </nav>
    </header>

    <main class="p-6">
        {@render children?.()}
    </main>

    <footer class="text-center p-4 mt-8 border-t border-gray-800 text-gray-500">
        <p>BORME Processor Interface</p>
		<p>&copy; Juan Fuente 2025</p>
    </footer>
</div>
