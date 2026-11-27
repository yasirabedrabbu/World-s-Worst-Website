export type CodeSample = {
  id: string;
  language: string;
  emoji: string;
  accent: string;
  file: string;
  title: string;
  blurb: string;
  code: string;
  output: string;
  runtime: string;
};

/**
 * Real, runnable specimens live in /tools on disk.
 * These are the short versions shown inside the museum codex.
 */
export const CODE_SAMPLES: CodeSample[] = [
  {
    id: 'java',
    language: 'Java',
    emoji: '☕',
    accent: '#f59e0b',
    file: 'ByteForge.java',
    title: 'ByteForge — text to binary oracle',
    blurb: 'Turns any phrase into UTF-8 binary and back. Compiled with javac 17+.',
    runtime: 'javac ByteForge.java && java ByteForge "chaos"',
    output: 'chaos -> 01100011 01101000 01100001 01101111 01110011',
    code: `public final class ByteForge {
  static String toBits(String text) {
    StringBuilder out = new StringBuilder();
    for (byte b : text.getBytes(java.nio.charset.StandardCharsets.UTF_8)) {
      out.append(String.format("%8s", Integer.toBinaryString(b & 0xFF)).replace(' ', '0')).append(' ');
    }
    return out.toString().trim();
  }
  static String fromBits(String bits) {
    String[] parts = bits.trim().split("\\\\s+");
    byte[] bytes = new byte[parts.length];
    for (int i = 0; i < parts.length; i++) bytes[i] = (byte) Integer.parseInt(parts[i], 2);
    return new String(bytes, java.nio.charset.StandardCharsets.UTF_8);
  }

  public static void main(String[] args) {
    String text = args.length > 0 ? String.join(" ", args) : "chaos";
    String bits = toBits(text);
    System.out.println(text + " -> " + bits);
    System.out.println("round-trip -> " + fromBits(bits));
  }
}`,
  },
  {
    id: 'python',
    language: 'Python',
    emoji: '🐍',
    accent: '#38bdf8',
    file: 'py_analyze.py',
    title: 'Text Autopsy — readability forensics',
    blurb: 'Real server tool: sends text to Python, gets entropy, vocabulary and reading time back.',
    runtime: 'python tools/py_analyze.py',
    output: '{"words": 18, "unique": 15, "entropy": 3.71, "reading_seconds": 6}',
    code: `import json, math, re, sys
from collections import Counter
def analyse(text: str) -> dict:
    words = re.findall(r"[A-Za-z']+", text.lower())
    counts = Counter(words)
    total = max(1, len(words))
    entropy = -sum((n / total) * math.log2(n / total) for n in counts.values())
    return {
        "chars": len(text),
        "words": len(words),
        "unique": len(counts),
        "entropy": round(entropy, 2),
        "top": counts.most_common(3),
        "reading_seconds": round(len(words) / 3.3, 1),
    }

if __name__ == "__main__":
    payload = json.loads(sys.stdin.read() or "{}")
    print(json.dumps(analyse(payload.get("text", ""))))`,
  },
  {
    id: 'rust',
    language: 'Rust',
    emoji: '🦀',
    accent: '#fb7185',
    file: 'entropy.rs',
    title: 'Entropy Gauge — password weather report',
    blurb: 'Ownership-safe Shannon entropy scorer. Build with rustc entropy.rs.',
    runtime: 'rustc -O tools/entropy.rs -o entropy && ./entropy "correct horse"',
    output: 'bits/char: 3.42 | verdict: STABLE | score: 79/100',
    code: `use std::collections::HashMap;
use std::env;

fn shannon(input: &str) -> f64 {
    let mut freq: HashMap<char, usize> = HashMap::new();
    for c in input.chars() { *freq.entry(c).or_insert(0) += 1; }
    let len = input.chars().count() as f64;
    freq.values()
        .map(|&n| { let p = n as f64 / len; -p * p.log2() })
        .sum()
}
fn main() {
    let input = env::args().skip(1).collect::<Vec<_>>().join(" ");
    let bits = shannon(&input);
    let score = (bits * input.len() as f64 * 1.4).min(100.0) as u8;
    let verdict = if score > 70 { "STABLE" } else if score > 40 { "WOBBLY" } else { "FLAT" };
    println!("bits/char: {:.2} | verdict: {} | score: {}/100", bits, verdict, score);
}`,
  },
  {
    id: 'c',
    language: 'C',
    emoji: '🔧',
    accent: '#a3e635',
    file: 'hexdump.c',
    title: 'Hex Curator — classic hexdump toy',
    blurb: 'Portable C99 byte viewer with an ASCII gutter. gcc -O2 hexdump.c -o hexdump.',
    runtime: 'gcc -O2 tools/hexdump.c -o hexdump && ./hexdump README.md',
    output: '00000000  23 20 f0 9f 8f 86 20 47  75 69 6e 6e 65 73 73 20  |# .... Guinness |',
    code: `#include <stdio.h>
#include <ctype.h>
int main(int argc, char **argv) {
    if (argc < 2) { fprintf(stderr, "usage: hexdump FILE\\n"); return 1; }
    FILE *f = fopen(argv[1], "rb");
    if (!f) { perror("hexdump"); return 1; }

    unsigned char buf[16];
    long offset = 0;
    size_t n;
    while ((n = fread(buf, 1, sizeof buf, f)) > 0) {
        printf("%08lx  ", offset);
        for (size_t i = 0; i < 16; i++)
            printf(i < n ? "%02x " : "   ", buf[i]);
        printf(" |");
        for (size_t i = 0; i < n; i++) putchar(isprint(buf[i]) ? buf[i] : '.');
        printf("|\\n");
        offset += (long)n;
    }
    fclose(f);
    return 0;
}`,
  },
  {
    id: 'csharp',
    language: 'C#',
    emoji: '🎯',
    accent: '#a78bfa',
    file: 'Badge.cs',
    title: 'Badge Forge — terminal achievement card',
    blurb: 'A tiny .NET 8 script that renders an ANSI survival badge from XP.',
    runtime: 'dotnet run --project tools/Badge.cs -- 420',
    output: '╔══════════════════════════╗\\n║  RANK: ENTROPY OVERLORD  ║',
    code: `using System;

record Survivor(string Name, int Xp)
{
    public string Rank => Xp switch
    {
        >= 1000 => "CHAOS DEITY",
        >= 500  => "ENTROPY OVERLORD",
        >= 200  => "UX GLADIATOR",
        >= 50   => "BRAVE VISITOR",
        _       => "FRESH MEAT"
    };
    public void Print()
    {
        Console.ForegroundColor = ConsoleColor.Yellow;
        Console.WriteLine("╔══════════════════════════════╗");
        Console.WriteLine($"║  RANK: {Rank,-20} ║");
        Console.WriteLine($"║  XP:   {Xp,-20} ║");
        Console.WriteLine("╚══════════════════════════════╝");
        Console.ResetColor();
    }
}

class Program
{
    static void Main(string[] args)
    {
        var xp = args.Length > 0 && int.TryParse(args[0], out var n) ? n : 120;
        new Survivor("Anon", xp).Print();
    }
}`,
  },
  {
    id: 'javascript',
    language: 'JavaScript',
    emoji: '⚡',
    accent: '#facc15',
    file: 'palette.mjs',
    title: 'Palette Forge — 60/30/10 generator',
    blurb: 'The same colour maths that powers the Palette tool, as a zero-dependency ES module.',
    runtime: 'node tools/palette.mjs 262',
    output: '{ base: "hsl(262 42% 96%)", surface: "hsl(262 28% 88%)", accent: "hsl(262 84% 58%)" }',
    code: `const clamp = (n, lo = 0, hi = 100) => Math.min(hi, Math.max(lo, n));

export function makePalette(hue, mood = "museum") {
  const pop = mood === "brutal" ? 18 : 8;
  return {
    base:    "hsl(" + hue + " 24% 96%)",
    surface: "hsl(" + hue + " 18% 90%)",
    ink:     "hsl(" + hue + " 22% 12%)",
    accent:  "hsl(" + ((hue + pop) % 360) + " 84% 56%)",
    accent2: "hsl(" + ((hue + 180) % 360) + " 62% 62%)",
    ratio: { base: 60, surface: 30, accent: 10 }
  };
}

const hue = clamp(Number(process.argv[2] ?? 262), 0, 360);
console.log(makePalette(hue, process.argv[3]));`,
  },
];

