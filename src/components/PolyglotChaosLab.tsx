import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

type Lang = {
  name: string;
  emoji: string;
  code: string;
  fakeOutput: string;
  kind: 'real' | 'fake';
};

const LANGS: Lang[] = [
  { name: 'PHP', emoji: '🐘', kind: 'fake', code: '<?php echo 2 + "2 apples"; ?>', fakeOutput: 'Warning: A non-numeric value... 4 (somehow)' },
  { name: 'Go', emoji: '🐹', kind: 'fake', code: 'if err != nil { return err }', fakeOutput: 'err != nil (err is your life choices)' },
  { name: 'Rust', emoji: '🦀', kind: 'fake', code: 'let x = &mut &mut &mut 5;', fakeOutput: 'error[E0499]: borrow checker filed for divorce' },
  { name: 'Java', emoji: '☕', kind: 'fake', code: 'AbstractSingletonProxyFactoryBean bean;', fakeOutput: 'NullPointerException at line ∞ (12,000 lines of stack trace hidden)' },
  { name: 'C#', emoji: '🎯', kind: 'fake', code: 'Console.WriteLine("Hello");', fakeOutput: 'Please install .NET Framework 2.0, 3.5, 4.8, 6, 7, 8 and 9' },
  { name: 'Ruby', emoji: '💎', kind: 'fake', code: '5.times { puts "magic" }', fakeOutput: 'magic\nmagic\n(Rails ate the other 3)' },
  { name: 'SQL', emoji: '🗄️', kind: 'fake', code: "DELETE FROM users -- WHERE id = 1", fakeOutput: '4,812,339 rows affected. Good luck.' },
  { name: 'Bash', emoji: '🐚', kind: 'fake', code: 'sudo make me a sandwich', fakeOutput: 'yasir is not in the sudoers file. This incident will be reported.' },
  { name: 'Lua', emoji: '🌙', kind: 'fake', code: 'print(arr[0])', fakeOutput: 'nil (arrays start at 1, peasant)' },
  { name: 'COBOL', emoji: '🦖', kind: 'fake', code: 'DISPLAY "HELLO" UPON CONSOLE.', fakeOutput: 'Compiling on mainframe... ETA: 1987' },
  { name: 'Brainf*ck', emoji: '🧠', kind: 'fake', code: '++++++++[>++++[>++>+++<<-]>+<<-]>>.', fakeOutput: 'Output: your sanity has left the chat' },
  { name: 'Kotlin', emoji: '🤖', kind: 'fake', code: 'val x: String? = null!!', fakeOutput: 'KotlinNullPointerException (you asked for it with !!)' },
];

// Real hand-written WebAssembly: (func (export "add") (param i32 i32) (result i32) local.get 0 local.get 1 i32.add)
const WASM_BYTES = new Uint8Array([
  0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00,
  0x01, 0x07, 0x01, 0x60, 0x02, 0x7f, 0x7f, 0x01, 0x7f,
  0x03, 0x02, 0x01, 0x00,
  0x07, 0x07, 0x01, 0x03, 0x61, 0x64, 0x64, 0x00, 0x00,
  0x0a, 0x09, 0x01, 0x07, 0x00, 0x20, 0x00, 0x20, 0x01, 0x6a, 0x0b,
]);

const FRAG_SHADER = `
precision mediump float;
uniform float t;
uniform vec2 r;
void main() {
  vec2 uv = gl_FragCoord.xy / r;
  float w = sin(uv.x * 20.0 + t * 3.0) * cos(uv.y * 17.0 - t * 2.0);
  vec3 vomit = vec3(0.6 + 0.4 * sin(t + w * 6.0), 0.9, 0.1 + 0.3 * cos(t * 1.7 + uv.y * 9.0));
  gl_FragColor = vec4(vomit * (0.7 + 0.3 * w), 1.0);
}`;

const VERT_SHADER = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

function GlslVomit() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl');
    if (!gl) {
      setError('WebGL not supported. Even your GPU refuses.');
      return;
    }
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader error');
      return s;
    };
    let raf = 0;
    try {
      const prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT_SHADER));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG_SHADER));
      gl.linkProgram(prog);
      gl.useProgram(prog);
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, 'p');
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      const uT = gl.getUniformLocation(prog, 't');
      const uR = gl.getUniformLocation(prog, 'r');
      const start = performance.now();
      const draw = () => {
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform1f(uT, (performance.now() - start) / 1000);
        gl.uniform2f(uR, canvas.width, canvas.height);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        raf = requestAnimationFrame(draw);
      };
      draw();
    } catch (e) {
      setError((e as Error).message);
    }
    return () => cancelAnimationFrame(raf);
  }, []);

  return error ? (
    <p className="text-red-600 font-bold">{error}</p>
  ) : (
    <canvas ref={ref} width={320} height={160} className="w-full h-40 border-4 border-black" />
  );
}

interface Props {
  onAwardXp?: (xp: number, reason: string) => void;
}

export const PolyglotChaosLab: React.FC<Props> = ({ onAwardXp }) => {
  const [wasmResult, setWasmResult] = useState<string>('Not compiled yet');
  const [pyResult, setPyResult] = useState<string>('Python sleeping 🐍💤');
  const [outputs, setOutputs] = useState<Record<string, string>>({});
  const [compiling, setCompiling] = useState<string | null>(null);

  const runWasm = async () => {
    try {
      const { instance } = await WebAssembly.instantiate(WASM_BYTES);
      const add = instance.exports.add as (a: number, b: number) => number;
      const real = add(2, 2);
      setWasmResult(`WASM says 2 + 2 = ${real}. Website says: ${real + 1}. Trust the website.`);
      onAwardXp?.(20, 'Ran real WebAssembly and was lied to');
    } catch (e) {
      setWasmResult(`WASM crashed: ${(e as Error).message}`);
    }
  };

  const runPython = async () => {
    setPyResult('Spawning python3... (please hold, your call is not important to us)');
    try {
      const res = await fetch('/api/polyglot/python');
      const data = await res.json();
      setPyResult(`Python ${data.version}: "${data.output}" (real answer was ${data.real}, ignored)`);
      onAwardXp?.(20, 'Woke up the real Python interpreter');
    } catch {
      setPyResult('Server Python unreachable. It moved to a farm upstate.');
    }
  };

  const fakeCompile = (lang: Lang) => {
    setCompiling(lang.name);
    const delay = 800 + Math.random() * 2200;
    setTimeout(() => {
      setOutputs((prev) => ({ ...prev, [lang.name]: lang.fakeOutput }));
      setCompiling(null);
      onAwardXp?.(5, `Fake-compiled ${lang.name}`);
    }, delay);
  };

  return (
    <section className="p-4 md:p-8 space-y-8 font-['Comic_Neue']">
      <header className="text-center">
        <motion.h2
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          className="text-3xl md:text-5xl font-black bg-yellow-300 border-4 border-black inline-block px-4 py-2 shadow-[6px_6px_0_#000]"
        >
          🌐 POLYGLOT CHAOS LAB
        </motion.h2>
        <p className="mt-3 text-sm md:text-base">
          16 programming languages. 3 actually run. 0 give the right answer.
        </p>
      </header>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white border-4 border-black p-4 shadow-[6px_6px_0_#000]">
          <h3 className="font-black text-lg">⚙️ WebAssembly (REAL)</h3>
          <code className="block text-xs bg-black text-green-400 p-2 my-2">i32.add (local.get 0) (local.get 1)</code>
          <button onClick={runWasm} className="bg-purple-500 text-white font-bold px-3 py-1 border-2 border-black">
            Execute .wasm
          </button>
          <p className="mt-2 text-sm">{wasmResult}</p>
        </div>

        <div className="bg-white border-4 border-black p-4 shadow-[6px_6px_0_#000]">
          <h3 className="font-black text-lg">🐍 Python (REAL, server)</h3>
          <code className="block text-xs bg-black text-green-400 p-2 my-2">print(random.choice(excuses))</code>
          <button onClick={runPython} className="bg-blue-500 text-white font-bold px-3 py-1 border-2 border-black">
            Run python3
          </button>
          <p className="mt-2 text-sm">{pyResult}</p>
        </div>

        <div className="bg-white border-4 border-black p-4 shadow-[6px_6px_0_#000]">
          <h3 className="font-black text-lg">🎨 GLSL Shader (REAL)</h3>
          <GlslVomit />
          <p className="text-xs mt-1">Fragment shader running on your GPU. Sorry, GPU.</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {LANGS.map((lang) => (
          <div key={lang.name} className="bg-lime-200 border-2 border-black p-3 -rotate-1 hover:rotate-2 transition-transform">
            <div className="flex items-center justify-between">
              <span className="font-black">
                {lang.emoji} {lang.name}
              </span>
              <span className="text-[10px] bg-red-500 text-white px-1">FAKE</span>
            </div>
            <code className="block text-[11px] bg-black text-amber-300 p-2 my-2 break-all">{lang.code}</code>
            <button
              disabled={compiling !== null}
              onClick={() => fakeCompile(lang)}
              className="text-xs font-bold bg-white border-2 border-black px-2 py-1 disabled:opacity-40"
            >
              {compiling === lang.name ? 'Compiling... 🔥' : 'Compile'}
            </button>
            {outputs[lang.name] && (
              <pre className="mt-2 text-[11px] whitespace-pre-wrap text-red-700 font-bold">{outputs[lang.name]}</pre>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};