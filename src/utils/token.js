export const AccessTokenCookie = {
  set(token, days = 7) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `access_token=${token}; expires=${expires}; path=/; Secure; SameSite=Strict`;
  },

  get() {
    return document.cookie.split("; ").reduce((r, c) => {
      const [key, v] = c.split("=");
      return key === "access_token" ? v : r;
    }, null);
  },

  delete() {
    document.cookie =
      "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure; SameSite=Strict";
  },
};
