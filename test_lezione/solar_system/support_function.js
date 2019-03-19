function PlanetRevolving(pivot, delta){ 
    pivot.rotation.y += (360 * Math.PI/180) * (delta / 365);
}

function PlanetRotation(planet, delta){ 
    planet.rotation.y += (360 * Math.PI/180) * (delta);
}