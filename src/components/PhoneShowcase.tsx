"use client";

import { useEffect, useRef, useState } from "react";
import { projectArt, screenSrc } from "@/lib/art";

type Api = {
  setArt: (key: string, idx?: number) => void;
  dispose: () => void;
};

/**
 * A draggable 3D phone rendered with plain three.js — no react-three-fiber,
 * no drei. three is dynamically imported only once the section is close to
 * the viewport, so it never touches the initial bundle.
 */
export default function PhoneShowcase({ artKey, screen = 0 }: { artKey: string; screen?: number }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<Api | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let cancelled = false;

    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        void boot();
      },
      { rootMargin: "300px" },
    );
    io.observe(mount);

    async function boot() {
      let THREE: typeof import("three");
      let RoundedBoxGeometry: typeof import("three/examples/jsm/geometries/RoundedBoxGeometry.js")["RoundedBoxGeometry"];
      try {
        [THREE, { RoundedBoxGeometry }] = await Promise.all([
          import("three"),
          import("three/examples/jsm/geometries/RoundedBoxGeometry.js"),
        ]);
      } catch {
        setFailed(true);
        return;
      }
      if (cancelled || !mount) return;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(mount.clientWidth, mount.clientHeight, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.display = "block";
      mount.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        30,
        mount.clientWidth / mount.clientHeight,
        0.1,
        100,
      );
      camera.position.set(0, 0, 8.6);

      const group = new THREE.Group();
      scene.add(group);

      // --- phone body ---
      const body = new THREE.Mesh(
        new RoundedBoxGeometry(1.66, 3.36, 0.17, 6, 0.16),
        new THREE.MeshStandardMaterial({
          color: 0x1b1f2e,
          roughness: 0.32,
          metalness: 0.85,
        }),
      );
      group.add(body);

      // rim light strip along the edge
      const rim = new THREE.Mesh(
        new RoundedBoxGeometry(1.7, 3.4, 0.12, 5, 0.17),
        new THREE.MeshBasicMaterial({ color: 0x8ef07a, transparent: true, opacity: 0.1 }),
      );
      group.add(rim);

      // --- screen ---
      const screenMat = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
      const screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 3.16), screenMat);
      screenMesh.position.z = 0.0885;
      group.add(screenMesh);

      // camera bump + side buttons for believability
      const lens = new THREE.Mesh(
        new THREE.CircleGeometry(0.045, 24),
        new THREE.MeshBasicMaterial({ color: 0x05070c }),
      );
      lens.position.set(0, 1.44, 0.09);
      group.add(lens);

      const btnMat = new THREE.MeshStandardMaterial({
        color: 0x2b3145,
        roughness: 0.4,
        metalness: 0.9,
      });
      const power = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.34, 0.1), btnMat);
      power.position.set(0.845, 0.55, 0);
      group.add(power);
      const vol = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.52, 0.1), btnMat);
      vol.position.set(-0.845, 0.72, 0);
      group.add(vol);

      // --- lights ---
      scene.add(new THREE.AmbientLight(0xffffff, 0.55));
      const key = new THREE.DirectionalLight(0xffffff, 2.1);
      key.position.set(3, 4, 6);
      scene.add(key);
      const acid = new THREE.PointLight(0x8ef07a, 22, 14);
      acid.position.set(-3, 1.6, 3);
      scene.add(acid);
      const violet = new THREE.PointLight(0x9b6bf7, 18, 14);
      violet.position.set(3.2, -2, 2.2);
      scene.add(violet);

      // --- texture from the procedural SVG ---
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 1056;
      const ctx = canvas.getContext("2d");
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
      screenMat.map = texture;
      screenMat.needsUpdate = true;

      let flash = 0;
      const setArt = (k: string, idx = 0) => {
        if (!ctx) return;
        const photo = screenSrc(k, idx);
        const svg = projectArt[k];
        if (!photo && !svg) return;

        const url = photo
          ? photo
          : URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          // cover-fit so a real screenshot of any aspect fills the screen
          const s = Math.max(canvas.width / img.width, canvas.height / img.height);
          const w = img.width * s;
          const h = img.height * s;
          ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
          texture.needsUpdate = true;
          if (!photo) URL.revokeObjectURL(url);
          flash = 1;
        };
        img.onerror = () => {
          if (!photo) URL.revokeObjectURL(url);
        };
        img.src = url;
      };

      // --- interaction ---
      const rot = { x: -0.06, y: -0.42, vx: 0, vy: 0 };
      const target = { x: -0.06, y: -0.42 };
      let dragging = false;
      let lastX = 0;
      let lastY = 0;
      let idle = 0;

      const onDown = (e: PointerEvent) => {
        dragging = true;
        idle = 0;
        lastX = e.clientX;
        lastY = e.clientY;
        renderer.domElement.setPointerCapture(e.pointerId);
      };
      const onMove = (e: PointerEvent) => {
        if (!dragging) return;
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;
        target.y += dx * 0.008;
        target.x = Math.max(-0.6, Math.min(0.6, target.x + dy * 0.006));
        idle = 0;
      };
      const onUp = () => {
        dragging = false;
      };
      const el = renderer.domElement;
      el.style.touchAction = "pan-y";
      el.addEventListener("pointerdown", onDown);
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerup", onUp);
      el.addEventListener("pointercancel", onUp);

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const resize = () => {
        if (!mount.clientWidth) return;
        renderer.setSize(mount.clientWidth, mount.clientHeight, false);
        camera.aspect = mount.clientWidth / mount.clientHeight;
        camera.updateProjectionMatrix();
      };
      const ro = new ResizeObserver(resize);
      ro.observe(mount);

      let visible = true;
      const vis = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
      });
      vis.observe(mount);

      let raf = 0;
      let t = 0;
      const tick = () => {
        raf = requestAnimationFrame(tick);
        if (!visible || document.visibilityState !== "visible") return;
        t += 0.016;
        if (!dragging) {
          idle += 0.016;
          if (idle > 1.6 && !reduce) target.y += 0.0022;
        }
        rot.y += (target.y - rot.y) * 0.09;
        rot.x += (target.x - rot.x) * 0.09;
        group.rotation.y = rot.y;
        group.rotation.x = rot.x + (reduce ? 0 : Math.sin(t * 0.7) * 0.02);
        group.position.y = reduce ? 0 : Math.sin(t * 0.9) * 0.045;

        if (flash > 0) {
          flash = Math.max(0, flash - 0.05);
          (rim.material as import("three").MeshBasicMaterial).opacity = 0.1 + flash * 0.35;
        }
        renderer.render(scene, camera);
      };
      raf = requestAnimationFrame(tick);

      setArt(artKey, screen);
      setReady(true);

      apiRef.current = {
        setArt,
        dispose: () => {
          cancelAnimationFrame(raf);
          ro.disconnect();
          vis.disconnect();
          el.removeEventListener("pointerdown", onDown);
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerup", onUp);
          el.removeEventListener("pointercancel", onUp);
          texture.dispose();
          scene.traverse((o) => {
            const m = o as import("three").Mesh;
            if (m.geometry) m.geometry.dispose();
            const mat = m.material as import("three").Material | import("three").Material[];
            if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
            else if (mat) mat.dispose();
          });
          renderer.dispose();
          el.remove();
        },
      };
    }

    return () => {
      cancelled = true;
      io.disconnect();
      apiRef.current?.dispose();
      apiRef.current = null;
    };
    // artKey intentionally excluded — swapped through the imperative api below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    apiRef.current?.setArt(artKey, screen);
  }, [artKey, screen]);

  return (
    <div className="relative h-full w-full">
      <div ref={mountRef} className="h-full w-full" />

      {/* Fallback: the flat art, shown until WebGL is up (or if it never is) */}
      {(!ready || failed) && (
        <div
          className="pointer-events-none absolute inset-0 grid place-items-center p-6"
          aria-hidden
        >
          {screenSrc(artKey, screen) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={screenSrc(artKey, screen) as string}
              alt=""
              className="h-full max-h-[420px] w-auto rounded-[26px] border border-line object-cover"
            />
          ) : (
            <div
              className="h-full max-h-[420px] overflow-hidden rounded-[26px] border border-line [&>svg]:h-full [&>svg]:w-auto"
              dangerouslySetInnerHTML={{ __html: projectArt[artKey] ?? "" }}
            />
          )}
        </div>
      )}

      {ready && !failed && (
        <p className="pointer-events-none absolute inset-x-0 bottom-1 text-center font-mono text-[10px] text-muted/70">
          drag to rotate
        </p>
      )}
    </div>
  );
}
