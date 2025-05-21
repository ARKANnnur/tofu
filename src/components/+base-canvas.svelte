<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { degToRad } from 'three/src/math/MathUtils';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
	import gsap from 'gsap';
	import * as CANNON from 'cannon-es';
	import { Shape } from '../utils/shapebuild';

	let canvas;

	onMount(() => {
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
		camera.position.z = 5;
		camera.position.x = 2;
		camera.position.y = 3;
		camera.lookAt(0, 0, 0);

		const controls = new OrbitControls(camera, renderer.domElement);
		controls.target.set(0, 0, 0);
		controls.enableDamping = true;
		controls.dampingFactor = 0.05;
		controls.enableZoom = true;
		controls.enablePan = true;
		controls.minDistance = 5;
		controls.maxDistance = 250;

		// Light
		const light = new THREE.DirectionalLight(0xffffff, 1);
		light.position.set(10, 20, 5);
		light.castShadow = true;
		scene.add(light);

		const ambientLight = new THREE.AmbientLight(0x87ceeb, 5);
		scene.add(ambientLight);

		// Physics world setup
		const world = new CANNON.World({
			gravity: new CANNON.Vec3(0, 0, 0)
		});

		const groundBody = new CANNON.Body({
			mass: 0,
			shape: new CANNON.Plane()
		});
		groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
		world.addBody(groundBody);

		// Create tofu objects
		let tofuGroupBox = [];
		const tofuGroup = new THREE.Group();

		const tofu = new Shape({
			size: { w: 3, h: 2, d: 3 },
			type: 'box',
			mass: 0,
			color: 0xafa
		});

		const tofu1 = new Shape({
			size: { w: 3, h: 2, d: 3 },
			type: 'box',
			mass: 0,
			color: 0xaaf,
			x: -7,
			y: 2,
			z: -4,
			rotation: { x: 20, y: 0, z: 10 }
		});

		const tofu2 = new Shape({
			size: { w: 3, h: 2, d: 3 },
			type: 'box',
			mass: 0,
			color: 0xfaa,
			x: -5,
			y: 2,
			z: -15,
			rotation: { x: 20, y: 0, z: 10 }
		});

		const tofu3 = new Shape({
			size: { w: 3, h: 2, d: 3 },
			type: 'box',
			mass: 0,
			color: 0xffa,
			x: 2,
			y: 2,
			z: -7,
			rotation: { x: 10, y: -25, z: -10 }
		});

		// Add to group and physics world
		tofuGroup.add(tofu.mesh, tofu1.mesh, tofu2.mesh, tofu3.mesh);
		tofuGroupBox.push(tofu, tofu1, tofu2, tofu3);
		world.addBody(tofu.body, tofu1.body, tofu2.body, tofu3.body);
		scene.add(tofuGroup);

		const timeStep = 1 / 120;

		function animate() {
			requestAnimationFrame(animate);
			controls.update();
			world.step(timeStep);
			tofuGroupBox.forEach((tofu) => {
				tofu.updateMeshFromBody();
			});

			renderer.render(scene, camera);
		}
		animate();
	});
</script>

<canvas bind:this={canvas} class="h-full w-full"></canvas>
