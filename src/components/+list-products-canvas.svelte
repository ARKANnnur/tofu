<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import gsap from 'gsap';
	import { FontLoader } from 'three/addons/loaders/FontLoader.js';
	import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
	import { Shape } from '../utils/shape-build';
	let canvas;
	let currentTextIndex = $state(0);

	let scene; // Declare in higher scope
	let camera;
	let renderer;
	let loadedFont; // Store loaded font
	let textMeshes = []; // Array to store active text meshes
	let textMaterial; // Define material once if it's the same

	const words = [
		'Uses \nTofu Puding \nMisso Soup \nSalad',
		'Silken Tofu \nSmooth and creamy, \nperfect for blending into \nsmoothies, desserts, or \nsauces. Ideal for dishes \nneeding a delicate texture.',
		'Uses \nVeggie stir-fry \nfried tofu bites \nor tofu skewers.',
		'Firm Tofu \nDense and versatile \ngreat for frying, baking, \nor stir-frying. \nAbsorbs flavors beautifully.',
		'Extra-Firm Tofu \nUltra-dense, perfect \nfor grilling or dishes \nwhere tofu needs to \nhold its shape. A go-to \nfor high-protein meals.',
		'Uses \nTofu steaks \nBBQ skewers \nmeat substitutes.'
	];

	const textPositions = [
		// Change 'positions' name to avoid conflict
		new THREE.Vector3(0, 0, -15),
		new THREE.Vector3(20, 0, -5),
		new THREE.Vector3(0, -20, -15),
		new THREE.Vector3(20, -20, -5),
		new THREE.Vector3(0, -40, -15),
		new THREE.Vector3(20, -40, -5)
	];

	const textRotations = [
		// Change 'rotation' name
		new THREE.Euler(
			THREE.MathUtils.degToRad(0),
			THREE.MathUtils.degToRad(0),
			THREE.MathUtils.degToRad(0)
		),
		new THREE.Euler(
			THREE.MathUtils.degToRad(0),
			THREE.MathUtils.degToRad(-70),
			THREE.MathUtils.degToRad(0)
		),
		new THREE.Euler(
			THREE.MathUtils.degToRad(0),
			THREE.MathUtils.degToRad(0),
			THREE.MathUtils.degToRad(0)
		),
		new THREE.Euler(
			THREE.MathUtils.degToRad(0),
			THREE.MathUtils.degToRad(-70),
			THREE.MathUtils.degToRad(0)
		),
		new THREE.Euler(
			THREE.MathUtils.degToRad(0),
			THREE.MathUtils.degToRad(0),
			THREE.MathUtils.degToRad(0)
		),
		new THREE.Euler(
			THREE.MathUtils.degToRad(0),
			THREE.MathUtils.degToRad(-70),
			THREE.MathUtils.degToRad(0)
		)
	];

	// Function to create or update text
	function updateTexts() {
		if (!scene || !loadedFont || !textMaterial) return; // Make sure everything is ready

		// 1. Remove old text meshes from scene and array
		textMeshes.forEach((mesh) => {
			scene.remove(mesh);
			mesh.geometry.dispose(); // Important to free GPU memory
			// Material doesn't need to be disposed if it will be reused
		});
		textMeshes = []; // Empty the array

		// 2. Create new text meshes based on currentTextIndex
		// Assuming you want to display two texts at once, e.g. words[currentTextIndex] and words[currentTextIndex + 1]
		const textsToShowIndices = [currentTextIndex, currentTextIndex + 1];

		textsToShowIndices.forEach((wordIdx, i) => {
			if (wordIdx >= words.length) return; // Avoid error if index is out of bounds

			const geometry = new TextGeometry(words[wordIdx], {
				font: loadedFont,
				size: 1.5,
				height: 0.5,
				depth: 0.5,
				curveSegments: 12,
				bevelEnabled: false
			});
			geometry.computeBoundingBox();
			geometry.center();

			const mesh = new THREE.Mesh(geometry, textMaterial);
			// Use index `i` for position and rotation (0 for first text, 1 for second text in current pair)
			// or set `textPositions` and `textRotations` to match `wordIdx`
			if (textPositions[wordIdx] && textRotations[wordIdx]) {
				// Make sure position/rotation data exists
				mesh.position.copy(textPositions[wordIdx]);
				mesh.rotation.copy(textRotations[wordIdx]);
			} else {
				// Fallback or default logic if position/rotation is not defined for wordIdx
				// For example, you might want to use i to select from a smaller array of positions/rotations
				// that only defines relative positions for text pairs
				if (i < textPositions.length && i < textRotations.length) {
					// Fallback example
					mesh.position.copy(textPositions[i]); // Using positions 0 and 1 from array
					mesh.rotation.copy(textRotations[i]);
				}
			}

			mesh.castShadow = true;
			scene.add(mesh);
			textMeshes.push(mesh); // Add to array for management
		});
	}

	// Use $effect to call updateTexts when currentTextIndex changes
	$effect(() => {
		console.log('currentTextIndex changed to:', currentTextIndex);
		if (loadedFont && scene && textMaterial) {
			// Make sure font is loaded before trying to update
			updateTexts();
		}
	});

	onMount(async () => {
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);

		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
		scene.background = new THREE.Color(0xfff4d2);
		renderer = new THREE.WebGLRenderer({
			canvas,
			antialias: true
		});

		renderer.setSize(canvas.clientWidth, canvas.clientHeight);
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		renderer.shadowMap.enabled = true;

		const initialCamPosition = { x: 0, y: 5, z: 5 };
		camera.position.set(initialCamPosition.x, initialCamPosition.y, initialCamPosition.z);
		camera.lookAt(3, 3, 0);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
		directionalLight.position.set(10, 15, 10);
		directionalLight.castShadow = true;
		scene.add(directionalLight);

		const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x888888, 0.8);
		scene.add(hemisphereLight);

		const tofu = new Shape({
			size: { w: 6, h: 3, d: 6 },
			type: 'box',
			color: 0xffffaa,
			x: 3,
			y: 0,
			z: -3,
			rotation: { x: 15, y: 20, z: -15 }
		});
		scene.add(tofu.mesh);

		textMaterial = new THREE.MeshStandardMaterial({
			color: 0x252525,
			metalness: 0.9,
			roughness: 0.1,
			side: THREE.DoubleSide
		});

		const fontLoader = new FontLoader();
		fontLoader.load(
			'/node_modules/three/examples/fonts/helvetiker_regular.typeface.json',
			(font) => {
				loadedFont = font; // Store loaded font
				updateTexts(); // Call updateTexts for initial text render
			}
		);

		gsap.timeline({
			scrollTrigger: {
				trigger: '.list-products',
				start: 'top top',
				end: '+=600%',
				pin: true,
				scrub: 3.0,
				markers: { indent: 300 },
				onUpdate: (self) => {
					const progress = self.progress;
					const angle = progress * Math.PI * 2 * 3;
					const radius = 10;

					const x = Math.cos(angle) * radius;
					const z = Math.sin(angle) * radius;

					camera.position.set(
						initialCamPosition.x + x,
						initialCamPosition.y + -(60 * progress),
						initialCamPosition.z + z
					);
					camera.lookAt(3, 3 + -(60 * progress), 0);

					if (progress > 0) {
						gsap.to(tofu.mesh.position, {
							z: 3,
							y: 0 + -(60 * progress),
							duration: 1,
							ease: 'power3.out'
						});

						gsap.to(tofu.mesh.rotation, {
							y: progress * Math.PI * 2,
							duration: 1,
							ease: 'none'
						});
					}

					// Logic to change currentTextIndex based on progress
					// For example, there are 3 pairs of text (words[0]/[1], words[2]/[3], words[4]/[5])
					// Total words.length = 6. Text pairs are 6/2 = 3.
					// Each pair is displayed for (1 / 3) of total progress.
					const numTextPairs = Math.floor(words.length / 2);
					const progressPerPair = 1 / numTextPairs;

					let newTextIndex = 0;
					if (progress < progressPerPair) {
						// First pair (index 0)
						newTextIndex = 0;
					} else if (progress < progressPerPair * 2) {
						// Second pair (index 2)
						newTextIndex = 2;
					} else if (progress < progressPerPair * 3) {
						// Third pair (index 4)
						newTextIndex = 4;
					}
					// Add more else if for more pairs
					// else {
					// newTextIndex = (numTextPairs - 1) * 2; // Last text if progress approaches 1
					// }

					if (currentTextIndex !== newTextIndex) {
						currentTextIndex = newTextIndex;
					}
				}
			}
		});
		// .to() that you had before might not be needed if all animations
		// and text state changes are controlled in one main ScrollTrigger onUpdate.
		// If you need it, make sure the logic is properly integrated.

		function animate() {
			requestAnimationFrame(animate);
			if (renderer && scene && camera) {
				// Make sure initialized
				renderer.render(scene, camera);
			}
		}
		animate();

		return () => {
			ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
			// Do Three.js cleanup if needed (dispose geometries, materials, renderer)
			if (renderer) renderer.dispose();
			textMeshes.forEach((mesh) => {
				if (mesh.geometry) mesh.geometry.dispose();
				// Don't dispose material if still used elsewhere or redefined when component mounts again
			});
			if (textMaterial) textMaterial.dispose();
			// scene.traverse can be used to dispose all objects in scene
		};
	});
</script>

<canvas bind:this={canvas} class="h-full w-full"></canvas>
