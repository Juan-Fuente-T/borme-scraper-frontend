<script lang="ts">
	import { isLoading, errorMessage } from '$lib/stores';
	import { processBormeForDate, getCompaniesByDate } from '$lib/api';
	import { writable } from 'svelte/store';
	import CompanyModal from '$lib/components/CompanyModal.svelte';
	import { createPaginationStore } from '$lib/stores';
	import PaginationControls from '$lib/components/PaginationControls.svelte';
	import SortControls from '$lib/components/SortControls.svelte';

	let selectedDate: string = new Date().toISOString().split('T')[0];
	const processingResult = writable<any>(null);
	// --- ESTADO PARA DATOS DE COMPAÑIAS DEL DÍA ---
	const companiesOfTheDay = writable<any[]>([]);
	let selectedCompanyForModal: any = null; // Controla si el modal está visible y qué compañía muestra
	// Store de paginación
	const pagination = createPaginationStore(30);
    let sortDirection = 'desc'; // Estado inicial
	let sortField = 'startDate'; // Campo por el que se ordena

	async function handleProcess() {
		isLoading.set(true);
		errorMessage.set(null);
		processingResult.set(null);
		companiesOfTheDay.set([]); // Limpia la lista de compañías anterior

		try {
			const processResponse = await processBormeForDate(selectedDate);
			processingResult.set(processResponse.data);

			// Si resulto un éxito inmediatamente hace una segunda llamada para recuperar datos.
			// if (processResponse.data.success && processResponse.data.companiesFound > 0) {
			if (processResponse.data.success) {
				await loadCompaniesForDate(0);
			}
		} catch (err: any) {
			processingResult.set({
				success: false,
				message: 'Fallo de conexión: ' + (err.message || 'No se pudo contactar con el servidor.')
			});
		} finally {
			isLoading.set(false);
		}
	}

    async function loadCompaniesForDate(page: number) {
    isLoading.set(true);
    errorMessage.set(null);

    const sortParam = `${sortField},${sortDirection}`; // <-- Parametros de ordenacion

    try {
        const response = await getCompaniesByDate(selectedDate, page, 20, sortParam);

        if (response.data.success) {
            companiesOfTheDay.set(response.data.companies);  // ← Actualiza el store

            pagination.updateFromResponse({
                currentPage: response.data.currentPage,
                totalPages: response.data.totalPages,
                total: response.data.total
            });
        } else {
            errorMessage.set('Error al cargar compañías.');
        }
    } catch (err: any) {
        errorMessage.set('Error de conexión: ' + err.message);
    } finally {
        isLoading.set(false);
    }
}

	function handleSort(field: string) {
		if (sortField === field) {
			// Si ya está ordenado por este campo, se invierte la dirección.
			sortDirection = sortDirection === 'desc' ? 'asc' : 'desc';
		} else {
			// Si es un campo nuevo, se establece y se resetea a 'desc'.
			sortField = field;
			sortDirection = 'desc';
		}
		loadCompaniesForDate(0); // Se vuelve a buscar con la nueva ordenación.
	}
</script>

{#if selectedCompanyForModal}
    <CompanyModal
        company={selectedCompanyForModal}
        onClose={() => selectedCompanyForModal = null}
    />
{/if}

<div class="container mx-auto">
	<h1 class="mb-6 border-b border-gray-700 pb-2 text-4xl font-bold">Dashboard de Procesamiento</h1>

	<form class="mb-8 rounded-lg bg-gray-800 p-6 shadow-lg" on:submit|preventDefault={handleProcess}>
		<div class="flex items-end space-x-4">
			<div class="flex-grow">
				<label for="date-input" class="mb-1 block text-sm font-medium text-gray-400">
					Seleccionar Fecha a Procesar
				</label>
				<input
					type="date"
					id="date-input"
					bind:value={selectedDate}
					class="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
				/>
			</div>
			<button
				type="submit"
				class="rounded-md bg-blue-600 px-6 py-2 font-bold text-white transition duration-300 hover:bg-blue-700 disabled:opacity-50"
				disabled={$isLoading}
			>
				{#if $isLoading}
					Procesando...
				{:else}
					Procesar
				{/if}
			</button>
		</div>
	</form>

	{#if $processingResult}
		{@const result = $processingResult}
		<div
			class="rounded-lg p-6 shadow-lg"
			class:bg-gray-800={result.success}
			class:border-green-700={result.success}
			class:bg-red-900={!result.success}
			class:border-red-700={!result.success}
		>
			<h2 class="mb-2 text-2xl font-bold">Informe de Procesamiento</h2>
			<p class="text-lg">
				<strong class:text-green-300={result.success} class:text-red-300={!result.success}>
					{result.success ? 'ÉXITO' : 'FALLO'}
				</strong>
				- {result.message}
			</p>
			{#if result.success}
				<ul class="mt-4 list-inside list-disc space-y-1 text-gray-300">
					<li>Fecha procesada: {result.date}</li>
					<li>Ficheros procesados: {result.filesProcessed}</li>
					<li>Compañías encontradas: {result.companiesFound}</li>
				</ul>
			{/if}

			{#if $companiesOfTheDay.length > 0}
				<div class="mt-8">
					<h2 class="mb-4 text-3xl font-bold">
						Compañías Encontradas ({$processingResult?.companiesFound || 0})
					</h2>
                    <SortControls
                        sortField={sortField}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                        fields={[
                            { value: 'startDate', label: 'Fecha' },
                            { value: 'capitalNumeric', label: 'Capital' }
                        ]}
                    />
                    <PaginationControls
                        currentPage={$pagination.currentPage}
                        totalPages={$pagination.totalPages}
                        totalElements={$pagination.totalElements}
                        isLoading={$isLoading}
                        onNext={() => loadCompaniesForDate($pagination.currentPage + 1)}
                        onPrev={() => loadCompaniesForDate($pagination.currentPage - 1)}
                    />
					<div class="overflow-x-auto">
						<table class="min-w-full border border-gray-700 bg-gray-800">
							<thead class="bg-gray-700">
								<tr>
									<th class="w-4/12 px-4 py-3 text-left">Nombre</th>
									<th class="w-4/12 px-4 py-3 text-left">Objeto social</th>
									<th class="w-1/12 px-4 py-3 text-left">Capital social</th>
									<th class="w-1/12 px-4 py-3 text-right">Fecha de constitución</th>
									<th class="w-1/12 px-4 py-3 text-right"></th>
								</tr>
							</thead>
							<tbody>
								{#each $companiesOfTheDay as company}
									<tr class="border-t border-gray-600 hover:bg-gray-700">
										<td class="px-4 py-2 font-semibold">{company.name}</td>
										<td class="px-4 py-2 font-mono text-md">{company.object}</td>
										<td class="px-4 py-2 font-mono text-sm">{company.capital}</td>
										<td class="px-4 py-2 text-right font-mono text-sm">{company.startDate}</td>
										<td class="px-4 py-2">
											<button
												on:click={() => (selectedCompanyForModal = company)}
												class="rounded-md bg-blue-600 px-3 py-1 text-sm font-bold text-white hover:bg-blue-700"
											>
												Ver Info
											</button>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			{/if}
			{#if result.fileUrls && result.fileUrls.length > 0}
				<div class="mt-6">
					<h3 class="mb-3 text-xl font-semibold">Enlaces a ficheros procesados:</h3>

					<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
						{#each result.fileUrls as url}
							<a
								href={url}
								target="_blank"
								rel="noopener noreferrer"
								class="block truncate rounded-md bg-gray-700 p-3 text-stone-200 transition duration-200 hover:bg-gray-600 hover:text-white"
								title={url.substring(url.lastIndexOf('/') + 1)}
							>
								{url.substring(url.lastIndexOf('/') + 1)}
							</a>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>
