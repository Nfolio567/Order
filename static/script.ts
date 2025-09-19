window.addEventListener('DOMContentLoaded', () => {
  const headerBack = document.getElementById("headerBack");
  headerBack?.classList.add(location.pathname.substring(1));
});
