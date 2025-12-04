<script lang="ts">
  import { onMount } from 'svelte';
  import EventCard from '$lib/components/EventCard.svelte';
  import ImageCard from '$lib/components/ImageCard.svelte';
  import { Camera, Calendar, Image, Sparkles, TrendingUp, Users, ArrowRight } from '@lucide/svelte';
  import { apiClient } from '$lib/api/client';
  import type { EventWithStats, ImageWithStats } from '$lib/types';

  let featuredEvents = $state<EventWithStats[]>([]);
  let recentImages = $state<ImageWithStats[]>([]);
  let stats = $state({ events: 0, images: 0, users: 0 });
  let loading = $state(true);
  let error = $state('');

  onMount(async () => {
    try {
      loading = true;
      
      // Load featured events (limit to 3)
      const eventsResponse = await apiClient.getEvents({ limit: 3, sortBy: 'date', sortOrder: 'desc' });
      if (eventsResponse.success && eventsResponse.data) {
        featuredEvents = eventsResponse.data.data || [];
        stats.events = eventsResponse.data.pagination?.totalItems || 0;
      }

      // Load recent images (limit to 4)
      const imagesResponse = await apiClient.getImages({ limit: 4, sortBy: 'uploadedAt', sortOrder: 'desc' });
      if (imagesResponse.success && imagesResponse.data) {
        recentImages = imagesResponse.data.data || [];
        stats.images = imagesResponse.data.pagination?.totalItems || 0;
      }

      // Load gallery stats
      const galleryResponse = await apiClient.getGalleryStats();
      if (galleryResponse.success && galleryResponse.data) {
        stats = {
          events: galleryResponse.data.totalEvents || stats.events,
          images: galleryResponse.data.totalImages || stats.images,
          users: galleryResponse.data.totalUsers || 0
        };
      }
    } catch (err) {
      error = err instanceof Error ? err.message : 'Error al cargar datos';
      console.error('Error loading home page data:', err);
    } finally {
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>Inicio - EventGallery</title>
</svelte:head>

<!-- Hero Section -->
<section class="hero bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl mb-8">
  <div class="hero-content text-center py-16">
    <div class="max-w-md">
      <h1 class="text-5xl font-bold mb-4 flex items-center justify-center gap-3">
        <Camera size={48} />
        EventGallery
      </h1>
      <p class="text-lg mb-6">
        Comparte y descubre los mejores momentos de cada evento. 
        Crea recuerdos inolvidables junto a tu comunidad.
      </p>
      <div class="flex gap-4 justify-center">
        <a href="/events" class="btn btn-primary btn-lg">
          <Calendar size={20} class="mr-2" />
          Explorar Eventos
        </a>
        <a href="/gallery" class="btn btn-outline btn-lg">
          <Image size={20} class="mr-2" />
          Mi Galería
        </a>
      </div>
    </div>
  </div>
</section>

<!-- Statistics Cards -->
<section class="mb-8">
  {#if loading}
    <div class="stats shadow w-full bg-base-200">
      <div class="stat">
        <div class="stat-title">Cargando...</div>
        <div class="stat-value">
          <span class="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    </div>
  {:else if error}
    <div class="alert alert-error">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{error}</span>
    </div>
  {:else}
    <div class="stats shadow w-full bg-base-200">
      <div class="stat">
        <div class="stat-figure text-primary">
          <Calendar size={32} />
        </div>
        <div class="stat-title">Eventos Activos</div>
        <div class="stat-value text-primary">{stats.events.toLocaleString()}</div>
        <div class="stat-desc">Total de eventos</div>
      </div>
      
      <div class="stat">
        <div class="stat-figure text-secondary">
          <Camera size={32} />
        </div>
        <div class="stat-title">Fotos Compartidas</div>
        <div class="stat-value text-secondary">{stats.images.toLocaleString()}</div>
        <div class="stat-desc">Total de fotos</div>
      </div>
      
      <div class="stat">
        <div class="stat-figure text-accent">
          <Users size={32} />
        </div>
        <div class="stat-title">Usuarios Activos</div>
        <div class="stat-value">{stats.users.toLocaleString()}</div>
        <div class="stat-desc">Total de usuarios</div>
      </div>
    </div>
  {/if}
</section>

<!-- Featured Events -->
<section class="mb-8">
  <div class="flex justify-between items-center mb-6">
    <h2 class="text-3xl font-bold flex items-center gap-2">
      <Sparkles size={32} />
      Eventos Destacados
    </h2>
    <a href="/events" class="btn btn-ghost flex items-center gap-2">
      Ver todos
      <ArrowRight size={16} />
    </a>
  </div>
  
  {#if loading}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each Array(3) as _}
        <div class="card bg-base-200 animate-pulse">
          <div class="h-48 bg-base-300"></div>
          <div class="card-body">
            <div class="h-4 bg-base-300 rounded w-3/4"></div>
            <div class="h-4 bg-base-300 rounded w-1/2"></div>
          </div>
        </div>
      {/each}
    </div>
  {:else if featuredEvents.length > 0}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each featuredEvents as event}
        <EventCard {event} />
      {/each}
    </div>
  {:else}
    <div class="text-center py-8">
      <p class="text-base-content/60">No hay eventos disponibles aún</p>
      <a href="/events/create" class="btn btn-primary mt-4">Crear Primer Evento</a>
    </div>
  {/if}
</section>

<!-- Recent Photos -->
<section>
  <div class="flex justify-between items-center mb-6">
    <h2 class="text-3xl font-bold flex items-center gap-2">
      <Camera size={32} />
      Fotos Recientes
    </h2>
    <a href="/gallery" class="btn btn-ghost flex items-center gap-2">
      Ver todas
      <ArrowRight size={16} />
    </a>
  </div>
  
  {#if loading}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {#each Array(4) as _}
        <div class="card bg-base-200 animate-pulse">
          <div class="aspect-square bg-base-300"></div>
          <div class="card-body p-4">
            <div class="h-4 bg-base-300 rounded w-3/4"></div>
          </div>
        </div>
      {/each}
    </div>
  {:else if recentImages.length > 0}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {#each recentImages as image}
        <ImageCard {image} showEventInfo={true} />
      {/each}
    </div>
  {:else}
    <div class="text-center py-8">
      <p class="text-base-content/60">No hay fotos disponibles aún</p>
      <a href="/gallery" class="btn btn-primary mt-4">Ver Galería</a>
    </div>
  {/if}
</section>

<!-- Call to Action -->
<section class="mt-12">
  <div class="card bg-base-200 shadow-lg">
    <div class="card-body text-center">
      <h3 class="card-title text-2xl justify-center mb-4 flex items-center gap-2">
        <Sparkles size={28} />
        ¿Listo para crear tu primer evento?
      </h3>
      <p class="mb-6">
        Invita a tus amigos, familia o colegas y comiencen a capturar momentos especiales juntos.
      </p>
      <div class="card-actions justify-center">
        <a href="/events/create" class="btn btn-primary btn-lg">
          <Calendar size={20} class="mr-2" />
          Crear Mi Primer Evento
        </a>
      </div>
    </div>
  </div>
</section>
