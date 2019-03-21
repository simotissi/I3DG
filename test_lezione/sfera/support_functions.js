function findMidPoint(i_vertex_a, i_vertex_b){
    vertex_a = geometry.vertices[i_vertex_a];
    vertex_b = geometry.vertices[i_vertex_b];
    mid_point = new THREE.Vector3( (vertex_a.x + vertex_b.x)/2.0, (vertex_a.y + vertex_b.y)/2.0, (vertex_a.z + vertex_b.z)/2.0);
    mid_point.normalize();
    geometry.vertices.push( mid_point );
}