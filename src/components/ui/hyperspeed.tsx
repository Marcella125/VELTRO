"use client";

import { useEffect, useMemo, useRef } from "react";
import clsx from "clsx";
import Image from "next/image";
import * as THREE from "three";
import { assetPath } from "@/lib/asset-path";
import {
  BloomEffect,
  EffectComposer,
  EffectPass,
  RenderPass,
  SMAAEffect,
  SMAAPreset,
} from "postprocessing";

type DistortionUniformValue = THREE.Vector2 | THREE.Vector3 | THREE.Vector4 | number;

type Distortion = {
  createUniforms: () => Record<string, { value: DistortionUniformValue }>;
  glsl: string;
  getJS?: (
    progress: number,
    time: number,
    uniforms: Record<string, { value: DistortionUniformValue }>
  ) => THREE.Vector3;
};

type DistortionPreset =
  | "mountainDistortion"
  | "xyDistortion"
  | "LongRaceDistortion"
  | "turbulentDistortion"
  | "turbulentDistortionStill"
  | "deepDistortion"
  | "deepDistortionStill";

type HyperspeedColorOptions = {
  roadColor: number;
  islandColor: number;
  background: number;
  shoulderLines: number;
  brokenLines: number;
  leftCars: number[];
  rightCars: number[];
  sticks: number;
};

type HyperspeedOptions = {
  distortion?: DistortionPreset;
  length: number;
  roadWidth: number;
  islandWidth: number;
  lanesPerRoad: number;
  fov: number;
  fovSpeedUp: number;
  speedUp: number;
  carLightsFade: number;
  totalSideLightSticks: number;
  lightPairsPerRoadWay: number;
  shoulderLinesWidthPercentage: number;
  brokenLinesWidthPercentage: number;
  brokenLinesLengthPercentage: number;
  lightStickWidth: [number, number];
  lightStickHeight: [number, number];
  movingAwaySpeed: [number, number];
  movingCloserSpeed: [number, number];
  carLightsLength: [number, number];
  carLightsRadius: [number, number];
  carWidthPercentage: [number, number];
  carShiftX: [number, number];
  carFloorSeparation: [number, number];
  colors: HyperspeedColorOptions;
};

export interface HyperspeedProps {
  className?: string;
  duration?: number;
  onComplete?: () => void;
  reducedMotion?: boolean;
  effectOptions?: Partial<HyperspeedOptions>;
  showLogoOverlay?: boolean;
}

const defaultOptions: HyperspeedOptions = {
  distortion: "turbulentDistortion",
  length: 400,
  roadWidth: 10,
  islandWidth: 2,
  lanesPerRoad: 4,
  fov: 90,
  fovSpeedUp: 150,
  speedUp: 2,
  carLightsFade: 0.4,
  totalSideLightSticks: 20,
  lightPairsPerRoadWay: 40,
  shoulderLinesWidthPercentage: 0.05,
  brokenLinesWidthPercentage: 0.1,
  brokenLinesLengthPercentage: 0.5,
  lightStickWidth: [0.12, 0.5],
  lightStickHeight: [1.3, 1.7],
  movingAwaySpeed: [60, 80],
  movingCloserSpeed: [-120, -160],
  carLightsLength: [12, 80],
  carLightsRadius: [0.05, 0.14],
  carWidthPercentage: [0.3, 0.5],
  carShiftX: [-0.8, 0.8],
  carFloorSeparation: [0, 5],
  colors: {
    roadColor: 0x050505,
    islandColor: 0x090304,
    background: 0x000000,
    shoulderLines: 0xf2eee8,
    brokenLines: 0xd6d0c9,
    leftCars: [0xc8102e, 0x8f071c, 0x5e020f],
    rightCars: [0xf2eee8, 0xd8d0c7, 0xc8102e],
    sticks: 0xc8102e,
  },
};

const INTRO_BLACK_START = 0.82;
const ROAD_FADE_START = 0.8;
const ROAD_FADE_END = 0.93;
const LOGO_REVEAL_START = 0.93;

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

const smoothstep = (min: number, max: number, value: number) => {
  const x = clamp01((value - min) / (max - min));
  return x * x * (3 - 2 * x);
};

function nsin(value: number) {
  return Math.sin(value) * 0.5 + 0.5;
}

function random(range: number | [number, number]) {
  if (Array.isArray(range)) {
    return Math.random() * (range[1] - range[0]) + range[0];
  }
  return Math.random() * range;
}

function pickRandom<T>(value: T | T[]) {
  if (Array.isArray(value)) {
    return value[Math.floor(Math.random() * value.length)];
  }
  return value;
}

function disposeMeshMaterial(material: THREE.Material | THREE.Material[]) {
  if (Array.isArray(material)) {
    material.forEach((item) => item.dispose());
    return;
  }
  material.dispose();
}

const createMountainUniforms = () => ({
  uFreq: { value: new THREE.Vector3(3, 6, 10) },
  uAmp: { value: new THREE.Vector3(30, 30, 20) },
});

const createXYUniforms = () => ({
  uFreq: { value: new THREE.Vector2(5, 2) },
  uAmp: { value: new THREE.Vector2(25, 15) },
});

const createLongRaceUniforms = () => ({
  uFreq: { value: new THREE.Vector2(2, 3) },
  uAmp: { value: new THREE.Vector2(35, 10) },
});

const createTurbulentUniforms = () => ({
  uFreq: { value: new THREE.Vector4(4, 8, 8, 1) },
  uAmp: { value: new THREE.Vector4(25, 5, 10, 10) },
});

const createDeepUniforms = () => ({
  uFreq: { value: new THREE.Vector2(4, 8) },
  uAmp: { value: new THREE.Vector2(10, 20) },
  uPowY: { value: new THREE.Vector2(20, 2) },
});

const distortions: Record<DistortionPreset, Distortion> = {
  mountainDistortion: {
    createUniforms: createMountainUniforms,
    glsl: `
      uniform vec3 uAmp;
      uniform vec3 uFreq;
      #define PI 3.14159265358979
      float nsin(float val){ return sin(val) * 0.5 + 0.5; }
      vec3 getDistortion(float progress){
        float fix = 0.02;
        return vec3(
          cos(progress * PI * uFreq.x + uTime) * uAmp.x - cos(fix * PI * uFreq.x + uTime) * uAmp.x,
          nsin(progress * PI * uFreq.y + uTime) * uAmp.y - nsin(fix * PI * uFreq.y + uTime) * uAmp.y,
          nsin(progress * PI * uFreq.z + uTime) * uAmp.z - nsin(fix * PI * uFreq.z + uTime) * uAmp.z
        );
      }
    `,
    getJS: (progress, time, uniforms) => {
      const uFreq = uniforms.uFreq.value as THREE.Vector3;
      const uAmp = uniforms.uAmp.value as THREE.Vector3;
      const fix = 0.02;
      const distortion = new THREE.Vector3(
        Math.cos(progress * Math.PI * uFreq.x + time) * uAmp.x -
          Math.cos(fix * Math.PI * uFreq.x + time) * uAmp.x,
        nsin(progress * Math.PI * uFreq.y + time) * uAmp.y -
          nsin(fix * Math.PI * uFreq.y + time) * uAmp.y,
        nsin(progress * Math.PI * uFreq.z + time) * uAmp.z -
          nsin(fix * Math.PI * uFreq.z + time) * uAmp.z
      );
      return distortion.multiply(new THREE.Vector3(2, 2, 2)).add(new THREE.Vector3(0, 0, -5));
    },
  },
  xyDistortion: {
    createUniforms: createXYUniforms,
    glsl: `
      uniform vec2 uFreq;
      uniform vec2 uAmp;
      #define PI 3.14159265358979
      vec3 getDistortion(float progress){
        float fix = 0.02;
        return vec3(
          cos(progress * PI * uFreq.x + uTime) * uAmp.x - cos(fix * PI * uFreq.x + uTime) * uAmp.x,
          sin(progress * PI * uFreq.y + PI/2. + uTime) * uAmp.y - sin(fix * PI * uFreq.y + PI/2. + uTime) * uAmp.y,
          0.
        );
      }
    `,
    getJS: (progress, time, uniforms) => {
      const uFreq = uniforms.uFreq.value as THREE.Vector2;
      const uAmp = uniforms.uAmp.value as THREE.Vector2;
      const fix = 0.02;
      const distortion = new THREE.Vector3(
        Math.cos(progress * Math.PI * uFreq.x + time) * uAmp.x -
          Math.cos(fix * Math.PI * uFreq.x + time) * uAmp.x,
        Math.sin(progress * Math.PI * uFreq.y + Math.PI / 2 + time) * uAmp.y -
          Math.sin(fix * Math.PI * uFreq.y + Math.PI / 2 + time) * uAmp.y,
        0
      );
      return distortion.multiply(new THREE.Vector3(2, 0.4, 1)).add(new THREE.Vector3(0, 0, -3));
    },
  },
  LongRaceDistortion: {
    createUniforms: createLongRaceUniforms,
    glsl: `
      uniform vec2 uFreq;
      uniform vec2 uAmp;
      #define PI 3.14159265358979
      vec3 getDistortion(float progress){
        float fix = 0.0125;
        return vec3(
          sin(progress * PI * uFreq.x + uTime) * uAmp.x - sin(fix * PI * uFreq.x + uTime) * uAmp.x,
          sin(progress * PI * uFreq.y + uTime) * uAmp.y - sin(fix * PI * uFreq.y + uTime) * uAmp.y,
          0.
        );
      }
    `,
    getJS: (progress, time, uniforms) => {
      const uFreq = uniforms.uFreq.value as THREE.Vector2;
      const uAmp = uniforms.uAmp.value as THREE.Vector2;
      const fix = 0.0125;
      const distortion = new THREE.Vector3(
        Math.sin(progress * Math.PI * uFreq.x + time) * uAmp.x -
          Math.sin(fix * Math.PI * uFreq.x + time) * uAmp.x,
        Math.sin(progress * Math.PI * uFreq.y + time) * uAmp.y -
          Math.sin(fix * Math.PI * uFreq.y + time) * uAmp.y,
        0
      );
      return distortion.multiply(new THREE.Vector3(1, 1, 0)).add(new THREE.Vector3(0, 0, -5));
    },
  },
  turbulentDistortion: {
    createUniforms: createTurbulentUniforms,
    glsl: `
      uniform vec4 uFreq;
      uniform vec4 uAmp;
      #define PI 3.14159265358979
      float nsin(float val){ return sin(val) * 0.5 + 0.5; }
      float getDistortionX(float progress){
        return cos(PI * progress * uFreq.r + uTime) * uAmp.r +
          pow(cos(PI * progress * uFreq.g + uTime * (uFreq.g / uFreq.r)), 2.) * uAmp.g;
      }
      float getDistortionY(float progress){
        return -nsin(PI * progress * uFreq.b + uTime) * uAmp.b +
          -pow(nsin(PI * progress * uFreq.a + uTime / (uFreq.b / uFreq.a)), 5.) * uAmp.a;
      }
      vec3 getDistortion(float progress){
        return vec3(
          getDistortionX(progress) - getDistortionX(0.0125),
          getDistortionY(progress) - getDistortionY(0.0125),
          0.
        );
      }
    `,
    getJS: (progress, time, uniforms) => {
      const uFreq = uniforms.uFreq.value as THREE.Vector4;
      const uAmp = uniforms.uAmp.value as THREE.Vector4;
      const getX = (p: number) =>
        Math.cos(Math.PI * p * uFreq.x + time) * uAmp.x +
        Math.pow(Math.cos(Math.PI * p * uFreq.y + time * (uFreq.y / uFreq.x)), 2) * uAmp.y;
      const getY = (p: number) =>
        -nsin(Math.PI * p * uFreq.z + time) * uAmp.z -
        Math.pow(nsin(Math.PI * p * uFreq.w + time / (uFreq.z / uFreq.w)), 5) * uAmp.w;
      const distortion = new THREE.Vector3(getX(progress) - getX(progress + 0.007), getY(progress) - getY(progress + 0.007), 0);
      return distortion.multiply(new THREE.Vector3(-2, -5, 0)).add(new THREE.Vector3(0, 0, -10));
    },
  },
  turbulentDistortionStill: {
    createUniforms: createTurbulentUniforms,
    glsl: `
      uniform vec4 uFreq;
      uniform vec4 uAmp;
      #define PI 3.14159265358979
      float nsin(float val){ return sin(val) * 0.5 + 0.5; }
      float getDistortionX(float progress){
        return cos(PI * progress * uFreq.r) * uAmp.r +
          pow(cos(PI * progress * uFreq.g * (uFreq.g / uFreq.r)), 2.) * uAmp.g;
      }
      float getDistortionY(float progress){
        return -nsin(PI * progress * uFreq.b) * uAmp.b +
          -pow(nsin(PI * progress * uFreq.a / (uFreq.b / uFreq.a)), 5.) * uAmp.a;
      }
      vec3 getDistortion(float progress){
        return vec3(
          getDistortionX(progress) - getDistortionX(0.02),
          getDistortionY(progress) - getDistortionY(0.02),
          0.
        );
      }
    `,
  },
  deepDistortion: {
    createUniforms: createDeepUniforms,
    glsl: `
      uniform vec2 uFreq;
      uniform vec2 uAmp;
      uniform vec2 uPowY;
      #define PI 3.14159265358979
      vec3 getDistortion(float progress){
        float x = sin(progress * PI * uFreq.x + uTime) * uAmp.x;
        float y = pow(abs(progress * uPowY.x), uPowY.y) + sin(progress * PI * uFreq.y + uTime) * uAmp.y;
        float baseX = sin(0.02 * PI * uFreq.x + uTime) * uAmp.x;
        float baseY = pow(abs(0.02 * uPowY.x), uPowY.y) + sin(0.02 * PI * uFreq.y + uTime) * uAmp.y;
        return vec3(x - baseX, y - baseY, 0.);
      }
    `,
    getJS: (progress, time, uniforms) => {
      const uFreq = uniforms.uFreq.value as THREE.Vector2;
      const uAmp = uniforms.uAmp.value as THREE.Vector2;
      const uPowY = uniforms.uPowY.value as THREE.Vector2;
      const getX = (p: number) => Math.sin(p * Math.PI * uFreq.x + time) * uAmp.x;
      const getY = (p: number) => Math.pow(p * uPowY.x, uPowY.y) + Math.sin(p * Math.PI * uFreq.y + time) * uAmp.y;
      const distortion = new THREE.Vector3(getX(progress) - getX(progress + 0.01), getY(progress) - getY(progress + 0.01), 0);
      return distortion.multiply(new THREE.Vector3(-2, -4, 0)).add(new THREE.Vector3(0, 0, -10));
    },
  },
  deepDistortionStill: {
    createUniforms: createDeepUniforms,
    glsl: `
      uniform vec2 uFreq;
      uniform vec2 uAmp;
      uniform vec2 uPowY;
      #define PI 3.14159265358979
      vec3 getDistortion(float progress){
        float x = sin(progress * PI * uFreq.x) * uAmp.x * 2.;
        float y = pow(abs(progress * uPowY.x), uPowY.y) + sin(progress * PI * uFreq.y) * uAmp.y;
        float baseX = sin(0.02 * PI * uFreq.x) * uAmp.x * 2.;
        float baseY = pow(abs(0.05 * uPowY.x), uPowY.y) + sin(0.05 * PI * uFreq.y) * uAmp.y;
        return vec3(x - baseX, y - baseY, 0.);
      }
    `,
  },
};

type RendererUniforms = {
  uTime: { value: number };
  uSceneOpacity: { value: number };
};

class CarLights {
  private app: App;
  private options: HyperspeedOptions;
  private colors: number[] | THREE.Color;
  private speedRange: [number, number];
  private fade: THREE.Vector2;
  mesh!: THREE.Mesh<THREE.InstancedBufferGeometry, THREE.ShaderMaterial>;

  constructor(
    app: App,
    options: HyperspeedOptions,
    colors: number[] | THREE.Color,
    speedRange: [number, number],
    fade: THREE.Vector2
  ) {
    this.app = app;
    this.options = options;
    this.colors = colors;
    this.speedRange = speedRange;
    this.fade = fade;
  }

  init() {
    const options = this.options;
    const curve = new THREE.LineCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1));
    const geometry = new THREE.TubeGeometry(curve, 40, 1, 8, false);
    const instanced = new THREE.InstancedBufferGeometry().copy(
      geometry as unknown as THREE.InstancedBufferGeometry
    ) as THREE.InstancedBufferGeometry;
    instanced.instanceCount = options.lightPairsPerRoadWay * 2;

    const laneWidth = options.roadWidth / options.lanesPerRoad;
    const offsets: number[] = [];
    const metrics: number[] = [];
    const colors: number[] = [];
    const palette = Array.isArray(this.colors)
      ? this.colors.map((color) => new THREE.Color(color))
      : [new THREE.Color(this.colors)];

    for (let i = 0; i < options.lightPairsPerRoadWay; i += 1) {
      const radius = random(options.carLightsRadius);
      const length = random(options.carLightsLength);
      const speed = random(this.speedRange);
      const carLane = i % options.lanesPerRoad;
      let laneX = carLane * laneWidth - options.roadWidth / 2 + laneWidth / 2;
      const carWidth = random(options.carWidthPercentage) * laneWidth;
      laneX += random(options.carShiftX) * laneWidth;
      const offsetY = random(options.carFloorSeparation) + radius * 1.3;
      const offsetZ = -random(options.length);

      offsets.push(laneX - carWidth / 2, offsetY, offsetZ);
      offsets.push(laneX + carWidth / 2, offsetY, offsetZ);
      metrics.push(radius, length, speed);
      metrics.push(radius, length, speed);

      const color = pickRandom(palette);
      colors.push(color.r, color.g, color.b, color.r, color.g, color.b);
    }

    instanced.setAttribute("aOffset", new THREE.InstancedBufferAttribute(new Float32Array(offsets), 3));
    instanced.setAttribute("aMetrics", new THREE.InstancedBufferAttribute(new Float32Array(metrics), 3));
    instanced.setAttribute("aColor", new THREE.InstancedBufferAttribute(new Float32Array(colors), 3));

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      fog: true,
      uniforms: {
        ...this.app.getSharedUniforms(),
        ...this.app.createDistortionUniforms(),
        uTravelLength: { value: options.length },
        uFade: { value: this.fade },
      },
      vertexShader: `
        #define USE_FOG
        ${THREE.ShaderChunk.fog_pars_vertex}
        attribute vec3 aOffset;
        attribute vec3 aMetrics;
        attribute vec3 aColor;
        uniform float uTravelLength;
        uniform float uTime;
        varying vec2 vUv;
        varying vec3 vColor;
        #include <getDistortion_vertex>
        void main() {
          vec3 transformed = position.xyz;
          float radius = aMetrics.r;
          float trailLength = aMetrics.g;
          float speed = aMetrics.b;
          transformed.xy *= radius;
          transformed.z *= trailLength;
          transformed.z += trailLength - mod(uTime * speed + aOffset.z, uTravelLength);
          transformed.xy += aOffset.xy;
          float progress = abs(transformed.z / uTravelLength);
          transformed.xyz += getDistortion(progress);
          vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.);
          gl_Position = projectionMatrix * mvPosition;
          vUv = uv;
          vColor = aColor;
          ${THREE.ShaderChunk.fog_vertex}
        }
      `,
      fragmentShader: `
        #define USE_FOG
        ${THREE.ShaderChunk.fog_pars_fragment}
        varying vec3 vColor;
        varying vec2 vUv;
        uniform vec2 uFade;
        uniform float uSceneOpacity;
        void main() {
          float alpha = smoothstep(uFade.x, uFade.y, vUv.x) * uSceneOpacity;
          vec4 color = vec4(vColor, alpha);
          if (color.a < 0.0001) discard;
          gl_FragColor = color;
          ${THREE.ShaderChunk.fog_fragment}
        }
      `,
    });

    material.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader.replace(
        "#include <getDistortion_vertex>",
        this.app.getDistortionGLSL()
      );
    };

    this.mesh = new THREE.Mesh(instanced, material);
    this.mesh.frustumCulled = false;
    this.app.scene.add(this.mesh);
  }

  update(time: number) {
    this.mesh.material.uniforms.uTime.value = time;
  }

  dispose() {
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    this.app.scene.remove(this.mesh);
  }
}

class SideSticks {
  private app: App;
  private options: HyperspeedOptions;
  mesh!: THREE.Mesh<THREE.InstancedBufferGeometry, THREE.ShaderMaterial>;

  constructor(app: App, options: HyperspeedOptions) {
    this.app = app;
    this.options = options;
  }

  init() {
    const options = this.options;
    const geometry = new THREE.PlaneGeometry(1, 1);
    const instanced = new THREE.InstancedBufferGeometry().copy(
      geometry as unknown as THREE.InstancedBufferGeometry
    ) as THREE.InstancedBufferGeometry;
    instanced.instanceCount = options.totalSideLightSticks;

    const offsets: number[] = [];
    const metrics: number[] = [];
    const colors: number[] = [];

    for (let i = 0; i < options.totalSideLightSticks; i += 1) {
      const width = random(options.lightStickWidth);
      const height = random(options.lightStickHeight);
      offsets.push(i * (options.length / options.totalSideLightSticks));
      metrics.push(width, height);
      const color = new THREE.Color(options.colors.sticks);
      colors.push(color.r, color.g, color.b);
    }

    instanced.setAttribute("aOffset", new THREE.InstancedBufferAttribute(new Float32Array(offsets), 1));
    instanced.setAttribute("aMetrics", new THREE.InstancedBufferAttribute(new Float32Array(metrics), 2));
    instanced.setAttribute("aColor", new THREE.InstancedBufferAttribute(new Float32Array(colors), 3));

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      fog: true,
      uniforms: {
        ...this.app.getSharedUniforms(),
        ...this.app.createDistortionUniforms(),
        uTravelLength: { value: options.length },
      },
      vertexShader: `
        #define USE_FOG
        ${THREE.ShaderChunk.fog_pars_vertex}
        attribute float aOffset;
        attribute vec2 aMetrics;
        attribute vec3 aColor;
        uniform float uTravelLength;
        uniform float uTime;
        varying vec3 vColor;
        mat4 rotationY(float angle) {
          return mat4(
            cos(angle), 0., sin(angle), 0.,
            0., 1., 0., 0.,
            -sin(angle), 0., cos(angle), 0.,
            0., 0., 0., 1.
          );
        }
        #include <getDistortion_vertex>
        void main() {
          vec3 transformed = position.xyz;
          transformed.xy *= aMetrics;
          float time = mod(uTime * 60. * 2. + aOffset, uTravelLength);
          transformed = (rotationY(PI / 2.) * vec4(transformed, 1.)).xyz;
          transformed.z += -uTravelLength + time;
          float progress = abs(transformed.z / uTravelLength);
          transformed.xyz += getDistortion(progress);
          transformed.y += aMetrics.y / 2.;
          transformed.x += -aMetrics.x / 2.;
          vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.);
          gl_Position = projectionMatrix * mvPosition;
          vColor = aColor;
          ${THREE.ShaderChunk.fog_vertex}
        }
      `,
      fragmentShader: `
        #define USE_FOG
        ${THREE.ShaderChunk.fog_pars_fragment}
        varying vec3 vColor;
        uniform float uSceneOpacity;
        void main() {
          gl_FragColor = vec4(vColor, uSceneOpacity);
          ${THREE.ShaderChunk.fog_fragment}
        }
      `,
    });

    material.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader
        .replace("#include <getDistortion_vertex>", this.app.getDistortionGLSL())
        .replace("void main() {", `#define PI 3.14159265358979\nvoid main() {`);
    };

    this.mesh = new THREE.Mesh(instanced, material);
    this.mesh.frustumCulled = false;
    this.app.scene.add(this.mesh);
  }

  update(time: number) {
    this.mesh.material.uniforms.uTime.value = time;
  }

  dispose() {
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    this.app.scene.remove(this.mesh);
  }
}

class Road {
  private app: App;
  private options: HyperspeedOptions;
  private meshes: THREE.Mesh[] = [];

  constructor(app: App, options: HyperspeedOptions) {
    this.app = app;
    this.options = options;
  }

  private createPlane(side: number, isRoad: boolean) {
    const options = this.options;
    const geometry = new THREE.PlaneGeometry(
      isRoad ? options.roadWidth : options.islandWidth,
      options.length,
      20,
      100
    );

    const uniforms: Record<string, { value: unknown }> = {
      ...this.app.getSharedUniforms(),
      ...this.app.createDistortionUniforms(),
      uTravelLength: { value: options.length },
      uColor: {
        value: new THREE.Color(
          isRoad ? options.colors.roadColor : options.colors.islandColor
        ),
      },
    };

    if (isRoad) {
      Object.assign(uniforms, {
        uLanes: { value: options.lanesPerRoad },
        uBrokenLinesColor: { value: new THREE.Color(options.colors.brokenLines) },
        uShoulderLinesColor: { value: new THREE.Color(options.colors.shoulderLines) },
        uShoulderLinesWidthPercentage: { value: options.shoulderLinesWidthPercentage },
        uBrokenLinesWidthPercentage: { value: options.brokenLinesWidthPercentage },
        uBrokenLinesLengthPercentage: { value: options.brokenLinesLengthPercentage },
      });
    }

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      fog: true,
      side: THREE.DoubleSide,
      uniforms,
      vertexShader: `
        #define USE_FOG
        ${THREE.ShaderChunk.fog_pars_vertex}
        uniform float uTravelLength;
        varying vec2 vUv;
        #include <getDistortion_vertex>
        void main() {
          vec3 transformed = position.xyz;
          vec3 distortion = getDistortion((transformed.y + uTravelLength / 2.) / uTravelLength);
          transformed.x += distortion.x;
          transformed.z += distortion.y;
          transformed.y += -1. * distortion.z;
          vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.);
          gl_Position = projectionMatrix * mvPosition;
          vUv = uv;
          ${THREE.ShaderChunk.fog_vertex}
        }
      `,
      fragmentShader: isRoad
        ? `
          #define USE_FOG
          ${THREE.ShaderChunk.fog_pars_fragment}
          varying vec2 vUv;
          uniform vec3 uColor;
          uniform float uTime;
          uniform float uSceneOpacity;
          uniform float uLanes;
          uniform vec3 uBrokenLinesColor;
          uniform vec3 uShoulderLinesColor;
          uniform float uShoulderLinesWidthPercentage;
          uniform float uBrokenLinesWidthPercentage;
          uniform float uBrokenLinesLengthPercentage;
          void main() {
            vec2 uv = vUv;
            uv.y = mod(uv.y + uTime * 0.05, 1.);
            float laneWidth = 1.0 / uLanes;
            float brokenLineWidth = laneWidth * uBrokenLinesWidthPercentage;
            float laneEmptySpace = 1.0 - uBrokenLinesLengthPercentage;
            float brokenLines = step(1.0 - brokenLineWidth, fract(uv.x * uLanes)) * step(laneEmptySpace, fract(uv.y * 10.0));
            float leftShoulder = step(uv.x, uShoulderLinesWidthPercentage);
            float rightShoulder = step(1.0 - uShoulderLinesWidthPercentage, uv.x);
            float shoulders = leftShoulder + rightShoulder;
            vec3 color = uColor;
            color = mix(color, uBrokenLinesColor, brokenLines);
            color = mix(color, uShoulderLinesColor, clamp(shoulders, 0.0, 1.0));
            gl_FragColor = vec4(color, uSceneOpacity);
            ${THREE.ShaderChunk.fog_fragment}
          }
        `
        : `
          #define USE_FOG
          ${THREE.ShaderChunk.fog_pars_fragment}
          uniform vec3 uColor;
          uniform float uSceneOpacity;
          void main() {
            gl_FragColor = vec4(uColor, uSceneOpacity);
            ${THREE.ShaderChunk.fog_fragment}
          }
        `,
    });

    material.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader.replace(
        "#include <getDistortion_vertex>",
        this.app.getDistortionGLSL()
      );
    };

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.z = -options.length / 2;
    mesh.position.x += (options.islandWidth / 2 + options.roadWidth / 2) * side;
    this.app.scene.add(mesh);
    this.meshes.push(mesh);
  }

  init() {
    this.createPlane(-1, true);
    this.createPlane(1, true);
    this.createPlane(0, false);
  }

  update(time: number) {
    this.meshes.forEach((mesh) => {
      const material = mesh.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = time;
    });
  }

  dispose() {
    this.meshes.forEach((mesh) => {
      mesh.geometry.dispose();
      disposeMeshMaterial(mesh.material);
      this.app.scene.remove(mesh);
    });
  }
}

class App {
  container: HTMLElement;
  options: HyperspeedOptions;
  renderer: THREE.WebGLRenderer;
  composer: EffectComposer;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  clock: THREE.Clock;
  fogUniforms: Record<string, { value: unknown }>;
  sharedUniforms: RendererUniforms;
  road: Road;
  leftCarLights: CarLights;
  rightCarLights: CarLights;
  sideSticks: SideSticks;
  distortion: Distortion;
  distortionUniformFactory: () => Record<string, { value: DistortionUniformValue }>;
  distortionUniforms: Record<string, { value: DistortionUniformValue }>;
  resizeObserver: ResizeObserver | null = null;
  rafId: number | null = null;
  disposed = false;
  onComplete?: () => void;
  duration: number;
  showLogoOverlay: boolean;
  fadeOverlay: HTMLDivElement | null;
  logoOverlay: HTMLDivElement | null;
  flashOverlay: HTMLDivElement | null;
  roadMaterials: THREE.ShaderMaterial[] = [];
  bloomEffect: BloomEffect;
  cleanupNodes: THREE.Object3D[] = [];
  useSmaa: boolean;
  elapsedMs = 0;

  constructor(
    container: HTMLElement,
    options: HyperspeedOptions,
    duration: number,
    onComplete: (() => void) | undefined,
    showLogoOverlay: boolean,
    fadeOverlay: HTMLDivElement | null,
    flashOverlay: HTMLDivElement | null,
    logoOverlay: HTMLDivElement | null,
    useSmaa: boolean,
    pixelRatioCap: number
  ) {
    this.container = container;
    this.options = options;
    this.duration = duration;
    this.onComplete = onComplete;
    this.showLogoOverlay = showLogoOverlay;
    this.fadeOverlay = fadeOverlay;
    this.flashOverlay = flashOverlay;
    this.logoOverlay = logoOverlay;
    this.useSmaa = useSmaa;
    this.distortion = distortions[options.distortion ?? "turbulentDistortion"];
    this.distortionUniformFactory = this.distortion.createUniforms;
    this.distortionUniforms = this.distortionUniformFactory();

    this.renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, pixelRatioCap));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.domElement.style.width = "100%";
    this.renderer.domElement.style.height = "100%";
    this.renderer.domElement.style.display = "block";
    this.container.appendChild(this.renderer.domElement);

    this.composer = new EffectComposer(this.renderer);
    this.camera = new THREE.PerspectiveCamera(
      options.fov,
      Math.max(container.clientWidth, 1) / Math.max(container.clientHeight, 1),
      0.1,
      10000
    );
    this.camera.position.set(0, 8, -5);

    this.scene = new THREE.Scene();
    const fog = new THREE.Fog(
      options.colors.background,
      options.length * 0.2,
      options.length * 500
    );
    this.scene.fog = fog;
    this.scene.background = new THREE.Color(options.colors.background);
    this.fogUniforms = {
      fogColor: { value: fog.color },
      fogNear: { value: fog.near },
      fogFar: { value: fog.far },
    };
    this.sharedUniforms = {
      uTime: { value: 0 },
      uSceneOpacity: { value: 1 },
    };

    this.clock = new THREE.Clock();
    this.road = new Road(this, options);
    this.leftCarLights = new CarLights(
      this,
      options,
      options.colors.leftCars,
      options.movingAwaySpeed,
      new THREE.Vector2(0, 1 - options.carLightsFade)
    );
    this.rightCarLights = new CarLights(
      this,
      options,
      options.colors.rightCars,
      options.movingCloserSpeed,
      new THREE.Vector2(1, 0 + options.carLightsFade)
    );
    this.sideSticks = new SideSticks(this, options);

    this.bloomEffect = new BloomEffect({
      luminanceThreshold: 0.2,
      luminanceSmoothing: 0,
      resolutionScale: useSmaa ? 1 : 0.7,
      intensity: 0.95,
    });
  }

  getSharedUniforms() {
    return {
      ...this.sharedUniforms,
      ...this.fogUniforms,
    };
  }

  createDistortionUniforms() {
    return this.distortionUniformFactory();
  }

  getDistortionGLSL() {
    return this.distortion.glsl;
  }

  init() {
    this.road.init();
    this.leftCarLights.init();
    this.rightCarLights.init();
    this.sideSticks.init();

    this.leftCarLights.mesh.position.setX(
      -this.options.roadWidth / 2 - this.options.islandWidth / 2
    );
    this.rightCarLights.mesh.position.setX(
      this.options.roadWidth / 2 + this.options.islandWidth / 2
    );
    this.sideSticks.mesh.position.setX(
      -(this.options.roadWidth + this.options.islandWidth / 2)
    );

    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);
    this.composer.addPass(new EffectPass(this.camera, this.bloomEffect));
    if (this.useSmaa) {
      this.composer.addPass(
        new EffectPass(this.camera, new SMAAEffect({ preset: SMAAPreset.MEDIUM }))
      );
    }

    this.scene.traverse((node) => {
      if (node instanceof THREE.Mesh && node.material instanceof THREE.ShaderMaterial) {
        this.roadMaterials.push(node.material);
      }
      this.cleanupNodes.push(node);
    });

    this.onResize();
    if (typeof ResizeObserver !== "undefined") {
      this.resizeObserver = new ResizeObserver(() => this.onResize());
      this.resizeObserver.observe(this.container);
    }
    window.addEventListener("resize", this.onResize);
    this.tick();
  }

  onResize = () => {
    if (this.disposed) return;
    const width = Math.max(this.container.clientWidth, 1);
    const height = Math.max(this.container.clientHeight, 1);
    this.renderer.setSize(width, height, false);
    this.composer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  };

  updateScene(progress: number, delta: number) {
    const p = clamp01(progress);
    const ignition = smoothstep(0.02, 0.2, p);
    const acceleration = smoothstep(0.18, 0.7, p);
    const finalPush = smoothstep(0.72, 0.9, p) * (1 - smoothstep(0.9, 0.98, p));
    const arrival = smoothstep(ROAD_FADE_START, ROAD_FADE_END, p);
    const sceneOpacity = 1 - arrival;

    const targetFov =
      THREE.MathUtils.lerp(this.options.fov, 138, acceleration) +
      THREE.MathUtils.lerp(0, 12, finalPush) -
      THREE.MathUtils.lerp(0, 28, smoothstep(0.9, 1, p));
    this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, targetFov, 0.08);
    this.camera.updateProjectionMatrix();

    const speedMultiplier =
      THREE.MathUtils.lerp(0.9, 1.4, ignition) +
      THREE.MathUtils.lerp(0, this.options.speedUp * 0.65, acceleration) +
      THREE.MathUtils.lerp(0, this.options.speedUp * 0.45, finalPush);
    this.elapsedMs += delta * 1000 * speedMultiplier * 0.8;
    const time = this.elapsedMs / 1000;
    this.sharedUniforms.uTime.value = time;
    this.sharedUniforms.uSceneOpacity.value = sceneOpacity;

    this.road.update(time);
    this.leftCarLights.update(time);
    this.rightCarLights.update(time);
    this.sideSticks.update(time);

    if (this.distortion.getJS) {
      const lookAt = this.distortion.getJS(0.025, time, this.distortionUniforms);
      this.camera.lookAt(
        new THREE.Vector3(
          this.camera.position.x + lookAt.x,
          this.camera.position.y + lookAt.y,
          this.camera.position.z + lookAt.z
        )
      );
    }

    this.bloomEffect.intensity =
      THREE.MathUtils.lerp(0.52, 0.95, ignition) *
      (1 - smoothstep(0.82, 1, p) * 0.96);

    if (this.fadeOverlay) {
      this.fadeOverlay.style.opacity = `${smoothstep(INTRO_BLACK_START, ROAD_FADE_END, p)}`;
    }
    if (this.flashOverlay) {
      this.flashOverlay.style.opacity = `${smoothstep(0.78, 0.84, p) * (1 - smoothstep(0.84, 0.9, p)) * 0.12}`;
    }
    if (this.logoOverlay) {
      const logoOpacity = this.showLogoOverlay ? smoothstep(LOGO_REVEAL_START, 1, p) : 0;
      this.logoOverlay.style.opacity = `${logoOpacity}`;
      this.logoOverlay.style.transform = `translate(-50%, -50%) scale(${THREE.MathUtils.lerp(
        0.94,
        1,
        smoothstep(LOGO_REVEAL_START, 1, p)
      )})`;
    }

    const hideRoad = p >= ROAD_FADE_END;
    this.renderer.domElement.style.opacity = hideRoad ? "0" : "1";
    this.renderer.domElement.style.visibility = hideRoad ? "hidden" : "visible";
  }

  tick = () => {
    if (this.disposed) return;
    const elapsed = this.elapsedMs;
    const progress = clamp01(elapsed / this.duration);
    const delta = Math.min(this.clock.getDelta(), 0.05);

    this.updateScene(progress, delta);

    if (progress >= 1) {
      this.onComplete?.();
      return;
    }

    this.composer.render(delta);
    this.rafId = requestAnimationFrame(this.tick);
  };

  dispose() {
    this.disposed = true;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    window.removeEventListener("resize", this.onResize);
    this.road.dispose();
    this.leftCarLights.dispose();
    this.rightCarLights.dispose();
    this.sideSticks.dispose();
    this.composer.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    if (this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}

export function Hyperspeed({
  className,
  duration = 3000,
  onComplete,
  reducedMotion = false,
  effectOptions,
  showLogoOverlay = true,
}: HyperspeedProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fadeOverlayRef = useRef<HTMLDivElement | null>(null);
  const flashOverlayRef = useRef<HTMLDivElement | null>(null);
  const logoOverlayRef = useRef<HTMLDivElement | null>(null);

  const mergedOptions = useMemo<HyperspeedOptions>(
    () => ({
      ...defaultOptions,
      ...effectOptions,
      colors: {
        ...defaultOptions.colors,
        ...(effectOptions?.colors ?? {}),
      },
    }),
    [effectOptions]
  );

  useEffect(() => {
    if (reducedMotion) {
      const timer = window.setTimeout(() => onComplete?.(), Math.min(duration, 320));
      return () => window.clearTimeout(timer);
    }

    const container = containerRef.current;
    if (!container) return;

    const width = window.innerWidth;
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1280;
    const responsiveOptions: HyperspeedOptions = {
      ...mergedOptions,
      lightPairsPerRoadWay: isMobile ? 18 : isTablet ? 28 : 40,
      totalSideLightSticks: isMobile ? 10 : isTablet ? 14 : 20,
    };

    let disposed = false;
    const app = new App(
      container,
      responsiveOptions,
      duration,
      () => {
        if (!disposed) onComplete?.();
      },
      showLogoOverlay,
      fadeOverlayRef.current,
      flashOverlayRef.current,
      logoOverlayRef.current,
      !isMobile,
      isMobile ? 1.2 : 1.5
    );

    app.init();

    return () => {
      disposed = true;
      app.dispose();
    };
  }, [duration, mergedOptions, onComplete, reducedMotion, showLogoOverlay]);

  return (
    <div
      ref={containerRef}
      className={clsx("relative h-full w-full overflow-hidden bg-black", className)}
      aria-hidden="true"
    >
      <div
        ref={flashOverlayRef}
        className="pointer-events-none absolute inset-0 z-[1] opacity-0"
        style={{
          background:
            "radial-gradient(60% 32% at 50% 58%, rgba(242,238,232,0.08), rgba(200,16,46,0.08) 42%, rgba(0,0,0,0) 74%)",
        }}
      />
      <div
        ref={fadeOverlayRef}
        className="pointer-events-none absolute inset-0 z-[2] bg-black opacity-0"
      />
      <div
        ref={logoOverlayRef}
        className="pointer-events-none absolute left-1/2 top-1/2 z-[3] opacity-0"
        style={{ transform: "translate(-50%, -50%) scale(0.94)" }}
      >
        <Image
          src={assetPath("/icons/veltro_logo_refined.svg")}
          alt=""
          width={180}
          height={36}
          unoptimized
          aria-hidden="true"
          className="h-auto w-[9rem] object-contain sm:w-[11rem]"
        />
      </div>
    </div>
  );
}
