import {
  ACESFilmicToneMapping,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  CatmullRomCurve3,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  Group,
  type Material,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PMREMGenerator,
  PointLight,
  RingGeometry,
  Scene,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/**
 * Four floating tape rolls (foam, VHB with red liner, clear nano, masking) built from plain
 * geometry — no model files to download. Lazy-loaded on desktop only, after the page is idle.
 */

type RollSpec = {
  outer: number;
  inner: number;
  height: number;
  side: Material;
  face: { base: string; line: string; lineAlpha: number; core?: string; stripe?: string };
  faceMaterial?: Material;
  strip?: Material;
  position: [number, number, number];
  rotation: [number, number, number];
  spin: number;
};

function faceTexture({ base, line, lineAlpha, core, stripe }: RollSpec["face"], inner: number, outer: number) {
  const size = 512;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const mid = size / 2;
  const innerPx = (inner / outer) * mid;
  ctx.fillStyle = base;
  ctx.beginPath();
  ctx.arc(mid, mid, mid, 0, Math.PI * 2);
  ctx.fill();
  // wound layers
  for (let r = innerPx; r < mid; r += 2.2) {
    const isStripe = stripe && Math.round(r) % 9 === 0;
    ctx.strokeStyle = isStripe ? stripe : line;
    ctx.globalAlpha = isStripe ? 0.9 : lineAlpha * (0.5 + Math.random() * 0.5);
    ctx.lineWidth = isStripe ? 1.6 : 1;
    ctx.beginPath();
    ctx.arc(mid, mid, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  // cardboard core
  if (core) {
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(mid, mid, innerPx + mid * 0.07, 0, Math.PI * 2);
    ctx.arc(mid, mid, innerPx, 0, Math.PI * 2, true);
    ctx.fill();
  }
  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/** A ribbon that leaves the roll tangentially and curls away. */
function stripGeometry(R: number, h: number) {
  const pts = [
    [0, -R * 0.995],
    [0.55 * R, -R * 1.0],
    [1.15 * R, -R * 1.07],
    [1.65 * R, -R * 1.3],
    [1.95 * R, -R * 1.7],
    [2.0 * R, -R * 2.15],
  ].map(([x, z]) => new Vector3(x, 0, z));
  const curve = new CatmullRomCurve3(pts, false, "centripetal");
  const N = 48;
  const pos = new Float32Array((N + 1) * 2 * 3);
  const uv = new Float32Array((N + 1) * 2 * 2);
  const idx: number[] = [];
  for (let i = 0; i <= N; i++) {
    const p = curve.getPoint(i / N);
    pos.set([p.x, -h / 2, p.z, p.x, h / 2, p.z], i * 6);
    uv.set([i / N, 0, i / N, 1], i * 4);
    if (i < N) {
      const a = i * 2;
      idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new BufferAttribute(pos, 3));
  g.setAttribute("uv", new BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

function makeRoll(spec: RollSpec) {
  const { outer: R, inner: r, height: h } = spec;
  const group = new Group();
  group.add(new Mesh(new CylinderGeometry(R, R, h, 96, 1, true), spec.side));
  const innerMat = spec.face.core
    ? new MeshStandardMaterial({ color: spec.face.core, roughness: 0.9, side: BackSide })
    : spec.side;
  group.add(new Mesh(new CylinderGeometry(r, r, h, 64, 1, true), innerMat));
  const faceMat =
    spec.faceMaterial ??
    new MeshStandardMaterial({ map: faceTexture(spec.face, r, R), roughness: 0.7, side: DoubleSide });
  const ring = new RingGeometry(r, R, 96, 1);
  const top = new Mesh(ring, faceMat);
  top.rotation.x = -Math.PI / 2;
  top.position.y = h / 2;
  const bottom = new Mesh(ring, faceMat);
  bottom.rotation.x = Math.PI / 2;
  bottom.position.y = -h / 2;
  group.add(top, bottom);
  if (spec.strip) group.add(new Mesh(stripGeometry(R, h * 0.98), spec.strip));
  group.position.set(...spec.position);
  group.rotation.set(...spec.rotation);
  group.userData.spin = spec.spin;
  return group;
}

export type TapeScene = { dispose: () => void };

/** Let the browser breathe between setup steps so no single task blocks input for long. */
const yieldToMain = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

export function createTapeScene(container: HTMLElement, trackEl: HTMLElement, onReady: () => void): TapeScene {
  let disposed = false;
  const cleanups: (() => void)[] = [];
  const teardown = () => cleanups.splice(0).reverse().forEach((fn) => fn());

  const init = async () => {
    const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.domElement.style.cssText = "width:100%;height:100%;display:block";
    container.appendChild(renderer.domElement);
    const scene = new Scene();
    cleanups.push(() => {
      scene.traverse((obj) => {
        if (obj instanceof Mesh) {
          obj.geometry.dispose();
          const mat = obj.material as MeshStandardMaterial;
          mat.map?.dispose();
          mat.dispose();
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    });

    await yieldToMain();
    if (disposed) return;
    const pmrem = new PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    pmrem.dispose();
    cleanups.push(() => envRT.dispose());
    scene.environment = envRT.texture;
    scene.environmentIntensity = 0.85;

    const camera = new PerspectiveCamera(32, 1, 0.1, 50);
    camera.position.set(0, 0, 8);
    const key = new DirectionalLight("#ffffff", 1.6);
    key.position.set(-3, 4, 5);
    const rim = new PointLight("#e5462b", 28, 12, 1.6);
    rim.position.set(2.5, -1.5, -2.5);
    const warm = new PointLight("#f1c84b", 10, 10, 1.8);
    warm.position.set(-2.8, 2.5, 1.5);
    scene.add(key, rim, warm);

    const redFilm = new MeshPhysicalMaterial({ color: "#d63c22", roughness: 0.28, clearcoat: 0.8, clearcoatRoughness: 0.2, side: DoubleSide });
    // Glassy look without `transmission` (which costs an extra render pass and a heavy shader).
    const clear = new MeshPhysicalMaterial({
      color: "#d4ecfb",
      roughness: 0.05,
      transparent: true,
      opacity: 0.5,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      ior: 1.47,
      depthWrite: false,
      side: DoubleSide,
    });
    const foam = new MeshStandardMaterial({ color: "#f3f0e8", roughness: 0.82 });
    const liner = new MeshStandardMaterial({ color: "#fbfaf6", roughness: 0.55, side: DoubleSide });
    const masking = new MeshStandardMaterial({ color: "#e7bf55", roughness: 0.92 });

    const specs: RollSpec[] = [
      {
        outer: 1.05, inner: 0.64, height: 0.62, side: foam, strip: liner,
        face: { base: "#ece7dc", line: "#000", lineAlpha: 0.07, core: "#b98b5b" },
        position: [0.25, 0.35, 0], rotation: [1.05, 0.2, 0.35], spin: 0.25,
      },
      {
        outer: 0.78, inner: 0.52, height: 0.36, side: redFilm, strip: redFilm,
        face: { base: "#45474d", line: "#000", lineAlpha: 0.25, core: "#b98b5b", stripe: "#d63c22" },
        position: [-1.45, -1.05, 0.7], rotation: [0.55, 0.9, -0.2], spin: -0.35,
      },
      {
        outer: 0.72, inner: 0.46, height: 0.5, side: clear, faceMaterial: clear, strip: clear,
        face: { base: "#fff", line: "#fff", lineAlpha: 0 },
        position: [1.55, -1.05, 0.5], rotation: [1.25, -0.4, -0.5], spin: 0.3,
      },
      {
        outer: 0.56, inner: 0.38, height: 0.42, side: masking,
        face: { base: "#ddb24d", line: "#6b4a10", lineAlpha: 0.12, core: "#a77a4a" },
        position: [-1.3, 1.35, -0.9], rotation: [0.85, -0.35, 0.6], spin: -0.2,
      },
    ];
    const stage = new Group();
    scene.add(stage);
    const rolls: Group[] = [];
    for (const spec of specs) {
      await yieldToMain();
      if (disposed) return;
      const roll = makeRoll(spec);
      rolls.push(roll);
      stage.add(roll);
    }
    const base = rolls.map((r) => r.position.clone());

    /* sizing */
    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.position.z = width / height < 1 ? 9.5 : 8;
      camera.updateProjectionMatrix();
    };
    resize();

    // Compile shaders off the main thread where the GPU driver allows it (KHR_parallel_shader_compile).
    await renderer.compileAsync(scene, camera);
    if (disposed) return;

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    cleanups.push(() => ro.disconnect());

    /* input */
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointer = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    cleanups.push(() => window.removeEventListener("pointermove", onPointer));

    /* loop, paused when off-screen or tab hidden */
    let visible = true;
    let raf = 0;
    let last = performance.now();
    let t = 0;
    let scroll = 0;
    let first = true;
    const loop = () => {
      cancelAnimationFrame(raf);
      if (!visible || document.hidden || disposed) return;
      raf = requestAnimationFrame(loop);
      const now = performance.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      t += dt;
      const rect = trackEl.getBoundingClientRect();
      const target = Math.min(1, Math.max(0, -rect.top / rect.height));
      scroll += (target - scroll) * 0.08;
      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;

      stage.rotation.y = pointer.x * 0.35 + scroll * 0.9;
      stage.rotation.x = pointer.y * 0.2 + scroll * 0.35;
      stage.position.y = scroll * 1.4;
      rolls.forEach((roll, i) => {
        const spread = 1 + scroll * 0.55;
        roll.position.set(base[i].x * spread, base[i].y * spread + Math.sin(t * 0.9 + i * 1.7) * 0.09, base[i].z);
        roll.rotateY(dt * roll.userData.spin * (1 + scroll * 6));
      });
      renderer.render(scene, camera);
      if (first) {
        first = false;
        onReady();
      }
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) loop();
    });
    io.observe(container);
    const onVisibility = () => {
      last = performance.now();
      loop();
    };
    document.addEventListener("visibilitychange", onVisibility);
    cleanups.push(() => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    });
    loop();
  };

  init().catch(teardown);

  return {
    dispose() {
      disposed = true;
      teardown();
    },
  };
}
