<script lang="ts">
  import { Heart, Share, Download, Eye, Calendar } from '@lucide/svelte';
  
  export let image: {
    id: string;
    url: string;
    title?: string;
    description?: string;
    author?: string;
    date?: string;
    eventId?: string;
    eventName?: string;
    likes?: number;
    isLiked?: boolean;
  };

  export let showEventInfo = false;
  export let showActions = true;

  function handleLike() {
    image.isLiked = !image.isLiked;
    image.likes = image.isLiked ? (image.likes || 0) + 1 : (image.likes || 0) - 1;
  }

  function handleShare() {
    // Placeholder for share functionality
    alert('Compartir imagen (funcionalidad pendiente)');
  }

  function handleDownload() {
    // Placeholder for download functionality
    alert('Descargar imagen (funcionalidad pendiente)');
  }
</script>

<div class="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
  <figure class="aspect-square overflow-hidden">
    <img 
      src={image.url} 
      alt={image.title || 'Imagen de galería'}
      class="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
      onclick={() => window.location.href = `/image/${image.id}`}
    />
  </figure>
  
  <div class="card-body p-4">
    {#if image.title}
      <h3 class="card-title text-base">{image.title}</h3>
    {/if}
    
    {#if image.description}
      <p class="text-sm text-base-content/70 line-clamp-2">{image.description}</p>
    {/if}

    <div class="flex justify-between items-center text-sm text-base-content/60 mt-2">
      <div class="flex items-center gap-2">
        {#if image.author}
          <div class="avatar avatar-xs">
            <div class="w-6 h-6 rounded-full">
              <img src="https://picsum.photos/24/24?random={image.author}" alt={image.author} />
            </div>
          </div>
          <span>{image.author}</span>
        {/if}
      </div>
      
      {#if image.date}
        <span>{new Date(image.date).toLocaleDateString()}</span>
      {/if}
    </div>

    {#if showEventInfo && image.eventName}
      <div class="badge badge-primary badge-sm mt-2">
        <Calendar size={12} class="mr-1" />
        {image.eventName}
      </div>
    {/if}

    {#if showActions}
      <div class="card-actions justify-between items-center mt-3">
        <div class="flex items-center gap-2">
          <button 
            class="btn btn-ghost btn-sm {image.isLiked ? 'text-error' : ''}"
            onclick={handleLike}
          >
            <Heart size={16} fill={image.isLiked ? 'currentColor' : 'none'} />
            <span class="text-xs">{image.likes || 0}</span>
          </button>
        </div>
        
        <div class="flex gap-1">
          <button class="btn btn-ghost btn-sm" onclick={handleShare} title="Compartir">
            <Share size={16} />
          </button>
          <button class="btn btn-ghost btn-sm" onclick={handleDownload} title="Descargar">
            <Download size={16} />
          </button>
          <a href="/image/{image.id}" class="btn btn-ghost btn-sm" title="Ver detalles">
            <Eye size={16} />
          </a>
        </div>
      </div>
    {/if}
  </div>
</div>