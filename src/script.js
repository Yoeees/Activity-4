import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

class RasenganVisualization {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);



        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        
        this.setupLights();
        this.createHand();
        this.createRasengan();
        this.animate();
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);
    }
    createHand() {
      const loader = new GLTFLoader();
      loader.load('models/Hand/Hand.glb', (gltf) => {
          const hand = gltf.scene;
  
          hand.scale.set(2.5, 2.5, 2.5); // Scale down for a closer, realistic perspective
          hand.position.set(1, -3, -3); // Move it closer to the camera (negative Z)
          hand.rotation.set(Math.PI / 6, Math.PI / 12, 0); // Tilt to mimic a holding pose
  
          this.hand = hand; // Store reference to animate later if needed
          this.scene.add(hand);
  
          // Position the Rasengan to appear floating in the palm
          if (this.rasenganGroup) {
              this.rasenganGroup.position.set(0,1.2, -2); // Align Rasengan with the hand's palm
          }
      });
  }
  
    createRasengan() {
        this.rasenganGroup = new THREE.Group();
        
        // Core particles
        const coreGeometry = new THREE.SphereGeometry(0.2, 32, 32);
        const coreMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x87CEEB, 
            emissive: 0x0044ff, 
            shininess: 100 
        });
        const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
        this.rasenganGroup.add(coreMesh);

        // Swirling particles
        this.particleSystem = this.createParticleSystem();
        this.rasenganGroup.add(this.particleSystem);

        this.scene.add(this.rasenganGroup);
        this.camera.position.z = 5;
    }

    createParticleSystem() {
        const particlesCount = 600;
        const positions = new Float32Array(particlesCount * 3);
        const colors = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount; i++) {
            const phi = Math.random() * Math.PI * 2;
            const theta = Math.random() * Math.PI;
            const radius = 0.5 + Math.random() * 0.2;

            positions[i * 3] = radius * Math.sin(theta) * Math.cos(phi);
            positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
            positions[i * 3 + 2] = radius * Math.cos(theta);

            // Blue-white gradient colors
            colors[i * 3] = 0.5 + Math.random() * 0.5;
            colors[i * 3 + 1] = 0.5 + Math.random() * 0.5;
            colors[i * 3 + 2] = 1;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({ 
            size: 0.02, 
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            transparent: true
        });

        return new THREE.Points(geometry, material);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        // Rotate Rasengan
        if (this.rasenganGroup) {
            this.rasenganGroup.rotation.x += 0.3;
            this.rasenganGroup.rotation.y += 0.5;
        }

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the visualization
new RasenganVisualization();
