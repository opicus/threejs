			import * as THREE from './build/three.module.js';

			import Stats from './jsm/libs/stats.module.js';

			import { OrbitControls } from './jsm/controls/OrbitControls.js';
			
			import { GLTFLoader } from './jsm/loaders/GLTFLoader.js';
			
			import { DRACOLoader } from './jsm/loaders/DRACOLoader.js';

			let camera, scene, renderer, stats;

			init();
			animate();

			function init() {

				const container = document.createElement( 'div' );
				document.body.appendChild( container );

				camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
				camera.position.set( 10, 0, 0 );

				scene = new THREE.Scene();
				scene.background = new THREE.Color( 0xa0a0a0 );
				scene.fog = new THREE.Fog( 0xa0a0a0, 200, 1000 );

				const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
				hemiLight.position.set( 0, 200, 0 );
				scene.add( hemiLight );

				
				// Instantiate a loader
				const loader = new GLTFLoader();

				// Optional: Provide a DRACOLoader instance to decode compressed mesh data
				const dracoLoader = new DRACOLoader();
				dracoLoader.setDecoderPath( '/draco/' );
				loader.setDRACOLoader( dracoLoader );

				// Load a glTF resource
				loader.load(
					// resource URL
					'models/gltf/compressed.gltf',
					// called when the resource is loaded
					function ( gltf ) {

						scene.add( gltf.scene );

						gltf.animations; // Array<THREE.AnimationClip>
						gltf.scene; // THREE.Group
						gltf.scenes; // Array<THREE.Group>
						gltf.cameras; // Array<THREE.Camera>
						gltf.asset; // Object

					},
					// called while loading is progressing
					function ( xhr ) {

						console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

					},
					// called when loading has errors
					function ( error ) {

						console.log( 'An error happened' );

					}
				);
				

				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.shadowMap.enabled = true;
				container.appendChild( renderer.domElement );

				const controls = new OrbitControls( camera, renderer.domElement );
				controls.target.set( 0, 0, 0 );
				controls.update();

				window.addEventListener( 'resize', onWindowResize );

				// stats
				stats = new Stats();
				container.appendChild( stats.dom );

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			//

			function animate() {

				requestAnimationFrame( animate );

				renderer.render( scene, camera );

				stats.update();

			}