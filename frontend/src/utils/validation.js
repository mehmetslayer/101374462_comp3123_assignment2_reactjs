// same rules as the backend validators; the backend still has the final say
export const EMAIL_RE = /^\S+@\S+\.\S+$/;
export const PASSWORD_RE = /^(?=.*[A-Za-z])(?=.*\d).{8,50}$/;
export const USERNAME_RE = /^\S{3,50}$/;