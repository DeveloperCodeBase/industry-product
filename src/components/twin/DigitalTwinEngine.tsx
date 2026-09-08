import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import {
  Maximize2,
  Minimize2,
  Camera,
  RotateCcw,
  Sparkles,
  Eye,
  Sliders,
  Waves,
  FileCheck,
  Check,
  X,
  Layers,
  Thermometer,
  Activity,
  Gauge,
  ShieldCheck,
  Cpu,
  Info,
  ChevronRight
} from 'lucide-react';
import { Asset, TwinMaturityMode } from '../../types';

export interface DigitalTwinEngineProps {
  asset: Asset;
  assets?: Asset[];
  onSelectAsset?: (assetId: string) => void;
  maturityMode?: TwinMaturityMode;
  onChangeMaturityMode?: (mode: TwinMaturityMode) => void;
  className?: string;
  showControls?: boolean;
}

interface SensorHotspot {
  id: string;
  nameFa: string;
  signal: 'vibrationRms' | 'temperature' | 'current' | 'pressure';
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  position: [number, number, number];
}

export const DigitalTwinEngine: React.FC<DigitalTwinEngineProps> = ({
  asset,
  assets = [],
  onSelectAsset,
  maturityMode = 'informative',
  onChangeMaturityMode,
  className = '',
  showControls = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [cameraView, setCameraView] = useState<'perspective' | 'top' | 'focus' | 'xray'>('perspective');
  const [selectedSensor, setSelectedSensor] = useState<SensorHotspot | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [autonomousActionResolved, setAutonomousActionResolved] = useState<'approved' | 'rejected' | null>(null);
  const [wireframeMode, setWireframeMode] = useState<boolean>(false);

  const calculatedRulDays = Math.max(1, Math.round((asset.rulHours || 1200) / 24));

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Dynamic mesh references for animations
  const rotatingElementsRef = useRef<THREE.Object3D[]>([]);
  const machineMeshGroupRef = useRef<THREE.Group | null>(null);
  const hotspotMeshesRef = useRef<THREE.Mesh[]>([]);
  const particleSystemRef = useRef<THREE.Points | null>(null);
  const rulRingMeshRef = useRef<THREE.Mesh | null>(null);

  // Mouse interaction for Orbit and Raycast
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const cameraSphericalRef = useRef<{ radius: number; theta: number; phi: number }>({
    radius: 18,
    theta: Math.PI / 4,
    phi: Math.PI / 3,
  });

  // Calculate sensor hotspots dynamically based on current asset telemetry
  const sensorHotspots: SensorHotspot[] = useMemo(() => {
    const t = asset.telemetry;
    return [
      {
        id: 'sensor-de-vib',
        nameFa: 'شتاب‌سنج یاتاقان سمت محرک (DE Bearing)',
        signal: 'vibrationRms',
        value: t.vibrationRms,
        unit: 'mm/s RMS',
        status: t.vibrationRms > 4.5 ? 'critical' : t.vibrationRms > 2.8 ? 'warning' : 'normal',
        position: [-1.4, 1.8, 0],
      },
      {
        id: 'sensor-nde-vib',
        nameFa: 'شتاب‌سنج یاتاقان سمت آزاد (NDE Bearing)',
        signal: 'vibrationRms',
        value: Number((t.vibrationRms * 0.82).toFixed(2)),
        unit: 'mm/s RMS',
        status: t.vibrationRms * 0.82 > 4.5 ? 'critical' : t.vibrationRms * 0.82 > 2.8 ? 'warning' : 'normal',
        position: [1.8, 1.8, 0],
      },
      {
        id: 'sensor-temp-stator',
        nameFa: 'ترموکوپل RTD حرارت سیم‌پیچ/محفظه',
        signal: 'temperature',
        value: t.temperature,
        unit: '°C',
        status: t.temperature > 85 ? 'critical' : t.temperature > 70 ? 'warning' : 'normal',
        position: [0, 2.5, 0.9],
      },
      {
        id: 'sensor-flange-pres',
        nameFa: 'ترانسمیتر فشار فلنج خروجی',
        signal: 'pressure',
        value: t.pressure,
        unit: 'Bar',
        status: t.pressure > 6.8 ? 'warning' : 'normal',
        position: [0.8, 3.4, 0],
      },
    ];
  }, [asset]);

  // Handle camera spherical coordinate updates
  const updateCameraPosition = () => {
    if (!cameraRef.current) return;
    const { radius, theta, phi } = cameraSphericalRef.current;
    const x = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.cos(theta);

    cameraRef.current.position.set(x, Math.max(1, y), z);
    cameraRef.current.lookAt(0, 1.2, 0);
  };

  // Change camera view preset
  useEffect(() => {
    if (cameraView === 'perspective') {
      cameraSphericalRef.current = { radius: 18, theta: Math.PI / 4, phi: Math.PI / 3.2 };
    } else if (cameraView === 'top') {
      cameraSphericalRef.current = { radius: 22, theta: 0.001, phi: 0.05 };
    } else if (cameraView === 'focus') {
      cameraSphericalRef.current = { radius: 8.5, theta: Math.PI / 3, phi: Math.PI / 2.6 };
    } else if (cameraView === 'xray') {
      cameraSphericalRef.current = { radius: 11, theta: -Math.PI / 4, phi: Math.PI / 2.8 };
    }
    updateCameraPosition();
  }, [cameraView]);

  // Main Three.js Scene Setup & Lifecycle
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070d18);
    scene.fog = new THREE.FogExp2(0x070d18, 0.02);
    sceneRef.current = scene;

    // 2. Camera
    const aspect = container.clientWidth / (container.clientHeight || 450);
    const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    cameraRef.current = camera;
    updateCameraPosition();

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const mainSpot = new THREE.DirectionalLight(0xe0f2fe, 1.8);
    mainSpot.position.set(12, 24, 15);
    mainSpot.castShadow = true;
    mainSpot.shadow.mapSize.width = 1024;
    mainSpot.shadow.mapSize.height = 1024;
    scene.add(mainSpot);

    const cyanFill = new THREE.PointLight(0x0ea5e9, 2.2, 45);
    cyanFill.position.set(-10, 8, -6);
    scene.add(cyanFill);

    const amberAccent = new THREE.PointLight(0xf59e0b, 1.2, 35);
    amberAccent.position.set(8, 4, 10);
    scene.add(amberAccent);

    // 5. Factory Grid Ground
    const gridHelper = new THREE.GridHelper(40, 40, 0x0284c7, 0x1e293b);
    gridHelper.position.y = -0.01;
    scene.add(gridHelper);

    const groundGeo = new THREE.PlaneGeometry(50, 50);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x060b15,
      roughness: 0.85,
      metalness: 0.15,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.02;
    ground.receiveShadow = true;
    scene.add(ground);

    // Factory Foundation Plinth
    const plinthGeo = new THREE.BoxGeometry(10, 0.4, 6);
    const plinthMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.6,
      metalness: 0.4,
    });
    const plinth = new THREE.Mesh(plinthGeo, plinthMat);
    plinth.position.y = 0.2;
    plinth.receiveShadow = true;
    plinth.castShadow = true;
    scene.add(plinth);

    // 6. Build the Machine Mesh Hierarchy based on asset.type
    const machineGroup = new THREE.Group();
    machineMeshGroupRef.current = machineGroup;
    rotatingElementsRef.current = [];

    // Equipment base color determined by health/status
    const statusColor =
      asset.status === 'critical' ? 0xef4444 : asset.status === 'warning' ? 0xf59e0b : 0x0284c7;

    const metalMaterial = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.35,
      metalness: 0.85,
      wireframe: wireframeMode,
    });

    const statusAccentMaterial = new THREE.MeshStandardMaterial({
      color: statusColor,
      roughness: 0.3,
      metalness: 0.7,
      emissive: new THREE.Color(statusColor),
      emissiveIntensity: maturityMode === 'descriptive' ? 0.05 : 0.35,
      wireframe: wireframeMode,
    });

    const rotatingShaftMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.2,
      metalness: 0.95,
      wireframe: wireframeMode,
    });

    // Build specific equipment geometry
    if (asset.type === 'compressor') {
      // High Pressure Turbo-Compressor
      // Main barrel casing
      const barrelGeo = new THREE.CylinderGeometry(1.6, 1.6, 5, 32);
      const barrel = new THREE.Mesh(barrelGeo, statusAccentMaterial);
      barrel.rotation.z = Math.PI / 2;
      barrel.position.y = 2.0;
      barrel.castShadow = true;
      machineGroup.add(barrel);

      // Centrifugal Volute Casing (Impeller stage)
      const voluteGeo = new THREE.TorusGeometry(2.0, 0.45, 16, 40);
      const volute = new THREE.Mesh(voluteGeo, metalMaterial);
      volute.position.set(0.5, 2.0, 0);
      volute.rotation.y = Math.PI / 2;
      machineGroup.add(volute);

      // Suction & Discharge Flanges
      const suctionPipeGeo = new THREE.CylinderGeometry(0.5, 0.5, 1.8, 24);
      const suctionPipe = new THREE.Mesh(suctionPipeGeo, metalMaterial);
      suctionPipe.position.set(-1.2, 3.1, 0);
      machineGroup.add(suctionPipe);

      const dischargePipeGeo = new THREE.CylinderGeometry(0.4, 0.4, 2.2, 24);
      const dischargePipe = new THREE.Mesh(dischargePipeGeo, metalMaterial);
      dischargePipe.position.set(0.8, 3.3, 0);
      machineGroup.add(dischargePipe);

      // Bearing Pedestals (DE & NDE)
      const dePedestal = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.4, 1.4), metalMaterial);
      dePedestal.position.set(-2.8, 1.1, 0);
      machineGroup.add(dePedestal);

      const ndePedestal = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.4, 1.4), metalMaterial);
      ndePedestal.position.set(2.8, 1.1, 0);
      machineGroup.add(ndePedestal);

      // Rotating Impeller assembly
      const shaftGeo = new THREE.CylinderGeometry(0.28, 0.28, 6.2, 20);
      const shaft = new THREE.Mesh(shaftGeo, rotatingShaftMat);
      shaft.rotation.z = Math.PI / 2;
      shaft.position.y = 2.0;
      machineGroup.add(shaft);
      rotatingElementsRef.current.push(shaft);

      // Internal Impeller blades
      const impellerHub = new THREE.Group();
      impellerHub.position.set(0.5, 2.0, 0);
      for (let i = 0; i < 8; i++) {
        const bladeGeo = new THREE.BoxGeometry(0.08, 1.5, 0.4);
        const blade = new THREE.Mesh(bladeGeo, rotatingShaftMat);
        blade.rotation.x = (i * Math.PI) / 4;
        impellerHub.add(blade);
      }
      machineGroup.add(impellerHub);
      rotatingElementsRef.current.push(impellerHub);
    } else if (asset.type === 'conveyor') {
      // Mining / Bulk Conveyor
      const trussGeo = new THREE.BoxGeometry(8, 0.6, 2.2);
      const truss = new THREE.Mesh(trussGeo, metalMaterial);
      truss.position.y = 1.6;
      machineGroup.add(truss);

      // Pulley Drums
      const headDrum = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 2.4, 24), statusAccentMaterial);
      headDrum.rotation.x = Math.PI / 2;
      headDrum.position.set(3.8, 1.6, 0);
      machineGroup.add(headDrum);
      rotatingElementsRef.current.push(headDrum);

      const tailDrum = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 2.4, 24), metalMaterial);
      tailDrum.rotation.x = Math.PI / 2;
      tailDrum.position.set(-3.8, 1.6, 0);
      machineGroup.add(tailDrum);
      rotatingElementsRef.current.push(tailDrum);

      // Rubber Belt Continuous Geometry
      const beltGeo = new THREE.BoxGeometry(7.8, 0.08, 2.3);
      const beltMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 });
      const topBelt = new THREE.Mesh(beltGeo, beltMat);
      topBelt.position.set(0, 2.44, 0);
      machineGroup.add(topBelt);

      // Idler Rollers
      for (let i = -2.5; i <= 2.5; i += 1.25) {
        const roller = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 2.4, 16), rotatingShaftMat);
        roller.rotation.x = Math.PI / 2;
        roller.position.set(i, 2.2, 0);
        machineGroup.add(roller);
        rotatingElementsRef.current.push(roller);
      }
    } else {
      // High-Voltage Induction Motor & Pump Unit
      const statorGeo = new THREE.CylinderGeometry(1.5, 1.5, 4.4, 32);
      const stator = new THREE.Mesh(statorGeo, statusAccentMaterial);
      stator.rotation.z = Math.PI / 2;
      stator.position.y = 1.9;
      machineGroup.add(stator);

      // Stator Cooling Fins
      for (let i = 0; i < 16; i++) {
        const finAngle = (i * Math.PI) / 8;
        const finGeo = new THREE.BoxGeometry(4.4, 0.05, 0.35);
        const fin = new THREE.Mesh(finGeo, metalMaterial);
        fin.position.set(0, 1.9 + Math.sin(finAngle) * 1.6, Math.cos(finAngle) * 1.6);
        machineGroup.add(fin);
      }

      // Terminal Box on top
      const terminalBox = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.7, 1.0), metalMaterial);
      terminalBox.position.set(-0.5, 3.7, 0);
      machineGroup.add(terminalBox);

      // Drive End (DE) shaft
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 5.6, 24), rotatingShaftMat);
      shaft.rotation.z = Math.PI / 2;
      shaft.position.y = 1.9;
      machineGroup.add(shaft);
      rotatingElementsRef.current.push(shaft);

      // Cooling Fan & Cowl
      const fanCowl = new THREE.Mesh(new THREE.CylinderGeometry(1.55, 1.55, 0.8, 24), metalMaterial);
      fanCowl.rotation.z = Math.PI / 2;
      fanCowl.position.set(2.4, 1.9, 0);
      machineGroup.add(fanCowl);
    }

    scene.add(machineGroup);

    // 7. Predictive RUL Hologram Ring (Level 3 & 4)
    if (maturityMode === 'predictive' || maturityMode === 'autonomous') {
      const ringGeo = new THREE.RingGeometry(4.8, 5.1, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: calculatedRulDays < 30 ? 0xef4444 : calculatedRulDays < 60 ? 0xf59e0b : 0x10b981,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = -Math.PI / 2;
      ringMesh.position.y = 0.25;
      scene.add(ringMesh);
      rulRingMeshRef.current = ringMesh;
    }

    // 8. Interactive Sensor Beacon Hotspots
    hotspotMeshesRef.current = [];
    if (maturityMode !== 'descriptive') {
      sensorHotspots.forEach((sensor) => {
        const beaconGroup = new THREE.Group();
        beaconGroup.position.set(...sensor.position);

        const beaconColor =
          sensor.status === 'critical' ? 0xef4444 : sensor.status === 'warning' ? 0xf59e0b : 0x10b981;

        // Central beacon sphere
        const sphereGeo = new THREE.SphereGeometry(0.18, 16, 16);
        const sphereMat = new THREE.MeshStandardMaterial({
          color: beaconColor,
          emissive: new THREE.Color(beaconColor),
          emissiveIntensity: 0.9,
          roughness: 0.2,
        });
        const sphere = new THREE.Mesh(sphereGeo, sphereMat);
        sphere.userData = { sensorId: sensor.id };
        beaconGroup.add(sphere);

        // Pulse ring
        const ringGeo = new THREE.RingGeometry(0.24, 0.32, 24);
        const ringMat = new THREE.MeshBasicMaterial({
          color: beaconColor,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.6,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.lookAt(0, 5, 10);
        beaconGroup.add(ring);

        scene.add(beaconGroup);
        hotspotMeshesRef.current.push(sphere);
      });
    }

    // 9. Particle Flow Effect (Fluid / Airflow)
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 8;
      particlePositions[i * 3 + 1] = 0.5 + Math.random() * 3.5;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.08,
      transparent: true,
      opacity: 0.4,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particleSystemRef.current = particles;

    // 10. Animation Render Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const delta = clock.getDelta();

      // Rotation based on actual telemetry RPM
      const rpmSpeed = (asset.telemetry.rpm / 60) * 2 * Math.PI;
      rotatingElementsRef.current.forEach((el) => {
        if (maturityMode !== 'descriptive') {
          el.rotation.x += rpmSpeed * 0.005;
        }
      });

      // Micro-vibration displacement (Visualizing live vibration severity)
      if (machineMeshGroupRef.current && maturityMode !== 'descriptive') {
        const vibFactor = (asset.telemetry.vibrationRms / 10) * 0.02;
        machineMeshGroupRef.current.position.y = Math.sin(elapsedTime * 45) * vibFactor;
        machineMeshGroupRef.current.position.x = Math.cos(elapsedTime * 38) * vibFactor * 0.5;
      }

      // Pulse sensor beacons
      hotspotMeshesRef.current.forEach((mesh, idx) => {
        const s = 1 + Math.sin(elapsedTime * 4 + idx) * 0.2;
        mesh.scale.set(s, s, s);
      });

      // Flow particles
      if (particleSystemRef.current) {
        const positions = particleSystemRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          positions[i * 3] += 0.03;
          if (positions[i * 3] > 4) {
            positions[i * 3] = -4;
          }
        }
        particleSystemRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Rotate RUL ring if present
      if (rulRingMeshRef.current) {
        rulRingMeshRef.current.rotation.z = elapsedTime * 0.2;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Observer to adapt fluidly
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 450;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    // Clean up on unmount or dependency re-run
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      resizeObserver.disconnect();
      renderer.dispose();
      scene.clear();
    };
  }, [asset, maturityMode, wireframeMode]);

  // Mouse & Touch Orbit Controls Implementation
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    cameraSphericalRef.current.theta += deltaX * 0.008;
    cameraSphericalRef.current.phi = Math.max(
      0.1,
      Math.min(Math.PI / 2 - 0.05, cameraSphericalRef.current.phi - deltaY * 0.008)
    );

    updateCameraPosition();
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    cameraSphericalRef.current.radius = Math.max(
      6,
      Math.min(35, cameraSphericalRef.current.radius + e.deltaY * 0.02)
    );
    updateCameraPosition();
  };

  // Raycaster for clicking on sensor nodes
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = mountRef.current;
    if (!container || !cameraRef.current || !sceneRef.current) return;

    const rect = container.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    const intersects = raycaster.intersectObjects(hotspotMeshesRef.current);
    if (intersects.length > 0) {
      const hit = intersects[0].object;
      const sensorId = hit.userData?.sensorId;
      const found = sensorHotspots.find((s) => s.id === sensorId);
      if (found) {
        setSelectedSensor(found);
      }
    }
  };

  // Reset view button
  const handleResetCamera = () => {
    setCameraView('perspective');
  };

  return (
    <div
      className={`relative flex flex-col rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl transition-all ${className} ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none' : ''
      }`}
    >
      {/* Top Header Bar inside Engine */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400">
            <Cpu size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-white">{asset.faName}</h2>
              <span className="text-[11px] font-mono text-slate-400">[{asset.name}]</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  asset.status === 'critical'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : asset.status === 'warning'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {asset.status === 'critical'
                  ? 'بحرانی'
                  : asset.status === 'warning'
                  ? 'هشدار نگهداری'
                  : 'عادی / بهینه'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {asset.industryFa} • شاخص سلامت کلی: {asset.healthScore}٪ • دور کاری: {asset.telemetry.rpm} RPM
            </p>
          </div>
        </div>

        {/* Maturity Mode Toggle Chips */}
        {showControls && onChangeMaturityMode && (
          <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 gap-1 text-xs">
            <button
              onClick={() => onChangeMaturityMode('descriptive')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 font-bold ${
                maturityMode === 'descriptive'
                  ? 'bg-slate-700 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="سطح ۱: مدل ثابت هندسی و متادیتای CAD"
            >
              <Eye size={13} />
              <span>توصیفی</span>
            </button>
            <button
              onClick={() => onChangeMaturityMode('informative')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 font-bold ${
                maturityMode === 'informative'
                  ? 'bg-sky-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="سطح ۲: داده تله‌متری زنده و نگاشت حرارتی"
            >
              <Sliders size={13} />
              <span>تشخیصی</span>
            </button>
            <button
              onClick={() => onChangeMaturityMode('predictive')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 font-bold ${
                maturityMode === 'predictive'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="سطح ۳: پیش‌بینی عمر باقیمانده RUL و بردار تخریب"
            >
              <Waves size={13} />
              <span>پیش‌بین</span>
            </button>
            <button
              onClick={() => onChangeMaturityMode('autonomous')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 font-bold ${
                maturityMode === 'autonomous'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="سطح ۴: فرامین خودکار هوشمند و اتصال به CMMS"
            >
              <Sparkles size={13} />
              <span>خودران</span>
            </button>
          </div>
        )}

        {/* View Angle & Fullscreen actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCameraView('perspective')}
            className={`px-2 py-1 rounded-lg text-xs font-semibold border transition-all ${
              cameraView === 'perspective'
                ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            پرسپکتیو
          </button>
          <button
            onClick={() => setCameraView('top')}
            className={`px-2 py-1 rounded-lg text-xs font-semibold border transition-all ${
              cameraView === 'top'
                ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            پلان بالا
          </button>
          <button
            onClick={() => setCameraView('focus')}
            className={`px-2 py-1 rounded-lg text-xs font-semibold border transition-all ${
              cameraView === 'focus'
                ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            فوکوس یاتاقان
          </button>
          <button
            onClick={() => setWireframeMode(!wireframeMode)}
            className={`p-1.5 rounded-lg border text-xs transition-all ${
              wireframeMode
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="نمای وایرفریم ساختار داخلی"
          >
            <Layers size={14} />
          </button>
          <button
            onClick={handleResetCamera}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
            title="بازنشانی زاویه دید"
          >
            <RotateCcw size={14} />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
            title={isFullscreen ? 'خروج از تمام‌صفحه' : 'تمام‌صفحه'}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Viewport */}
      <div
        ref={mountRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onClick={handleCanvasClick}
        className="w-full h-[450px] sm:h-[520px] lg:h-[580px] cursor-grab active:cursor-grabbing relative overflow-hidden select-none"
      />

      {/* Floating HUD: Live Telemetry Gauges */}
      <div className="absolute top-16 right-4 z-10 flex flex-col gap-2 max-w-xs pointer-events-none">
        <div className="p-3 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-800 text-xs shadow-xl pointer-events-auto">
          <div className="flex items-center justify-between text-slate-300 font-bold mb-2 pb-1 border-b border-slate-800">
            <span className="flex items-center gap-1.5 text-sky-400">
              <Activity size={14} />
              تله‌متری بلادرنگ حسگرها
            </span>
            <span className="font-mono text-[10px] text-emerald-400">PTP LOCKED</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800">
              <div className="text-slate-400">ارتعاشات RMS:</div>
              <div className="text-sm font-black font-mono text-white mt-0.5">
                {asset.telemetry.vibrationRms} <span className="text-[10px] font-normal text-slate-400">mm/s</span>
              </div>
            </div>
            <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800">
              <div className="text-slate-400">دمای یاتاقان:</div>
              <div className="text-sm font-black font-mono text-white mt-0.5">
                {asset.telemetry.temperature} <span className="text-[10px] font-normal text-slate-400">°C</span>
              </div>
            </div>
            <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800">
              <div className="text-slate-400">جریان الکتریکی:</div>
              <div className="text-sm font-black font-mono text-white mt-0.5">
                {asset.telemetry.current} <span className="text-[10px] font-normal text-slate-400">A</span>
              </div>
            </div>
            <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800">
              <div className="text-slate-400">فشار خط:</div>
              <div className="text-sm font-black font-mono text-white mt-0.5">
                {asset.telemetry.pressure} <span className="text-[10px] font-normal text-slate-400">Bar</span>
              </div>
            </div>
          </div>
        </div>

        {/* Level 3 Predictive Badge */}
        {(maturityMode === 'predictive' || maturityMode === 'autonomous') && (
          <div className="p-3 rounded-xl bg-purple-950/80 backdrop-blur-md border border-purple-500/40 text-xs shadow-xl pointer-events-auto">
            <div className="flex items-center gap-1.5 font-bold text-purple-300 mb-1">
              <Waves size={14} />
              <span>پیش‌آگهی عمر مفید باقیمانده (RUL)</span>
            </div>
            <div className="text-xl font-black font-mono text-white">
              {calculatedRulDays} <span className="text-xs font-normal text-purple-300">روز تا خستگی بحرانی</span>
            </div>
            <div className="text-[10px] text-purple-200 mt-1">
              ضریب اطمینان مدل پیش‌بین: ۹۲.۴٪ (منطبق با استاندارد ISO 13374)
            </div>
          </div>
        )}
      </div>

      {/* Floating HUD: Autonomous Action Banner (Level 4) */}
      {maturityMode === 'autonomous' && (
        <div className="absolute bottom-4 left-4 right-4 z-10 max-w-2xl mx-auto p-4 rounded-2xl bg-slate-900/95 backdrop-blur-lg border border-amber-500/50 shadow-2xl">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Sparkles size={18} />
              <span>فرمان خودکار هوشمند ویستا-نظم‌گر (سطح ۴ خودران)</span>
            </div>
            {autonomousActionResolved && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                اقدام ثبت شد
              </span>
            )}
          </div>
          <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
            به دلیل افزایش ارتعاش هارمونیک در بسامد ۱.۸ برابر دور کار و افزایش دمای یاتاقان سمت محرک، سیستم به‌صورت خودکار پیشنهاد کاهش سرعت دوران به ۱۲۰۰ RPM و رزرو بازرسی ارتعاشی در سیستم CMMS را صادر نموده است.
          </p>

          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={() => setAutonomousActionResolved('approved')}
              disabled={autonomousActionResolved !== null}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 disabled:opacity-50"
            >
              <Check size={14} />
              <span>تأیید اقدام خودکار و درج در CMMS</span>
            </button>
            <button
              onClick={() => setAutonomousActionResolved('rejected')}
              disabled={autonomousActionResolved !== null}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <X size={14} />
              <span>رد اقدام / ارجاع به اپراتور ارشد</span>
            </button>
          </div>
        </div>
      )}

      {/* Sensor Detail Inspection Drawer */}
      {selectedSensor && (
        <div className="absolute top-16 left-4 z-20 w-80 p-4 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-sky-500/40 shadow-2xl text-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="font-bold text-white flex items-center gap-2">
              <Gauge size={16} className="text-sky-400" />
              <span>بازرسی نقطه حسگری</span>
            </div>
            <button
              onClick={() => setSelectedSensor(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X size={16} />
            </button>
          </div>

          <div>
            <div className="font-semibold text-slate-200">{selectedSensor.nameFa}</div>
            <div className="text-[11px] font-mono text-slate-400 mt-0.5">{selectedSensor.id}</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-slate-400 text-[11px]">مقدار اندازه‌گیری‌شده لحظه‌ای:</div>
            <div className="text-2xl font-black font-mono text-white mt-1">
              {selectedSensor.value} <span className="text-xs font-normal text-sky-400">{selectedSensor.unit}</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-emerald-400 mt-1">
              <ShieldCheck size={12} />
              <span>دارای مهر رمزنگاری SHA-256 در بلوک حقیقت</span>
            </div>
          </div>

          <div className="space-y-1 text-[11px] text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">پروتکل ارتباطی:</span>
              <span className="font-mono text-sky-300">Modbus TCP / MQTT Sparkplug B</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">آخرین کالیبراسیون:</span>
              <span className="font-mono text-slate-200">۱۴۰۵/۰۲/۱۵</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">عدم قطعیت سنسور:</span>
              <span className="font-mono text-slate-200">±۰.۰۲ mm/s RMS</span>
            </div>
          </div>

          <a
            href={`#/vibration/${asset.id}`}
            className="w-full py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-sky-600/20"
          >
            <span>مشاهده طیف FFT و ارتعاشات عمیق</span>
            <ChevronRight size={14} />
          </a>
        </div>
      )}

      {/* Bottom Status Bar */}
      <div className="px-4 py-2 bg-slate-950/90 border-t border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-200 font-semibold">موتور سه‌بعدی Three.js فعال (WebGL 2.0)</span>
          </span>
          <span>نرخ فریم: ۶۰ FPS</span>
          <span>گره صنعتی: Edge-E (تأخیر &lt; ۱ میلی‌ثانیه)</span>
        </div>
        <div className="flex items-center gap-2">
          <span>کنترل‌ها: درگ برای چرخش، اسکرول برای زوم، کلیک روی گوی‌ها برای بازرسی</span>
        </div>
      </div>
    </div>
  );
};
