export type QuizQuestion = {
  q: string;
  a: string;
  options: string[];
  fact: string;
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  { q: 'Which language is compiled by javac and runs on the JVM?', a: 'Java', options: ['Rust', 'Java', 'Python', 'C#'], fact: 'Write once, debug everywhere.' },
  { q: 'Which language owns the cargo package manager?', a: 'Rust', options: ['C', 'Go', 'Rust', 'Python'], fact: 'Cargo builds and tests without a fight.' },
  { q: 'What does C# compile to before the CLR runs it?', a: 'IL bytecode', options: ['Machine code', 'IL bytecode', 'WASM', 'Python'], fact: 'Intermediate Language, then JIT.' },
  { q: 'Which Python structure enforces blocks with indentation?', a: 'Whitespace', options: ['Braces', 'Whitespace', 'Semicolons', 'BEGIN/END'], fact: 'Spaces are syntax, not decoration.' },
  { q: 'Which C header gives you printf?', a: '<stdio.h>', options: ['<stdlib.h>', '<stdio.h>', '<string.h>', '<math.h>'], fact: 'Standard input/output.' },
  { q: 'Which tool does the browser execute natively?', a: 'WebAssembly', options: ['JVM bytecode', 'WebAssembly', 'CIL', 'ELF'], fact: 'A portable binary target for the web.' },
  { q: 'In Rust, what does the borrow checker protect?', a: 'Memory safety', options: ['Network speed', 'Memory safety', 'CSS nesting', 'DNS'], fact: 'No data races at compile time.' },
  { q: 'Which file extension does a TypeScript React component usually use?', a: '.tsx', options: ['.tsx', '.jsx', '.rs', '.cs'], fact: 'TSX = TypeScript + JSX.' },
];
