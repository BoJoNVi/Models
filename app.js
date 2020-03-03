//------------------Scene & Camera------------------
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 30;

//------------------Drawables------------------
//Model
var loader = new THREE.GLTFLoader();

loader.load( 'Models/Anime/scene.gltf', function ( gltf ) {
  gltf.scene.position.y = -20;
	scene.add( gltf.scene );

}, undefined, function ( error ) {

	console.error( error );

} );

//Ground
floor = new THREE.Mesh(new THREE.BoxBufferGeometry(100, 10, 100), 
new THREE.MeshPhongMaterial( { color:0xffffff } ));
floor.position.y = -25;
floor.receiveShadow = true;
floor.castShadow = true;
scene.add(floor);

//Environment Rain
starGeo = new THREE.Geometry();
     for(let i=0;i<8000;i++) {
       star = new THREE.Vector3(
         Math.random() * 600 - 300,
         Math.random() * 1200 - 600,
         Math.random() * 500 - 250
       );
       star.velocity = 0;
       star.acceleration = 1;
       starGeo.vertices.push(star);
     }
 
     let starMaterial = new THREE.PointsMaterial({
       color: 0xffffff,
       size: 0.7
     });
 
     stars = new THREE.Points(starGeo,starMaterial);
     stars.position.set(0,0,0);
     scene.add(stars);


lightning = new THREE.Mesh(new THREE.BoxBufferGeometry(500, 500, 1), 
new THREE.MeshPhongMaterial( { map: new THREE.TextureLoader().load( 'lightning.jpg' ) } ));
lightning.position.z = 300;
scene.add(lightning);


//------------------Lightings------------------
let ambientLight = new THREE.AmbientLight(0xFFCF70, 0.1);
scene.add(ambientLight);
let spotLight = new THREE.SpotLight( 0xffffff, 1);
spotLight.position.set(500, 200, 0 );
spotLight.target.position.set( 0, 0, 0 );
spotLight.castShadow = true;
scene.add( spotLight.target );
scene.add( spotLight );
let spotLight1 = new THREE.SpotLight( 0xffffff, 10);
spotLight1.position.set(300, 200, 0 );
spotLight1.target.position.set( 0, 0, 0 );
spotLight1.castShadow = true;
scene.add( spotLight1.target );
scene.add( spotLight1 );
let spotLight2 = new THREE.SpotLight( 0xffffff, 5);
spotLight2.position.set(400, 200, 0 );
spotLight2.target.position.set( 0, 0, 0 );
spotLight2.castShadow = true;
scene.add( spotLight2.target );
scene.add( spotLight2 );



//------------------Renderer------------------
let renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;


//------------------Functions------------------
let counter = 0;
controls = new THREE.OrbitControls (camera, renderer.domElement);
function animate() {
  controls.update();
  starGeo.vertices.forEach(p => {
    p.y -= 2;
    if (p.y < -600){
      p.y = 400;  
      counter += 1;
    }
    if (counter >= 3000){
      spotLight.target.position.set(0, 0, 0);
      spotLight1.target.position.set(0, 0, 0);
      spotLight2.target.position.set(0, 0, 0);
      scene.background =  new THREE.TextureLoader().load( 'lightning.jpg' );
      counter = 0;
    }
    else if (counter == 100){
      spotLight1.target.position.set(1000, 1000, 1000);
    }
    else if (counter == 200){
      spotLight2.target.position.set(1000, 1000, 1000);
    }
    else if (counter == 300){
      spotLight.target.position.set(1000, 1000, 1000);
      lightning.position.z = 10000;
      scene.background = new THREE.TextureLoader().load( 'black.jpg' );
    }
  });
  

starGeo.verticesNeedUpdate = true;

renderer.render(scene, camera);
requestAnimationFrame(animate);
}
animate();  