let scene;
let stats;
let camera;
let renderer;
let cube;
let rotationAngle;
let rotationAxes;

let keyListener = e => {
    switch (e.key) {
        case "a":
            camera.position.x -= 0.5;
            break;
        case "ArrowDown":
            camera.position.y -= 0.5;
            break;
        case "w":
            camera.position.z -= 0.5;
            break;
        case "d":
            camera.position.x += 0.5;
            break;
        case "ArrowUp":
            camera.position.y += 0.5;
            break;
        case "s":
            camera.position.z += 0.5;
            break;
        default:
            break;
    }
};

function createColorCube(data) {
    let cubeFaces = [];
    let cubeVerteces = [];

    let width = data.w,
        height = data.h,
        depth = data.d;

    cubeVerteces.push(new THREE.Vector3(width / 2, height / 2, depth / 2));   // top front right
    cubeVerteces.push(new THREE.Vector3(width / 2, height / 2, -depth / 2));  // top back right
    cubeVerteces.push(new THREE.Vector3(-width / 2, height / 2, -depth / 2)); // top back left
    cubeVerteces.push(new THREE.Vector3(-width / 2, height / 2, depth / 2));  // top front left
    cubeVerteces.push(new THREE.Vector3(width / 2, -height / 2, depth / 2));  // bottom front right
    cubeVerteces.push(new THREE.Vector3(width / 2, -height / 2, -depth / 2)); // bottom back right
    cubeVerteces.push(new THREE.Vector3(-width / 2, -height / 2, -depth / 2));// bottom back left
    cubeVerteces.push(new THREE.Vector3(-width / 2, -height / 2, depth / 2)); // bottom front left

    //FRONT
    let geometry1 = new THREE.Geometry();
    geometry1.vertices.push(cubeVerteces[0]);
    geometry1.vertices.push(cubeVerteces[3]);
    geometry1.vertices.push(cubeVerteces[7]);
    geometry1.vertices.push(cubeVerteces[4]);
    
    geometry1.faces.push(new THREE.Face3(0,1,2));
    geometry1.faces.push(new THREE.Face3(0,2,3));
    cubeFaces.push(new THREE.Mesh(geometry1, new THREE.MeshBasicMaterial({ color: "rgb(255,255,0)" })));

    //RIGHT
    let geometry2 = new THREE.Geometry();
    geometry2.vertices.push(cubeVerteces[1]);
    geometry2.vertices.push(cubeVerteces[0]);
    geometry2.vertices.push(cubeVerteces[4]);
    geometry2.vertices.push(cubeVerteces[5]);

    geometry2.faces.push(new THREE.Face3(0,1,2));
    geometry2.faces.push(new THREE.Face3(0,2,3));
    cubeFaces.push(new THREE.Mesh(geometry2, new THREE.MeshBasicMaterial({ color: "rgb(255,0,255)" })));

    //LEFT
    let geometry3 = new THREE.Geometry();
    geometry3.vertices.push(cubeVerteces[3]);
    geometry3.vertices.push(cubeVerteces[2]);
    geometry3.vertices.push(cubeVerteces[6]);
    geometry3.vertices.push(cubeVerteces[7]);

    geometry3.faces.push(new THREE.Face3(0,1,2));
    geometry3.faces.push(new THREE.Face3(0,2,3));
    cubeFaces.push(new THREE.Mesh(geometry3, new THREE.MeshBasicMaterial({ color: "rgb(0,255,0)" })));

    //BACK
    let geometry4 = new THREE.Geometry();
    geometry4.vertices.push(cubeVerteces[2]);
    geometry4.vertices.push(cubeVerteces[1]);
    geometry4.vertices.push(cubeVerteces[5]);
    geometry4.vertices.push(cubeVerteces[6]);

    geometry4.faces.push(new THREE.Face3(0,1,2));
    geometry4.faces.push(new THREE.Face3(0,2,3));
    cubeFaces.push(new THREE.Mesh(geometry4, new THREE.MeshBasicMaterial({ color: "rgb(0,0,255)" })));

    //TOP
    let geometry5 = new THREE.Geometry();
    geometry5.vertices.push(cubeVerteces[1]);
    geometry5.vertices.push(cubeVerteces[2]);
    geometry5.vertices.push(cubeVerteces[3]);
    geometry5.vertices.push(cubeVerteces[0]);

    geometry5.faces.push(new THREE.Face3(0,1,2));
    geometry5.faces.push(new THREE.Face3(0,2,3));
    cubeFaces.push(new THREE.Mesh(geometry5, new THREE.MeshBasicMaterial({ color: "rgb(0,255,255)" })));

    //BOTTOM
    let geometry6 = new THREE.Geometry();
    geometry6.vertices.push(cubeVerteces[4]);
    geometry6.vertices.push(cubeVerteces[7]);
    geometry6.vertices.push(cubeVerteces[6]);
    geometry6.vertices.push(cubeVerteces[5]);

    geometry6.faces.push(new THREE.Face3(0,1,2));
    geometry6.faces.push(new THREE.Face3(0,2,3));
    cubeFaces.push(new THREE.Mesh(geometry6, new THREE.MeshBasicMaterial({ color: "rgb(255,0,0)" })));

    return cubeFaces;
}

// Rotate an object around an arbitrary axis in object space
let rotObjectMatrix;
function rotateAroundObjectAxis(object, axis, radians) {
  rotObjectMatrix = new THREE.Matrix4();
  rotObjectMatrix.makeRotationAxis(axis.normalize(), radians);
  object.matrix.multiply(rotObjectMatrix);
  object.rotation.setFromRotationMatrix(object.matrix);
}

function rotateCube() {
    cube.forEach(face =>{
        rotateAroundObjectAxis(face, rotationAxes, rotationAngle);
    });
}

function linkStats() {
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0';
    stats.domElement.style.left = '0';
    document.body.appendChild(stats.domElement);
}

function init() {

    scene = new THREE.Scene();
    /**
     * fov — Camera frustum vertical field of view.
     * aspect — Camera frustum aspect ratio.
     * near — Camera frustum near plane.
     * far — Camera frustum far plane.
     */
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    cube = createColorCube({
        w: 2,
        h: 2,
        d: 2
    });

    cube.forEach(face =>{
        scene.add(face);
    });
    
    linkStats();
    
    rotationAngle = 0.01;
    rotationAxes = new THREE.Vector3(1,0.5,0.75);

    document.addEventListener("keydown", keyListener);
    camera.position.z = 3;

    requestAnimationFrame(Render);
}

function Render() {
    stats.begin();
    rotateCube();
    renderer.render(scene, camera);

    stats.end();
    requestAnimationFrame(Render);
}

