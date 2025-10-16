<script lang="ts">
  import EventCard from '$lib/components/EventCard.svelte';
  import ImageCard from '$lib/components/ImageCard.svelte';
  import { Camera, Calendar, Image, Sparkles, TrendingUp, Users, ArrowRight } from '@lucide/svelte';

  // Mock data para eventos destacados
  const featuredEvents = [
    {
      id: '1',
      name: 'Conferencia Tech 2024',
      description: 'La mayor conferencia de tecnología del año con los mejores ponentes internacionales',
      date: '2024-03-15',
      location: 'Centro de Convenciones, Ciudad',
      participantCount: 245,
      imageCount: 89,
      isJoined: true,
      createdBy: 'TechEvents'
    },
    {
      id: '2', 
      name: 'Matrimonio Ana & Carlos',
      description: 'Celebración de boda en jardines con familia y amigos',
      date: '2024-02-28',
      location: 'Jardines La Primavera',
      participantCount: 156,
      imageCount: 234,
      isJoined: false,
      createdBy: 'Ana Rodriguez'
    },
    {
      id: '3',
      name: 'Festival de Música Indie',
      description: 'Tres días de la mejor música independiente nacional e internacional',
      date: '2024-04-05',
      location: 'Parque Central',
      participantCount: 89,
      imageCount: 156,
      isJoined: true,
      createdBy: 'MusicFest'
    }
  ];

  // Mock data para imágenes recientes
  const recentImages = [
    {
      id: '1',
      url: 'https://picsum.photos/400/400?random=1',
      title: 'Atardecer en la playa',
      author: 'Juan Pérez',
      date: '2024-01-20',
      eventId: '1',
      eventName: 'Viaje de Fin de Semana',
      likes: 24,
      isLiked: false
    },
    {
      id: '2', 
      url: 'https://picsum.photos/400/400?random=2',
      title: 'Momento especial',
      author: 'María García',
      date: '2024-01-19',
      eventId: '2',
      eventName: 'Matrimonio Ana & Carlos',
      likes: 18,
      isLiked: true
    },
    {
      id: '3',
      url: 'https://picsum.photos/400/400?random=3',
      title: 'Concierto principal',
      author: 'Carlos López',
      date: '2024-01-18',
      eventId: '3',
      eventName: 'Festival de Música Indie',
      likes: 32,
      isLiked: false
    },
    {
      id: '4',
      url: 'https://picsum.photos/400/400?random=4',
      title: 'Entre amigos',
      author: 'Laura Torres',
      date: '2024-01-17',
      likes: 15,
      isLiked: true
    }
  ];
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
  <div class="stats shadow w-full bg-base-200">
    <div class="stat">
      <div class="stat-figure text-primary">
        <Calendar size={32} />
      </div>
      <div class="stat-title">Eventos Activos</div>
      <div class="stat-value text-primary">1,234</div>
      <div class="stat-desc flex items-center gap-1">
        <TrendingUp size={16} />
        15% más que el mes pasado
      </div>
    </div>
    
    <div class="stat">
      <div class="stat-figure text-secondary">
        <Camera size={32} />
      </div>
      <div class="stat-title">Fotos Compartidas</div>
      <div class="stat-value text-secondary">45.6K</div>
      <div class="stat-desc flex items-center gap-1">
        <TrendingUp size={16} />
        8% más que la semana pasada
      </div>
    </div>
    
    <div class="stat">
      <div class="stat-figure text-accent">
        <Users size={32} />
      </div>
      <div class="stat-title">Usuarios Activos</div>
      <div class="stat-value">8,901</div>
      <div class="stat-desc flex items-center gap-1">
        <TrendingUp size={16} />
        12% más participación
      </div>
    </div>
  </div>
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
  
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each featuredEvents as event}
      <EventCard {event} />
    {/each}
  </div>
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
  
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {#each recentImages as image}
      <ImageCard {image} showEventInfo={true} />
    {/each}
  </div>
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
