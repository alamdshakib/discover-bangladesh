import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { MEDIA, ScrollTrigger } from '@animations';

const PALETTES = {
  light: {
    fog: new THREE.Color('#f4f6f8'),
    low: new THREE.Color('#e8eef4'),
    mid: new THREE.Color('#cbd5e1'),
    peak: new THREE.Color('#10b981'),
    wire: new THREE.Color('#94a3b8'),
    wireOpacity: 0.28,
    surfaceOpacity: 0.72,
    particle: new THREE.Color('#64748b'),
    particleOpacity: 0.42,
    ambient: 0.9,
    directional: 0.75,
  },
  dark: {
    fog: new THREE.Color('#0b111e'),
    low: new THREE.Color('#0c1424'),
    mid: new THREE.Color('#1a2a44'),
    peak: new THREE.Color('#10b981'),
    wire: new THREE.Color('#38bdf8'),
    wireOpacity: 0.24,
    surfaceOpacity: 0.8,
    particle: new THREE.Color('#34d399'),
    particleOpacity: 0.48,
    ambient: 0.7,
    directional: 0.85,
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
  grad.addColorStop(0.35, 'rgba(255, 255, 255, 0.55)');
  grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Multi-octave procedural heightfield modeling Bangladesh's eastern highlands
 * (Sajek / Bandarban ridges on +X) tapering smoothly into fluid deltaic currents (-X / +Z).
 */
function sampleElevation(x, y, time, amp) {
  const eastRatio = Math.max(0, Math.min(1, (x + 18) / 36));
  const highlandBias = 0.55 + eastRatio * eastRatio * 1.15;

  const ridgeA = Math.sin(x * 0.24 + time * 0.42) * Math.cos(y * 0.26 - time * 0.28) * 1.15;
  const ridgeB = Math.sin((x * 0.48 - y * 0.36) + time * 0.55) * 0.46;
  const deltaWave = Math.cos(y * 0.62 + Math.sin(x * 0.18 + time * 0.3) * 1.4 - time * 0.4) * 0.26;
  const microDetail = Math.sin(x * 1.05 + y * 0.92 + time * 0.75) * 0.11;

  return (ridgeA + ridgeB + deltaWave + microDetail) * highlandBias * amp;
}

/**
 * Bespoke Three.js WebGL 3D topographic terrain & atmospheric mist backdrop for the Hero.
 * Automatically pauses off-screen via IntersectionObserver, syncs live with Light/Dark mode,
 * and scrubs a 3D camera fly-through via GSAP ScrollTrigger.
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
    const activeParticleColor = targetPalette.current.particle.clone();

    scene.fog = new THREE.FogExp2(activeFogColor.getHex(), 0.042);

    const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 100);
    camera.position.set(0, 4.9, 12.2);
    camera.lookAt(0, -0.8, 0);

    // Architectural studio lights
    const ambientLight = new THREE.AmbientLight(0xffffff, targetPalette.current.ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, targetPalette.current.directional);
    dirLight.position.set(8, 14, 10);
    scene.add(ambientLight, dirLight);

    // 1. Procedural 3D elevation mesh (110x110 desktop / 45x45 mobile)
    const segments = isMobile ? 45 : 110;
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
    wireMesh.position.z = 0.025;
    terrainGroup.add(surfaceMesh, wireMesh);
    scene.add(terrainGroup);

    // 2. Floating 3D atmospheric mist particles
    const particleCount = isMobile ? 110 : 260;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i += 1) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 32;
      particlePositions[i * 3 + 1] = Math.random() * 8 - 1.5;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 18;
      particleSpeeds[i] = 0.25 + Math.random() * 0.55;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const spriteTexture = createSoftParticleTexture();
    const particleMaterial = new THREE.PointsMaterial({
      color: activeParticleColor,
      size: isMobile ? 0.24 : 0.28,
      map: spriteTexture,
      transparent: true,
      opacity: targetPalette.current.particleOpacity,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // ResizeObserver for crisp layout matching
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

    // MutationObserver for live Light / Dark mode color transitions
    const themeObserver = new MutationObserver(() => {
      const dark = document.documentElement.classList.contains('dark');
      targetPalette.current = dark ? PALETTES.dark : PALETTES.light;
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // Pointer inertia state
    const pointer = { targetX: 0, targetY: 0, currentX: 0, currentY: 0 };
    const onPointerMove = (e) => {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      pointer.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    if (!isMobile && !prefersReduced) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
    }

    // ScrollTrigger 3D camera fly-through (scrub: 1)
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
    const updateTerrain = (time, amp) => {
      const colorAttr = geometry.attributes.color;
      for (let i = 0; i < vertexCount; i += 1) {
        const x = baseXY[i * 2];
        const y = baseXY[i * 2 + 1];
        const z = sampleElevation(x, y, time, amp);
        posAttr.setZ(i, z);

        const norm = Math.max(0, Math.min(1, (z + 1.8) / 4.0));
        if (norm < 0.62) {
          tempColor.copy(activeLowColor).lerp(activeMidColor, norm / 0.62);
        } else {
          tempColor.copy(activeMidColor).lerp(activePeakColor, ((norm - 0.62) / 0.38) * 0.55);
        }
        colorAttr.setXYZ(i, tempColor.r, tempColor.g, tempColor.b);
      }
      posAttr.needsUpdate = true;
      colorAttr.needsUpdate = true;
      geometry.computeVertexNormals();
    };

    // Pause animation loop automatically when Hero leaves viewport
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

      // Smooth theme color interpolation
      const pal = targetPalette.current;
      const colorLerp = 0.07;
      activeFogColor.lerp(pal.fog, colorLerp);
      activeLowColor.lerp(pal.low, colorLerp);
      activeMidColor.lerp(pal.mid, colorLerp);
      activePeakColor.lerp(pal.peak, colorLerp);
      activeWireColor.lerp(pal.wire, colorLerp);
      activeParticleColor.lerp(pal.particle, colorLerp);

      scene.fog.color.copy(activeFogColor);
      wireMaterial.color.copy(activeWireColor);
      wireMaterial.opacity += (pal.wireOpacity - wireMaterial.opacity) * colorLerp;
      surfaceMaterial.opacity += (pal.surfaceOpacity - surfaceMaterial.opacity) * colorLerp;
      particleMaterial.color.copy(activeParticleColor);
      particleMaterial.opacity += (pal.particleOpacity - particleMaterial.opacity) * colorLerp;
      ambientLight.intensity += (pal.ambient - ambientLight.intensity) * colorLerp;
      dirLight.intensity += (pal.directional - dirLight.intensity) * colorLerp;

      // Damped pointer inertia (0.05 smoothing)
      pointer.currentX += (pointer.targetX - pointer.currentX) * 0.05;
      pointer.currentY += (pointer.targetY - pointer.currentY) * 0.05;

      const sp = scrollState.progress;
      const amp = 1.0 + sp * 0.38;
      updateTerrain(elapsed, amp);

      // Drift atmospheric mist particles smoothly in Z-space
      if (!prefersReduced) {
        const pArr = particleGeometry.attributes.position.array;
        for (let i = 0; i < particleCount; i += 1) {
          pArr[i * 3 + 2] += dt * particleSpeeds[i];
          if (pArr[i * 3 + 2] > 9) {
            pArr[i * 3 + 2] = -9;
          }
        }
        particleGeometry.attributes.position.needsUpdate = true;
      }

      // Camera glide & damped orbit
      camera.position.x = pointer.currentX * 1.45;
      camera.position.y = 4.9 - sp * 2.1 - pointer.currentY * 0.65;
      camera.position.z = 12.2 - sp * 4.8;
      camera.lookAt(pointer.currentX * 0.4, -0.8 - sp * 0.9, -1.2 - sp * 1.5);
      camera.rotation.z = -pointer.currentX * 0.025;

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

    // Initial draw (also serves as clean static architectural backdrop for reduced-motion)
    updateTerrain(0, 1);
    renderer.render(scene, camera);

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
      if (!isMobile && !prefersReduced) {
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
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] overflow-hidden opacity-90 sm:h-[680px] lg:h-[780px]"
    >
      {/* Subtle architectural gradient fade so the 3D terrain melts seamlessly into the canvas */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-canvas via-canvas/70 to-transparent transition-colors duration-300 dark:from-[#0B111E] dark:via-[#0B111E]/75" />
    </div>
  );
}
