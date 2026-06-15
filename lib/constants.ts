export const ADMIN_EMAIL = 'me@gmail.com';

export const isEmailAdmin = (email?: string | null) => {
  if (!email) return false;
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
};
