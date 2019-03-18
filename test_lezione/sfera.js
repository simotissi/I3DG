let scene;
let stats;
let camera;
let renderer;
let cube;
let rotationAngle;
let rotationAxes;
let flag = true;

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
        case " ":
            if(flag){
                rotationAngle = 0;
            }else{
                rotationAngle = 0.01;
            }
            flag = !flag;
            break;
        default:
            break;
    }
};

let maxEDGEfrom;
let pDicotomic;
let uDicotomic;
let mDicotomic;
let nDicotomic;
let flagFoundDicotmic;

/**
 * Returns index of mid point of that edge if there. If not return -1
 * @param {Array} edges Array of edges
 * @param {Number} from index of from vertex of edge
 * @param {Number} to index of to vertex of edge
 * @returns {Number} index of mid vertex
 */
function getMidPointer(edges, from, to) {
    if (from > to) {
        maxEDGEfrom = to;
        to = from;
        from = maxEDGEfrom;
    }

    pDicotomic = 0;
    uDicotomic = edges.length - 1;

    while (pDicotomic <= uDicotomic) {
        mDicotomic = Math.floor((pDicotomic + uDicotomic) / 2);
        if (edges[mDicotomic].from == from) {
            // valore x trovato alla posizione m
            pDicotomic = 0;
            uDicotomic = edges[mDicotomic].to.length - 1;
            while (pDicotomic <= uDicotomic) {
                nDicotomic = Math.floor((pDicotomic + uDicotomic) / 2);
                if (edges[mDicotomic].to[nDicotomic].to == to) {
                    // valore x trovato alla posizione n
                    return edges[mDicotomic].to[nDicotomic].mid;
                }
                if (edges[mDicotomic].to[nDicotomic].to < to) {
                    pDicotomic = nDicotomic + 1;
                } else {
                    uDicotomic = nDicotomic - 1;
                }
            }
            return -1;
        }
        if (edges[mDicotomic].from < from) {
            pDicotomic = mDicotomic + 1;
        } else {
            uDicotomic = mDicotomic - 1;
        }
    }
    return -1;
}

function insertEdge(edges, from, to) {
    if (from > to) {
        maxEDGEfrom = to;
        to = from;
        from = maxEDGEfrom;
    }

    pDicotomic = 0;
    uDicotomic = edges.length - 1;

    flagFoundDicotmic = false;
    while (pDicotomic <= uDicotomic) {
        mDicotomic = Math.floor((pDicotomic + uDicotomic) / 2);
        
        if (edges[mDicotomic].from == from) {
            // valore x trovato alla posizione m
            flagFoundDicotmic = true;
            break;
        }
        if (edges[mDicotomic].from < from) {
            pDicotomic = mDicotomic + 1;
        } else {
            uDicotomic = mDicotomic - 1;
        }
    }

    if (flagFoundDicotmic) {
        pDicotomic = 0;
        uDicotomic = edges[mDicotomic].to.length - 1;
        flagFoundDicotmic = false;
        while (pDicotomic <= uDicotomic) {
            nDicotomic = Math.floor((pDicotomic + uDicotomic) / 2);
            if (edges[mDicotomic].to[nDicotomic].to == to) {
                // valore x trovato alla posizione n
                flagFoundDicotmic = true;
                break;
            }
            if (edges[mDicotomic].to[nDicotomic].to < to) {
                pDicotomic = nDicotomic + 1;
            } else {
                uDicotomic = nDicotomic - 1;
            }
        }    
        if(flagFoundDicotmic){
            return;
        } else{
            edges[mDicotomic].to.splice(pDicotomic, 0,
                {
                    to: to,
                    mid: -1
                }
            );
        }
    } else {
        edges.splice(pDicotomic, 0, { 
            from: from, 
            to: [
                { to: to, mid: -1 }
            ] 
        });
    }
}

function createSphere(steps) {
    let geometry = new THREE.Geometry();

    geometry.vertices.push(new THREE.Vector3( 0,  1,  0)); // top
    geometry.vertices.push(new THREE.Vector3( 1,  0,  0)); // right
    geometry.vertices.push(new THREE.Vector3( 0,  0,  1)); // front
    geometry.vertices.push(new THREE.Vector3(-1,  0,  0)); // left
    geometry.vertices.push(new THREE.Vector3( 0,  0, -1)); // back
    geometry.vertices.push(new THREE.Vector3( 0, -1,  0)); // bottom

    geometry.faces.push(new THREE.Face3(0, 1, 4));
    geometry.faces.push(new THREE.Face3(0, 4, 3));
    geometry.faces.push(new THREE.Face3(0, 3, 2));
    geometry.faces.push(new THREE.Face3(0, 2, 1));
 
    geometry.faces.push(new THREE.Face3(1, 5, 4));
    geometry.faces.push(new THREE.Face3(4, 5, 3));
    geometry.faces.push(new THREE.Face3(3, 5, 2));
    geometry.faces.push(new THREE.Face3(2, 5, 1));

    let edges;
    for (let i = 1; i < steps; i++) {
        edges = [];
        
        geometry.faces.forEach(face => {
            insertEdge(edges, face.a, face.b);
            insertEdge(edges, face.b, face.c);
            insertEdge(edges, face.c, face.a);
        });

        // creating mid vertex of edges
        edges.forEach(edge => {
            edge.to.forEach(edgeTo => {
                let newVertex = new THREE.Vector3(
                    // mid point x
                    (geometry.vertices[edge.from].x + geometry.vertices[edgeTo.to].x) / 2,
                    // mid point y
                    (geometry.vertices[edge.from].y + geometry.vertices[edgeTo.to].y) / 2,
                    // mid point z
                    (geometry.vertices[edge.from].z + geometry.vertices[edgeTo.to].z) / 2);

                newVertex.normalize();
                geometry.vertices.push(newVertex);
                edgeTo.mid = geometry.vertices.length - 1;
            });
        });

        // updating faces: for each face will be created 4 faces
        let newFaces = [];
        let a, ab, b, bc, c, ca;
        geometry.faces.forEach(face => {
            a = face.a;
            ab = getMidPointer(edges, face.a, face.b);
            b = face.b;
            bc = getMidPointer(edges, face.b, face.c);
            c = face.c;
            ca = getMidPointer(edges, face.c, face.a);
            newFaces.push(new THREE.Face3(a, ab, ca));
            newFaces.push(new THREE.Face3(ab, b, bc));
            newFaces.push(new THREE.Face3(ca, ab, bc));
            newFaces.push(new THREE.Face3(ca, bc, c));
        });

        geometry.faces = newFaces;
    }

    console.log("faces", geometry.faces.length);
    console.log("vertices", geometry.vertices.length);
    return new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ wireframe: true }));
}

// Rotate an object around an arbitrary axis in object space
let rotObjectMatrix;
function rotateAroundObjectAxis(object, axis, radians) {
  rotObjectMatrix = new THREE.Matrix4();
  rotObjectMatrix.makeRotationAxis(axis.normalize(), radians);
  object.matrix.multiply(rotObjectMatrix);
  object.rotation.setFromRotationMatrix(object.matrix);
}

function rotateSolid(solid) {
    rotateAroundObjectAxis(solid, rotationAxes, rotationAngle);
}

function linkStats() {
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0';
    stats.domElement.style.left = '0';
    document.body.appendChild(stats.domElement);
}

let sphere;

function init() {
    linkStats();

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

    sphere = createSphere(5);
    scene.add(sphere);
    
    rotationAngle = 0.01;
    rotationAxes = new THREE.Vector3(0,1,0);

    document.addEventListener("keydown", keyListener);
    camera.position.z = 2;

    requestAnimationFrame(Render);
}

function Render() {
    stats.begin();
    rotateSolid(sphere);
    
    renderer.render(scene, camera);

    stats.end();
    requestAnimationFrame(Render);
}
