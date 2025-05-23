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
		// renderer.shadowMap.enabled = true; // Aktifkan jika menggunakan bayangan
		// renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		const initialCamPosition = {
			x: 0,
			y: 0.5,
			z: 5
		};
		camera.position.set(initialCamPosition.x, initialCamPosition.y, initialCamPosition.z);
		camera.lookAt(0, 2, 0);

		// Light
		const light = new THREE.DirectionalLight(0xffffff, 1);
		light.position.set(10, 20, 10);
		// light.castShadow = true; // Aktifkan jika ingin tahu menghasilkan bayangan
		// Atur properti bayangan jika castShadow = true
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
		const NUM_TOFUS = 24;
		const tofuSize = { w: 3, h: 2, d: 3 };
		const tofuColor = 0xffffaa; // Warna tahu

		// Create common geometry and material for all tofus
		const tofuGeometry = new THREE.BoxGeometry(tofuSize.w, tofuSize.h, tofuSize.d);
		const tofuMaterial = new THREE.MeshStandardMaterial({ color: tofuColor }); // Gunakan MeshStandardMaterial untuk bereaksi terhadap cahaya

		// Create InstancedMesh
		const tofuInstances = new THREE.InstancedMesh(tofuGeometry, tofuMaterial, NUM_TOFUS);
		// tofuInstances.castShadow = true; // Jika tahu menghasilkan bayangan
		// tofuInstances.receiveShadow = true; // Jika tahu menerima bayangan
		scene.add(tofuInstances);

		const spawnRange = {
			x: { min: -15, max: 15 },
			y: { min: -15, max: 10 },
			z: { min: -45, max: -15 }
		};

		const usedPositions = [];
		const minDistance = 10;

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
			console.warn('Could not find non-overlapping position, using fallback.');
			return new THREE.Vector3(0, 0, 0); // Fallback
		}

		// Store data for each instance (original position, current animated position, initial rotation)
		const instanceData = [];
		const dummy = new THREE.Object3D(); // Helper object for matrix calculation

		for (let i = 0; i < NUM_TOFUS; i++) {
			const position = generateNonOverlappingPosition();
			const randomRotationEuler = new THREE.Euler(
				THREE.MathUtils.degToRad(Math.random() * 360),
				THREE.MathUtils.degToRad(Math.random() * 360),
				THREE.MathUtils.degToRad(Math.random() * 360)
			);
			const quaternion = new THREE.Quaternion().setFromEuler(randomRotationEuler);

			instanceData[i] = {
				originalPosition: position.clone(),
				animatedPosition: position.clone(), // GSAP will animate this
				initialRotation: quaternion.clone()
			};

			// Set initial matrix for the instance
			dummy.position.copy(instanceData[i].animatedPosition);
			dummy.quaternion.copy(instanceData[i].initialRotation);
			dummy.updateMatrix();
			tofuInstances.setMatrixAt(i, dummy.matrix);
		}
		tofuInstances.instanceMatrix.needsUpdate = true;

		// Fungsi untuk menghasilkan offset acak dari posisi dasar
		function getRandomOffset(basePositionVec3, range = 0.8) {
			return new THREE.Vector3(
				basePositionVec3.x + (Math.random() - 0.5) * range * 2,
				basePositionVec3.y + (Math.random() - 0.5) * range * 2,
				basePositionVec3.z + (Math.random() - 0.5) * range * 2
			);
		}

		// Fungsi untuk memulai animasi acak untuk sebuah instance
		function startInstanceAnimation(index) {
			const data = instanceData[index];
			const targetPos = getRandomOffset(data.originalPosition, 0.8);

			gsap.to(data.animatedPosition, {
				// Animate the 'animatedPosition' Vector3
				x: targetPos.x,
				y: targetPos.y,
				z: targetPos.z,
				duration: 1.5 + Math.random() * 0.5,
				ease: 'sine.inOut',
				onUpdate: () => {
					dummy.position.copy(data.animatedPosition);
					dummy.quaternion.copy(data.initialRotation); // Rotation remains constant during this position animation
					dummy.updateMatrix();
					tofuInstances.setMatrixAt(index, dummy.matrix);
					tofuInstances.instanceMatrix.needsUpdate = true; // Signal Three.js to update the instance matrix
				},
				onComplete: () => {
					startInstanceAnimation(index); // Loop animation
				}
			});
		}

		// Mulai animasi untuk setiap instance
		for (let i = 0; i < NUM_TOFUS; i++) {
			startInstanceAnimation(i);
		}

		function animate() {
			requestAnimationFrame(animate);
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

		const loader = new FontLoader();

		loader.load(
			'https://codepen-alva.s3.eu-west-2.amazonaws.com/helvetiker_regular.typeface.json',
			function (font) {
				const textGeometry = new TextGeometry('Halo Dunia!', {
					font,
					size: 0.5,
					height: 0.4,
					curveSegments: 12,
					bevelEnabled: true,
					bevelSize: 0.02,
					bevelThickness: 0.03,
					bevelOffset: 0,
					bevelSegments: 4
				});

				const textMaterial = new THREE.MeshStandardMaterial({ color: 0x252525 });
				const textMesh = new THREE.Mesh(textGeometry, textMaterial);
				textMesh.position.set(0, 0, -50);
				scene.add(textMesh);
			}
		);

		// Cleanup
		return () => {
			ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
			window.removeEventListener('resize', handleResize);
			tofuGeometry.dispose();
			tofuMaterial.dispose();
			// Stop all GSAP animations that may still be running
			gsap.killTweensOf(instanceData.map((d) => d.animatedPosition));
		};
	});
</script>

<canvas bind:this={canvas} class="h-full w-full"></canvas>
