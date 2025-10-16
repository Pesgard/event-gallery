<script lang="ts">
  import { Calendar, MapPin, Users, Camera, Share, ExternalLink } from '@lucide/svelte';
  
  export let event: {
    id: string;
    name: string;
    description?: string;
    date: string;
    location?: string;
    coverImage?: string;
    participantCount?: number;
    imageCount?: number;
    isJoined?: boolean;
    createdBy?: string;
  };

  function handleJoinEvent() {
    event.isJoined = !event.isJoined;
    event.participantCount = event.isJoined 
      ? (event.participantCount || 0) + 1 
      : Math.max(0, (event.participantCount || 0) - 1);
  }

  function handleShareEvent() {
    // Placeholder for share event functionality
    navigator.clipboard.writeText(`${window.location.origin}/events/${event.id}`);
    alert('Enlace del evento copiado al portapapeles');
  }
</script>

<div class="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
  <figure class="aspect-video overflow-hidden">
    <img 
      src={event.coverImage || `https://picsum.photos/400/225?random=${event.id}`}
      alt={event.name}
      class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
    />
  </figure>

  <div class="card-body p-4">
    <h2 class="card-title text-lg">
      {event.name}
      {#if event.isJoined}
        <div class="badge badge-success">Unido</div>
      {/if}
    </h2>

    {#if event.description}
      <p class="text-sm text-base-content/70 line-clamp-3">{event.description}</p>
    {/if}

    <div class="flex flex-col gap-2 mt-3">
      <div class="flex items-center gap-2 text-sm">
        <Calendar size={16} />
        <span>{new Date(event.date).toLocaleDateString('es-ES', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</span>
      </div>

      {#if event.location}
        <div class="flex items-center gap-2 text-sm">
          <MapPin size={16} />
          <span class="truncate">{event.location}</span>
        </div>
      {/if}

      <div class="flex justify-between text-sm text-base-content/60">
        <div class="flex items-center gap-1">
          <Users size={14} />
          <span>{event.participantCount || 0} participantes</span>
        </div>
        <div class="flex items-center gap-1">
          <Camera size={14} />
          <span>{event.imageCount || 0} fotos</span>
        </div>
      </div>

      {#if event.createdBy}
        <div class="flex items-center gap-2 text-sm text-base-content/60">
          <div class="avatar avatar-xs">
            <div class="w-5 h-5 rounded-full">
              <img src="https://picsum.photos/20/20?random={event.createdBy}" alt={event.createdBy} />
            </div>
          </div>
          <span>Creado por {event.createdBy}</span>
        </div>
      {/if}
    </div>

    <div class="card-actions justify-between mt-4">
      <div class="flex gap-2">
        <button 
          class="btn btn-sm {event.isJoined ? 'btn-outline' : 'btn-primary'}"
          onclick={handleJoinEvent}
        >
          {event.isJoined ? 'Salir' : 'Unirse'}
        </button>
        <a href="/events/{event.id}" class="btn btn-ghost btn-sm">
          <ExternalLink size={16} class="mr-1" />
          Ver Galería
        </a>
      </div>
      
      <div class="flex gap-1">
        <button class="btn btn-ghost btn-sm" onclick={handleShareEvent} title="Compartir evento">
          <Share size={16} />
        </button>
      </div>
    </div>
  </div>
</div>