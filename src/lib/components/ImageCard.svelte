<script lang="ts">
  import { Heart, Share, Download, Eye, Calendar } from '@lucide/svelte';
  import type { ImageWithStats } from '$lib/types';
  
  export let image: ImageWithStats & { 
    user?: { username: string; fullName: string | null; avatarUrl: string | null };
    event?: { name: string };
    isLiked?: boolean;
  };

  export let showEventInfo = false;
  export let showActions = true;

  function handleShare() {
    navigator.clipboard.writeText(`${window.location.origin}/image/${image.id}`);
    alert('Enlace de la imagen copiado al portapapeles');
  }

  function handleDownload() {
    window.open(image.imageUrl, '_blank');
  }
</script>

<div class="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
  <figure class="aspect-square overflow-hidden">
    <a href="/image/{image.id}" class="block w-full h-full">
      <img 
        src={image.thumbnailUrl || image.imageUrl} 
        alt={image.title || 'Imagen de galería'}
        class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
      />
    </a>
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
        {#if image.user}
          {#if image.user.avatarUrl}
            <div class="avatar avatar-xs">
              <div class="w-6 h-6 rounded-full">
                <img src={image.user.avatarUrl} alt={image.user.username} />
              </div>
            </div>
          {/if}
          <span>{image.user.fullName || image.user.username}</span>
        {/if}
      </div>
      
      <span>{new Date(image.uploadedAt).toLocaleDateString()}</span>
    </div>

    {#if showEventInfo && image.event}
      <div class="badge badge-primary badge-sm mt-2">
        <Calendar size={12} class="mr-1" />
        {image.event.name}
      </div>
    {/if}

    {#if showActions}
      <div class="card-actions justify-between items-center mt-3">
        <div class="flex items-center gap-2">
          <div class="btn btn-ghost btn-sm {image.isLiked ? 'text-error' : ''}">
            <Heart size={16} fill={image.isLiked ? 'currentColor' : 'none'} />
            <span class="text-xs">{image.likeCount || 0}</span>
          </div>
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