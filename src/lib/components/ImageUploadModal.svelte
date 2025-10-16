<script lang="ts">
  import { Upload, FolderOpen, CheckCircle, AlertCircle, X } from '@lucide/svelte';
  
  export let isOpen = false;
  export let eventId: string | null = null;
  export let onUpload: (files: FileList, metadata: any) => void = () => {};

  let files: FileList | null = null;
  let title = '';
  let description = '';
  let dragOver = false;
  let fileInput: HTMLInputElement;

  function handleFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    files = target.files;
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    dragOver = false;
    files = event.dataTransfer?.files || null;
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    dragOver = true;
  }

  function handleDragLeave() {
    dragOver = false;
  }

  function handleSubmit() {
    if (files) {
      onUpload(files, { title, description, eventId });
      closeModal();
    }
  }

  function closeModal() {
    isOpen = false;
    files = null;
    title = '';
    description = '';
    dragOver = false;
  }

  function openFileDialog() {
    fileInput.click();
  }
</script>

{#if isOpen}
  <dialog class="modal modal-open">
    <div class="modal-box w-11/12 max-w-2xl">
      <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
        <Upload size={20} />
        Subir {eventId ? 'al Evento' : 'a Mi Galería'}
      </h3>

      <div class="space-y-4">
        <!-- File Drop Zone -->
        <div 
          class="border-2 border-dashed border-base-300 rounded-lg p-8 text-center transition-colors
                 {dragOver ? 'border-primary bg-primary/5' : ''}"
          ondrop={handleDrop}
          ondragover={handleDragOver}
          ondragleave={handleDragLeave}
        >
          <input 
            type="file" 
            multiple 
            accept="image/*"
            class="hidden"
            bind:this={fileInput}
            onchange={handleFileSelect}
          />

          {#if files && files.length > 0}
            <div class="text-success">
              <CheckCircle size={48} class="mx-auto mb-2" />
              <p class="mt-2 font-medium">
                {files.length} archivo{files.length > 1 ? 's' : ''} seleccionado{files.length > 1 ? 's' : ''}
              </p>
              <div class="mt-2 space-y-1">
                {#each Array.from(files) as file}
                  <p class="text-sm text-base-content/60">{file.name}</p>
                {/each}
              </div>
            </div>
          {:else}
            <div>
              <FolderOpen size={64} class="mx-auto mb-4" />
              <p class="mt-4 text-lg font-medium">
                Arrastra las imágenes aquí o 
                <button class="btn btn-link p-0 h-auto min-h-0" onclick={openFileDialog}>
                  selecciónalas
                </button>
              </p>
              <p class="text-sm text-base-content/60 mt-2">
                Soporta múltiples archivos JPG, PNG, WEBP
              </p>
            </div>
          {/if}
        </div>

        <!-- Metadata Fields -->
        <div class="space-y-3">
          <div>
            <label for="title" class="label">
              <span class="label-text">Título (opcional)</span>
            </label>
            <input 
              id="title"
              type="text" 
              placeholder="Título de la imagen" 
              class="input input-bordered w-full"
              bind:value={title}
            />
          </div>

          <div>
            <label for="description" class="label">
              <span class="label-text">Descripción (opcional)</span>
            </label>
            <textarea 
              id="description"
              class="textarea textarea-bordered w-full" 
              placeholder="Describe la imagen..."
              rows="3"
              bind:value={description}
            ></textarea>
          </div>

          {#if eventId}
            <div class="alert alert-info">
              <AlertCircle size={16} />
              <span>Las imágenes se subirán al evento actual y serán visibles para todos los participantes.</span>
            </div>
          {/if}
        </div>
      </div>

      <div class="modal-action">
        <button class="btn btn-ghost" onclick={closeModal}>
          <X size={16} class="mr-1" />
          Cancelar
        </button>
        <button 
          class="btn btn-primary"
          disabled={!files || files.length === 0}
          onclick={handleSubmit}
        >
          <Upload size={16} class="mr-1" />
          Subir {files ? files.length : 0} imagen{files && files.length > 1 ? 'es' : ''}
        </button>
      </div>
    </div>
    
    <form method="dialog" class="modal-backdrop">
      <button onclick={closeModal}>cerrar</button>
    </form>
  </dialog>
{/if}