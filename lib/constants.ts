export const ADMIN_EMAIL = 'tafs4918@gmail.com';

export const isEmailAdmin = (email?: string | null) => {
  if (!email) return false;
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
};
