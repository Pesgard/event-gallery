<script lang="ts">
  import { onMount } from 'svelte';
  import { Palette } from '@lucide/svelte';

  const themes = [
    'light', 'dark', 'cupcake', 'bumblebee', 'emerald', 'corporate', 
    'synthwave', 'retro', 'cyberpunk', 'valentine', 'halloween', 
    'garden', 'forest', 'aqua', 'lofi', 'pastel', 'fantasy', 
    'wireframe', 'black', 'luxury', 'dracula', 'cmyk', 'autumn', 
    'business', 'acid', 'lemonade', 'night', 'coffee', 'winter', 
    'dim', 'nord', 'sunset'
  ];

  let currentTheme = 'light';

  onMount(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    currentTheme = savedTheme;
    document.documentElement.setAttribute('data-theme', currentTheme);
  });

  function changeTheme(theme: string) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }
</script>

<div class="dropdown dropdown-end">
  <label tabindex="0" class="btn btn-ghost btn-circle">
    <Palette size={20} />
  </label>
  <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 max-h-80 overflow-y-auto">
    <li class="menu-title">
      <span>Seleccionar Tema</span>
    </li>
    {#each themes as theme}
      <li>
        <button 
          class="justify-between {currentTheme === theme ? 'active' : ''}"
          onclick={() => changeTheme(theme)}
        >
          <span class="capitalize">{theme}</span>
          {#if currentTheme === theme}
            <span class="text-success">✓</span>
          {/if}
        </button>
      </li>
    {/each}
  </ul>
</div>