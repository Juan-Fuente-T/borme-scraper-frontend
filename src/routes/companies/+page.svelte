<script lang="ts">
	import { onMount } from 'svelte';
	import { companies, isLoading, errorMessage, createPaginationStore } from '$lib/stores';
	import { searchCompanies } from '$lib/api';
	import PaginationControls from '$lib/components/PaginationControls.svelte';
	import '../../app.css';
	import SortControls from '$lib/components/SortControls.svelte';

	// Store de paginación
	const pagination = createPaginationStore(30);
	let sortDirection = 'desc'; // Estado inicial
	let sortField = 'startDate'; // Campo por el que se ordena

	// ESTADO PARA LOS FILTROS DE BÚSQUEDA
	let nameFilter: string | null = null;
	let adminFilter: string | null = null;
	let solePartnerFilter: string | null = null;
	let startDateFilter: string | null = null;
	let endDateFilter: string | null = null;

	async function performSearch(pageToFetch: number = 0) {
		isLoading.set(true);
		errorMessage.set(null);

		const sortParam = `${sortField},${sortDirection}`;

		try {
			const response = await searchCompanies(
				nameFilter,
				adminFilter,
				solePartnerFilter,
				startDateFilter,
				endDateFilter,
				pageToFetch,
				30, // Tamaño de página
				sortParam
			);

			if (response.data.success) {
				companies.set(response.data.companies);
				pagination.updateFromResponse({
					// Se actualiza el store de paginación
					currentPage: response.data.currentPage,
					totalPages: response.data.totalPages,
					total: response.data.total
				});
			} else {
				errorMessage.set('El servidor reportó un error en la búsqueda.');
			}
		} catch (err) {
			errorMessage.set('Fallo de conexión al realizar la búsqueda.');
		} finally {
			isLoading.set(false);
		}
	}

	onMount(() => {
		performSearch(); // Carga inicial
	});

	function handleSort(field: string) {
		if (sortField === field) {
			// Si ya está ordenado por este campo, se invierte la dirección.
			sortDirection = sortDirection === 'desc' ? 'asc' : 'desc';
		} else {
			// Si es un campo nuevo, se establece y se resetea a 'desc'.
			sortField = field;
			sortDirection = 'desc';
		}
		performSearch(); // Se vuelve a buscar con la nueva ordenación.
	}

	function clearFilters() {
		nameFilter = null;
		adminFilter = null;
		solePartnerFilter = null;
		startDateFilter = null;
		endDateFilter = null;
		performSearch(0); // Vuelve a buscar desde la página 0 sin filtros
	}
</script>

<div class="container mx-auto min-h-screen bg-gray-900 p-8 text-gray-200">
	<h1 class="mb-6 border-b border-gray-700 pb-2 text-4xl font-bold">Directorio de Compañías</h1>

	<div class="mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-lg">
		<form
			on:submit|preventDefault={() => performSearch(0)}
			class="grid grid-cols-1 items-end gap-4 md:grid-cols-12"
		>
			<div class="md:col-span-3">
				<label for="nameFilter" class="mb-1 block text-sm font-medium text-gray-400"
					>Buscar por Nombre</label
				>
				<input
					type="text"
					id="nameFilter"
					bind:value={nameFilter}
					placeholder="Ej: PREMIER NATURAL ENERGY..."
					class="w-full rounded-md bg-gray-700"
				/>
			</div>

			<div class="md:col-span-4">
				<label for="adminFilter" class="mb-1 block text-sm font-medium text-gray-400"
					>Admin / Socio</label
				>
				<input
					type="text"
					id="adminFilter"
					bind:value={adminFilter}
					placeholder="Ej: ABAD GARCIA JAVIER..."
					class="w-full rounded-md bg-gray-700"
				/>
			</div>

			<div class="md:col-span-2">
				<label for="startDateFilter" class="mb-1 block text-sm font-medium text-gray-400"
					>Desde</label
				>
				<input
					type="date"
					id="startDateFilter"
					bind:value={startDateFilter}
					class="w-full rounded-md bg-gray-700"
				/>
			</div>

			<div class="md:col-span-2">
				<label for="endDateFilter" class="mb-1 block text-sm font-medium text-gray-400">Hasta</label
				>
				<input
					type="date"
					id="endDateFilter"
					bind:value={endDateFilter}
					class="w-full rounded-md bg-gray-700"
				/>
			</div>

			<div class="md:col-span-1">
				<button
					type="submit"
					class="w-full cursor-pointer rounded-md bg-blue-600 px-4 py-2 font-bold text-white transition duration-300 hover:bg-blue-700"
				>
					Buscar
				</button>
			</div>
		</form>
		<div class="mt-4 flex items-center justify-between space-x-4 border-t border-gray-700 pt-4">
			<!--<div class="flex items-center space-x-4">
				<span class="font-semibold text-gray-400">Ordenar por:</span>
				<button
					on:click={() => handleSort('startDate')}
					class="rounded-md bg-gray-700 px-3 py-1 text-sm text-white transition hover:bg-gray-600 cursor-pointer"
					class:!bg-blue-600={sortField === 'startDate'}
				>
					Fecha {sortField === 'startDate' ? (sortDirection === 'desc' ? '↓' : '↑') : ''}
				</button>
				<button
					on:click={() => handleSort('capitalNumeric')}
					class="rounded-md bg-gray-700 px-3 py-1 text-sm text-white transition hover:bg-gray-600 cursor-pointer"
					class:!bg-blue-600={sortField === 'capitalNumeric'}
				>
					Capital {sortField === 'capitalNumeric' ? (sortDirection === 'desc' ? '↓' : '↑') : ''}
				</button>
			</div> -->
            <SortControls
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                fields={[
                    { value: 'startDate', label: 'Fecha' },
                    { value: 'capitalNumeric', label: 'Capital' }
                ]}
            />
			<button
				on:click={clearFilters}
				class="rounded-md bg-red-800 px-3 py-1 text-sm text-white transition hover:bg-red-700 cursor-pointer"
			>
				Limpiar Filtros
			</button>
		</div>
	</div>

	{#if $isLoading}
		<div class="p-10 text-center">
			<p class="text-xl text-blue-400">Cargando datos del servidor...</p>
		</div>
	{:else if $errorMessage}
		<div class="rounded-md border border-red-700 bg-red-900 px-4 py-3 text-red-300">
			<strong class="font-bold">¡No se han podido cargar las compañías!</strong>
			<span class="block sm:inline">{$errorMessage}</span>
		</div>
	{:else if $companies.length > 0}
		<PaginationControls
			currentPage={$pagination.currentPage}
			totalPages={$pagination.totalPages}
			totalElements={$pagination.totalElements}
			isLoading={$isLoading}
			onNext={() => performSearch($pagination.currentPage + 1)}
			onPrev={() => performSearch($pagination.currentPage - 1)}
		/>
		<div class="overflow-x-auto">
			<table
				class="w-full min-w-full table-fixed border-collapse border border-gray-700 bg-gray-800"
			>
				<thead class="bg-gray-700">
					<tr>
						<th class="w-1/12 px-4 py-3 text-left">BORME ID</th>
						<th class="w-4/12 px-4 py-3 text-left">Nombre</th>
						<th class="w-4/12 px-4 py-3 text-left">Objeto Social</th>
						<th class="w-2/12 px-4 py-3 text-right">Capital</th>
						<th class="w-1/12 px-4 py-3 text-right">Fecha Constitución</th>
					</tr>
				</thead>
				<tbody>
					{#each $companies as company}
						<tr class="border-t border-gray-600 hover:bg-gray-700">
							<td class="px-4 py-2 font-mono text-sm text-gray-400">{company.bormeId}</td>
							<td class="px-4 py-2 font-semibold">{company.name}</td>

							<td class="truncate px-4 py-2" title={company.object}>{company.object}</td>

							<td class="px-4 py-2 text-right font-mono text-sm">{company.capital}</td>
							<td class="px-4 py-2 text-right font-mono text-sm">{company.startDate}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else}
		<div class="rounded-md border border-gray-700 bg-gray-800 p-6">
			<p class="text-center text-lg">No se encontraron compañías en la base de datos.</p>
		</div>
	{/if}
</div>
