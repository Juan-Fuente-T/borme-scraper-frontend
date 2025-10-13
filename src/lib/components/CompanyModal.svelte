<script lang="ts">
	import { onMount } from 'svelte';
	import { getPublicationPdf } from '$lib/api';

	export let company: any;
	export let onClose: () => void;

	// --- ESTADO INTERNO DEL MODAL ---
	let pdfUrl: string | null = null;
	let isLoadingPdf = true;
	let pdfError: string | null = null;

	// Función de escape (doctrina correcta)
	function handleEscape(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onClose();
		}
	}

	// Lógica de carga del PDF
	onMount(() => {
		async function fetchData() {
			if (company.publicationId) {
				try {
					const response = await getPublicationPdf(company.publicationId);
					const blob = new Blob([response.data], { type: 'application/pdf' });
					pdfUrl = URL.createObjectURL(blob);
				} catch (error: any) {
					console.error('Error al cargar el PDF:', error);
					pdfError = 'No se pudo cargar el documento.';
				} finally {
					isLoadingPdf = false;
				}
			} else {
				isLoadingPdf = false;
				pdfError = 'No se encontró ID de publicación.';
			}
		}

		fetchData();

		// Limpieza de memoria
		return () => {
			if (pdfUrl) {
				URL.revokeObjectURL(pdfUrl);
			}
		};
	});
</script>

<svelte:window on:keydown={handleEscape} />

<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
	<button
		type="button"
		class="bg-opacity-75 absolute inset-0 bg-black"
		aria-label="Cerrar modal"
		on:click={onClose}
	></button>

	<div
		class="relative z-10 grid h-[90vh] w-full max-w-7xl grid-cols-1 gap-6 rounded-lg bg-gray-800 p-6 text-gray-300 shadow-xl md:grid-cols-2"
		role="dialog"
		aria-modal="true"
	>
		<button
			type="button"
			on:click={onClose}
			aria-label="Cerrar"
			class="absolute top-3 right-3 z-20 rounded border px-1 text-center text-2xl text-gray-300 hover:text-white"
			>&times;</button
		>

		<div class="flex flex-col overflow-y-auto pr-4">
			<div class="mb-4 flex items-start justify-between border-b border-gray-700 pb-4">
				<h2 class="text-2xl font-bold">{company.name || 'Detalles de la Compañía'}</h2>
			</div>

			<div class="space-y-4 text-sm">
				<p>
					<strong>BORME ID:</strong> <span class="font-mono text-gray-400">{company.bormeId}</span>
				</p>
				<p>
					<strong>Capital social:</strong>
					<span class="font-mono text-gray-400">{company.capital}</span>
				</p>
				<p>
					<strong>Fecha Constitución:</strong>
					<span class="font-mono text-gray-400">{company.startDate}</span>
				</p>
				<p>
					<strong>Administrador:</strong>
					<span class="text-gray-400">{company.admin || 'N/A'}</span>
				</p>
				<p>
					<strong>Socio Único:</strong>
					<span class="text-gray-400">{company.solePartner || 'N/A'}</span>
				</p>

				<div class="pt-2">
					<h3 class="font-semibold">Dirección:</h3>
					<p class="text-gray-400">{company.address || 'N/A'}</p>
				</div>
				<div class="pt-2">
					<h3 class="font-semibold">Objeto Social:</h3>
					<p class="text-gray-400">{company.object || 'N/A'}</p>
				</div>
				<div class="pt-2">
					<h3 class="font-semibold">Datos Registrales:</h3>
					<p class="text-gray-400">{company.registryData || 'N/A'}</p>
				</div>
			</div>
		</div>
		<div class="mr-6 flex h-full flex-col overflow-hidden rounded-md bg-gray-900">
			{#if isLoadingPdf}
				<div class="flex h-full items-center justify-center">
					<p>Cargando documento...</p>
				</div>
			{:else if pdfUrl}
				<div class="flex items-center justify-between bg-gray-700 p-2 text-sm">
					<p class="truncate text-gray-400">
						Doc. Origen: <span class="font-semibold text-gray-300"
							>{company.publicationFileName}</span
						>
					</p>
					<a
						href={company.publicationFileUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="ml-4 flex-shrink-0 rounded-md bg-blue-600 px-3 py-1 text-xs font-bold text-white transition hover:bg-blue-500"
						>Abrir Original</a
					>
				</div>
				<iframe src={pdfUrl} title="Visor de PDF del BORME" class="h-full w-full border-0"></iframe>
			{:else}
				<div class="flex h-full items-center justify-center p-4 text-center text-red-400">
					<p>{pdfError || 'No se pudo cargar el documento.'}</p>
				</div>
			{/if}
		</div>
	</div>
</div>
