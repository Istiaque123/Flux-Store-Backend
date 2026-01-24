// ! src/common/http-status.ts

export const HTTP_STATUS = {
  // !───────────────────────────────────────────────
  // ! Success (2xx)
  // !───────────────────────────────────────────────
  OK: 200,                    // GET successful, general success
  CREATED: 201,               // POST → resource created
  ACCEPTED: 202,              // Request accepted, processing async (e.g. background job started)
  NO_CONTENT: 204,            // DELETE/PUT successful, no body returned

  // !───────────────────────────────────────────────
  // ! Client Errors (4xx) – most important for your API
  // !───────────────────────────────────────────────
  BAD_REQUEST: 400,           // Invalid input, validation failed, malformed request
  UNAUTHORIZED: 401,          // Authentication failed / no token / invalid token
  FORBIDDEN: 403,             // Authenticated but no permission (wrong role)
  NOT_FOUND: 404,             // Resource does not exist
  METHOD_NOT_ALLOWED: 405,    // Wrong HTTP method on endpoint
  CONFLICT: 409,              // Conflict (e.g. email already registered, version conflict)
  UNPROCESSABLE_ENTITY: 422,  // Semantic validation error (used by some APIs instead of 400)
  TOO_MANY_REQUESTS: 429,     // Rate limiting hit

  // !───────────────────────────────────────────────
  // ! Server Errors (5xx)
  // !───────────────────────────────────────────────
  INTERNAL_SERVER_ERROR: 500, // Generic server error (don't expose details!)
  NOT_IMPLEMENTED: 501,       // Feature not implemented yet
  BAD_GATEWAY: 502,           // Upstream service error (e.g. payment gateway failed)
  SERVICE_UNAVAILABLE: 503,   // Temporary outage, maintenance
  GATEWAY_TIMEOUT: 504,       // Upstream timed out
} as const;