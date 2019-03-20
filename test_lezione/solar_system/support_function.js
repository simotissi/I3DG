//mapping function for all rotations
function mapping(value, istart, istop, ostart, ostop) {
    return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
  }

//function for che creation of the sun
function createSun(radius, color_rgb){
    let g_sun = new THREE.SphereGeometry( radius, 32, 32 );
    let m_sun = new THREE.MeshBasicMaterial( {color: color_rgb, wireframe: true} );
    return new THREE.Mesh( g_sun, m_sun );
}

//function for the creation of the planet
function createPlanet(radius, color_rgb){
    let g_planet = new THREE.SphereGeometry( radius, 8, 8 );
    let m_planet = new THREE.MeshBasicMaterial( {color: color_rgb, wireframe: true} );
    return new THREE.Mesh( g_planet, m_planet );
}

//function for the creation of the moon
function createMoon(radius, color_rgb){
    let g_moon = new THREE.SphereGeometry( radius, 8, 8 );
    let m_moon = new THREE.MeshBasicMaterial( {color: color_rgb, wireframe: true} );
    return new THREE.Mesh( g_moon, m_moon );
}
