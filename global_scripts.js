document.addEventListener('DOMContentLoaded', () => {
  const loadComponent = async (id, file) => {
    const response = await fetch(file);
    if (response.ok) {
      document.getElementById(id).innerHTML = await response.text();
    }
  };

  loadComponent('navbar', '/components/navbar.html');
  loadComponent('footer', '/components/footer.html');
});
