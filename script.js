const container = document.getElementById('container');
const slider = document.getElementById('transparency-slider');
const topImage = document.querySelector('#top-layer img');

// === Transparence ===
slider.addEventListener('input', () => {
  topImage.style.opacity = slider.value / 100;
});

// === Variables Zoom & Pan ===
let scale = 1;
let originX = 0;
let originY = 0;
let isDragging = false;
let lastX = 0;
let lastY = 0;
let lastMouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 }; // Pour zoom boutons

function updateTransform() {
  const transform = `translate(${originX}px, ${originY}px) scale(${scale})`;
  document.querySelectorAll('.image-wrapper').forEach(el => {
    el.style.transform = transform;
  });
}

// === Zoom souris (molette) ===
container.addEventListener('wheel', e => {
  if (e.target.closest('#transparency-container')) return;
  e.preventDefault();

  const rect = container.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  lastMouse = { x: e.clientX, y: e.clientY }; // Mémorise pour les boutons

  const offsetX = (mouseX - originX) / scale;
  const offsetY = (mouseY - originY) / scale;

  const delta = e.deltaY > 0 ? -0.1 : 0.1;
  const newScale = Math.min(Math.max(0.1, scale + delta), 10);

  originX = mouseX - offsetX * newScale;
  originY = mouseY - offsetY * newScale;
  scale = newScale;

  updateTransform();
});

// === Pan souris ===
container.addEventListener('mousedown', e => {
  if (e.target.closest('#transparency-container')) return;
  isDragging = true;
  lastX = e.clientX;
  lastY = e.clientY;
  container.style.cursor = "grabbing";
});

container.addEventListener('mousemove', e => {
  lastMouse = { x: e.clientX, y: e.clientY }; // mise à jour position curseur
  if (!isDragging) return;
  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;
  originX += dx;
  originY += dy;
  lastX = e.clientX;
  lastY = e.clientY;
  updateTransform();
});

container.addEventListener('mouseup', () => {
  isDragging = false;
  container.style.cursor = "grab";
});

container.addEventListener('mouseleave', () => {
  isDragging = false;
  container.style.cursor = "grab";
});

// === Zoom boutons centré sur curseur ===
function zoomAtCursor(delta, clientX, clientY) {
  const rect = container.getBoundingClientRect();
  const mouseX = clientX - rect.left;
  const mouseY = clientY - rect.top;

  const offsetX = (mouseX - originX) / scale;
  const offsetY = (mouseY - originY) / scale;

  const newScale = Math.min(Math.max(0.1, scale + delta), 10);
  originX = mouseX - offsetX * newScale;
  originY = mouseY - offsetY * newScale;
  scale = newScale;

  updateTransform();
}

document.getElementById('zoom-in').addEventListener('click', () => {
  zoomAtCursor(0.1, lastMouse.x, lastMouse.y);
});

document.getElementById('zoom-out').addEventListener('click', () => {
  zoomAtCursor(-0.1, lastMouse.x, lastMouse.y);
});

// === Touch events (mobile : pinch zoom + pan) ===
let touchStartDist = null;
let initialScale = scale;

container.addEventListener('touchstart', e => {
  if (e.touches.length === 2) {
    touchStartDist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
    initialScale = scale;
  } else if (e.touches.length === 1 && !e.target.closest('#transparency-container')) {
    isDragging = true;
    lastX = e.touches[0].clientX;
    lastY = e.touches[0].clientY;
  }
}, { passive: false });

container.addEventListener('touchmove', e => {
  e.preventDefault();

  if (e.touches.length === 2 && touchStartDist) {
    const newDist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
    const zoomFactor = newDist / touchStartDist;
    scale = Math.min(Math.max(0.1, initialScale * zoomFactor), 10);
    updateTransform();
  } else if (e.touches.length === 1 && isDragging) {
    const dx = e.touches[0].clientX - lastX;
    const dy = e.touches[0].clientY - lastY;
    originX += dx;
    originY += dy;
    lastX = e.touches[0].clientX;
    lastY = e.touches[0].clientY;
    updateTransform();
  }
}, { passive: false });

container.addEventListener('touchend', () => {
  isDragging = false;
  touchStartDist = null;
});

// === Initialisation ===
updateTransform();
