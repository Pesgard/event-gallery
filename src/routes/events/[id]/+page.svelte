<script lang="ts">
  import { page } from '$app/stores';
  import ImageCard from '$lib/components/ImageCard.svelte';
  import ImageUploadModal from '$lib/components/ImageUploadModal.svelte';
  import { Calendar, MapPin, Users, Camera, Upload, Share, Edit, Copy, CheckCircle, Clock, Image } from '@lucide/svelte';

  let showUploadModal = false;
  let showParticipants = false;
  let sortBy = 'recent';
  
  // Get event ID from URL
  $: eventId = $page.params.id;

  // Mock event data
  const event = {
    id: eventId,
    name: 'Conferencia Tech 2024',
    description: 'La mayor conferencia de tecnología del año con los mejores ponentes internacionales. Ven y aprende sobre las últimas tendencias en desarrollo de software, inteligencia artificial, y tecnologías emergentes.',
    date: '2024-03-15',
    time: '09:00',
    location: 'Centro de Convenciones, Ciudad de México',
    coverImage: 'https://picsum.photos/1200/400?random=event',
    participantCount: 245,
    imageCount: 89,
    isJoined: true,
    createdBy: 'TechEvents',
    category: 'technology',
    isOwner: false, // Set to true if current user is the event creator
    inviteCode: 'TECH2024'
  };

  // Mock participants data
  const participants = [
    { id: '1', name: 'Ana García', avatar: 'https://picsum.photos/40/40?random=1', joined: '2024-01-15' },
    { id: '2', name: 'Carlos López', avatar: 'https://picsum.photos/40/40?random=2', joined: '2024-01-14' },
    { id: '3', name: 'María Torres', avatar: 'https://picsum.photos/40/40?random=3', joined: '2024-01-13' },
    { id: '4', name: 'Juan Pérez', avatar: 'https://picsum.photos/40/40?random=4', joined: '2024-01-12' },
    { id: '5', name: 'Sofia Ruiz', avatar: 'https://picsum.photos/40/40?random=5', joined: '2024-01-11' }
  ];

  // Mock images data
  const eventImages = [
    {
      id: '1',
      url: 'https://picsum.photos/400/400?random=20',
      title: 'Inauguración del evento',
      description: 'Momento de la apertura con el keynote principal',
      author: 'Ana García',
      date: '2024-01-20T09:00:00',
      eventId: eventId,
      eventName: event.name,
      likes: 24,
      isLiked: false
    },
    {
      id: '2',
      url: 'https://picsum.photos/400/400?random=21',
      title: 'Panel de IA',
      description: 'Discusión sobre el futuro de la inteligencia artificial',
      author: 'Carlos López',
      date: '2024-01-20T11:30:00',
      eventId: eventId,
      eventName: event.name,
      likes: 18,
      isLiked: true
    },
    {
      id: '3',
      url: 'https://picsum.photos/400/400?random=22',
      title: 'Networking break',
      description: 'Conectando con otros desarrolladores',
      author: 'María Torres',
      date: '2024-01-20T14:15:00',
      eventId: eventId,
      eventName: event.name,
      likes: 32,
      isLiked: false
    },
    {
      id: '4',
      url: 'https://picsum.photos/400/400?random=23',
      title: 'Demo de productos',
      description: 'Presentación de las últimas innovaciones',
      author: 'Juan Pérez',
      date: '2024-01-20T16:00:00',
      eventId: eventId,
      eventName: event.name,
      likes: 15,
      isLiked: true
    }
  ];

  // Sort images
  $: sortedImages = eventImages.sort((a, b) => {
    switch (sortBy) {
      case 'likes':
        return (b.likes || 0) - (a.likes || 0);
      case 'oldest':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      default: // recent
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  function handleJoinEvent() {
    event.isJoined = !event.isJoined;
    event.participantCount = event.isJoined 
      ? event.participantCount + 1 
      : Math.max(0, event.participantCount - 1);
  }

  function handleShareEvent() {
    const url = `${window.location.origin}/events/${eventId}`;
    navigator.clipboard.writeText(url);
    alert('Enlace del evento copiado al portapapeles');
  }

  function handleUpload(files: FileList, metadata: any) {
    console.log('Uploading files to event:', files, metadata);
    alert(`Subiendo ${files.length} imagen(es) al evento...`);
  }

  function copyInviteCode() {
    navigator.clipboard.writeText(event.inviteCode);
    alert('Código de invitación copiado');
  }

  function isEventPast() {
    return new Date(event.date) < new Date();
  }
</script>

<svelte:head>
  <title>{event.name} - EventGallery</title>
</svelte:head>

<!-- Event Hero Section -->
<div class="relative mb-8">
  <!-- Cover Image -->
  <div class="hero min-h-80 rounded-xl overflow-hidden shadow-lg" style="background-image: url({event.coverImage});">
    <div class="hero-overlay bg-opacity-40 bg-black rounded-xl"></div>
    <div class="hero-content text-center text-neutral-content">
      <div class="max-w-md">
        <h1 class="mb-5 text-5xl font-bold text-white drop-shadow-lg">{event.name}</h1>
        <div class="flex flex-wrap justify-center gap-2 mb-5">
          <div class="badge badge-lg bg-black/50 border-white/20 text-white">
            <Calendar size={16} class="mr-1" />
            {new Date(event.date).toLocaleDateString('es-ES', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
          {#if event.time}
            <div class="badge badge-lg bg-black/50 border-white/20 text-white">
              <Clock size={16} class="mr-1" />
              {event.time}
            </div>
          {/if}
          <div class="badge badge-lg bg-black/50 border-white/20 text-white">
            <MapPin size={16} class="mr-1" />
            {event.location}
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Action Buttons -->
  <div class="absolute top-4 right-4 flex gap-2">
    <button class="btn btn-ghost btn-circle bg-black/30 text-white hover:bg-black/50" onclick={handleShareEvent}>
      <Share size={20} />
    </button>
    {#if event.isOwner}
      <a href="/events/{eventId}/edit" class="btn btn-ghost btn-circle bg-black/30 text-white hover:bg-black/50">
        <Edit size={20} />
      </a>
    {/if}
  </div>
</div>

<!-- Event Info Cards -->
<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
  
  <!-- Main Info Card -->
  <div class="lg:col-span-2">
    <div class="card bg-base-100 shadow-lg">
      <div class="card-body">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h2 class="card-title text-2xl mb-2">Detalles del Evento</h2>
            <div class="flex items-center gap-2 text-sm text-base-content/60">
              <div class="avatar avatar-xs">
                <div class="w-6 h-6 rounded-full">
                  <img src="https://picsum.photos/24/24?random=organizer" alt={event.createdBy} />
                </div>
              </div>
              <span>Organizado por <span class="font-medium">{event.createdBy}</span></span>
            </div>
          </div>
          
          <div class="flex gap-2">
            {#if !event.isJoined && !isEventPast()}
              <button class="btn btn-primary" onclick={handleJoinEvent}>
                Unirse al Evento
              </button>
            {:else if event.isJoined}
              <button class="btn btn-outline" onclick={handleJoinEvent}>
                Salir del Evento
              </button>
            {/if}
          </div>
        </div>

        {#if event.description}
          <p class="text-base-content/80 leading-relaxed mb-4">{event.description}</p>
        {/if}

        <div class="grid grid-cols-2 gap-4 mt-4">
          <div class="stat bg-base-200/50 rounded-lg">
            <div class="stat-figure text-primary">
              <Users size={24} />
            </div>
            <div class="stat-title text-xs">Participantes</div>
            <div class="stat-value text-2xl">{event.participantCount}</div>
            <button 
              class="stat-desc link link-primary"
              onclick={() => showParticipants = true}
            >
              Ver participantes
            </button>
          </div>
          
          <div class="stat bg-base-200/50 rounded-lg">
            <div class="stat-figure text-secondary">
              <Camera size={24} />
            </div>
            <div class="stat-title text-xs">Fotos Compartidas</div>
            <div class="stat-value text-2xl">{event.imageCount}</div>
            <div class="stat-desc">en la galería</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Actions Card -->
  <div class="space-y-4">
    <!-- Upload Photos Card -->
    {#if event.isJoined}
      <div class="card bg-primary text-primary-content shadow-lg">
        <div class="card-body p-4">
          <h3 class="card-title text-lg">
            <Upload size={20} />
            Compartir Fotos
          </h3>
          <p class="text-sm opacity-90 mb-3">
            Sube tus mejores momentos del evento
          </p>
          <button 
            class="btn btn-primary-content btn-sm"
            onclick={() => showUploadModal = true}
          >
            Subir Fotos
          </button>
        </div>
      </div>
    {/if}

    <!-- Invite Card -->
    <div class="card bg-base-100 shadow-lg">
      <div class="card-body p-4">
        <h3 class="card-title text-lg">
          <Share size={20} />
          Invitar Amigos
        </h3>
        <p class="text-sm text-base-content/60 mb-3">
          Comparte el código de invitación
        </p>
        <div class="flex gap-2">
          <input 
            type="text" 
            value={event.inviteCode}
            class="input input-bordered input-sm flex-1"
            readonly
          />
          <button class="btn btn-ghost btn-sm" onclick={copyInviteCode}>
            <Copy size={16} />
          </button>
        </div>
      </div>
    </div>

    <!-- Event Status -->
    <div class="card bg-base-100 shadow-lg">
      <div class="card-body p-4">
        <h3 class="card-title text-lg">
          {#if isEventPast()}
            <CheckCircle size={20} />
          {:else}
            <Clock size={20} />
          {/if}
          Estado
        </h3>
        <div class="badge {isEventPast() ? 'badge-success' : 'badge-warning'}">
          {isEventPast() ? 'Evento Finalizado' : 'Evento Próximo'}
        </div>
        {#if !isEventPast()}
          <p class="text-sm text-base-content/60 mt-2">
            Faltan {Math.ceil((new Date(event.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} días
          </p>
        {/if}
      </div>
    </div>
  </div>
</div>

<!-- Gallery Section -->
<div class="mb-8">
  <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
    <div>
      <h2 class="text-3xl font-bold flex items-center gap-2">
        <Camera size={32} />
        Galería del Evento
      </h2>
      <p class="text-base-content/60">
        Fotos compartidas por los participantes
      </p>
    </div>
    
    <div class="flex gap-2">
      <select class="select select-bordered select-sm" bind:value={sortBy}>
        <option value="recent">Más recientes</option>
        <option value="oldest">Más antiguas</option>
        <option value="likes">Más populares</option>
      </select>
    </div>
  </div>

  {#if sortedImages.length > 0}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {#each sortedImages as image}
        <ImageCard {image} showEventInfo={false} />
      {/each}
    </div>
  {:else}
    <div class="text-center py-16">
      <Image size={64} class="mx-auto mb-4 text-base-content/30" />
      <h3 class="text-2xl font-bold mb-2">No hay fotos aún</h3>
      <p class="text-base-content/60 mb-6">
        {#if event.isJoined}
          ¡Sé el primero en compartir una foto del evento!
        {:else}
          Únete al evento para ver y compartir fotos
        {/if}
      </p>
      {#if event.isJoined}
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
</div>

<!-- Participants Modal -->
{#if showParticipants}
  <dialog class="modal modal-open">
    <div class="modal-box">
      <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
        <Users size={20} />
        Participantes ({participants.length})
      </h3>
      
      <div class="space-y-3 max-h-80 overflow-y-auto">
        {#each participants as participant}
          <div class="flex items-center justify-between p-3 bg-base-200 rounded-lg">
            <div class="flex items-center gap-3">
              <div class="avatar">
                <div class="w-10 h-10 rounded-full">
                  <img src={participant.avatar} alt={participant.name} />
                </div>
              </div>
              <div>
                <div class="font-medium">{participant.name}</div>
                <div class="text-sm text-base-content/60">
                  Se unió el {new Date(participant.joined).toLocaleDateString()}
                </div>
              </div>
            </div>
            <button class="btn btn-ghost btn-sm">
              Ver perfil
            </button>
          </div>
        {/each}
      </div>

      <div class="modal-action">
        <button class="btn" onclick={() => showParticipants = false}>
          Cerrar
        </button>
      </div>
    </div>
    
    <form method="dialog" class="modal-backdrop">
      <button onclick={() => showParticipants = false}>cerrar</button>
    </form>
  </dialog>
{/if}

<!-- Upload Modal -->
<ImageUploadModal 
  bind:isOpen={showUploadModal}
  eventId={eventId}
  onUpload={handleUpload}
/>