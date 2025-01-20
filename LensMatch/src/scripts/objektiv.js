import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

let scene, camera, renderer, controls;

// Init-Funktion für die 3D-Szene
export const initLensScene = (canvasId) => {
  const canvas = document.getElementById(canvasId); // Referenz zum Canvas-Element über die ID
  if (!canvas) {
    console.error(`Canvas mit ID '${canvasId}' nicht gefunden.`);
    return;
  }

  // Szene, Kamera und Renderer initialisieren
  scene = new THREE.Scene(); // Erstellen der 3D-Szene
  camera = new THREE.PerspectiveCamera(55, 1, 0.1, 1000); // Perspektivkamera mit FoV, Aspect-Ratio, Near- und Far-Clipping
  renderer = new THREE.WebGLRenderer({
    antialias: true, // Glättung der Kanten
    canvas: canvas, 
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x000000, 0); // Transparenter Hintergrund

  // Funktion: Renderer an Canvas-Größe anpassen
  const resizeRenderer = () => {
    const width = canvas.clientWidth; // Breite des Canvas
    const height = canvas.clientHeight; // Höhe des Canvas

    renderer.setSize(width, height, false); // Setzt die Größe des Renderers
    camera.aspect = width / height; // Aktualisiert das Seitenverhältnis der Kamera
    camera.updateProjectionMatrix(); // Aktualisiert die Kameraprojektion
  };

  resizeRenderer(); // Initiales Setzen der Größe
  window.addEventListener("resize", resizeRenderer); // Event-Listener für Fenster-Resize

// Startposition der Kamera
camera.position.set(6, 3, 0); // Kamera ist leicht von schräg oben vorne ausgerichtet

// Kamera-Bewegung mit der Maus steuern
controls = new OrbitControls(camera, renderer.domElement); // Verknüpft Kamera und Renderer mit den Maus-Interaktionen
controls.enableDamping = true; // Aktiviert die Trägheitseffekte bei der Bewegung
controls.dampingFactor = 0.05; // Trägheitsfaktor für glattere Bewegungen

// Deaktiviere Zoom und Panning (Hoch-/Runterbewegungen deaktivieren)
controls.enableZoom = false; // Verhindert das Zoomen mit der Maus
controls.enablePan = false; // Verhindert das Verschieben der Szene

// Begrenze die vertikale Drehung (Polarwinkel) auf einen Bereich von 45°
controls.minPolarAngle = Math.PI / 4; // Minimaler Winkel (45°)
controls.maxPolarAngle = Math.PI / 2.3; // Maximaler Winkel (90°)

// Fokuspunkt der Kamera setzen (z. B. auf das Zentrum des Objektivs)
controls.target.set(0, -0.5, 0); // Ziel auf die Mitte des Objekts setzen
controls.update(); // Aktualisiere die OrbitControls




  // *** Beleuchtung hinzufügen ***
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.5); // Umgebungslicht für gleichmäßige Grundbeleuchtung
  scene.add(ambientLight);

  const sunLight3 = new THREE.DirectionalLight(0x88f3ff, 15); 
  sunLight3.position.set(10, -30, 250); // Position des Lichts
  sunLight3.castShadow = true; // Aktiviert Schattenwurf
  scene.add(sunLight3);

  const sunLight4 = new THREE.DirectionalLight(0xffffff, 30); 
  sunLight4.position.set(130, -90, -120); // Position des Lichts
  sunLight4.castShadow = true; // Aktiviert Schattenwurf
  scene.add(sunLight4);

  const objectGroup = new THREE.Group(); 
  scene.add(objectGroup);

  // GLTFLoader für das 3D-Modell
  const loader = new GLTFLoader(); 
  loader.load(
    "/3D-Objekte/Objektiv/lens_verbunden_p1.glb", 
    (gltf) => {
      const model = gltf.scene; 

      // BoundingBox berechnen und Modell zentrieren
      const box = new THREE.Box3().setFromObject(model); 
      const center = box.getCenter(new THREE.Vector3()); 
      model.position.sub(center); // Verschiebt das Modell so, dass es im Ursprung zentriert ist

      objectGroup.add(model); // Hinzufügen des Modells zur Objektgruppe

      // Materialien bearbeiten
      model.traverse((child) => {
        if (child.isMesh) {
          // Prüfung, ob es sich um ein Mesh handelt
          switch (child.material.name) {
            case "Metallic-Schwarz": // 
              child.material.color = new THREE.Color(0x000000); 
              child.material.metalness = 0.96; 
              child.material.roughness = 0.33; 
              break;
            case "Font": // Material: Schrift
              child.material.color = new THREE.Color(0xffffff); 
              child.material.metalness = 0.5;
              child.material.roughness = 0.5;
              break;
            case "Gummierung": // Material: Gummi
              child.material.color = new THREE.Color(0x111111); 
              child.material.metalness = 0.25;
              child.material.roughness = 0.86;
              break;
            case "Glas": // Material: Glas
              child.material.color = new THREE.Color(0x88f3ff); 
              child.material.metalness = 0.95;
              child.material.roughness = 0.1;
              child.material.opacity = 0.7; 
              child.material.transparent = true; 
              child.material.side = THREE.DoubleSide; 
              child.material.alphaTest = .5;
              child.material.depthWrite = false;
              break;
            case "Procedual Rough Metal":
              child.material.color = new THREE.Color(0x000000);
              child.material.metalness = 0.96;
              child.material.roughness = 0.33;
              break;
            default:
              break;
          }
        }
      });
    },
    undefined,
    (error) => {
      console.error("Fehler beim Laden des GLB-Modells:", error); 
    }
  );

  // Wiederholte Aufrufe der Animation
  const animate = () => {
    requestAnimationFrame(animate); 
    controls.update(); // Aktualisierung der Kamera-Steuerung (OrbitControls)
    renderer.render(scene, camera); // Szene rendern
  };
  animate(); 
};
