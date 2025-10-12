<script lang="ts">
  export let company: any;
  export let onClose: () => void;

  // Cierra con Escape (global)
  function handleEscape(event: KeyboardEvent) {
    if (event.key === 'Escape') onClose();
  }

  // opcional: evitar doble foco si quieres
  // function handleOverlayKeyDown(e: KeyboardEvent) {
  //   if (e.key === 'Enter' || e.key === ' ') onClose();
  // }
</script>

<svelte:window on:keydown={handleEscape} />

<!-- CONTENEDOR FIXED (no interactivo) -->
<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
  <!-- BOTÓN overlay: ocupa todo el fondo y es el encargado de cerrar -->
  <button
    type="button"
    class="absolute inset-0 bg-black bg-opacity-75"
    aria-label="Cerrar modal"
    on:click={onClose}
  ></button>

  <!-- DIALOG principal (por encima del overlay) -->
  <div
    class="relative z-10 grid w-full max-w-7xl grid-cols-1 gap-6 rounded-lg bg-gray-800 p-6 text-gray-300 shadow-xl h-[90vh] md:grid-cols-2"
    on:click|stopPropagation
    role="dialog"
    aria-modal="true"
    aria-label="Detalles de la compañía"
  >
    <!-- Botón de cerrar en esquina (accesible y visible) -->
    <button
      type="button"
      on:click={onClose}
      aria-label="Cerrar"
      class="absolute top-3 right-3 z-20 text-center px-1 text-2xl border rounded text-gray-300 hover:text-white"
    >&times;</button>

    <!-- CONTENIDO IZQUIERDO -->
    <div class="flex flex-col overflow-y-auto pr-4">
      <div class="mb-4 flex items-start justify-between border-b border-gray-700 pb-4">
        <h2 class="text-2xl font-bold">{company.name || 'Detalles de la Compañía'}</h2>
      </div>

      <div class="space-y-4 text-sm">
        <p><strong>BORME ID:</strong> <span class="font-mono text-gray-400">{company.bormeId}</span></p>
        <p><strong>Capital:</strong> <span class="font-mono text-gray-400">{company.capital}</span></p>
        <p><strong>Fecha Constitución:</strong> <span class="font-mono text-gray-400">{company.startDate}</span></p>
        <p><strong>Administrador:</strong> <span class="text-gray-400">{company.admin || 'N/A'}</span></p>
        <p><strong>Socio Único:</strong> <span class="text-gray-400">{company.solePartner || 'N/A'}</span></p>

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

    <!-- CONTENIDO DERECHO: visor PDF -->
    <div class="flex h-full flex-col mr-6 overflow-hidden rounded-md bg-gray-900">
      {#if company.publicationFileUrl}
        <div class="flex items-center justify-between bg-gray-700 p-2 text-sm">
          <p class="truncate text-gray-400">
            Documento de Origen: <span class="font-semibold text-gray-300">{company.publicationFileName}</span>
          </p>
          <a
            href={company.publicationFileUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="ml-4 flex-shrink-0 rounded-md bg-blue-600 px-3 py-1 text-xs font-bold text-white transition hover:bg-blue-500"
          >Abrir Original</a>
        </div>

        <iframe
          src={"http://localhost:8080/api/borme/publications/proxy/" + company.publicationId}
          title="Visor de PDF del BORME"
          class="h-full w-full border-0"
        ></iframe>
      {:else}
        <div class="flex h-full items-center justify-center p-4 text-center text-gray-500">
          <p>No se encontró la información de origen del documento.</p>
        </div>
      {/if}
    </div>
  </div>
</div>
