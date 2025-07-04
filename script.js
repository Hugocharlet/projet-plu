var scale = 1,
    panning = false,
    pointX = 0,
    pointY = 0,
    start = { x: 0, y: 0 },
    initialDistance = 0,
    lastScale = 1;

const zoom = document.getElementById("zoom");
const zoom_outer = document.getElementById("zoom_outer");

function setTransform() {
  zoom.style.transform = `translate(${pointX}px, ${pointY}px) scale(${scale})`;
}

// --- Souris (mouse) ---
zoom.addEventListener("mousedown", function (e) {
  e.preventDefault();
  start = { x: e.clientX - pointX, y: e.clientY - pointY };
  panning = true;
});

window.addEventListener("mouseup", function () {
  panning = false;
});

zoom.addEventListener("mousemove", function (e) {
  e.preventDefault();
  if (!panning) return;

  pointX = e.clientX - start.x;
  pointY = e.clientY - start.y;
  setTransform();
});

zoom.addEventListener("wheel", function (e) {
  e.preventDefault();
  var xs = (e.clientX - pointX) / scale;
  var ys = (e.clientY - pointY) / scale;
  var delta = e.wheelDelta ? e.wheelDelta : -e.deltaY;
  (delta > 0) ? (scale *= 1.2) : (scale /= 1.2);

  // Limiter l'échelle
  scale = Math.min(Math.max(0.5, scale), 5);

  pointX = e.clientX - xs * scale;
  pointY = e.clientY - ys * scale;

  setTransform();
});

// --- Touch (mobile) ---

zoom.addEventListener("touchstart", function (e) {
  if (e.touches.length === 1) {
    // Un doigt = pan
    start = { x: e.touches[0].clientX - pointX, y: e.touches[0].clientY - pointY };
    panning = true;
  } else if (e.touches.length === 2) {
    // Deux doigts = pinch zoom
    panning = false;
    initialDistance = getDistance(e.touches[0], e.touches[1]);
    lastScale = scale;
  }
});

zoom.addEventListener("touchmove", function (e) {
  e.preventDefault();
  if (e.touches.length === 1 && panning) {
    // Pan à un doigt
    pointX = e.touches[0].clientX - start.x;
    pointY = e.touches[0].clientY - start.y;
    setTransform();
  } else if (e.touches.length === 2) {
    // Pinch zoom
    const currentDistance = getDistance(e.touches[0], e.touches[1]);
    let newScale = (currentDistance / initialDistance) * lastScale;

    // Limiter l'échelle
    newScale = Math.min(Math.max(0.5, newScale), 6);

    // Calcul du centre des deux doigts
    const midPoint = {
      x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
      y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
    };

    // Calcul coordonnées en relatif à l'image
    const xs = (midPoint.x - pointX) / scale;
    const ys = (midPoint.y - pointY) / scale;

    // Mise à jour de la position pour zoom centré
    pointX = midPoint.x - xs * newScale;
    pointY = midPoint.y - ys * newScale;

    scale = newScale;
    setTransform();
  }
});

zoom.addEventListener("touchend", function (e) {
  if (e.touches.length === 0) {
    panning = false;
  }
});

// Fonction utilitaire pour calculer la distance entre deux touches
function getDistance(touch1, touch2) {
  return Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
}
