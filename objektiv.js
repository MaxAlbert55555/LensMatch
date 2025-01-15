    // Szene, Kamera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 1000); // Platzhalter-Seitenverhältnis
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: document.getElementById('lensCanvas') });
    renderer.setPixelRatio(window.devicePixelRatio); // Hohe Pixeldichte
    renderer.setClearColor(0x000000, 0); // Transparenter Hintergrund

    // Funktion, um Renderer-Größe an Canvas-Größe anzupassen
    const resizeRenderer = () => {
        const canvas = renderer.domElement; // Das Canvas-Element
        const width = canvas.clientWidth; // Breite aus CSS
        const height = canvas.clientHeight; // Höhe aus CSS

        renderer.setSize(width, height, false); // Renderer-Größe anpassen
        camera.aspect = width / height; // Kamera-Seitenverhältnis anpassen
        camera.updateProjectionMatrix(); // Kamera-Projektionsmatrix aktualisieren
    };

    // Initiale Größenanpassung und Event-Listener
    resizeRenderer();
    window.addEventListener('resize', resizeRenderer); // Reaktion auf Fenstergrößenänderung

    // OrbitControls für Mausinteraktionen
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Sanfte Bewegungen
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 1;
    controls.maxDistance = 10;

    // Lichter
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5); // Helles Umgebungslicht
    scene.add(ambientLight);

    const sunLight1 = new THREE.DirectionalLight(0x88f3ff, 5);
    sunLight1.position.set(20, 20, 20);
    sunLight1.castShadow = true;
    scene.add(sunLight1);

    const sunLight2 = new THREE.DirectionalLight(0xfffff, 2);
    sunLight2.position.set(-20, 20, 20);
    sunLight2.castShadow = true;
    scene.add(sunLight2);

    const sunLight3 = new THREE.DirectionalLight(0x88f3ff, 5);
    sunLight3.position.set(-20, -20, 20);
    sunLight3.castShadow = true;
    scene.add(sunLight3);

    const sunLight4 = new THREE.DirectionalLight(0xffffff, 20);
    sunLight4.position.set(20, -20, 20);
    sunLight4.castShadow = true;
    scene.add(sunLight4);

    // Objektgruppe
    const objectGroup = new THREE.Group();
    scene.add(objectGroup);

    // GLTFLoader
    const loader = new THREE.GLTFLoader();
    loader.load('/3D-Objekte/Objektiv/lens_verbunden_p1.glb', (gltf) => {
        const model = gltf.scene;

        // Berechne die BoundingBox des Modells
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());

        // Verschiebe das Modell, sodass der Ursprung in der Mitte liegt
        model.position.sub(center);

        objectGroup.add(model); // Modell zur Gruppe hinzufügen

        model.traverse((child) => {
            if (child.isMesh) {
                if (child.material.name === "Metallic-Schwarz") {
                    child.material.color = new THREE.Color(0x000000);
                    child.material.metalness = 0.96;
                    child.material.roughness = 0.33;
                } else if (child.material.name === "Font") {
                    child.material.color = new THREE.Color(0xffffff);
                    child.material.metalness = 0.5;
                    child.material.roughness = 0.5;
                } else if (child.material.name === "Gummierung") {
                    child.material.color = new THREE.Color(0x111111);
                    child.material.metalness = 0.25;
                    child.material.roughness = 0.86;
                } else if (child.material.name === "Glas") {
                    child.material.color = new THREE.Color(0xaaaaaa);
                    child.material.metalness = 1;
                    child.material.roughness = 0.05;
                    child.material.opacity = 0.5;
                    child.material.transparent = true;
                    child.material.side = THREE.DoubleSide;
                    child.material.alphaTest = 0.1;
                    child.material.depthWrite = false;
                } else if (child.material.name === "Procedual Rough Metal") {
                    child.material.color = new THREE.Color(0x000000);
                    child.material.metalness = 0.96;
                    child.material.roughness = 0.33;
                }
            }
        });
    }, undefined, (error) => {
        console.error('Fehler beim Laden des GLB-Modells:', error);
    });

    camera.position.set(5, 3, 0);

    // Animationsschleife
    const animate = () => {
        requestAnimationFrame(animate); // Nächster Frame
        controls.update(); // Aktualisiere die Steuerung
        renderer.render(scene, camera); // Szene rendern
    };
    animate(); // Starte Animation
