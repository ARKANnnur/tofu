<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import gsap from 'gsap';
	import { Shape } from '../utils/tester';

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
		// scene.background = new THREE.Color(0xfff4d2);
		scene.background = new THREE.Color(0xfff4);
		const renderer = new THREE.WebGLRenderer({
			canvas,
			antialias: true
		});

		renderer.setSize(canvas.clientWidth, canvas.clientHeight);
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		const initialCamPosition = {
			x: 5.5,
			y: 5,
			z: 4
		};
		camera.position.set(initialCamPosition.x, initialCamPosition.y, initialCamPosition.z);
		camera.lookAt(0, 0, 0);

		// Light
		const light = new THREE.DirectionalLight(0xffffff, 1);
		light.position.set(10, 20, 5);
		light.castShadow = true;
		// light.shadow.mapSize.width = 512;
		// light.shadow.mapSize.height = 512;
		scene.add(light);

		const ambientLight = new THREE.AmbientLight(0x87ceeb, 0.5);
		scene.add(ambientLight);

		// Create tofu objects with original positions
		let tofuGroupBox = [];
		const tofuGroup = new THREE.Group();

		const tofu = new Shape({
			size: { w: 3, h: 2, d: 3 },
			type: 'box',
			color: 0xafa,
			x: 3,
			y: 2,
			z: 0
		});

		const tofu1 = new Shape({
			size: { w: 3, h: 2, d: 3 },
			type: 'box',
			color: 0xaaf,
			x: -5,
			y: 2,
			z: -5,
			rotation: { x: 10, y: 30, z: 10 }
		});

		const tofu2 = new Shape({
			size: { w: 3, h: 2, d: 3 },
			type: 'box',
			color: 0xfaa,
			x: -5,
			y: 2,
			z: -25,
			rotation: { x: -20, y: -30, z: 10 }
		});

		const tofu3 = new Shape({
			size: { w: 3, h: 2, d: 3 },
			type: 'box',
			color: 0xffa,
			x: 4,
			y: 2,
			z: -10,
			rotation: { x: 0, y: -5, z: -20 }
		});

		// Add to group
		// Fungsi untuk menghasilkan posisi acak dalam rentang kecil
		function getRandomOffset(basePosition, range = 0.5) {
			return {
				x: basePosition.x + (Math.random() - 0.5) * range * 2,
				y: basePosition.y + (Math.random() - 0.5) * range * 2,
				z: basePosition.z + (Math.random() - 0.5) * range * 2
			};
		}

		// Fungsi untuk memulai animasi acak
		function startRandomAnimation(tofuMesh, originalPos) {
			const targetPos = getRandomOffset(originalPos, 0.1); // Rentang ±0.5 unit
			gsap.to(tofuMesh.position, {
				x: targetPos.x,
				y: targetPos.y,
				z: targetPos.z,
				duration: 1.5 + Math.random() * 0.5, // Durasi acak 1.5-2 detik
				ease: 'sine.inOut',
				onComplete: () => {
					// Lanjutkan ke posisi acak berikutnya
					startRandomAnimation(tofuMesh, originalPos);
				}
			});
		}

		// Add to group and start random animations
		tofuGroupBox = [tofu, tofu1, tofu2, tofu3];
		tofuGroupBox.forEach((t) => {
			tofuGroup.add(t.mesh);
			// Mulai animasi acak
			startRandomAnimation(t.mesh, t.mesh.userData.originalPosition);
		});
		scene.add(tofuGroup);

		const proxy = {
			progress: 0,
			cameraX: initialCamPosition.x,
			scale: 1,
			zIndex: 0
		};

		ScrollTrigger.create({
			trigger: '.tofu-canvas-trigger',
			start: 'top top',
			end: '+=100%',
			scrub: 1,
			pin: true,
			markers: true,
			onUpdate: (self) => {
				proxy.progress = self.progress;

				// Animasi scale dengan GSAP
				gsap.to(tofu.mesh.scale, {
					x: gsap.utils.interpolate(1, 50, proxy.progress),
					y: gsap.utils.interpolate(1, 50, proxy.progress),
					duration: 0.1
				});

				// Animasi posisi kamera dengan GSAP
				gsap.to(camera.position, {
					x: gsap.utils.interpolate(initialCamPosition.x, 0, proxy.progress),
					y: gsap.utils.interpolate(initialCamPosition.y, 0, proxy.progress),
					z: gsap.utils.interpolate(initialCamPosition.z, 4, proxy.progress),
					duration: 0.1,
					onUpdate: () => {
						camera.lookAt(0, 0, 0);
						camera.updateProjectionMatrix();
					}
				});
				const pos = document.getElementsByClassName('position-index')
				console.log(pos.style.zIndex);

				// Update z-index
				gsap.to('.position-index', {
					zIndex: gsap.utils.interpolate(0, 99999, proxy.progress)
				});
				// canvas.style.z = Math.floor(gsap.utils.interpolate(0, 99999, proxy.progress));
			}
		});

		// gsap.to(tofu.mesh.scale, {
		// 	x: 50,
		// 	y: 50,
		// 	scrollTrigger: {
		// 		trigger: '.tofu-canvas-trigger',
		// 		start: 'top top',
		// 		end: '+=100%',
		// 		scrub: 1,
		// 		pin: false,
		// 		markers: true,
		// 		onUpdate: () => console.log('scale')
		// 	}
		// });
		// const proxy = { x: camera.position.x };
		// gsap.to(proxy, {
		// 	x: 0,
		// 	scrollTrigger: {
		// 		trigger: '.tofu-canvas-trigger',
		// 		start: 'top top',
		// 		end: '+=200%',
		// 		scrub: 1,
		// 		pin: false,
		// 		markers: true,
		// 		onUpdate: () => {
		// 			camera.position.x = proxy.x;
		// 			console.log(camera.position);
		// 		}
		// 	}
		// });
		// gsap.to(canvas.style, {
		// 	zIndex: 99999,
		// 	scrollTrigger: {
		// 		trigger: '.tofu-canvas-trigger',
		// 		start: 'top top',
		// 		end: '+=200%',
		// 		scrub: 1,
		// 		pin: false,
		// 		markers: true,
		// 		onUpdate: () => console.log(canvas.style.zIndex)
		// 	}
		// });
		ScrollTrigger.refresh();

		// Drag mechanics
		const raycaster = new THREE.Raycaster();
		const mouse = new THREE.Vector2();
		let isDragging = false;
		let dragOffset = new THREE.Vector3();
		let selectedTofu = null;

		// Convert mouse coordinates relative to canvas
		function getCanvasRelativeMouse(event) {
			const rect = canvas.getBoundingClientRect();
			return {
				x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
				y: -((event.clientY - rect.top) / rect.height) * 2 + 1
			};
		}

		// Mouse movement handler
		function onMouseMove(event) {
			const mousePos = getCanvasRelativeMouse(event);
			mouse.x = mousePos.x;
			mouse.y = mousePos.y;

			if (isDragging && selectedTofu) {
				raycaster.setFromCamera(mouse, camera);

				// Create a dragging plane at a fixed distance
				const cameraDirection = new THREE.Vector3();
				camera.getWorldDirection(cameraDirection);
				const dragPlane = new THREE.Plane(cameraDirection, -5);

				const intersection = new THREE.Vector3();
				if (raycaster.ray.intersectPlane(dragPlane, intersection)) {
					// Apply offset correction
					const targetPosition = intersection.sub(dragOffset);

					// Axis constraints
					const maxZMovement = 5;
					targetPosition.z = Math.max(-maxZMovement, Math.min(maxZMovement, targetPosition.z));

					// Apply movement with low resistance
					const currentPos = selectedTofu.position.clone();
					const resistance = {
						x: 0.8,
						y: 0.8,
						z: 0.4
					};

					const newPos = new THREE.Vector3(
						currentPos.x + (targetPosition.x - currentPos.x) * resistance.x,
						currentPos.y + (targetPosition.y - currentPos.y) * resistance.y,
						currentPos.z + (targetPosition.z - currentPos.z) * resistance.z
					);

					// Smooth transition with GSAP
					gsap.to(selectedTofu.position, {
						x: newPos.x,
						y: newPos.y,
						z: newPos.z,
						duration: 0.4,
						ease: 'power2.out'
					});
				}
			}
		}

		function onMouseDown(event) {
			const mousePos = getCanvasRelativeMouse(event);
			mouse.x = mousePos.x;
			mouse.y = mousePos.y;

			raycaster.setFromCamera(mouse, camera);
			const intersects = raycaster.intersectObjects(
				tofuGroupBox.map((t) => t.mesh),
				true
			);

			if (intersects.length > 0) {
				const clickedMesh = intersects[0].object;
				const index = tofuGroupBox.findIndex((t) => t.mesh === clickedMesh);
				if (index === -1) {
					console.error('Tofu not found in tofuGroupBox:', clickedMesh);
					return;
				}

				isDragging = true;
				selectedTofu = clickedMesh;

				const intersectPoint = intersects[0].point;
				dragOffset = intersectPoint.clone().sub(selectedTofu.position);

				// Visual feedback
				// selectedTofu.material.color.set(0xffff00);
				// console.log('Dragging tofu:', index, 'at position:', selectedTofu.position);
			} else {
				console.log('No tofu clicked at mouse position:', mouse);
			}
		}

		function onMouseUp() {
			if (isDragging && selectedTofu) {
				isDragging = false;

				// Restore original color
				const index = tofuGroupBox.findIndex((t) => t.mesh === selectedTofu);
				selectedTofu.material.color.set(tofuGroupBox[index].mesh.userData.originalColor);

				// Spring back to original position
				const originalPos = tofuGroupBox[index].mesh.userData.originalPosition;
				// console.log('Returning tofu', index, 'to:', originalPos);

				gsap.to(selectedTofu.position, {
					x: originalPos.x,
					y: originalPos.y,
					z: originalPos.z,
					duration: 1.5,
					ease: 'elastic.out(1, 0.5)', // Efek karet untuk magnet
					onComplete: () => {
						// Pastikan posisi akhir tepat
						selectedTofu.position.set(originalPos.x, originalPos.y, originalPos.z);
						// console.log('Tofu', index, 'returned to:', selectedTofu.position);
					}
				});

				selectedTofu = null;
			}
		}

		// Event listeners on canvas
		canvas.addEventListener('mousemove', onMouseMove, false);
		canvas.addEventListener('mousedown', onMouseDown, false);
		canvas.addEventListener('mouseup', onMouseUp, false);

		// Handle window resize
		window.addEventListener('resize', () => {
			const w = canvas.clientWidth;
			const h = canvas.clientHeight;
			camera.aspect = w / h;
			camera.updateProjectionMatrix();
			renderer.setSize(w, h);
			renderer.setPixelRatio(window.devicePixelRatio);
		});

		// Add debug visuals
		// const axesHelper = new THREE.AxesHelper(5);
		// scene.add(axesHelper);
		// const gridHelper = new THREE.GridHelper(20, 20);
		// scene.add(gridHelper);

		function animate() {
			requestAnimationFrame(animate);
			camera.updateProjectionMatrix();
			renderer.render(scene, camera);
		}
		animate();

		// Cleanup
		return () => {
			ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
			canvas.removeEventListener('mousemove', onMouseMove);
			canvas.removeEventListener('mousedown', onMouseDown);
			canvas.removeEventListener('mouseup', onMouseUp);
		};
	});
</script>

<canvas bind:this={canvas} class="h-full w-full"></canvas>
