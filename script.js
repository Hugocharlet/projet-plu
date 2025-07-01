var scale = 1,
panning = false,
pointX = 0,
pointY = 0,
start = { x: 0, y: 0 },
zoom = document.getElementById("zoom");
zoom_outer = document.getElementById("zoom_outer");
zoomInBtn = document.getElementById("zoom-in");
zoomOutBtn = document.getElementById("zoom-out");
img = document.querySelector('img')
const transparencySlider = document.getElementById("transparency-slider");
const topLayer = document.getElementById("top-layer");

transparencySlider.addEventListener("input", function (e) {
  const value = parseInt(e.target.value); // valeur entre 0 et 100
  const opacity = value / 100; // converti en 0.0 – 1.0
  topLayer.style.opacity = opacity;
});

function setTransform() {
zoom.style.transform = "translate(" + pointX + "px, " + pointY + "px) scale(" + scale + ")";

}
zoom.addEventListener("mousedown", function (e) {
    e.preventDefault();
    start = { x: e.clientX - pointX, y: e.clientY - pointY };
    panning = true;
  });
  

zoom.addEventListener("mouseup", function (e) {
    panning = false;

});

zoom.addEventListener("mousemove", function (e) {
    e.preventDefault();
    if (!panning) {
      return;
    }

      pointX = (e.clientX - start.x);
      pointY = (e.clientY - start.y);
      setTransform();

      });

zoom.addEventListener("wheel", function (e) {
    e.preventDefault();
    var xs = (e.clientX - pointX) / scale,
    ys = (e.clientY - pointY) / scale,
    delta = (e.wheelDelta ? e.wheelDelta : -e.deltaY);
  (delta > 0) ? (scale *= 1.2) : (scale /= 1.2);
  pointX = e.clientX - xs * scale;
  pointY = e.clientY - ys * scale;
  
  setTransform();
  });


 function changeOrigin() {
    const containerRect = zoom_outer.getBoundingClientRect();
    


    const originX = containerRect.width / 2;
    const originY = containerRect.height / 2;


    zoom.style.transformOrigin = `${originX}px ${originY}px`;

}

const zoomSlider = document.getElementById("zoom-slider");

zoomSlider.addEventListener("input", function (e) {
    const newScale = parseFloat(e.target.value); // récupère la valeur du slider
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
  
    // Recentrer sur le milieu de l'écran
    const xs = (containerWidth / 2 - pointX) / scale;
    const ys = (containerHeight / 2 - pointY) / scale;
  
    scale = newScale;
  
    pointX = containerWidth / 2 - xs * scale;
    pointY = containerHeight / 2 - ys * scale;
  
    setTransform();
  }); 

window.addEventListener('mousemove', (e)=>{


    const originX = window.innerWidth / 2;
    const originY = window.innerHeight / 2;
    

 });
 

