import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import Globe from "react-globe.gl";
import * as THREE from "three";
import axios from "axios";

const API = `${import.meta.env.VITE_BACKEND_URL ?? ""}/api`;

const EARTH_TEXTURE = "/earth-topo-bathy-8k.jpg";
const EARTH_SPECULAR = "/earth-water.png";
const NIGHT_SKY = "//unpkg.com/three-globe/example/img/night-sky.png";
const EARTH_BUMP = "//unpkg.com/three-globe/example/img/earth-topology.png";

// Stable accessor functions — defined outside component to prevent re-renders
const getPointColor = (d) => (d.isSelected ? "#00E5FF" : "rgba(255,255,255,0.55)");
const getPointRadius = (d) => (d.isSelected ? 0.7 : 0.18);
const getPointAltitude = (d) => (d.isSelected ? 0.04 : 0.005);
const getRingColor = () => "#00E5FF";
const getLabelColor = () => "rgba(255,255,255,0.35)";

function useCities() {
  const [cities, setCities] = useState([]);
  useEffect(() => {
    axios.get(`${API}/cities`)
      .then((res) => setCities(res.data.cities || []))
      .catch(() => {});
  }, []);
  return cities;
}

function useWindowDimensions() {
  const [dim, setDim] = useState({ width: window.innerWidth, height: window.innerHeight });
  useEffect(() => {
    const handle = () => setDim({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);
  return dim;
}

function useGlobeControls(globeRef) {
  useEffect(() => {
    if (!globeRef.current) return;
    const controls = globeRef.current.controls();
    if (controls) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.4;
      controls.minDistance = 180;
      controls.maxDistance = 550;
      controls.enableDamping = true;
      controls.dampingFactor = 0.1;
      controls.rotateSpeed = 0.6;
      controls.zoomSpeed = 0.8;
    }
    globeRef.current.pointOfView({ lat: 20, lng: 10, altitude: 2.5 }, 0);
  }, [globeRef]);
}

function useGlobeMaterial(globeRef) {
  const configured = useRef(false);
  useEffect(() => {
    if (!globeRef.current || configured.current) return;
    configured.current = true;
    setTimeout(() => {
      const scene = globeRef.current?.scene();
      if (!scene) return;
      const specularTex = new THREE.TextureLoader().load(EARTH_SPECULAR);
      let found = false;
      scene.traverse((obj) => {
        if (obj.isMesh && obj.material?.map && obj.material?.bumpMap && !found) {
          found = true;
          const mat = obj.material;
          mat.specularMap = specularTex;
          mat.specular = new THREE.Color(0x444444);
          mat.shininess = 18;
          mat.bumpScale = 8;
          mat.needsUpdate = true;
        }
      });
    }, 1500);
  }, [globeRef]);
}

const GlobeView = ({ onLocationClick, selectedCoords }) => {
  const globeRef = useRef();
  const cities = useCities();
  const dim = useWindowDimensions();

  useGlobeControls(globeRef);
  useGlobeMaterial(globeRef);

  const pointsData = useMemo(() => {
    const pts = cities.map((c) => ({ lat: c.lat, lng: c.lon, name: c.name, isSelected: false }));
    if (selectedCoords) pts.push({ lat: selectedCoords.lat, lng: selectedCoords.lng, name: "Selected", isSelected: true });
    return pts;
  }, [cities, selectedCoords]);

  const ringsData = useMemo(
    () => (selectedCoords ? [{ lat: selectedCoords.lat, lng: selectedCoords.lng }] : []),
    [selectedCoords]
  );

  const labelsData = useMemo(
    () => cities.map((c) => ({ lat: c.lat, lng: c.lon, text: c.name })),
    [cities]
  );

  const stopAutoRotate = useCallback(() => {
    const controls = globeRef.current?.controls();
    if (controls) controls.autoRotate = false;
  }, []);

  const handleGlobeClick = useCallback(({ lat, lng }) => {
    stopAutoRotate();
    onLocationClick(lat, lng);
  }, [onLocationClick, stopAutoRotate]);

  const handlePointClick = useCallback((point) => {
    stopAutoRotate();
    onLocationClick(point.lat, point.lng);
  }, [onLocationClick, stopAutoRotate]);

  return (
    <Globe
      ref={globeRef}
      width={dim.width}
      height={dim.height}
      globeImageUrl={EARTH_TEXTURE}
      bumpImageUrl={EARTH_BUMP}
      backgroundImageUrl={NIGHT_SKY}
      showAtmosphere={true}
      atmosphereColor="#00E5FF"
      atmosphereAltitude={0.18}
      pointsData={pointsData}
      pointLat="lat"
      pointLng="lng"
      pointColor={getPointColor}
      pointRadius={getPointRadius}
      pointAltitude={getPointAltitude}
      pointResolution={12}
      onGlobeClick={handleGlobeClick}
      onPointClick={handlePointClick}
      ringsData={ringsData}
      ringLat="lat"
      ringLng="lng"
      ringColor={getRingColor}
      ringMaxRadius={4}
      ringPropagationSpeed={2}
      ringRepeatPeriod={1200}
      ringAltitude={0.002}
      labelsData={labelsData}
      labelLat="lat"
      labelLng="lng"
      labelText="text"
      labelSize={0.6}
      labelDotRadius={0.15}
      labelColor={getLabelColor}
      labelResolution={2}
      labelAltitude={0.01}
      animateIn={true}
    />
  );
};

export default GlobeView;
