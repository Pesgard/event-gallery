<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { ArrowLeft, Heart, Share, Download, Eye, MoreVertical, Info, Copy, MessageCircle, Camera, BarChart3 } from '@lucide/svelte';

  let showComments = false;
  let newComment = '';
  let showMetadata = false;
  let showShareModal = false;
  
  // Get image ID from URL
  $: imageId = $page.params.id;

  // Mock image data
  const image = {
    id: imageId,
    url: 'https://picsum.photos/800/600?random=detail',
    title: 'Atardecer en la montaña',
    description: 'Una vista increíble desde la cima después de una larga caminata. Este momento capturado durante nuestro viaje de fin de semana será inolvidable para siempre.',
    author: 'Juan Pérez',
    authorAvatar: 'https://picsum.photos/40/40?random=author',
    uploadDate: '2024-01-20T15:30:00',
    views: 142,
    downloads: 18,
    likes: 24,
    isLiked: false,
    eventId: '1',
    eventName: 'Excursión de Fin de Semana',
    isOwner: false, // Set to true if current user owns the image
    metadata: {
      camera: 'iPhone 13 Pro',
      settings: 'f/2.8, 1/120s, ISO 100',
      location: 'Pico de Orizaba, Veracruz',
      fileSize: '2.4 MB',
      dimensions: '4032 × 3024',
      uploadedFrom: 'Móvil'
    }
  };

  // Mock comments data
  const comments = [
    {
      id: '1',
      author: 'María García',
      authorAvatar: 'https://picsum.photos/32/32?random=comment1',
      content: '¡Qué vista tan increíble! Me encanta cómo captaste la luz del atardecer.',
      date: '2024-01-20T16:00:00',
      likes: 3,
      isLiked: false
    },
    {
      id: '2', 
      author: 'Carlos López',
      authorAvatar: 'https://picsum.photos/32/32?random=comment2',
      content: 'Definitivamente uno de los mejores momentos del viaje. ¡Excelente foto!',
      date: '2024-01-20T17:15:00',
      likes: 5,
      isLiked: true
    },
    {
      id: '3',
      author: 'Ana Torres',
      authorAvatar: 'https://picsum.photos/32/32?random=comment3',
      content: 'Me trae tantos recuerdos de nuestras aventuras. Gracias por compartir ❤️',
      date: '2024-01-21T08:30:00',
      likes: 2,
      isLiked: false
    }
  ];

  // Mock related images
  const relatedImages = [
    {
      id: '2',
      url: 'https://picsum.photos/200/200?random=related1',
      title: 'Camino a la cima'
    },
    {
      id: '3',
      url: 'https://picsum.photos/200/200?random=related2', 
      title: 'El grupo completo'
    },
    {
      id: '4',
      url: 'https://picsum.photos/200/200?random=related3',
      title: 'Descanso en el mirador'
    },
    {
      id: '5',
      url: 'https://picsum.photos/200/200?random=related4',
      title: 'Flora del lugar'
    }
  ];

  function handleLike() {
    image.isLiked = !image.isLiked;
    image.likes = image.isLiked ? image.likes + 1 : image.likes - 1;
  }

  function handleCommentLike(commentId: string) {
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
      comment.isLiked = !comment.isLiked;
      comment.likes = comment.isLiked ? comment.likes + 1 : comment.likes - 1;
    }
  }

  function handleAddComment() {
    if (newComment.trim()) {
      comments.push({
        id: String(comments.length + 1),
        author: 'Mi Usuario',
        authorAvatar: 'https://picsum.photos/32/32?random=myuser',
        content: newComment,
        date: new Date().toISOString(),
        likes: 0,
        isLiked: false
      });
      newComment = '';
      showComments = true;
    }
  }

  function handleDownload() {
    // Simulate download
    image.downloads += 1;
    alert('Descargando imagen... (funcionalidad pendiente)');
  }

  function handleShare() {
    showShareModal = true;
  }

  function copyImageLink() {
    const url = `${window.location.origin}/image/${imageId}`;
    navigator.clipboard.writeText(url);
    alert('Enlace copiado al portapapeles');
  }

  function handleReport() {
    alert('Reportar imagen (funcionalidad pendiente)');
  }

  function handleDelete() {
    if (confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
      alert('Imagen eliminada (funcionalidad pendiente)');
      window.history.back();
    }
  }

  onMount(() => {
    // Simulate view count increment
    image.views += 1;
  });
</script>

<svelte:head>
  <title>{image.title || 'Imagen'} - EventGallery</title>
  <meta name="description" content={image.description || 'Imagen compartida en EventGallery'} />
</svelte:head>

<div class="max-w-7xl mx-auto">
  <!-- Back Navigation -->
  <div class="flex items-center gap-2 mb-6">
    <button class="btn btn-ghost btn-sm" onclick={() => history.back()}>
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
      </svg>
      Volver
    </button>
    
    {#if image.eventId}
      <span class="text-base-content/60">→</span>
      <a href="/events/{image.eventId}" class="btn btn-ghost btn-sm">
        <span class="text-lg">🎉</span>
        {image.eventName}
      </a>
    {/if}
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    
    <!-- Main Image Column -->
    <div class="lg:col-span-2 space-y-6">
      
      <!-- Image Container -->
      <div class="card bg-base-100 shadow-xl overflow-hidden">
        <figure class="relative group">
          <img 
            src={image.url} 
            alt={image.title || 'Imagen'}
            class="w-full h-auto max-h-[70vh] object-contain bg-base-200"
            loading="lazy"
          />
          
          <!-- Image Overlay Actions -->
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div class="flex gap-3">
              <button class="btn btn-circle btn-primary" onclick={handleLike} title="Me gusta">
                <Heart size={20} fill={image.isLiked ? 'currentColor' : 'none'} />
              </button>
              <button class="btn btn-circle btn-secondary" onclick={handleShare} title="Compartir">
                <Share size={20} />
              </button>
              <button class="btn btn-circle btn-accent" onclick={handleDownload} title="Descargar">
                <Download size={20} />
              </button>
            </div>
          </div>
        </figure>
      </div>

      <!-- Image Actions Bar -->
      <div class="card bg-base-100 shadow-lg">
        <div class="card-body p-4">
          <div class="flex flex-wrap justify-between items-center gap-4">
            
            <!-- Left Actions -->
            <div class="flex items-center gap-4">
              <button 
                class="btn btn-ghost gap-2 {image.isLiked ? 'text-error' : ''}"
                onclick={handleLike}
              >
                <Heart size={16} fill={image.isLiked ? 'currentColor' : 'none'} />
                <span>{image.likes}</span>
              </button>
              
              <button 
                class="btn btn-ghost gap-2"
                onclick={() => showComments = !showComments}
              >
                <MessageCircle size={16} />
                <span>{comments.length}</span>
              </button>
              
              <div class="flex items-center gap-2 text-sm text-base-content/60">
                <Eye size={16} />
                <span>{image.views} vistas</span>
              </div>
            </div>

            <!-- Right Actions -->
            <div class="flex items-center gap-2">
              <button class="btn btn-outline btn-sm" onclick={handleShare}>
                <Share size={16} class="mr-1" />
                Compartir
              </button>
              <button class="btn btn-outline btn-sm" onclick={handleDownload}>
                <Download size={16} class="mr-1" />
                Descargar
              </button>
              
              <!-- More Options Dropdown -->
              <div class="dropdown dropdown-end">
                <label tabindex="0" class="btn btn-ghost btn-sm">
                  <MoreVertical size={16} />
                </label>
                <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li><button onclick={() => showMetadata = true}>Ver metadatos</button></li>
                  <li><button onclick={copyImageLink}>Copiar enlace</button></li>
                  {#if image.isOwner}
                    <li><button>Editar</button></li>
                    <li><button onclick={handleDelete} class="text-error">Eliminar</button></li>
                  {:else}
                    <li><button onclick={handleReport}>Reportar</button></li>
                  {/if}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Comments Section -->
      {#if showComments}
        <div class="card bg-base-100 shadow-lg">
          <div class="card-body">
            <h3 class="card-title text-xl mb-4">
              <MessageCircle size={20} />
              Comentarios ({comments.length})
            </h3>

            <!-- Add Comment -->
            <div class="flex gap-3 mb-6">
              <div class="avatar">
                <div class="w-8 h-8 rounded-full">
                  <img src="https://picsum.photos/32/32?random=myuser" alt="Mi avatar" />
                </div>
              </div>
              <div class="flex-1">
                <textarea 
                  class="textarea textarea-bordered w-full" 
                  placeholder="Escribe un comentario..."
                  bind:value={newComment}
                  rows="2"
                ></textarea>
                <div class="flex justify-end mt-2">
                  <button 
                    class="btn btn-primary btn-sm"
                    onclick={handleAddComment}
                    disabled={!newComment.trim()}
                  >
                    Comentar
                  </button>
                </div>
              </div>
            </div>

            <!-- Comments List -->
            <div class="space-y-4">
              {#each comments as comment}
                <div class="flex gap-3 p-3 bg-base-200 rounded-lg">
                  <div class="avatar">
                    <div class="w-8 h-8 rounded-full">
                      <img src={comment.authorAvatar} alt={comment.author} />
                    </div>
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="font-medium text-sm">{comment.author}</span>
                      <span class="text-xs text-base-content/60">
                        {new Date(comment.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p class="text-sm mb-2">{comment.content}</p>
                    <button 
                      class="btn btn-ghost btn-xs gap-1 {comment.isLiked ? 'text-error' : ''}"
                      onclick={() => handleCommentLike(comment.id)}
                    >
                      <Heart size={12} fill={comment.isLiked ? 'currentColor' : 'none'} />
                      <span>{comment.likes}</span>
                    </button>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>
      {/if}
    </div>

    <!-- Sidebar -->
    <div class="space-y-6">
      
      <!-- Image Info Card -->
      <div class="card bg-base-100 shadow-lg">
        <div class="card-body">
          <div class="flex items-start gap-3 mb-4">
            <div class="avatar">
              <div class="w-12 h-12 rounded-full">
                <img src={image.authorAvatar} alt={image.author} />
              </div>
            </div>
            <div class="flex-1">
              <h3 class="font-bold text-lg">{image.author}</h3>
              <p class="text-sm text-base-content/60">
                {new Date(image.uploadDate).toLocaleDateString('es-ES', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <button class="btn btn-outline btn-sm">
              Seguir
            </button>
          </div>

          {#if image.title}
            <h2 class="text-xl font-bold mb-2">{image.title}</h2>
          {/if}

          {#if image.description}
            <p class="text-base-content/80 mb-4">{image.description}</p>
          {/if}

          {#if image.eventId}
            <a href="/events/{image.eventId}" class="btn btn-outline btn-sm w-full">
              <span class="text-lg">🎉</span>
              Ver Evento: {image.eventName}
            </a>
          {/if}
        </div>
      </div>

      <!-- Stats Card -->
      <div class="card bg-base-100 shadow-lg">
        <div class="card-body p-4">
          <h3 class="font-bold mb-3 flex items-center gap-2">
            <BarChart3 size={16} />
            Estadísticas
          </h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-base-content/60">Vistas:</span>
              <span class="font-medium">{image.views}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-base-content/60">Me gusta:</span>
              <span class="font-medium">{image.likes}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-base-content/60">Descargas:</span>
              <span class="font-medium">{image.downloads}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-base-content/60">Comentarios:</span>
              <span class="font-medium">{comments.length}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Images -->
      {#if relatedImages.length > 0}
        <div class="card bg-base-100 shadow-lg">
          <div class="card-body p-4">
            <h3 class="font-bold mb-3">
              {#if image.eventId}
                Más del evento
              {:else}
                Más del autor
              {/if}
            </h3>
            <div class="grid grid-cols-2 gap-2">
              {#each relatedImages as related}
                <a href="/image/{related.id}" class="aspect-square">
                  <img 
                    src={related.url} 
                    alt={related.title}
                    class="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform duration-200"
                  />
                </a>
              {/each}
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>

<!-- Metadata Modal -->
{#if showMetadata}
  <dialog class="modal modal-open">
    <div class="modal-box">
      <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
        <Info size={20} />
        Información Técnica
      </h3>
      
      <div class="space-y-3">
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="font-medium text-base-content/60">Cámara:</span>
            <div>{image.metadata.camera}</div>
          </div>
          <div>
            <span class="font-medium text-base-content/60">Configuración:</span>
            <div>{image.metadata.settings}</div>
          </div>
          <div>
            <span class="font-medium text-base-content/60">Dimensiones:</span>
            <div>{image.metadata.dimensions}</div>
          </div>
          <div>
            <span class="font-medium text-base-content/60">Tamaño:</span>
            <div>{image.metadata.fileSize}</div>
          </div>
          <div>
            <span class="font-medium text-base-content/60">Ubicación:</span>
            <div>{image.metadata.location}</div>
          </div>
          <div>
            <span class="font-medium text-base-content/60">Subido desde:</span>
            <div>{image.metadata.uploadedFrom}</div>
          </div>
        </div>
      </div>

      <div class="modal-action">
        <button class="btn" onclick={() => showMetadata = false}>
          Cerrar
        </button>
      </div>
    </div>
    
    <form method="dialog" class="modal-backdrop">
      <button onclick={() => showMetadata = false}>cerrar</button>
    </form>
  </dialog>
{/if}

<!-- Share Modal -->
{#if showShareModal}
  <dialog class="modal modal-open">
    <div class="modal-box">
      <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
        <Share size={20} />
        Compartir Imagen
      </h3>
      
      <div class="space-y-4">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Enlace de la imagen</span>
          </label>
          <div class="input-group">
            <input 
              type="text" 
              value="{window.location.origin}/image/{imageId}"
              class="input input-bordered flex-1"
              readonly
            />
            <button class="btn" onclick={copyImageLink}>
              <Copy size={16} />
            </button>
          </div>
        </div>

        <div class="divider">O compartir en</div>

        <div class="flex flex-wrap gap-3">
          <button class="btn btn-outline">
            📘 Facebook
          </button>
          <button class="btn btn-outline">
            🐦 Twitter
          </button>
          <button class="btn btn-outline">
            📷 Instagram
          </button>
          <button class="btn btn-outline">
            💼 LinkedIn
          </button>
        </div>
      </div>

      <div class="modal-action">
        <button class="btn" onclick={() => showShareModal = false}>
          Cerrar
        </button>
      </div>
    </div>
    
    <form method="dialog" class="modal-backdrop">
      <button onclick={() => showShareModal = false}>cerrar</button>
    </form>
  </dialog>
{/if}