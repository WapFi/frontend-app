export function getCookie(name) {
  const allCookies = document.cookie.split('; ');
  for (let cookie of allCookies) {
    const [key, value] = cookie.split('=');
    if (key === name) return value;
  }
  return null;
}


//  export function getCookie(name) {
//     const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
//     return match ? match[2] : null;
//   };
