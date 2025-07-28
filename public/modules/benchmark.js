function now() {
    return performance.now();
  }
  
  const SIZE = 1_000_000;
  const ITER = 100_000_000;
  
  function int_add_latency() {
    let sum = 0;
    const start = now();
    for (let i = 0; i < ITER; i++) sum += i;
    return now() - start;
  }
  
  function int_mult_latency() {
    let prod = 1;
    const start = now();
    for (let i = 1; i < ITER; i++) prod *= 1;
    return now() - start;
  }
  
  function int_div_latency() {
    let res = 1;
    const start = now();
    for (let i = 1; i < ITER; i++) res /= 1;
    return now() - start;
  }
  
  function float_add_latency() {
    let sum = 0.0;
    const start = now();
    for (let i = 0; i < ITER; i++) sum += 1.0;
    return now() - start;
  }
  
  function float_mult_latency() {
    let prod = 1.0;
    const start = now();
    for (let i = 1; i < ITER; i++) prod *= 1.000001;
    return now() - start;
  }
  
  function float_div_latency() {
    let res = 1.0;
    const start = now();
    for (let i = 1; i < ITER; i++) res /= 1.000001;
    return now() - start;
  }
  
  function double_add_latency() {
    let sum = 0.0;
    const start = now();
    for (let i = 0; i < ITER; i++) sum += 1.0;
    return now() - start;
  }
  
  function double_mult_latency() {
    let prod = 1.0;
    const start = now();
    for (let i = 1; i < ITER; i++) prod *= 1.000001;
    return now() - start;
  }
  
  function double_div_latency() {
    let res = 1.0;
    const start = now();
    for (let i = 1; i < ITER; i++) res /= 1.000001;
    return now() - start;
  }
  
  function sequential_memory_latency() {
    const arr = new Array(SIZE).fill(0).map((_, i) => i);
    let total = 0;
    const start = now();
    for (let i = 0; i < SIZE; i++) total += arr[i];
    return now() - start;
  }
  
  function random_memory_latency() {
    const arr = new Array(SIZE).fill(0).map((_, i) => i);
    let total = 0;
    const start = now();
    for (let i = 0; i < SIZE; i++) total += arr[Math.floor(Math.random() * SIZE)];
    return now() - start;
  }
  
  function heap_allocation_latency() {
    const start = now();
    const block = new Uint32Array(100_000_000);
    for (let i = 0; i < 100_000; i++) block[i] = i;
    return now() - start;
  }
  
  function benchmark_simd_vs_scalar() {
    const size = 1024;
    const a = new Float32Array(size);
    const b = new Float32Array(size);
    const result = new Float32Array(size);
    for (let i = 0; i < size; ++i) {
      a[i] = i * 0.5;
      b[i] = i * 0.25;
    }
    const start = now();
    for (let i = 0; i < size; i += 4) {
      result[i] = a[i] + b[i];
      result[i + 1] = a[i + 1] + b[i + 1];
      result[i + 2] = a[i + 2] + b[i + 2];
      result[i + 3] = a[i + 3] + b[i + 3];
    }
    return now() - start;
  }
  
  function microbenchmark_nbody() {
    const n = 100;
    const bodies = Array.from({ length: n }, () => ({
      x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, mass: 1
    }));
    const start = now();
    for (let step = 0; step < 10; ++step) {
      for (let i = 0; i < n; ++i) {
        for (let j = 0; j < n; ++j) {
          if (i === j) continue;
          const dx = bodies[j].x - bodies[i].x;
          const dy = bodies[j].y - bodies[i].y;
          const dz = bodies[j].z - bodies[i].z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz + 1e-10);
          const force = bodies[j].mass / (dist * dist);
          bodies[i].vx += dx * force;
          bodies[i].vy += dy * force;
          bodies[i].vz += dz * force;
        }
      }
    }
    return now() - start;
  }
  
  function branch_prediction_latency() {
    let sum = 0;
    const start = now();
    for (let i = 0; i < ITER; i++) {
      sum += (i % 2 === 0) ? i : -i;
    }
    return now() - start;
  }
  
  function cache_associativity_latency() {
    const stride = 4096;
    const accesses = 100_000;
    const arr = new Array(stride * 100).fill(1);
    let sum = 0;
    const start = now();
    for (let i = 0; i < accesses; i++) {
      sum += arr[(i * stride) % arr.length];
    }
    return now() - start;
  }
  
  export default function run_benchmarks() {
    const result = {
      int_add_latency_ms: int_add_latency(),
      int_mult_latency_ms: int_mult_latency(),
      int_div_latency_ms: int_div_latency(),
      float_add_latency_ms: float_add_latency(),
      float_mult_latency_ms: float_mult_latency(),
      float_div_latency_ms: float_div_latency(),
      double_add_latency_ms: double_add_latency(),
      double_mult_latency_ms: double_mult_latency(),
      double_div_latency_ms: double_div_latency(),
      sequential_memory_latency_ms: sequential_memory_latency(),
      random_memory_latency_ms: random_memory_latency(),
      heap_allocation_latency_ms: heap_allocation_latency(),
      simd_vs_scalar_ms: benchmark_simd_vs_scalar(),
      nbody_simulation_ms: microbenchmark_nbody(),
      branch_prediction_latency_ms: branch_prediction_latency(),
      cache_associativity_latency_ms: cache_associativity_latency(),
    };

    return JSON.stringify(result);
  }
