
import init,* as wasm from "../modules/rs_fingerprint_generator/wasm_app.js";
import BenchmarkModule from "../modules/cpp_benchmark_generator/cpp_benchmark_generator/a.out.js"
import run_benchmarks from "../modules/benchmark.js";
import { collectFingerprintData } from "../modules/fingerprintjs_collector.js";

let modules = [
    {name: "rs_fingerprint_generator"},
    {name: "js_fingerprint_generator"},
    {name: "cpp_benchmark_generator"},
    {name: "js_benchmark_generator"}
]

async function initializeModules() {

    await init()
    const cpp_object = await BenchmarkModule();
  
    modules = [
        {name: "rs_fingerprint_generator", collector: wasm.get_fingerprint},
        {name: "js_fingerprint_generator", collector: collectFingerprintData},
        {name: "cpp_benchmark_generator", collector: cpp_object.run_benchmarks},
        {name: "js_benchmark_generator", collector: run_benchmarks}
    ];
}

export { initializeModules, modules };