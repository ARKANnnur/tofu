<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import gsap from 'gsap';
	import { FontLoader } from 'three/addons/loaders/FontLoader.js';
	import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

	let canvas;

	onMount(async () => {
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);

		// Scene setup
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(
			75,
			canvas.clientWidth / canvas.clientHeight,
			0.1,
			1000
		);
		scene.background = new THREE.Color(0xfff4d2);
		const renderer = new THREE.WebGLRenderer({
			canvas,
			antialias: true
		});

		renderer.setSize(canvas.clientWidth, canvas.clientHeight);
		// renderer.shadowMap.enabled = true; // activate shadows if needed
		// renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		const initialCamPosition = {
			x: 0,
			y: 0.5,
			z: 5
		};
		camera.position.set(initialCamPosition.x, initialCamPosition.y, initialCamPosition.z);
		const cameraLookAtTarget = new THREE.Vector3(0, 0, 0);
		camera.lookAt(cameraLookAtTarget);

		// Light
		const light = new THREE.DirectionalLight(0xffffff, 1);
		light.position.set(10, 20, 10);
		// light.castShadow = true;
		// light.shadow.mapSize.width = 1024;
		// light.shadow.mapSize.height = 1024;
		// light.shadow.camera.left = -20;
		// light.shadow.camera.right = 20;
		// light.shadow.camera.top = 20;
		// light.shadow.camera.bottom = -20;
		scene.add(light);

		const ambientLight = new THREE.AmbientLight(0x87ceeb, 0.5); // Sedikit biru langit
		scene.add(ambientLight);

		// Parameters for Tofu
		const NUM_TOFUS = 80;
		const tofuSize = { w: 3, h: 2, d: 3 };
		const tofuColor = 0xffffaa; // Warna tahu

		// Create common geometry and material for all tofus
		const tofuGeometry = new THREE.BoxGeometry(tofuSize.w, tofuSize.h, tofuSize.d);
		const tofuMaterial = new THREE.MeshStandardMaterial({ color: tofuColor }); // Use MeshStandardMaterial to react to light

		// Create InstancedMesh
		const tofuInstances = new THREE.InstancedMesh(tofuGeometry, tofuMaterial, NUM_TOFUS);
		// tofuInstances.castShadow = true; // If you know, it produces a shadow
		// tofuInstances.receiveShadow = true; // If you know, it receives shadows
		scene.add(tofuInstances);

		const spawnRange = {
			x: { min: -40, max: 40 },
			y: { min: -40, max: 40 },
			z: { min: -60, max: -5 }
		};

		const usedPositions = [];
		const minDistance = 15;

		function generateNonOverlappingPosition() {
			let tries = 0;
			while (tries < 500) {
				const pos = new THREE.Vector3(
					Math.random() * (spawnRange.x.max - spawnRange.x.min) + spawnRange.x.min,
					Math.random() * (spawnRange.y.max - spawnRange.y.min) + spawnRange.y.min,
					Math.random() * (spawnRange.z.max - spawnRange.z.min) + spawnRange.z.min
				);

				const isTooClose = usedPositions.some((p) => p.distanceTo(pos) < minDistance);
				if (!isTooClose) {
					usedPositions.push(pos);
					return pos;
				}
				tries++;
			}

			console.warn('Could not find non-overlapping position, using safe fallback.');
			const fallback = new THREE.Vector3(
				Math.random() * (spawnRange.x.max - spawnRange.x.min) + spawnRange.x.min,
				Math.random() * (spawnRange.y.max - spawnRange.y.min) + spawnRange.y.min,
				spawnRange.z.max // Forced in the back of the spawn range
			);
			usedPositions.push(fallback);
			return fallback;
		}

		// Store data for each instance (original position, current animated position, initial rotation)
		const instanceData = [];
		const dummy = new THREE.Object3D(); // Helper object for matrix calculation

		for (let i = 0; i < NUM_TOFUS; i++) {
			const center = generateNonOverlappingPosition();
			const radius = 1 + Math.random() * 2;
			const angle = Math.random() * Math.PI * 2;
			const orbitSpeed = 0.01 + Math.random() * 0.02;

			instanceData[i] = {
				center: center.clone(),
				radius: radius,
				orbitAngle: angle,
				orbitSpeed: orbitSpeed,
				initialRotation: new THREE.Quaternion().setFromEuler(
					new THREE.Euler(
						THREE.MathUtils.degToRad(Math.random() * 360),
						THREE.MathUtils.degToRad(Math.random() * 360),
						THREE.MathUtils.degToRad(Math.random() * 360)
					)
				)
			};

			const position = getOrbitPosition(center, radius, angle);
			dummy.position.copy(position);
			dummy.quaternion.copy(instanceData[i].initialRotation);
			dummy.updateMatrix();
			tofuInstances.setMatrixAt(i, dummy.matrix);
		}
		tofuInstances.instanceMatrix.needsUpdate = true;

		// Function to produce random offset from the base position
		function getOrbitPosition(center, radius, angle) {
			return new THREE.Vector3(
				center.x + radius * Math.cos(angle),
				center.y + radius * Math.sin(angle),
				center.z
			);
		}

		// --- Beginning Implementation of Camera Movement with Mouse ---
		const cameraMouseInfluence = {
			x: { current: 0, target: 0, ease: 0.1, sensitivity: 35 },
			y: { current: 0, target: 0, ease: 0.1, sensitivity: 9 },
			z: { current: 5, target: 0, ease: 0.1, sensitivity: 35 }
		};

		let trigger = false;

		// Mouse tracking
		let mouseX = 0;
		let mouseY = 0;
		const TRACKING_OFFSET = 0.25; // 25% The upper part is ignored
		const TRACKING_HEIGHT = 1 - TRACKING_OFFSET;

		const onMouseMove = (event) => {
			if (!canvas) return;
			const rect = canvas.getBoundingClientRect();
			const y = (event.clientY - rect.top) / rect.height;
			const nx = (event.clientX / canvas.clientWidth - 0.5) * 2;
			// Y tracking only the lower 75% area (25% offset from the top)
			let normalizedY = (y - TRACKING_OFFSET) / TRACKING_HEIGHT;
			normalizedY = Math.max(0, Math.min(1, normalizedY));

			mouseX = nx;
			mouseY = (0.5 - normalizedY) * 2;
		};
		window.addEventListener('mousemove', onMouseMove);
		// --- END IMPLEMENTATION OF CAMERA MOVEMENT WITH MOUSE ---

		const loader = new FontLoader();

		loader.load('/node_modules/three/examples/fonts/helvetiker_bold.typeface.json', (font) => {
			const words = ['Creamy', 'Soft', 'Silken', 'Protein Rich', 'Delicious', 'Plant Based'];
			const textMaterial = new THREE.MeshStandardMaterial({ color: 0x252525 });
			const positions = [
				new THREE.Vector3(0, 0, 0),
				new THREE.Vector3(-15, 5, -20),
				new THREE.Vector3(20, 10, -15),
				new THREE.Vector3(-3, -10, -20),
				new THREE.Vector3(-20, -20, -40),
				new THREE.Vector3(25, -20, -40)
			];
			words.forEach((word, i) => {
				const textGeometry = new TextGeometry(word, {
					font,
					size: 2,
					height: 0.5,
					depth: 0.5,
					curveSegments: 12,
					bevelEnabled: false,
					bevelSize: 0.02,
					bevelThickness: 0.03,
					bevelOffset: 0,
					bevelSegments: 4
				});
				textGeometry.computeVertexNormals(); // Prevent transparency
				const textMesh = new THREE.Mesh(textGeometry, textMaterial);
				textMesh.position.copy(positions[i]);
				scene.add(textMesh);
			});
		});

		ScrollTrigger.create({
			trigger: '.pin-tagline',
			start: '50% top',
			end: '+=100%',
			pin: true,
			scrub: 1,
			markers: true,
			onUpdate: (self) => {
				let spacerOpacity;
				trigger = self.progress > 0.1; // Check if the progress is greater than 0.1
				// console.log('Progress:', p);
				spacerOpacity = gsap.utils.mapRange(0, 1, 1, 0, self.progress);
				spacerOpacity = gsap.utils.clamp(0, 1, spacerOpacity); // Clamp to ensure valid range

				// Apply opacity directly to the spacer's style
				// self.spacer.style.opacity = spacerOpacity;

				gsap.set(camera.position, {
					z: gsap.utils.interpolate(cameraMouseInfluence.z.current, -50, self.progress),
					ease: 'none'
				});

				camera.updateProjectionMatrix();
			}
		});

		ScrollTrigger.refresh();

		function animate() {
			requestAnimationFrame(animate);
			for (let i = 0; i < NUM_TOFUS; i++) {
				const data = instanceData[i];
				data.orbitAngle += data.orbitSpeed;

				const position = getOrbitPosition(data.center, data.radius, data.orbitAngle);
				dummy.position.copy(position);
				dummy.quaternion.copy(data.initialRotation);
				dummy.updateMatrix();
				tofuInstances.setMatrixAt(i, dummy.matrix);
			}
			tofuInstances.instanceMatrix.needsUpdate = true;

			if (!trigger) {
				cameraMouseInfluence.x.current = gsap.utils.interpolate(
					cameraMouseInfluence.x.current,
					cameraMouseInfluence.x.target + mouseX,
					cameraMouseInfluence.x.ease
				);

				cameraMouseInfluence.y.current = gsap.utils.interpolate(
					cameraMouseInfluence.y.current,
					cameraMouseInfluence.y.target + mouseY,
					cameraMouseInfluence.y.ease
				);

				// New z calculation based on distance from (0, 0)
				const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY); // Euclidean distance
				const zBase = 5; // Minimum z value when x or y = 0
				cameraMouseInfluence.z.current = gsap.utils.interpolate(
					cameraMouseInfluence.z.current,
					zBase + distance * cameraMouseInfluence.z.sensitivity,
					cameraMouseInfluence.z.ease
				);

				camera.position.x = cameraMouseInfluence.x.current * cameraMouseInfluence.x.sensitivity;
				camera.position.y = cameraMouseInfluence.y.current * cameraMouseInfluence.y.sensitivity;
				camera.position.z = cameraMouseInfluence.z.current;
				camera.lookAt(-camera.position.x, -camera.position.y, -camera.position.z);
			}
			renderer.render(scene, camera);
		}
		animate();

		// Handle window resize
		const handleResize = () => {
			if (canvas && renderer && camera) {
				const width = canvas.clientWidth;
				const height = canvas.clientHeight;
				renderer.setSize(width, height);
				camera.aspect = width / height;
				camera.updateProjectionMatrix();
			}
		};
		window.addEventListener('resize', handleResize);

		// Cleanup
		return () => {
			ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
			window.removeEventListener('resize', handleResize);
			window.removeEventListener('mousemove', onMouseMove);
			tofuGeometry.dispose();
			tofuMaterial.dispose();
			// Stop all GSAP animations that may still be running
			gsap.killTweensOf(instanceData.map((d) => d.animatedPosition));
		};
	});
</script>

<canvas bind:this={canvas} class="h-full w-full text-sm"></canvas>
