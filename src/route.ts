/**
 * Routes used for authentication.
 * These routes redirects logged in users to /settings.
 * @type {string[]}
 */
export const authRoutes = [
  "/login",
  "/",
  "/signup",
  "/code",
  "/reset",
  "/update_password",
];

// export const adminRoutes = ["/dashboard", "/sold"];

/**
 * Route to redirect when a users successfully logs in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/dashboard";
export const DEFAULT_REDIRECT = "/login";
