<script lang="ts">
  import ThemeController from './ThemeController.svelte';
  import { Home, Image, Calendar, Plus, Menu, Camera, type Icon as IconType } from '@lucide/svelte';
  
  interface NavItem {
    name: string;
    href: string;
    icon: typeof IconType;
  }

  const navItems: NavItem[] = [
    { name: 'Inicio', href: '/', icon: Home },
    { name: 'Mi Galería', href: '/gallery', icon: Image },
    { name: 'Eventos', href: '/events', icon: Calendar },
    { name: 'Crear Evento', href: '/events/create', icon: Plus }
  ];

  let isLoggedIn = true; // Placeholder for auth state
</script>

<div class="navbar bg-base-200 shadow-lg">
  <div class="navbar-start">
    <div class="dropdown lg:hidden">
      <label tabindex="0" class="btn btn-ghost">
        <Menu size={20} />
      </label>
      <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
        {#each navItems as item}
          {@const Icon = item.icon}
          <li>
            <a href={item.href} class="flex items-center gap-2">
              <Icon size={18} />
              {item.name}
            </a>
          </li>
        {/each}
      </ul>
    </div>
    <a href="/" class="btn btn-ghost text-xl">
      <Camera size={24} />
      EventGallery
    </a>
  </div>

  <div class="navbar-center hidden lg:flex">
    <ul class="menu menu-horizontal px-1">
      {#each navItems as item}
        {@const Icon = item.icon}
        <li>
          <a href={item.href} class="flex items-center gap-2">
            <Icon size={18} />
            {item.name}
          </a>
        </li>
      {/each}
    </ul>
  </div>

  <div class="navbar-end gap-2">
    <ThemeController />
    
    {#if isLoggedIn}
      <div class="dropdown dropdown-end">
        <label tabindex="0" class="btn btn-ghost btn-circle avatar">
          <div class="w-10 rounded-full">
            <img src="https://picsum.photos/40/40?random=user" alt="Avatar" />
          </div>
        </label>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
          <li><a href="/profile">Mi Perfil</a></li>
          <li><a href="/settings">Configuración</a></li>
          <li><a href="/logout">Cerrar Sesión</a></li>
        </ul>
      </div>
    {:else}
      <a href="/login" class="btn btn-primary">Iniciar Sesión</a>
    {/if}
  </div>
</div>