// Entropy Gauge: password weather report.
// rustc -O tools/entropy.rs -o entropy && ./entropy "correct horse battery staple"
use std::collections::HashMap;
use std::env;

fn shannon(input: &str) -> f64 {
    let mut freq: HashMap<char, usize> = HashMap::new();
    for c in input.chars() {
        *freq.entry(c).or_insert(0) += 1;
    }
    let len = input.chars().count().max(1) as f64;
    freq.values()
        .map(|&n| {
            let p = n as f64 / len;
            -p * p.log2()
        })
        .sum()
}

fn main() {
    let input = env::args().skip(1).collect::<Vec<_>>().join(" ");
    let bits = shannon(&input);
    let score = (bits * input.len() as f64 * 1.4).min(100.0) as u8;
    let verdict = if score > 70 {
        "STABLE"
    } else if score > 40 {
        "WOBBLY"
    } else {
        "FLAT"
    };
    println!(
        "bits/char: {:.2} | verdict: {} | score: {}/100",
        bits, verdict, score
    );
}
