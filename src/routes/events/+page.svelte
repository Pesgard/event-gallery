<script lang="ts">
  import EventCard from '$lib/components/EventCard.svelte';
  import { Calendar, Plus, Search, TrendingUp, Users, Camera, X, ArrowRight } from '@lucide/svelte';

  let searchQuery = '';
  let selectedCategory = 'all';
  let selectedStatus = 'all';
  let sortBy = 'date';

  // Mock data para eventos
  const allEvents = [
    {
      id: '1',
      name: 'Conferencia Tech 2024',
      description: 'La mayor conferencia de tecnología del año con los mejores ponentes internacionales y las últimas innovaciones en desarrollo de software.',
      date: '2024-03-15',
      location: 'Centro de Convenciones, Ciudad de México',
      participantCount: 245,
      imageCount: 89,
      isJoined: true,
      createdBy: 'TechEvents',
      category: 'technology',
      status: 'upcoming'
    },
    {
      id: '2',
      name: 'Matrimonio Ana & Carlos',
      description: 'Celebración de boda en jardines con familia y amigos. Una ceremonia íntima y llena de amor.',
      date: '2024-02-28',
      location: 'Jardines La Primavera, Cuernavaca',
      participantCount: 156,
      imageCount: 234,
      isJoined: false,
      createdBy: 'Ana Rodriguez',
      category: 'wedding',
      status: 'past'
    },
    {
      id: '3',
      name: 'Festival de Música Indie',
      description: 'Tres días de la mejor música independiente nacional e internacional con más de 50 artistas.',
      date: '2024-04-05',
      location: 'Parque Central, Guadalajara',
      participantCount: 89,
      imageCount: 156,
      isJoined: true,
      createdBy: 'MusicFest',
      category: 'music',
      status: 'upcoming'
    },
    {
      id: '4',
      name: 'Graduación Generación 2024',
      description: 'Ceremonia de graduación de la Universidad Nacional. Celebramos el logro de nuestros estudiantes.',
      date: '2024-06-20',
      location: 'Auditorio Nacional, CDMX',
      participantCount: 320,
      imageCount: 45,
      isJoined: false,
      createdBy: 'Universidad Nacional',
      category: 'education',
      status: 'upcoming'
    },
    {
      id: '5',
      name: 'Maratón de la Ciudad',
      description: 'Evento deportivo anual que recorre los lugares más emblemáticos de la ciudad.',
      date: '2024-01-15',
      location: 'Centro Histórico, CDMX',
      participantCount: 1200,
      imageCount: 567,
      isJoined: true,
      createdBy: 'Deporte para Todos',
      category: 'sports',
      status: 'past'
    },
    {
      id: '6',
      name: 'Exposición de Arte Moderno',
      description: 'Muestra de arte contemporáneo con obras de artistas nacionales e internacionales.',
      date: '2024-05-10',
      location: 'Museo de Arte Contemporáneo',
      participantCount: 78,
      imageCount: 123,
      isJoined: false,
      createdBy: 'Galería Moderna',
      category: 'art',
      status: 'upcoming'
    }
  ];

  const categories = [
    { value: 'all', label: 'Todas las categorías', icon: Calendar },
    { value: 'technology', label: 'Tecnología', icon: Calendar },
    { value: 'wedding', label: 'Bodas', icon: Calendar },
    { value: 'music', label: 'Música', icon: Calendar },
    { value: 'education', label: 'Educación', icon: Calendar },
    { value: 'sports', label: 'Deportes', icon: Calendar },
    { value: 'art', label: 'Arte', icon: Calendar }
  ];

  // Filtros y búsqueda
  $: filteredEvents = allEvents
    .filter(event => {
      // Filtro por búsqueda
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return event.name.toLowerCase().includes(query) || 
               event.description.toLowerCase().includes(query) ||
               event.location?.toLowerCase().includes(query) ||
               event.createdBy.toLowerCase().includes(query);
      }
      return true;
    })
    .filter(event => {
      // Filtro por categoría
      return selectedCategory === 'all' || event.category === selectedCategory;
    })
    .filter(event => {
      // Filtro por estado
      if (selectedStatus === 'all') return true;
      if (selectedStatus === 'joined') return event.isJoined;
      return event.status === selectedStatus;
    })
    .sort((a, b) => {
      // Ordenamiento
      switch (sortBy) {
        case 'participants':
          return (b.participantCount || 0) - (a.participantCount || 0);
        case 'images':
          return (b.imageCount || 0) - (a.imageCount || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        default: // date
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

  function handleBulkAction(action: string) {
    console.log('Bulk action:', action);
    alert(`Acción "${action}" aplicada (funcionalidad pendiente)`);
  }
</script>

<svelte:head>
  <title>Eventos - EventGallery</title>
</svelte:head>

<!-- Header -->
<div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
  <div>
    <h1 class="text-4xl font-bold flex items-center gap-3 mb-2">
      <Calendar size={40} />
      Explorar Eventos
    </h1>
    <p class="text-base-content/60">
      Descubre eventos increíbles y únete a la diversión
    </p>
  </div>
  
  <a href="/events/create" class="btn btn-primary btn-lg">
    <Plus size={20} class="mr-2" />
    Crear Evento
  </a>
</div>

<!-- Quick Stats -->
<div class="stats stats-horizontal shadow mb-8 w-full bg-base-200">
  <div class="stat">
    <div class="stat-figure text-primary">
      <Calendar size={24} />
    </div>
    <div class="stat-title">Total de Eventos</div>
    <div class="stat-value text-primary">{allEvents.length}</div>
  </div>
  
  <div class="stat">
    <div class="stat-figure text-secondary">
      <Users size={24} />
    </div>
    <div class="stat-title">Eventos Unidos</div>
    <div class="stat-value text-secondary">{allEvents.filter(e => e.isJoined).length}</div>
  </div>
  
  <div class="stat">
    <div class="stat-figure text-accent">
      <Camera size={24} />
    </div>
    <div class="stat-title">Fotos Compartidas</div>
    <div class="stat-value text-accent">{allEvents.reduce((sum, e) => sum + (e.imageCount || 0), 0)}</div>
  </div>
</div>

<!-- Filters -->
<div class="card bg-base-200 shadow-lg mb-6">
  <div class="card-body p-4">
    <div class="flex flex-col lg:flex-row gap-4">
      <!-- Search -->
      <div class="flex-1">
        <div class="form-control">
          <div class="input-group">
            <input 
              type="text" 
              placeholder="Buscar eventos por nombre, descripción o ubicación..." 
              class="input input-bordered flex-1"
              bind:value={searchQuery}
            />
            <button class="btn btn-square">
              add
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Filter Controls -->
      <div class="flex flex-wrap gap-2">
        <!-- Category Filter -->
        <select class="select select-bordered" bind:value={selectedCategory}>
          {#each categories as category}
            <option value={category.value}>
              {category.icon} {category.label}
            </option>
          {/each}
        </select>

        <!-- Status Filter -->
        <select class="select select-bordered" bind:value={selectedStatus}>
          <option value="all">Todos los estados</option>
          <option value="upcoming">Próximos</option>
          <option value="past">Pasados</option>
          <option value="joined">Mis eventos</option>
        </select>

        <!-- Sort -->
        <select class="select select-bordered" bind:value={sortBy}>
          <option value="date">Por fecha</option>
          <option value="participants">Por participantes</option>
          <option value="images">Por fotos</option>
          <option value="name">Por nombre</option>
        </select>
      </div>
    </div>

    <!-- Category chips -->
    <div class="flex flex-wrap gap-2 mt-4">
      {#each categories.slice(1) as category}
        {@const CategoryIcon = category.icon}
        <button 
          class="badge badge-lg {selectedCategory === category.value ? 'badge-primary' : 'badge-ghost'} cursor-pointer hover:scale-105 transition-transform flex items-center gap-1"
          onclick={() => selectedCategory = category.value}
        >
          <CategoryIcon size={12} />
          {category.label}
        </button>
      {/each}
    </div>
  </div>
</div>

<!-- Results info -->
<div class="flex justify-between items-center mb-6">
  <div class="flex items-center gap-2 text-base-content/60">
    <Calendar size={20} />
    <span>
      Mostrando {filteredEvents.length} de {allEvents.length} eventos
      {#if searchQuery}
        para "{searchQuery}"
      {/if}
    </span>
  </div>
  
  {#if searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all'}
    <button 
      class="btn btn-ghost btn-sm"
      onclick={() => {
        searchQuery = '';
        selectedCategory = 'all';
        selectedStatus = 'all';
      }}
    >
      <X size={16} class="mr-1" />
      Limpiar filtros
    </button>
  {/if}
</div>

<!-- Events Grid -->
{#if filteredEvents.length > 0}
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each filteredEvents as event}
      <EventCard {event} />
    {/each}
  </div>
{:else}
  <div class="text-center py-16">
    <Search size={64} class="mx-auto mb-4 text-base-content/30" />
    <h3 class="text-2xl font-bold mb-2">No se encontraron eventos</h3>
    <p class="text-base-content/60 mb-6">
      {#if searchQuery}
        Intenta con una búsqueda diferente o cambia los filtros.
      {:else}
        ¡Sé el primero en crear un evento increíble!
      {/if}
    </p>
    <div class="flex flex-col sm:flex-row gap-3 justify-center">
      {#if searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all'}
        <button 
          class="btn btn-outline"
          onclick={() => {
            searchQuery = '';
            selectedCategory = 'all';
            selectedStatus = 'all';
          }}
        >
          <X size={16} class="mr-1" />
          Limpiar filtros
        </button>
      {/if}
      <a href="/events/create" class="btn btn-primary">
        <Plus size={16} class="mr-2" />
        Crear Primer Evento
      </a>
    </div>
  </div>
{/if}

<!-- Load More Button (placeholder) -->
{#if filteredEvents.length >= 12}
  <div class="text-center mt-8">
    <button class="btn btn-outline btn-wide">
      Cargar más eventos
      <span class="loading loading-spinner loading-xs ml-2 hidden"></span>
    </button>
  </div>
{/if}

<!-- Floating Action Button for quick create -->
<div class="fixed bottom-6 right-6 lg:hidden">
  <a href="/events/create" class="btn btn-primary btn-circle btn-lg shadow-xl">
    <Plus size={24} />
  </a>
</div>