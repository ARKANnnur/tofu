// @ts-nocheck

import * as THREE from 'three';

import * as CANNON from 'cannon-es';

// create object
export class Shape {
	constructor({
		x = 0,
		y = 0,
		z = 0,
		size = { w: 1, h: 1, d: 1 },
		color = 0xffffff,
		type = 'box',
		mass = 1, // for debugging
		rotation = null
	} = {}) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.size = size;
		this.color = color;
		this.type = type;
		this.mass = mass;
		this.startPosition = new CANNON.Vec3(x, y, z);
		this.rotation = rotation;

		this.mesh = this.draw();
		this.body = this.physic();

		if (this.rotation) {
			const { x, y, z } = this.rotation;
			const euler = new THREE.Euler(
				THREE.MathUtils.degToRad(x),
				THREE.MathUtils.degToRad(y),
				THREE.MathUtils.degToRad(z)
			);

			this.mesh.rotation.copy(euler); // THREE.js rotasi
			const quat = new CANNON.Quaternion();
			quat.setFromEuler(euler.x, euler.y, euler.z);
			this.body.quaternion.copy(quat); // CANNON rotasi
		}
	}

	draw() {
		const geometryBox = new THREE.BoxGeometry(this.size.w, this.size.h, this.size.d);
		const MaterialBox = new THREE.MeshStandardMaterial({ color: this.color });
		const meshBox = new THREE.Mesh(geometryBox, MaterialBox);
		meshBox.position.set(this.x, this.y, this.z);
		meshBox.castShadow = true;

		if (this.type === 'box') return meshBox;
	}

	physic() {
		const bodyBox = new CANNON.Body({
			mass: this.mass,
			position: new CANNON.Vec3(this.x, this.y, this.z),
			shape: new CANNON.Box(new CANNON.Vec3(this.size.w / 2, this.size.h / 2, this.size.d / 2)), // setengah ukuran box
			material: Shape.material,
			linearDamping: 0.8,
			angularDamping: 0.8
		});

		if (this.type === 'box') return bodyBox;
	}

	updateMeshFromBody() {
		this.mesh.position.copy(this.body.position);
		this.mesh.quaternion.copy(this.body.quaternion);
	}
}

Shape.material = new CANNON.Material();
