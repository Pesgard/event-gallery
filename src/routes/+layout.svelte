<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$lib/components/Navbar.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>EventGallery - Comparte tus momentos</title>
	<meta name="description" content="Plataforma para compartir y descubrir fotos de eventos" />
</svelte:head>

<div class="min-h-screen bg-base-100">
	<Navbar />
	<main class="container mx-auto px-4 py-6">
		{@render children?.()}
	</main>
</div>
