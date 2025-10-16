<script lang="ts">
  import ImageCard from '$lib/components/ImageCard.svelte';
  import ImageUploadModal from '$lib/components/ImageUploadModal.svelte';
  import { Image, Upload, Search, Camera, Heart, Grid3X3, List, MoreHorizontal, Calendar } from '@lucide/svelte';

  let showUploadModal = false;
  let searchQuery = '';
  let selectedFilter = 'all'; // all, event, personal
  let sortBy = 'date'; // date, likes, title

  // Mock data para la galería personal
  const allImages = [
    {
      id: '1',
      url: 'https://picsum.photos/400/400?random=10',
      title: 'Atardecer en la montaña',
      description: 'Una vista increíble desde la cima después de una larga caminata',
      author: 'Mi Usuario',
      date: '2024-01-20',
      eventId: '1',
      eventName: 'Excursión de Fin de Semana',
      likes: 15,
      isLiked: false
    },
    {
      id: '2',
      url: 'https://picsum.photos/400/400?random=11',
      title: 'Momento especial',
      description: 'Celebrando con amigos',
      author: 'Mi Usuario',
      date: '2024-01-19',
      eventId: '2',
      eventName: 'Fiesta de Cumpleaños',
      likes: 28,
      isLiked: true
    },
    {
      id: '3',
      url: 'https://picsum.photos/400/400?random=12',
      title: 'Arquitectura moderna',
      description: '',
      author: 'Mi Usuario', 
      date: '2024-01-18',
      likes: 8,
      isLiked: false
    },
    {
      id: '4',
      url: 'https://picsum.photos/400/400?random=13',
      title: 'Concierto en vivo',
      description: 'La banda principal del festival',
      author: 'Mi Usuario',
      date: '2024-01-17',
      eventId: '3',
      eventName: 'Festival de Música',
      likes: 42,
      isLiked: true
    },
    {
      id: '5',
      url: 'https://picsum.photos/400/400?random=14',
      title: 'Naturaleza pura',
      description: 'Un paseo por el bosque local',
      author: 'Mi Usuario',
      date: '2024-01-16',
      likes: 12,
      isLiked: false
    },
    {
      id: '6',
      url: 'https://picsum.photos/400/400?random=15',
      title: 'Street art',
      description: 'Arte urbano en el centro de la ciudad',
      author: 'Mi Usuario',
      date: '2024-01-15',
      likes: 23,
      isLiked: true
    }
  ];

  // Filtros y búsqueda
  $: filteredImages = allImages
    .filter(image => {
      // Filtro por búsqueda
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return image.title?.toLowerCase().includes(query) || 
               image.description?.toLowerCase().includes(query) ||
               image.eventName?.toLowerCase().includes(query);
      }
      return true;
    })
    .filter(image => {
      // Filtro por tipo
      switch (selectedFilter) {
        case 'event':
          return !!image.eventId;
        case 'personal':
          return !image.eventId;
        default:
          return true;
      }
    })
    .sort((a, b) => {
      // Ordenamiento
      switch (sortBy) {
        case 'likes':
          return (b.likes || 0) - (a.likes || 0);
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        default: // date
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

  function handleUpload(files: FileList, metadata: any) {
    console.log('Uploading files:', files, metadata);
    // Aquí iría la lógica real de subida
    alert(`Subiendo ${files.length} imagen(es)...`);
  }

  function handleBulkAction(action: string) {
    console.log('Bulk action:', action);
    alert(`Acción "${action}" aplicada (funcionalidad pendiente)`);
  }
</script>

<svelte:head>
  <title>Mi Galería - EventGallery</title>
</svelte:head>

<!-- Header -->
<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
  <div>
    <h1 class="text-4xl font-bold flex items-center gap-3 mb-2">
      <Image size={40} />
      Mi Galería
    </h1>
    <p class="text-base-content/60">
      Gestiona y visualiza todas tus fotos en un solo lugar
    </p>
  </div>
  
  <button 
    class="btn btn-primary btn-lg"
    onclick={() => showUploadModal = true}
  >
    <Upload size={20} class="mr-2" />
    Subir Fotos
  </button>
</div>

<!-- Stats -->
<div class="stats stats-horizontal shadow mb-8 w-full bg-base-200">
  <div class="stat">
    <div class="stat-figure text-primary">
      <Camera size={24} />
    </div>
    <div class="stat-title">Total de Fotos</div>
    <div class="stat-value text-primary">{allImages.length}</div>
  </div>
  
  <div class="stat">
    <div class="stat-figure text-secondary">
      <Calendar size={24} />
    </div>
    <div class="stat-title">En Eventos</div>
    <div class="stat-value text-secondary">{allImages.filter(img => img.eventId).length}</div>
  </div>
  
  <div class="stat">
    <div class="stat-figure text-accent">
      <Heart size={24} />
    </div>
    <div class="stat-title">Total de Likes</div>
    <div class="stat-value text-accent">{allImages.reduce((sum, img) => sum + (img.likes || 0), 0)}</div>
  </div>
</div>

<!-- Filters and Search -->
<div class="card bg-base-200 shadow-lg mb-6">
  <div class="card-body p-4">
    <div class="flex flex-col lg:flex-row gap-4">
      <!-- Search -->
      <div class="flex-1">
        <div class="form-control">
          <div class="input-group">
            <input 
              type="text" 
              placeholder="Buscar por título, descripción o evento..." 
              class="input input-bordered flex-1"
              bind:value={searchQuery}
            />
            <button class="btn btn-square">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap gap-2">
        <select class="select select-bordered" bind:value={selectedFilter}>
          <option value="all">Todas las fotos</option>
          <option value="event">En eventos</option>
          <option value="personal">Personales</option>
        </select>

        <select class="select select-bordered" bind:value={sortBy}>
          <option value="date">Más recientes</option>
          <option value="likes">Más populares</option>
          <option value="title">Por título</option>
        </select>

        <!-- Bulk actions -->
        <div class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-outline">
            Acciones
            <MoreHorizontal size={16} class="ml-1" />
          </label>
          <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
            <li><button onclick={() => handleBulkAction('download')}>Descargar seleccionadas</button></li>
            <li><button onclick={() => handleBulkAction('share')}>Compartir seleccionadas</button></li>
            <li><button onclick={() => handleBulkAction('delete')}>Eliminar seleccionadas</button></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Results info -->
<div class="flex justify-between items-center mb-6">
  <div class="text-base-content/60">
    Mostrando {filteredImages.length} de {allImages.length} fotos
    {#if searchQuery}
      para "{searchQuery}"
    {/if}
  </div>
  
  <div class="flex gap-2">
    <button class="btn btn-ghost btn-sm" title="Vista de cuadrícula">
      <Grid3X3 size={16} />
    </button>
    <button class="btn btn-ghost btn-sm" title="Vista de lista">
      <List size={16} />
    </button>
  </div>
</div>

<!-- Gallery Grid -->
{#if filteredImages.length > 0}
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {#each filteredImages as image}
      <ImageCard {image} showEventInfo={true} />
    {/each}
  </div>
{:else}
  <div class="text-center py-16">
    <Search size={64} class="mx-auto mb-4 text-base-content/30" />
    <h3 class="text-2xl font-bold mb-2">No se encontraron fotos</h3>
    <p class="text-base-content/60 mb-6">
      {#if searchQuery}
        Intenta con una búsqueda diferente o cambia los filtros.
      {:else}
        ¡Comienza subiendo tu primera foto!
      {/if}
    </p>
    {#if !searchQuery}
      <button 
        class="btn btn-primary"
        onclick={() => showUploadModal = true}
      >
        <Upload size={16} class="mr-2" />
        Subir Primera Foto
      </button>
    {/if}
  </div>
{/if}

<!-- Load More Button (placeholder) -->
{#if filteredImages.length >= 12}
  <div class="text-center mt-8">
    <button class="btn btn-outline btn-wide">
      Cargar más fotos
      <span class="loading loading-spinner loading-xs ml-2 hidden"></span>
    </button>
  </div>
{/if}

<!-- Upload Modal -->
<ImageUploadModal 
  bind:isOpen={showUploadModal}
  eventId={null}
  onUpload={handleUpload}
/>