import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { MEDIA, ScrollTrigger } from '@animations';

const PALETTES = {
  light: {
    fog: new THREE.Color('#f4f6f8'),
    low: new THREE.Color('#e6edf5'),
    mid: new THREE.Color('#cbd5e1'),
    peak: new THREE.Color('#10b981'),
    wire: new THREE.Color('#94a3b8'),
    wireOpacity: 0.31,
    surfaceOpacity: 0.74,
    particleA: new THREE.Color('#94a3b8'),
    particleB: new THREE.Color('#10b981'),
    particleOpacity: 0.45,
    ambient: 0.92,
    directional: 0.78,
  },
  dark: {
    fog: new THREE.Color('#0b111e'),
    low: new THREE.Color('#09101d'),
    mid: new THREE.Color('#13253e'),
    peak: new THREE.Color('#14b8a6'),
    wire: new THREE.Color('#22d3ee'),
    wireOpacity: 0.27,
    surfaceOpacity: 0.82,
    particleA: new THREE.Color('#34d399'),
    particleB: new THREE.Color('#22d3ee'),
    particleOpacity: 0.54,
    ambient: 0.72,
    directional: 0.88,
  },
};

function createSoftParticleTexture() {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.38, 'rgba(255, 255, 255, 0.58)');
  grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Multi-octave procedural heightfield inspired by Bangladesh's topography:
 * rolling eastern highlands (+X) and a sinuous river-delta channel meandering across the plains.
 */
function sampleElevation(x, y, time, amp) {
  const eastRatio = Math.max(0, Math.min(1, (x + 18) / 36));
  const highlandBias = 0.52 + eastRatio * eastRatio * 1.22;

  const ridgeA = Math.sin(x * 0.23 + time * 0.4) * Math.cos(y * 0.25 - time * 0.26) * 1.18;
  const ridgeB = Math.sin(x * 0.46 - y * 0.34 + time * 0.52) * 0.48;
  const deltaCurrent = Math.cos(y * 0.58 + Math.sin(x * 0.19 + time * 0.28) * 1.5 - time * 0.38) * 0.28;
  const microContour = Math.sin(x * 1.02 + y * 0.88 + time * 0.7) * 0.11;

  // Sinuous river-delta valley carving gently across the central-western plains
  const riverAxis = x + 3.2 - Math.sin(y * 0.22 + time * 0.22) * 4.4;
  const riverChannel = Math.exp(-(riverAxis * riverAxis) / 14.0) * 0.72;

  return ((ridgeA + ridgeB + deltaCurrent + microContour) * highlandBias - riverChannel) * amp;
}

/**
 * Interactive Three.js 3D topographic wireframe + depth-shaded terrain & atmospheric mist
 * rendered strictly at z-0 behind the Hero section.
 * Syncs dynamically to Light Mode (silver/emerald mist) and Dark Mode (obsidian/glowing emerald-cyan),
 * tilts smoothly with mouse movement, scrubs forward via ScrollTrigger, and pauses off-screen via IntersectionObserver.
 */
export function HeroTerrain3D({ sectionRef }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const prefersReduced = window.matchMedia(MEDIA.reduceMotion).matches;
    const isMobile = window.matchMedia(MEDIA.mobile).matches;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isMobile,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return undefined;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const initialDark = document.documentElement.classList.contains('dark');
    const targetPalette = { current: initialDark ? PALETTES.dark : PALETTES.light };

    const activeFogColor = targetPalette.current.fog.clone();
    const activeLowColor = targetPalette.current.low.clone();
    const activeMidColor = targetPalette.current.mid.clone();
    const activePeakColor = targetPalette.current.peak.clone();
    const activeWireColor = targetPalette.current.wire.clone();
    const activeParticleA = targetPalette.current.particleA.clone();
    const activeParticleB = targetPalette.current.particleB.clone();

    scene.fog = new THREE.FogExp2(activeFogColor.getHex(), 0.04);

    const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 100);
    camera.position.set(0, 5.0, 12.4);
    camera.lookAt(0, -0.8, 0);

    const ambientLight = new THREE.AmbientLight(0xffffff, targetPalette.current.ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, targetPalette.current.directional);
    dirLight.position.set(8, 14, 10);
    scene.add(ambientLight, dirLight);

    // 1. Procedural 3D elevation surface + topographic wireframe mesh
    const segments = isMobile ? 48 : 112;
    const geometry = new THREE.PlaneGeometry(36, 26, segments, segments);
    const posAttr = geometry.attributes.position;
    const vertexCount = posAttr.count;
    const baseXY = new Float32Array(vertexCount * 2);
    const colors = new Float32Array(vertexCount * 3);

    for (let i = 0; i < vertexCount; i += 1) {
      baseXY[i * 2] = posAttr.getX(i);
      baseXY[i * 2 + 1] = posAttr.getY(i);
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const surfaceMaterial = new THREE.MeshLambertMaterial({
      vertexColors: true,
      transparent: true,
      opacity: targetPalette.current.surfaceOpacity,
      side: THREE.DoubleSide,
    });

    const wireMaterial = new THREE.MeshBasicMaterial({
      color: activeWireColor,
      wireframe: true,
      transparent: true,
      opacity: targetPalette.current.wireOpacity,
    });

    const terrainGroup = new THREE.Group();
    terrainGroup.rotation.x = -Math.PI * 0.37;
    terrainGroup.position.set(0, -2.15, -1.2);

    const surfaceMesh = new THREE.Mesh(geometry, surfaceMaterial);
    const wireMesh = new THREE.Mesh(geometry, wireMaterial);
    wireMesh.position.z = 0.026;
    terrainGroup.add(surfaceMesh, wireMesh);
    scene.add(terrainGroup);

    // 2. Dual-toned floating 3D atmospheric mist particles
    const particleCount = isMobile ? 115 : 270;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const particleMix = new Float32Array(particleCount);
    const particleSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i += 1) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 32;
      particlePositions[i * 3 + 1] = Math.random() * 8 - 1.4;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 18;
      particleMix[i] = Math.random();
      particleSpeeds[i] = 0.24 + Math.random() * 0.55;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const spriteTexture = createSoftParticleTexture();
    const particleMaterial = new THREE.PointsMaterial({
      vertexColors: true,
      size: isMobile ? 0.25 : 0.3,
      map: spriteTexture,
      transparent: true,
      opacity: targetPalette.current.particleOpacity,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    const resize = () => {
      const width = Math.max(container.clientWidth, 1);
      const height = Math.max(container.clientHeight, 1);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    // Dynamic Light / Dark theme sync
    const themeObserver = new MutationObserver(() => {
      const dark = document.documentElement.classList.contains('dark');
      targetPalette.current = dark ? PALETTES.dark : PALETTES.light;
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // Smooth mouse-driven camera tilt
    const pointer = { targetX: 0, targetY: 0, currentX: 0, currentY: 0 };
    const onPointerMove = (e) => {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      pointer.targetX = (e.clientX / Math.max(window.innerWidth, 1) - 0.5) * 2;
      pointer.targetY = (e.clientY / Math.max(window.innerHeight, 1) - 0.5) * 2;
    };
    if (!prefersReduced) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
    }

    // ScrollTrigger forward camera scrub
    const scrollState = { progress: 0 };
    let scrollTrigger = null;
    const triggerEl = sectionRef?.current ?? container;
    if (!prefersReduced && triggerEl) {
      scrollTrigger = ScrollTrigger.create({
        trigger: triggerEl,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          scrollState.progress = self.progress;
        },
      });
    }

    const tempColor = new THREE.Color();
    const syncParticleColors = () => {
      const pColorAttr = particleGeometry.attributes.color;
      for (let i = 0; i < particleCount; i += 1) {
        tempColor.copy(activeParticleA).lerp(activeParticleB, particleMix[i]);
        pColorAttr.setXYZ(i, tempColor.r, tempColor.g, tempColor.b);
      }
      pColorAttr.needsUpdate = true;
    };

    const updateTerrain = (time, amp) => {
      const colorAttr = geometry.attributes.color;
      for (let i = 0; i < vertexCount; i += 1) {
        const x = baseXY[i * 2];
        const y = baseXY[i * 2 + 1];
        const z = sampleElevation(x, y, time, amp);
        posAttr.setZ(i, z);

        const norm = Math.max(0, Math.min(1, (z + 1.9) / 4.1));
        if (norm < 0.58) {
          tempColor.copy(activeLowColor).lerp(activeMidColor, norm / 0.58);
        } else {
          tempColor.copy(activeMidColor).lerp(activePeakColor, ((norm - 0.58) / 0.42) * 0.65);
        }
        colorAttr.setXYZ(i, tempColor.r, tempColor.g, tempColor.b);
      }
      posAttr.needsUpdate = true;
      colorAttr.needsUpdate = true;
      geometry.computeVertexNormals();
    };

    let isVisible = true;
    let rafId = null;
    let lastTime = performance.now();
    let elapsed = 0;

    const renderFrame = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      if (!prefersReduced) {
        elapsed += dt;
      }

      const pal = targetPalette.current;
      const colorLerp = 0.08;
      activeFogColor.lerp(pal.fog, colorLerp);
      activeLowColor.lerp(pal.low, colorLerp);
      activeMidColor.lerp(pal.mid, colorLerp);
      activePeakColor.lerp(pal.peak, colorLerp);
      activeWireColor.lerp(pal.wire, colorLerp);
      activeParticleA.lerp(pal.particleA, colorLerp);
      activeParticleB.lerp(pal.particleB, colorLerp);

      scene.fog.color.copy(activeFogColor);
      wireMaterial.color.copy(activeWireColor);
      wireMaterial.opacity += (pal.wireOpacity - wireMaterial.opacity) * colorLerp;
      surfaceMaterial.opacity += (pal.surfaceOpacity - surfaceMaterial.opacity) * colorLerp;
      particleMaterial.opacity += (pal.particleOpacity - particleMaterial.opacity) * colorLerp;
      ambientLight.intensity += (pal.ambient - ambientLight.intensity) * colorLerp;
      dirLight.intensity += (pal.directional - dirLight.intensity) * colorLerp;
      syncParticleColors();

      // Smooth damped pointer inertia
      pointer.currentX += (pointer.targetX - pointer.currentX) * 0.055;
      pointer.currentY += (pointer.targetY - pointer.currentY) * 0.055;

      const sp = scrollState.progress;
      const amp = 1.0 + sp * 0.42;
      updateTerrain(elapsed, amp);

      if (!prefersReduced) {
        const pArr = particleGeometry.attributes.position.array;
        for (let i = 0; i < particleCount; i += 1) {
          pArr[i * 3 + 2] += dt * particleSpeeds[i];
          pArr[i * 3 + 1] += Math.sin(elapsed * 0.6 + i) * 0.002;
          if (pArr[i * 3 + 2] > 9) {
            pArr[i * 3 + 2] = -9;
          }
        }
        particleGeometry.attributes.position.needsUpdate = true;
      }

      // Camera mouse-tilt + ScrollTrigger forward fly-through
      camera.position.x = pointer.currentX * 1.55;
      camera.position.y = 5.0 - sp * 2.3 - pointer.currentY * 0.7;
      camera.position.z = 12.4 - sp * 5.4;
      camera.lookAt(pointer.currentX * 0.45, -0.8 - sp * 0.95, -1.2 - sp * 1.6);
      camera.rotation.z = -pointer.currentX * 0.028;

      renderer.render(scene, camera);

      if (isVisible && !prefersReduced) {
        rafId = window.requestAnimationFrame(renderFrame);
      } else {
        rafId = null;
      }
    };

    const startLoop = () => {
      if (rafId !== null) return;
      lastTime = performance.now();
      rafId = window.requestAnimationFrame(renderFrame);
    };

    const stopLoop = () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    syncParticleColors();
    updateTerrain(0, 1);
    renderer.render(scene, camera);

    // Pause requestAnimationFrame automatically when scrolled out of view
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          if (prefersReduced) renderer.render(scene, camera);
          else startLoop();
        } else {
          stopLoop();
        }
      },
      { threshold: 0 }
    );
    visibilityObserver.observe(container);

    if (!prefersReduced) startLoop();

    return () => {
      stopLoop();
      visibilityObserver.disconnect();
      resizeObserver.disconnect();
      themeObserver.disconnect();
      scrollTrigger?.kill();
      if (!prefersReduced) {
        window.removeEventListener('pointermove', onPointerMove);
      }
      geometry.dispose();
      particleGeometry.dispose();
      surfaceMaterial.dispose();
      wireMaterial.dispose();
      particleMaterial.dispose();
      spriteTexture?.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [sectionRef]);

  return (
    <div
      ref={containerRef}
      data-hero-terrain
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-92"
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-canvas via-canvas/75 to-transparent transition-colors duration-300 dark:from-[#0B111E] dark:via-[#0B111E]/80" />
    </div>
  );
}
