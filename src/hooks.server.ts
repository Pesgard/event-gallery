// ==========================================
// HOOKS SERVER - SPA MODE
// ==========================================
// In SPA mode, we don't need server-side hooks since
// all authentication is handled client-side with Bearer tokens
// ==========================================

import type { Handle } from '@sveltejs/kit';

// Empty handle - no server-side processing needed for SPA
export const handle: Handle = async ({ event, resolve }) => {
	return resolve(event);
};
