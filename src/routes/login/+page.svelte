<script lang="ts">
  import { Camera, Mail, Lock, Eye, EyeOff } from '@lucide/svelte';
  import { login, register, isLoading } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  
  let email = $state('');
  let password = $state('');
  let username = $state('');
  let fullName = $state('');
  let isRegistering = $state(false);
  let showPassword = $state(false);
  let errorMessage = $state('');
  let loading = $state(false);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    errorMessage = '';
    loading = true;

    try {
      if (isRegistering) {
        if (!username.trim()) {
          errorMessage = 'El nombre de usuario es requerido';
          loading = false;
          return;
        }
        const result = await register(email, username, password, fullName || undefined);
        if (result.success) {
          goto('/');
        } else {
          errorMessage = result.error?.message || 'Error al registrar';
        }
      } else {
        const result = await login(email, password);
        if (result.success) {
          goto('/');
        } else {
          errorMessage = result.error?.message || 'Error al iniciar sesión';
        }
      }
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : 'Error inesperado';
    } finally {
      loading = false;
    }
  }

  function handleGoogleLogin() {
    alert('Inicio de sesión con Google (funcionalidad pendiente)');
  }

  function handleFacebookLogin() {
    alert('Inicio de sesión con Facebook (funcionalidad pendiente)');
  }

  function togglePasswordVisibility() {
    showPassword = !showPassword;
  }
</script>

<svelte:head>
  <title>{isRegistering ? 'Registrarse' : 'Iniciar Sesión'} - EventGallery</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8">
    <!-- Logo y título -->
    <div class="text-center">
      <Camera size={64} class="mx-auto mb-4" />
      <h2 class="text-3xl font-bold">
        {isRegistering ? 'Crear cuenta' : 'Bienvenido de vuelta'}
      </h2>
      <p class="mt-2 text-base-content/60">
        {isRegistering 
          ? 'Únete a EventGallery y comienza a compartir momentos' 
          : 'Inicia sesión en tu cuenta'}
      </p>
    </div>

    <!-- Formulario principal -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        {#if errorMessage}
          <div class="alert alert-error mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{errorMessage}</span>
          </div>
        {/if}

        <form onsubmit={handleSubmit} class="space-y-6">
          <div>
            <label for="email" class="label">
              <span class="label-text">Correo electrónico</span>
            </label>
            <input 
              id="email"
              type="email" 
              required
              class="input input-bordered w-full" 
              placeholder="tu@email.com"
              bind:value={email}
              disabled={loading}
            />
          </div>

          {#if isRegistering}
            <div>
              <label for="username" class="label">
                <span class="label-text">Nombre de usuario</span>
              </label>
              <input 
                id="username"
                type="text" 
                required
                class="input input-bordered w-full" 
                placeholder="usuario123"
                bind:value={username}
                disabled={loading}
              />
            </div>

            <div>
              <label for="fullName" class="label">
                <span class="label-text">Nombre completo (opcional)</span>
              </label>
              <input 
                id="fullName"
                type="text" 
                class="input input-bordered w-full" 
                placeholder="Juan Pérez"
                bind:value={fullName}
                disabled={loading}
              />
            </div>
          {/if}

          <div>
            <label for="password" class="label">
              <span class="label-text">Contraseña</span>
            </label>
            <div class="relative">
              <input 
                id="password"
                type={showPassword ? 'text' : 'password'} 
                required
                class="input input-bordered w-full pr-10" 
                placeholder="••••••••"
                bind:value={password}
                disabled={loading}
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm btn-square"
                onclick={togglePasswordVisibility}
              >
                {#if showPassword}
                  <EyeOff size={16} />
                {:else}
                  <Eye size={16} />
                {/if}
              </button>
            </div>
            {#if !isRegistering}
              <span class="label">
                <a href="/forgot-password" class="label-text-alt link link-hover">
                  ¿Olvidaste tu contraseña?
                </a>
              </span>
            {/if}
          </div>

          <button type="submit" class="btn btn-primary w-full" disabled={loading}>
            {#if loading}
              <span class="loading loading-spinner loading-sm"></span>
            {/if}
            {isRegistering ? 'Crear cuenta' : 'Iniciar sesión'}
          </button>
        </form>

        <!-- Divider -->
        <div class="divider">O continúa con</div>

        <!-- Social login buttons -->
        <div class="space-y-3">
          <button 
            class="btn btn-outline w-full"
            onclick={handleGoogleLogin}
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar con Google
          </button>

          <button 
            class="btn btn-outline w-full"
            onclick={handleFacebookLogin}
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Continuar con Facebook
          </button>
        </div>
      </div>
    </div>

    <!-- Toggle entre login y registro -->
    <div class="text-center">
      <p class="text-base-content/60">
        {isRegistering ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'}
        <button 
          class="link link-primary ml-1"
          onclick={() => isRegistering = !isRegistering}
        >
          {isRegistering ? 'Inicia sesión aquí' : 'Regístrate gratis'}
        </button>
      </p>
    </div>

    <!-- Terms and privacy -->
    {#if isRegistering}
      <div class="text-center text-sm text-base-content/60">
        Al registrarte, aceptas nuestros 
        <a href="/terms" class="link">Términos de Servicio</a> y 
        <a href="/privacy" class="link">Política de Privacidad</a>
      </div>
    {/if}
  </div>
</div>