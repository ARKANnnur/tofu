// @ts-nocheck
import * as THREE from 'three';

export class Shape {
	constructor({
		x = 0,
		y = 0,
		z = 0,
		size = { w: 1, h: 1, d: 1 },
		color = 0xffffff,
		type = 'box',
		rotation = null,
		opacity = 1,
		transparent = true,
	} = {}) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.size = size;
		this.color = color;
		this.type = type;
		this.rotation = rotation;
		this.opacity = opacity;
		this.transparent = transparent;

		this.mesh = this.draw();
	}

	draw() {
		const geometryBox = new THREE.BoxGeometry(this.size.w, this.size.h, this.size.d);
		const materialBox = new THREE.MeshStandardMaterial({ color: this.color, transparent: this.transparent, opacity: this.opacity });
		const meshBox = new THREE.Mesh(geometryBox, materialBox);
		meshBox.position.set(this.x, this.y, this.z);
		meshBox.castShadow = true;
		meshBox.receiveShadow = true;
		meshBox.userData.originalColor = this.color;
		meshBox.userData.originalPosition = new THREE.Vector3(this.x, this.y, this.z);

		if (this.rotation) {
			const { x, y, z } = this.rotation;
			const euler = new THREE.Euler(
				THREE.MathUtils.degToRad(x),
				THREE.MathUtils.degToRad(y),
				THREE.MathUtils.degToRad(z)
			);
			meshBox.rotation.copy(euler);
		}

		if (this.type === 'box') return meshBox;
	}
}
