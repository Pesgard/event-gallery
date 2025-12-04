// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
// 
// Note: In SPA mode, we don't use server-side Locals
// Authentication is handled client-side with Bearer tokens
declare global {
	namespace App {
		// Locals are not used in SPA mode
		// interface Locals {}
		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
