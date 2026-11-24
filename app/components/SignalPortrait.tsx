"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Signal Portrait — generative WebGL fingerprint (hand-written GLSL) plus a
 * particle bridge that carries the signal from the field into the data panel.
 *
 * Interactions:
 *  1. ambient → crystallize when `revealed` flips true
 *  2. magnetic pointer
 *  3. particle bridge: grains cover nearly the whole field, then fade into
 *     the card at `target` (NDC). Closing the card does not replay them.
 *  4. bot/automation → corrupted glitch state + red particles
 */
export type SignalPortraitProps = {
  seed: number[];
  revealed: boolean;
  bot: boolean;
  suspect: number;
  pulse: number;
  /** "out" flies particles into the card once, as it opens. */
  flow: "idle" | "out";
  target: [number, number] | null; // panel anchor in NDC (-1..1)
  className?: string;
};

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
`;

const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime; uniform vec2 uRes; uniform vec3 uSeed;
  uniform vec2 uMouse; uniform float uMouseStr; uniform float uIntro;
  uniform float uSuspect; uniform float uPerturb; uniform float uGlitch;
  uniform float uDim; uniform float uReduced;
  float hash(vec2 p){ p=fract(p*vec2(123.34,345.45)); p+=dot(p,p+34.345); return fract(p.x*p.y); }
  float noise(vec2 p){ vec2 i=floor(p),f=fract(p); f=f*f*(3.0-2.0*f);
    float a=hash(i),b=hash(i+vec2(1,0)),c=hash(i+vec2(0,1)),d=hash(i+vec2(1,1));
    return mix(mix(a,b,f.x),mix(c,d,f.x),f.y); }
  float fbm(vec2 p){ float v=0.0,a=0.5; for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.02; a*=0.5; } return v; }
  vec3 pal(float t){ vec3 a=vec3(0.52,0.30,0.34); vec3 b=vec3(0.50,0.34,0.28);
    vec3 c=vec3(1.0,0.92,0.84); vec3 d=vec3(0.0,0.11,0.62); return a+b*cos(6.28318*(c*t+d)); }
  void main(){
    float t = (uReduced > 0.5) ? 6.0 : uTime;
    vec2 uv=vUv; vec2 p=(uv-0.5); p.x*=uRes.x/uRes.y; p*=2.0;
    if(uGlitch>0.001){ float row=floor(uv.y*70.0); float jump=step(0.72,hash(vec2(row,floor(t*9.0))));
      float amt=(hash(vec2(row,floor(t*13.0)))-0.5); p.x+=amt*jump*uGlitch*0.3; }
    vec2 toMouse=uMouse-p; float md=length(toMouse);
    vec2 lean=normalize(toMouse+1e-4)*uMouseStr*0.35*exp(-md*1.1);
    float flow=t*0.04; vec2 q=p*1.4+lean+uSeed.xy*6.0;
    vec2 w1=vec2(fbm(q+flow),fbm(q+vec2(5.2,1.3)-flow));
    float warpAmt=1.6+uPerturb*1.2;
    vec2 w2=vec2(fbm(q+warpAmt*w1+1.7),fbm(q+warpAmt*w1+9.2));
    float f=fbm(q+warpAmt*w2+uSeed.z*3.0);
    // before the click: thin rings on a fixed centre, nudged off perfect
    // circles. the seed arrives with uIntro — offset, tighter spacing, full warp.
    float personal=smoothstep(0.36,1.0,uIntro);
    float calm=1.0-personal;
    float rad0=length(p);
    vec2 niggle=vec2(fbm(p*0.65+1.3),fbm(p*0.65+vec2(4.1,2.2)))-0.5;
    // homepage only: rings lean toward the cursor, never far enough to fold
    float mag=min(md*0.8,0.42*exp(-md*0.45));
    vec2 dent=normalize(toMouse+1e-4)*uMouseStr*mag*calm;
    vec2 bowed=p+niggle*0.2*calm*rad0-dent;
    vec2 fc=vec2(uSeed.x-0.5,uSeed.y-0.5)*0.5*personal;
    float radial=length(bowed-fc)*mix(12.0,9.0,personal);
    float freq=8.0+uSeed.x*4.0;
    // generic rings travel outward once per pad beat (55 Hz against 55.4 Hz)
    float drift=mix(0.40,0.05,personal);
    float v=radial+f*mix(0.1,freq*0.5,personal)+md*(0.5+uPerturb*2.0)*personal-t*drift;
    float gg=fract(v); float dl=min(gg,1.0-gg);
    float aa=fwidth(v)*0.9+0.0015; float lw=mix(0.012,0.14,personal);
    float line=1.0-smoothstep(lw,lw+aa*1.6,dl);
    float soft=smoothstep(0.35,0.65,f)*0.6;
    float structure=mix(line,mix(soft,line,clamp(uIntro,0.0,1.0)),personal);
    float reveal=smoothstep(uIntro*1.5-0.4,uIntro*1.5,1.0-length(p)*0.5);
    structure*=mix(0.6,1.0,reveal);
    float tone=radial*0.05+f*0.5+uSeed.y*0.3+flow;
    vec3 lineCol=pal(tone);
    lineCol=mix(lineCol,vec3(1.0,0.365,0.133),0.40);
    lineCol=mix(lineCol,vec3(1.0,0.23,0.23),uSuspect*0.6);
    float wash=smoothstep(0.3,0.7,f)*mix(0.02,0.10,personal);
    vec3 col=lineCol*structure+pal(tone)*wash*(1.0-structure);
    col*=0.9+0.6*structure; col=pow(col,vec3(0.92));
    float g=hash(uv*uRes+t*60.0); col+=(g-0.5)*0.045;
    if(uGlitch>0.001){ vec3 split=vec3(pal(tone+0.06*uGlitch).r,col.g,pal(tone-0.06*uGlitch).b);
      col=mix(col,split,0.6*uGlitch); col+=vec3(1.0,0.22,0.10)*(structure*0.9+0.10)*uGlitch;
      float scan=0.88+0.12*sin(uv.y*uRes.y*0.5); col*=mix(1.0,scan,uGlitch);
      col+=(hash(uv*uRes+t*140.0)-0.5)*0.12*uGlitch; }
    float vig=smoothstep(1.3,0.2,length(p)); col*=0.25+0.75*vig; col*=uDim;
    float gray=dot(col,vec3(0.299,0.587,0.114));
    float colorIn=smoothstep(0.32,1.0,uIntro);
    col=mix(vec3(gray),col,colorIn);
    float well=smoothstep(1.15,0.08,length(p));
    col*=mix(1.0,0.52,well*calm);
    gl_FragColor=vec4(col,1.0);
  }
`;

const PVERT = /* glsl */ `
  attribute vec2 aLocal; attribute float aSeed;
  uniform float uProg; uniform float uTime; uniform vec2 uTarget; uniform float uPixelRatio;
  uniform vec2 uHome; uniform float uHomeScale; uniform float uCardScale;
  varying float vA; varying float vSeed; varying float vMix;
  void main(){
    float cp=clamp(uProg,0.0,1.0); float e=1.0-pow(1.0-cp,1.6);
    vec2 start=uHome+aLocal*uHomeScale;
    vec2 endp=uTarget+aLocal*uCardScale;
    vec2 pos=mix(start,endp,e);
    float flight=sin(3.14159*e);
    pos+=vec2(sin(aSeed*25.0+uTime*1.5),cos(aSeed*19.0+uTime*1.3))*0.035*flight;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,0.0,1.0);
    float lift=step(0.001,uProg);
    float intoCard=1.0-smoothstep(0.32,0.72,uProg);
    vA=lift*intoCard;
    vSeed=aSeed; vMix=e;
    gl_PointSize=(2.4+4.8*fract(aSeed*53.0))*uPixelRatio*mix(1.05,0.72,e);
  }
`;
const PFRAG = /* glsl */ `
  precision highp float; varying float vA; varying float vSeed; varying float vMix; uniform float uBot;
  vec3 pal(float t){ vec3 a=vec3(0.52,0.30,0.34); vec3 b=vec3(0.50,0.34,0.28);
    vec3 c=vec3(1.0,0.92,0.84); vec3 d=vec3(0.0,0.11,0.62); return a+b*cos(6.28318*(c*t+d)); }
  void main(){
    vec2 c=gl_PointCoord-0.5; float d=length(c); float a=smoothstep(0.5,0.0,d)*vA;
    float tone=fract(vSeed*9.3);
    vec3 field=mix(pal(tone),pal(fract(tone+0.37)),0.35);
    vec3 accent=vec3(1.0,0.365,0.133);
    vec3 peach=vec3(1.0,0.86,0.72);
    vec3 warn=vec3(1.0,0.231,0.231);
    vec3 warnLight=vec3(1.0,0.72,0.58);
    field=mix(field,peach,0.86);
    field=mix(field,warnLight,uBot);
    vec3 card=mix(accent,warn,uBot);
    vec3 col=mix(field,card,smoothstep(0.2,0.88,vMix));
    gl_FragColor=vec4(col,a);
  }
`;

export default function SignalPortrait(props: SignalPortraitProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const s = useRef({
    seed: props.seed, suspect: props.suspect, bot: props.bot,
    introTarget: 0.3, intro: 0.3, glitchTarget: 0, glitch: 0,
    mx: 0, my: 0, mxT: 0, myT: 0, str: 0, strT: 0, perturb: 0,
    target: props.target, dir: 0, prog: 0,
  });

  useEffect(() => {
    s.current.suspect = props.suspect;
    s.current.seed = props.seed;
    s.current.introTarget = props.revealed ? 1 : 0.3;
    s.current.glitchTarget = props.bot ? 1 : 0;
  }, [props.suspect, props.seed, props.revealed, props.bot]);

  // Plays once as the card opens. Closing snaps the grains off so the next
  // open can play again, without a return flight.
  useEffect(() => {
    const st = s.current;
    if (props.target) st.target = props.target;
    if (props.flow === "out" && st.target) {
      st.bot = props.bot;
      if (st.prog < 1) st.dir = 1;
    } else if (props.flow === "idle") {
      st.dir = 0;
      st.prog = 0;
    }
  }, [props.flow, props.target, props.bot]);

  useEffect(() => { s.current.perturb = Math.min(1, s.current.perturb + 0.8); }, [props.pulse]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: "high-performance" });
    renderer.setClearColor(0x0a0a0b, 1);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const st = s.current;

    const uniforms: Record<string, THREE.IUniform> = {
      uTime: { value: 0 }, uRes: { value: new THREE.Vector2(1, 1) },
      uSeed: { value: new THREE.Vector3(st.seed[0] ?? 0.3, st.seed[1] ?? 0.6, st.seed[2] ?? 0.9) },
      uMouse: { value: new THREE.Vector2(0, 0) }, uMouseStr: { value: 0 },
      uIntro: { value: 0.3 }, uSuspect: { value: st.suspect }, uPerturb: { value: 0 },
      uGlitch: { value: 0 }, uDim: { value: 1 }, uReduced: { value: reduced ? 1 : 0 },
    };
    const material = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms });
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

    // Ridges span almost the whole frame, then the same shape gathers on the card.
    const N = 1800;
    const ridges = 22;
    const locals = new Float32Array(N * 2), seeds = new Float32Array(N);
    const perRidge = Math.ceil(N / ridges);
    for (let i = 0; i < N; i++) {
      const ridge = i % ridges;
      const along = Math.floor(i / ridges) / perRidge;
      const ang = along * Math.PI * 2 + ridge * 0.42;
      const rad = 0.04 + (ridge / (ridges - 1)) * 0.96;
      const wobble = Math.sin(ang * 5 + ridge * 1.7) * 0.012;
      locals[i * 2] = Math.cos(ang) * (rad + wobble);
      locals[i * 2 + 1] = Math.sin(ang) * (rad + wobble);
      seeds[i] = (i * 0.61803398875) % 1;
    }
    const pg = new THREE.BufferGeometry();
    pg.setAttribute("position", new THREE.BufferAttribute(new Float32Array(N * 3), 3));
    pg.setAttribute("aLocal", new THREE.BufferAttribute(locals, 2));
    pg.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    const pu: Record<string, THREE.IUniform> = {
      uProg: { value: 0 }, uTime: { value: 0 }, uTarget: { value: new THREE.Vector2(0.62, 0) },
      uHome: { value: new THREE.Vector2(0, 0) }, uHomeScale: { value: 0.96 }, uCardScale: { value: 0.22 },
      uPixelRatio: { value: dpr }, uBot: { value: 0 },
    };
    const pmat = new THREE.ShaderMaterial({
      uniforms: pu, vertexShader: PVERT, fragmentShader: PFRAG,
      transparent: true, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(pg, pmat); points.frustumCulled = false; scene.add(points);

    mount.appendChild(renderer.domElement);
    Object.assign(renderer.domElement.style, { width: "100%", height: "100%", display: "block" });

    function resize() {
      const w = mount!.clientWidth || 1, h = mount!.clientHeight || 1;
      renderer.setSize(w, h, false);
      (uniforms.uRes.value as THREE.Vector2).set(w * dpr, h * dpr);
    }
    resize();
    const ro = new ResizeObserver(resize); ro.observe(mount);

    function onPointer(e: PointerEvent) {
      const r = mount!.getBoundingClientRect();
      st.mxT = (((e.clientX - r.left) / r.width) * 2 - 1) * (r.width / r.height);
      st.myT = -(((e.clientY - r.top) / r.height) * 2 - 1); st.strT = 1;
    }
    const onLeave = () => { st.strT = 0; };
    mount.addEventListener("pointermove", onPointer);
    mount.addEventListener("pointerdown", onPointer);
    mount.addEventListener("pointerleave", onLeave);

    const clock = new THREE.Clock();
    let raf = 0;
    function frame() {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(clock.getDelta(), 0.05); const time = clock.elapsedTime;
      st.mx += (st.mxT - st.mx) * Math.min(1, dt * 6);
      st.my += (st.myT - st.my) * Math.min(1, dt * 6);
      st.str += (st.strT - st.str) * Math.min(1, dt * 4);
      st.intro += (st.introTarget - st.intro) * Math.min(1, dt * 1.6);
      st.glitch += (st.glitchTarget - st.glitch) * Math.min(1, dt * 3.5);
      st.perturb += (0 - st.perturb) * Math.min(1, dt * 1.5);

      if (reduced && st.dir !== 0) {
        st.prog = st.dir === 1 ? 1 : 0;
        st.dir = 0;
      } else if (st.dir === 1) {
        st.prog = Math.min(1, st.prog + dt / 0.85);
        if (st.prog >= 1) { st.prog = 1; st.dir = 0; }
      }
      if (st.target) (pu.uTarget.value as THREE.Vector2).set(st.target[0], st.target[1]);
      const prog = st.prog;
      pu.uProg.value = prog; pu.uTime.value = time; pu.uBot.value = st.bot ? 1 : 0;
      const act = prog > 0 && prog < 1 ? Math.sin(Math.PI * Math.min(1, prog / 0.85)) : 0;

      uniforms.uTime.value = time;
      (uniforms.uMouse.value as THREE.Vector2).set(st.mx, st.my);
      uniforms.uMouseStr.value = st.str; uniforms.uIntro.value = st.intro;
      uniforms.uSuspect.value += (st.suspect - uniforms.uSuspect.value) * Math.min(1, dt * 3);
      uniforms.uPerturb.value = st.perturb; uniforms.uGlitch.value = st.glitch;
      uniforms.uDim.value = 1 - 0.25 * act;
      (uniforms.uSeed.value as THREE.Vector3).set(st.seed[0] ?? 0.3, st.seed[1] ?? 0.6, st.seed[2] ?? 0.9);

      renderer.render(scene, camera);
    }
    frame();

    return () => {
      cancelAnimationFrame(raf); ro.disconnect();
      mount.removeEventListener("pointermove", onPointer);
      mount.removeEventListener("pointerdown", onPointer);
      mount.removeEventListener("pointerleave", onLeave);
      pg.dispose(); pmat.dispose(); material.dispose(); renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mountRef} className={props.className} aria-hidden="true" />;
}
