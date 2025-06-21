export function getShortName(user) {
  if (!user) return '';

  const name = user.name?.trim() || '';
  const surname = user.surname?.trim() || '';

  if (!name && !surname) return '';

  return `${name.charAt(0) || ''}${surname.charAt(0) || ''}`.toUpperCase();
}
