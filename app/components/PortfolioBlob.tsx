"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

/**
 * PortfolioBlob — small glassy blob that masks Ward's avatar and links into the
 * portfolio. Fixed top-right so it rides on every home state (human / bot / landing).
 * Raw three.js (the demo has no R3F); matches the signal-blob prototype settings.
 */

const SNOISE = `
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+2.0*C.xxx; vec3 x3=x0-1.0+3.0*C.xxx;
  i=mod(i,289.0);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=1.0/7.0; vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z); vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

export default function PortfolioBlob() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hoverRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const SIZE = 76;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(SIZE, SIZE, false);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 4.4);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;

    const key = new THREE.DirectionalLight(0xffffff, 0.5); key.position.set(2, 3, 4); scene.add(key);
    const rim = new THREE.DirectionalLight(0xff5d22, 0.5); rim.position.set(-3, -1, 2); scene.add(rim);

    const backing = new THREE.Mesh(
      new THREE.CircleGeometry(1.5, 64),
      new THREE.MeshBasicMaterial({ color: 0x0e0b16, toneMapped: false })
    );
    backing.position.z = -0.72;
    scene.add(backing);

    const photoMat = new THREE.MeshBasicMaterial({ toneMapped: false });
    const photo = new THREE.Mesh(new THREE.CircleGeometry(1.45, 64), photoMat);
    photo.position.z = -0.5;
    scene.add(photo);
    new THREE.TextureLoader().load("/ward.jpg", (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      photoMat.map = t;
      photoMat.needsUpdate = true;
    });

    const mat = new THREE.MeshPhysicalMaterial({
      transmission: 1, metalness: 0, roughness: 0.08, ior: 1.19, thickness: 0.7,
      iridescence: 0.12, iridescenceIOR: 1.3, clearcoat: 0,
      envMapIntensity: 0.2, color: 0xffffff, attenuationColor: new THREE.Color(0xffd9c4),
      attenuationDistance: 3,
    });

    let shader: any = null;
    mat.onBeforeCompile = (s: any) => {
      s.uniforms.uTime = { value: 0 };
      s.uniforms.uAmp = { value: 0.03 };
      s.uniforms.uFreq = { value: 0.55 };
      s.uniforms.uSpeed = { value: reduce ? 0 : 0.45 };
      shader = s;
      s.vertexShader =
        `uniform float uTime; uniform float uAmp; uniform float uFreq; uniform float uSpeed;
         ${SNOISE}
         float disp(vec3 p){ return snoise(p*uFreq + vec3(0.0,0.0,uTime*uSpeed)); }
        ` + s.vertexShader;
      s.vertexShader = s.vertexShader.replace("#include <beginnormal_vertex>", `
        float e = 0.0016;
        vec3 n0 = normalize(normal);
        vec3 t1 = normalize(cross(n0, abs(n0.y) < 0.99 ? vec3(0.0,1.0,0.0) : vec3(1.0,0.0,0.0)));
        vec3 t2 = normalize(cross(n0, t1));
        float d0 = disp(position)      * uAmp;
        float d1 = disp(position+t1*e) * uAmp;
        float d2 = disp(position+t2*e) * uAmp;
        vec3 pA = position + n0*d0;
        vec3 pB = (position + t1*e) + n0*d1;
        vec3 pC = (position + t2*e) + n0*d2;
        vec3 objectNormal = normalize(cross(pB-pA, pC-pA));
        if (dot(objectNormal, n0) < 0.0) objectNormal = -objectNormal;
        #ifdef USE_TANGENT
          vec3 objectTangent = vec3( tangent.xyz );
        #endif
      `);
      s.vertexShader = s.vertexShader.replace("#include <begin_vertex>", `
        vec3 transformed = position + normalize(normal) * (disp(position) * uAmp);
      `);
    };

    const blob = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 96), mat);
    scene.add(blob);

    const cur = { amp: 0.03, speed: reduce ? 0 : 0.45, size: 1.5 };
    const clock = new THREE.Clock();
    let t = 0, raf = 0, alive = true;

    const tick = () => {
      if (!alive) return;
      raf = requestAnimationFrame(tick);
      const dt = clock.getDelta();
      if (!reduce) t += dt;
      const h = hoverRef.current;
      cur.amp += ((h ? 0.07 : 0.03) - cur.amp) * 0.08;
      cur.speed += ((reduce ? 0 : h ? 0.85 : 0.45) - cur.speed) * 0.08;
      cur.size += ((h ? 1.56 : 1.5) - cur.size) * 0.1;
      blob.scale.setScalar(cur.size);
      if (shader) {
        shader.uniforms.uTime.value = t;
        shader.uniforms.uAmp.value = cur.amp;
        shader.uniforms.uSpeed.value = cur.speed;
      }
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      blob.geometry.dispose();
      mat.dispose();
      backing.geometry.dispose();
      (backing.material as THREE.Material).dispose();
      photo.geometry.dispose();
      photoMat.dispose();
      if (photoMat.map) photoMat.map.dispose();
      envRT.dispose();
      pmrem.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <a
      href="/portfolio/"
      className="pblob"
      aria-label="Open to work. Check my portfolio."
      onMouseEnter={() => { hoverRef.current = true; }}
      onMouseLeave={() => { hoverRef.current = false; }}
    >
      <canvas ref={canvasRef} className="pblob-canvas" width={76} height={76} />
      <div className="pblob-tags">
        <span className="pblob-tag status">Open to work</span>
        <span className="pblob-tag link">Check my portfolio →</span>
      </div>
      <style>{`
        .pblob{position:fixed;top:24px;right:24px;z-index:50;display:flex;flex-direction:column;align-items:flex-end;gap:.5rem;text-decoration:none;}
        .pblob-canvas{width:70px;height:70px;display:block;}
        .pblob-tags{display:flex;flex-direction:column;align-items:flex-end;gap:.1rem;font-family:var(--font-geist-mono),ui-monospace,monospace;font-size:.6rem;letter-spacing:.1em;text-transform:uppercase;text-align:right;line-height:1.3;}
        .pblob-tag{white-space:nowrap;}
        .pblob-tag.status{color:var(--fg-dim,#9a968f);}
        .pblob-tag.link{color:var(--accent,#ff5d22);opacity:0;transform:translateY(-3px);transition:opacity .22s ease,transform .22s ease;}
        .pblob:hover .pblob-tag.link{opacity:1;transform:none;}
        @media (prefers-reduced-motion:reduce){.pblob-tag.link{transition:none;}}
      `}</style>
    </a>
  );
}
