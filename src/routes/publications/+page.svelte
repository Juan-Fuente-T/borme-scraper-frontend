<script lang="ts">
	import { onMount } from 'svelte';
	import {
		companies,
		isLoading,
		errorMessage,
		publications,
		createPaginationStore
	} from '$lib/stores';
	import { getPublications } from '$lib/api';
	import '../../app.css';
	import PaginationControls from '$lib/components/PaginationControls.svelte';

	const pagination = createPaginationStore(30);
	let sortDirection = 'desc'; // Estado inicial
	let sortField = 'publicationDate'; // Campo por el que se ordena

	async function fetchPublications(page: number) {
		// Da la orden de "cargando". Actualiza el store.
		isLoading.set(true);
		errorMessage.set(null); // Limpia errores anteriores.
		const sortParam = `${sortField},${sortDirection}`;

		try {
			const response = await getPublications(page, 30, sortParam);

			if (response.data.success) {
				// Si todo va bien, guarda la lista de publicaciones en el store.
				publications.set(response.data.publications);
				pagination.updateFromResponse({
					currentPage: response.data.currentPage,
					totalPages: response.data.totalPages,
					total: response.data.total
				});
			} else {
				// Se guardan posibles problemas.
				errorMessage.set('El servidor reportó un error al cargar las publicaciones.');
			}
		} catch (err) {
			errorMessage.set('Fallo de conexión. No se pudo contactar con el servidor.');
			console.error(err);
		} finally {
			// En cualquier caso, la carga ha terminado. Actualiza el store.
			isLoading.set(false);
		}
	}

function toggleSortDirection() {
    // Invierte la dirección actual.
    sortDirection = sortDirection === 'desc' ? 'asc' : 'desc';
    // Vuelve a lanzar la búsqueda desde la página 0.
    fetchPublications(0);
}

	// Carga de la primera página al iniciar el componente.
	onMount(() => {
		fetchPublications(0);
	});
</script>

<div class="container mx-auto min-h-screen bg-gray-900 p-8 text-gray-200">
	<h1 class="mb-6 border-b border-gray-700 pb-2 text-4xl font-bold">
		Directorio de documentos publicados
	</h1>

	{#if $isLoading}
		<div class="p-10 text-center">
			<p class="text-xl text-blue-400">Cargando documentos del servidor...</p>
		</div>
	{:else if $errorMessage}
		<div class="rounded-md border border-red-700 bg-red-900 px-4 py-3 text-red-300">
			<strong class="font-bold">¡No se han podido cargar los documentos!</strong>
			<span class="block sm:inline">{$errorMessage}</span>
		</div>
	{:else if $publications.length > 0}
		<div class="flex items-center space-x-4 p-4 justify-end">
			<span class="font-semibold text-gray-400">Ordenar por:</span>
			<button
				on:click={toggleSortDirection}
                class="bg-blue-600 hover:bg-blue-500 text-white py-1 px-3 rounded-md text-sm transition cursor-pointer"
			>
				Fecha {sortDirection === 'desc' ? '↓' : '↑'}
			</button>
		</div>
		<PaginationControls
			currentPage={$pagination.currentPage}
			totalPages={$pagination.totalPages}
			totalElements={$pagination.totalElements}
			isLoading={$isLoading}
			onNext={() => pagination.nextPage(fetchPublications)}
			onPrev={() => pagination.prevPage(fetchPublications)}
		/>
		<div class="overflow-x-auto">
			<table class="min-w-full border border-gray-700 bg-gray-800">
				<thead class="bg-gray-700">
					<tr>
						<th class="px-4 py-3 text-left">Documento ID</th>
						<th class="px-4 py-3 text-left">Nombre</th>
						<th class="px-4 py-3 text-left">Fecha de publicación</th>
						<th class="px-4 py-3 text-left">Url</th>
					</tr>
				</thead>

				<tbody>
					{#each $publications as publication}
						<tr class="border-t border-gray-600 hover:bg-gray-700">
							<td class="px-4 py-2">{publication.id}</td>
							<td class="px-4 py-2 font-semibold">{publication.filename}</td>
							<td class="px-4 py-2">{publication.publicationDate}</td>
							<td class="px-4 py-2">{publication.fileUrl}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else}
		<div class="rounded-md border border-gray-700 bg-gray-800 p-6">
			<p class="text-center text-lg">No se encontraron documentos en la base de datos.</p>
		</div>
	{/if}
</div>
