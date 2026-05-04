import { useRef, useEffect } from 'react';
import { Renderer, Program, Mesh, Triangle, Vec2 } from 'ogl';

const vertex = `
  attribute vec2 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0, 1);
  }
`;

const fragment = `
  precision highp float;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform float uHueShift;
  uniform float uNoiseIntensity;
  uniform float uScanlineIntensity;
  uniform float uScanlineFrequency;
  uniform float uWarpAmount;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    vec2 p = (uv - 0.5) * 2.0;
    p.x *= uResolution.x / uResolution.y;

    float d = length(p);
    float angle = atan(p.y, p.x);

    p += vec2(cos(angle * 3.0 + uTime), sin(angle * 2.0 - uTime)) * 0.05 * uWarpAmount;

    float noise = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453) * uNoiseIntensity;
    vec3 color = vec3(0.01, 0.01, 0.03) + noise;

    float mDist = length(p - (uMouse - 0.5) * 2.0);
    float light = 0.15 / (mDist + 0.4);
    color += vec3(0.1, 0.3, 0.6) * light;

    float scanline = sin(uv.y * uScanlineFrequency + uTime * 2.0) * uScanlineIntensity;
    color -= scanline;

    color.r += sin(uTime * 0.1 + uHueShift * 0.01) * 0.05;
    color.b += cos(uTime * 0.1 + uHueShift * 0.01) * 0.05;

    gl_FragColor = vec4(color, 1.0);
  }
`;

const DarkVeil = ({
  hueShift = 50,
  noiseIntensity = 0.07,
  scanlineIntensity = 0,
  speed = 0.7,
  scanlineFrequency = 0,
  warpAmount = 0.8,
  resolutionScale = 1.25,
}) => {
  const containerRef = useRef();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({ alpha: true, premultipliedAlpha: false });
    const gl = renderer.gl;
    container.appendChild(gl.canvas);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Vec2() },
        uMouse: { value: new Vec2(0.5, 0.5) },
        uHueShift: { value: hueShift },
        uNoiseIntensity: { value: noiseIntensity },
        uScanlineIntensity: { value: scanlineIntensity },
        uScanlineFrequency: { value: scanlineFrequency },
        uWarpAmount: { value: warpAmount },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    const handleResize = () => {
      const width = container.offsetWidth;
      const height = container.offsetHeight;
      renderer.setSize(width * resolutionScale, height * resolutionScale);
      gl.canvas.style.width = `${width}px`;
      gl.canvas.style.height = `${height}px`;
      program.uniforms.uResolution.value.set(gl.canvas.width, gl.canvas.height);
    };

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      program.uniforms.uMouse.value.set(
        (e.clientX - rect.left) / rect.width,
        1.0 - (e.clientY - rect.top) / rect.height
      );
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    handleResize();

    let animateId;
    const update = (t) => {
      animateId = requestAnimationFrame(update);
      program.uniforms.uTime.value = t * 0.001 * speed;
      renderer.render({ scene: mesh });
    };
    animateId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animateId);
      if (container.contains(gl.canvas)) {
        container.removeChild(gl.canvas);
      }
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [hueShift, noiseIntensity, scanlineIntensity, speed, scanlineFrequency, warpAmount, resolutionScale]);

  return <div ref={containerRef} className="dark-veil-container" />;
};

export default DarkVeil;
