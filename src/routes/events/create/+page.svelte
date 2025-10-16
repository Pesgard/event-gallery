<script lang="ts">
	import {
		Plus,
		Calendar,
		MapPin,
		Users,
		Lock,
		Globe,
		FileImage,
		ArrowLeft,
		ArrowRight,
		Sparkles,
		type Icon as IconType
	} from '@lucide/svelte';

	let eventData = {
		name: '',
		description: '',
		date: '',
		time: '',
		location: '',
		category: 'other',
		isPrivate: false,
		maxParticipants: '',
		coverImage: null as File | null
	};

	let step = 1;
	const totalSteps = 3;
	let coverImagePreview = '';
	let dragOver = false;

	const categories = [
		{ value: 'wedding', label: 'Boda', icon: Calendar },
		{ value: 'birthday', label: 'Cumpleaños', icon: Calendar },
		{ value: 'conference', label: 'Conferencia', icon: Calendar },
		{ value: 'music', label: 'Música', icon: Calendar },
		{ value: 'sports', label: 'Deportes', icon: Calendar },
		{ value: 'art', label: 'Arte', icon: Calendar },
		{ value: 'education', label: 'Educación', icon: Calendar },
		{ value: 'technology', label: 'Tecnología', icon: Calendar },
		{ value: 'food', label: 'Gastronomía', icon: Calendar },
		{ value: 'travel', label: 'Viaje', icon: Calendar },
		{ value: 'family', label: 'Familiar', icon: Users },
		{ value: 'other', label: 'Otro', icon: Calendar }
	];

	function nextStep() {
		if (step < totalSteps) {
			step++;
		}
	}

	function prevStep() {
		if (step > 1) {
			step--;
		}
	}

	function handleImageUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			eventData.coverImage = file;
			const reader = new FileReader();
			reader.onload = (e) => {
				coverImagePreview = e.target?.result as string;
			};
			reader.readAsDataURL(file);
		}
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		dragOver = false;
		const file = event.dataTransfer?.files?.[0];
		if (file && file.type.startsWith('image/')) {
			eventData.coverImage = file;
			const reader = new FileReader();
			reader.onload = (e) => {
				coverImagePreview = e.target?.result as string;
			};
			reader.readAsDataURL(file);
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		dragOver = true;
	}

	function handleDragLeave() {
		dragOver = false;
	}

	function createEvent() {
		console.log('Creating event:', eventData);
		alert('¡Evento creado exitosamente! (funcionalidad pendiente)');
		// Redirect to event page
		window.location.href = '/events/123'; // placeholder ID
	}

	function isStepValid(stepNumber: number): boolean {
		switch (stepNumber) {
			case 1:
				return eventData.name.trim() !== '' && eventData.date !== '' && eventData.category !== '';
			case 2:
				return eventData.location.trim() !== '';
			case 3:
				return true; // Optional step
			default:
				return false;
		}
	}

	// Set minimum date to today
	const today = new Date().toISOString().split('T')[0];
</script>

<svelte:head>
	<title>Crear Evento - EventGallery</title>
</svelte:head>

<div class="mx-auto max-w-4xl">
	<!-- Header -->
	<div class="mb-8 text-center">
		<h1 class="mb-4 flex items-center justify-center gap-3 text-4xl font-bold">
			<Plus size={40} />
			Crear Nuevo Evento
		</h1>
		<p class="text-base-content/60">
			Organiza un evento increíble y comparte momentos únicos con tu comunidad
		</p>
	</div>

	<!-- Progress Steps -->
	<div class="steps mb-8 w-full">
		<div class="step {step >= 1 ? 'step-primary' : ''}">Información Básica</div>
		<div class="step {step >= 2 ? 'step-primary' : ''}">Ubicación y Detalles</div>
		<div class="step {step >= 3 ? 'step-primary' : ''}">Imagen y Configuración</div>
	</div>

	<!-- Form Card -->
	<div class="card bg-base-100 shadow-xl">
		<div class="card-body">
			<!-- Step 1: Basic Information -->
			{#if step === 1}
				<h2 class="mb-6 card-title text-2xl">
					<Calendar size={24} />
					Información Básica
				</h2>

				<div class="space-y-6">
					<!-- Event Name -->
					<div>
						<label for="name" class="label">
							<span class="label-text font-medium">Nombre del evento *</span>
						</label>
						<input
							id="name"
							type="text"
							placeholder="Ej: Cumpleaños de María, Conferencia Tech 2024..."
							class="input-bordered input w-full"
							bind:value={eventData.name}
							required
						/>
					</div>

					<!-- Category -->
					<div>
						<label for="category" class="label">
							<span class="label-text font-medium">Categoría *</span>
						</label>
						<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
							{#each categories as category}
								{@const CategoryIcon = category.icon}
								<label class="cursor-pointer">
									<input
										type="radio"
										name="category"
										value={category.value}
										bind:group={eventData.category}
										class="sr-only"
									/>
									<div
										class="card-compact card border-2 bg-base-200 transition-all hover:bg-base-300
                             {eventData.category === category.value
											? 'border-primary bg-primary/10'
											: 'border-transparent'}"
									>
										<div class="card-body items-center text-center">
											<CategoryIcon size={24} class="mb-1" />
											<div class="text-sm font-medium">{category.label}</div>
										</div>
									</div>
								</label>
							{/each}
						</div>
					</div>

					<!-- Date and Time -->
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div>
							<label for="date" class="label">
								<span class="label-text font-medium">Fecha *</span>
							</label>
							<input
								id="date"
								type="date"
								class="input-bordered input w-full"
								bind:value={eventData.date}
								min={today}
								required
							/>
						</div>
						<div>
							<label for="time" class="label">
								<span class="label-text font-medium">Hora</span>
							</label>
							<input
								id="time"
								type="time"
								class="input-bordered input w-full"
								bind:value={eventData.time}
							/>
						</div>
					</div>

					<!-- Description -->
					<div>
						<label for="description" class="label">
							<span class="label-text font-medium">Descripción</span>
						</label>
						<textarea
							id="description"
							class="textarea-bordered textarea h-24 w-full"
							placeholder="Describe tu evento, qué actividades habrá, qué deben saber los invitados..."
							bind:value={eventData.description}
						></textarea>
					</div>
				</div>
			{/if}

			<!-- Step 2: Location and Details -->
			{#if step === 2}
				<h2 class="mb-6 card-title text-2xl">
					<MapPin size={24} />
					Ubicación y Detalles
				</h2>

				<div class="space-y-6">
					<!-- Location -->
					<div>
						<label for="location" class="label">
							<span class="label-text font-medium">Ubicación *</span>
						</label>
						<input
							id="location"
							type="text"
							placeholder="Ej: Centro de Convenciones, Jardines La Primavera, Mi casa..."
							class="input-bordered input w-full"
							bind:value={eventData.location}
							required
						/>
						<label class="label">
							<span class="label-text-alt">Será visible para todos los participantes</span>
						</label>
					</div>

					<!-- Max Participants -->
					<div>
						<label for="maxParticipants" class="label">
							<span class="label-text font-medium">Límite de participantes</span>
						</label>
						<input
							id="maxParticipants"
							type="number"
							placeholder="Opcional - deja vacío para sin límite"
							class="input-bordered input w-full"
							min="1"
							max="10000"
							bind:value={eventData.maxParticipants}
						/>
						<label class="label">
							<span class="label-text-alt">Si no especificas, cualquiera podrá unirse</span>
						</label>
					</div>

					<!-- Privacy Settings -->
					<div class="form-control">
						<label class="label cursor-pointer justify-start gap-3">
							<input
								type="checkbox"
								class="toggle toggle-primary"
								bind:checked={eventData.isPrivate}
							/>
							<div>
								<div class="flex items-center gap-2 font-medium">
									{#if eventData.isPrivate}
										<Lock size={16} />
									{:else}
										<Globe size={16} />
									{/if}
									Evento privado
								</div>
								<div class="text-sm text-base-content/60">
									Solo las personas con el enlace de invitación podrán unirse
								</div>
							</div>
						</label>
					</div>

					<!-- Event Preview -->
					<div class="card border-2 border-dashed bg-base-200">
						<div class="card-body">
							<h3 class="text-lg font-bold">Vista previa</h3>
							<div class="space-y-2 text-sm">
								<div class="flex items-center gap-2">
									<Calendar size={16} />
									<span class="font-medium">{eventData.name || 'Nombre del evento'}</span>
								</div>
								<div class="flex items-center gap-2">
									<Calendar size={16} />
									<span>
										{eventData.date
											? new Date(eventData.date).toLocaleDateString('es-ES', {
													year: 'numeric',
													month: 'long',
													day: 'numeric'
												})
											: 'Fecha no seleccionada'}
										{eventData.time ? `a las ${eventData.time}` : ''}
									</span>
								</div>
								<div class="flex items-center gap-2">
									<MapPin size={16} />
									<span>{eventData.location || 'Ubicación por definir'}</span>
								</div>
								<div class="flex items-center gap-2">
									<Users size={16} />
									<span>
										{eventData.maxParticipants
											? `Hasta ${eventData.maxParticipants} participantes`
											: 'Sin límite de participantes'}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			{/if}

			<!-- Step 3: Image and Configuration -->
			{#if step === 3}
				<h2 class="mb-6 card-title text-2xl">
					<FileImage size={24} />
					Imagen y Configuración Final
				</h2>

				<div class="space-y-6">
					<!-- Cover Image Upload -->
					<div>
						<label class="label">
							<span class="label-text font-medium">Imagen de portada (opcional)</span>
						</label>

						<div
							class="rounded-lg border-2 border-dashed border-base-300 p-8 text-center transition-colors
                     {dragOver ? 'border-primary bg-primary/5' : ''}"
							ondrop={handleDrop}
							ondragover={handleDragOver}
							ondragleave={handleDragLeave}
						>
							<input
								type="file"
								accept="image/*"
								class="hidden"
								id="coverImage"
								onchange={handleImageUpload}
							/>

							{#if coverImagePreview}
								<div class="space-y-4">
									<img
										src={coverImagePreview}
										alt="Vista previa"
										class="mx-auto max-h-40 rounded-lg shadow-lg"
									/>
									<div class="space-x-2">
										<label for="coverImage" class="btn btn-outline btn-sm"> Cambiar imagen </label>
										<button
											class="btn btn-ghost btn-sm"
											onclick={() => {
												coverImagePreview = '';
												eventData.coverImage = null;
											}}
										>
											Quitar imagen
										</button>
									</div>
								</div>
							{:else}
								<div>
									<FileImage size={64} class="mx-auto mb-4" />
									<p class="mt-4 text-lg font-medium">
										Arrastra una imagen aquí o
										<label for="coverImage" class="btn h-auto min-h-0 p-0 btn-link">
											selecciona una
										</label>
									</p>
									<p class="mt-2 text-sm text-base-content/60">JPG, PNG o WEBP hasta 5MB</p>
								</div>
							{/if}
						</div>
					</div>

					<!-- Final Summary -->
					<div
						class="card border-2 border-primary/20 bg-gradient-to-r from-primary/10 to-secondary/10"
					>
						<div class="card-body">
							<h3 class="mb-4 card-title text-xl">
								<Sparkles size={20} />
								Resumen del Evento
							</h3>

							<div class="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
								<div class="space-y-3">
									<div>
										<span class="font-medium text-base-content/60">Nombre:</span>
										<div class="font-bold">{eventData.name}</div>
									</div>
									<div>
										<span class="font-medium text-base-content/60">Categoría:</span>
										<div class="flex items-center gap-1">
											<svelte:component
												this={categories.find((c) => c.value === eventData.category)?.icon ||
													Calendar}
												size={16}
											/>
											<span>{categories.find((c) => c.value === eventData.category)?.label}</span>
										</div>
									</div>
									<div>
										<span class="font-medium text-base-content/60">Fecha:</span>
										<div>
											{eventData.date
												? new Date(eventData.date).toLocaleDateString('es-ES', {
														year: 'numeric',
														month: 'long',
														day: 'numeric'
													})
												: ''}
											{eventData.time ? `a las ${eventData.time}` : ''}
										</div>
									</div>
								</div>

								<div class="space-y-3">
									<div>
										<span class="font-medium text-base-content/60">Ubicación:</span>
										<div>{eventData.location}</div>
									</div>
									<div>
										<span class="font-medium text-base-content/60">Participantes:</span>
										<div>{eventData.maxParticipants || 'Sin límite'}</div>
									</div>
									<div>
										<span class="font-medium text-base-content/60">Privacidad:</span>
										<div class="flex items-center gap-1">
											{#if eventData.isPrivate}
												<Lock size={16} />
												<span>Privado</span>
											{:else}
												<Globe size={16} />
												<span>Público</span>
											{/if}
										</div>
									</div>
								</div>
							</div>

							{#if eventData.description}
								<div class="mt-4">
									<span class="font-medium text-base-content/60">Descripción:</span>
									<p class="mt-1 italic">{eventData.description}</p>
								</div>
							{/if}
						</div>
					</div>
				</div>
			{/if}

			<!-- Navigation Buttons -->
			<div class="mt-8 card-actions justify-between">
				<div>
					{#if step > 1}
						<button class="btn btn-outline" onclick={prevStep}>
							<ArrowLeft size={16} class="mr-1" />
							Anterior
						</button>
					{/if}
				</div>

				<div>
					{#if step < totalSteps}
						<button class="btn btn-primary" onclick={nextStep} disabled={!isStepValid(step)}>
							Siguiente
							<ArrowRight size={16} class="ml-1" />
						</button>
					{:else}
						<button
							class="btn btn-lg btn-success"
							onclick={createEvent}
							disabled={!isStepValid(1) || !isStepValid(2)}
						>
							<Calendar size={20} class="mr-2" />
							Crear Evento
						</button>
					{/if}
				</div>
			</div>
		</div>
	</div>

	<!-- Help Text -->
	<div class="mt-8 text-center text-base-content/60">
		<p>
			¿Necesitas ayuda? Consulta nuestra
			<a href="/help" class="link">guía de creación de eventos</a>
		</p>
	</div>
</div>
