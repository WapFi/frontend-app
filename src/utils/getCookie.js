export function getCookie(name) {
  const allCookies = document.cookie.split('; ');
  for (let cookie of allCookies) {
    const [key, value] = cookie.split('=');
    if (key === name) return value;
  }
  return null;
}
