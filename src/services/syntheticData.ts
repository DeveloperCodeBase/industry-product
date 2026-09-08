import { Asset, FaultScenario, TelemetryData, TruthBlock } from '../types';

// Ring buffer implementation as specified in Chapter 15
export class RingBuffer<T> {
  capacity: number;
  data: T[];

  constructor(capacity: number = 500) {
    this.capacity = capacity;
    this.data = [];
  }

  push(sample: T) {
    this.data.push(sample);
    if (this.data.length > this.capacity) {
      this.data.shift();
    }
  }

  getAll(): T[] {
    return [...this.data];
  }

  getLatest(): T | undefined {
    return this.data[this.data.length - 1];
  }

  clear() {
    this.data = [];
  }
}

// Pseudo-random deterministic generator with seed
class PseudoRandom {
  private seed: number;

  constructor(seed: number = 42) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  gaussian(mean = 0, stdDev = 1): number {
    const u1 = Math.max(1e-10, this.next());
    const u2 = this.next();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return mean + z0 * stdDev;
  }
}

// Helper to simulate SHA-256 hash string
function computeMockSha256(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex1 = Math.abs(hash).toString(16).padStart(8, '0');
  const hex2 = Math.abs((hash ^ 0x5a5a5a5a)).toString(16).padStart(8, '0');
  const hex3 = Math.abs((hash * 31)).toString(16).padStart(8, '0');
  const hex4 = Math.abs((hash ^ 0x3f3f3f3f)).toString(16).padStart(8, '0');
  return `0x${hex1}${hex2}${hex3}${hex4}e8b94f1c9d2a017e3f8b5a`.slice(0, 66);
}

export const INITIAL_ASSETS: Asset[] = [
  {
    id: 'compressor-04',
    name: 'Compressor K-04',
    faName: 'کمپرسور سانتریفیوژ خوراک K-04',
    type: 'Centrifugal Gas Compressor',
    faType: 'کمپرسور سانتریفیوژ گاز فرایندی',
    section: 'واحد تراکم و تثبیت گاز',
    criticality: 'critical',
    healthScore: 78,
    confidenceScore: 99.8,
    status: 'warning',
    rulHours: 142,
    isoClass: 'Class III',
    lastTruthBlockId: 'TB-2026-980124',
    model3DConfig: {
      type: 'compressor',
      position: [-5, 0, -2],
      scale: [1.2, 1.2, 1.2],
    },
    telemetry: {
      vibrationRms: 5.8,
      temperature: 78.4,
      current: 44.5,
      pressure: 8.2,
      rpm: 2975,
      timestampMs: Date.now(),
    },
  },
  {
    id: 'motor-201',
    name: 'Motor M-201',
    faName: 'الکتروموتور آسیاب مواد خام M-201',
    type: 'High-Voltage Induction Motor',
    faType: 'موتور القایی ولتاژ متوسط ۳۱۵ کیلووات',
    section: 'واحد آسیاب و خردایش اولیه',
    criticality: 'critical',
    healthScore: 88,
    confidenceScore: 99.9,
    status: 'advisory',
    rulHours: 420,
    isoClass: 'Class III',
    lastTruthBlockId: 'TB-2026-980125',
    model3DConfig: {
      type: 'motor',
      position: [0, 0, -2],
      scale: [1.1, 1.1, 1.1],
    },
    telemetry: {
      vibrationRms: 3.4,
      temperature: 66.8,
      current: 58.2,
      pressure: 2.1,
      rpm: 1488,
      timestampMs: Date.now(),
    },
  },
  {
    id: 'conveyor-12',
    name: 'Conveyor CV-12',
    faName: 'نوار نقاله اصلی انتقال سنگ‌شکن CV-12',
    type: 'Heavy Industrial Conveyor Belt',
    faType: 'نوار نقاله هوی دیوتی ۱۵۰۰ تن در ساعت',
    section: 'خط انتقال پیوسته مواد',
    criticality: 'high',
    healthScore: 94,
    confidenceScore: 99.7,
    status: 'normal',
    rulHours: 1250,
    isoClass: 'Class II',
    lastTruthBlockId: 'TB-2026-980126',
    model3DConfig: {
      type: 'conveyor',
      position: [5, 0, -2],
      scale: [1.5, 0.8, 1],
    },
    telemetry: {
      vibrationRms: 1.8,
      temperature: 42.1,
      current: 31.4,
      pressure: 1.0,
      rpm: 720,
      timestampMs: Date.now(),
    },
  },
  {
    id: 'pump-102',
    name: 'Feed Pump P-102',
    faName: 'پمپ گریز از مرکز تغذیه بویلر P-102',
    type: 'Multi-stage Centrifugal Pump',
    faType: 'پمپ چندمرحله‌ای آب تغذیه فشار بالا',
    section: 'واحد تولید بخار و یوتیلیتی',
    criticality: 'high',
    healthScore: 91,
    confidenceScore: 100.0,
    status: 'normal',
    rulHours: 890,
    isoClass: 'Class II',
    lastTruthBlockId: 'TB-2026-980127',
    model3DConfig: {
      type: 'pump',
      position: [-5, 0, 3],
      scale: [1, 1, 1],
    },
    telemetry: {
      vibrationRms: 2.1,
      temperature: 52.3,
      current: 24.8,
      pressure: 16.4,
      rpm: 2950,
      timestampMs: Date.now(),
    },
  },
  {
    id: 'extruder-03',
    name: 'Extruder EX-03',
    faName: 'اکسترودر خط تولید گرانول EX-03',
    type: 'Twin Screw Compounding Extruder',
    faType: 'اکسترودر دوماردونه کامپاندینگ',
    section: 'واحد پلیمریزاسیون و دانه‌بندی',
    criticality: 'high',
    healthScore: 96,
    confidenceScore: 99.9,
    status: 'normal',
    rulHours: 1680,
    isoClass: 'Class II',
    lastTruthBlockId: 'TB-2026-980128',
    model3DConfig: {
      type: 'tower',
      position: [0, 0, 3],
      scale: [1, 1.3, 1],
    },
    telemetry: {
      vibrationRms: 1.6,
      temperature: 185.0,
      current: 62.1,
      pressure: 42.0,
      rpm: 480,
      timestampMs: Date.now(),
    },
  },
  {
    id: 'mixer-05',
    name: 'Reactor Mixer AG-05',
    faName: 'همزن رآکتور شیمیایی دوغاب AG-05',
    type: 'Heavy Slurry Agitator',
    faType: 'میکسر صنعتی ضدسایش مخزن خنثی‌سازی',
    section: 'واحد واکنش و سنتز شیمیایی',
    criticality: 'medium',
    healthScore: 89,
    confidenceScore: 99.8,
    status: 'normal',
    rulHours: 940,
    isoClass: 'Class II',
    lastTruthBlockId: 'TB-2026-980129',
    model3DConfig: {
      type: 'mixer',
      position: [5, 0, 3],
      scale: [1.2, 1.2, 1.2],
    },
    telemetry: {
      vibrationRms: 2.6,
      temperature: 48.7,
      current: 19.5,
      pressure: 3.2,
      rpm: 120,
      timestampMs: Date.now(),
    },
  },
  {
    id: 'fan-08',
    name: 'Cooling Fan CF-08',
    faName: 'فن هوادهی برج خنک‌کننده هیبریدی CF-08',
    type: 'Axial Cooling Fan',
    faType: 'فن محوری ۶ پره با قطر ۵ متر',
    section: 'واحد خنک‌کاری و برج آب برگشتی',
    criticality: 'medium',
    healthScore: 93,
    confidenceScore: 99.7,
    status: 'normal',
    rulHours: 1100,
    isoClass: 'Class I',
    lastTruthBlockId: 'TB-2026-980130',
    model3DConfig: {
      type: 'tower',
      position: [-2.5, 0, 0.5],
      scale: [0.9, 0.9, 0.9],
    },
    telemetry: {
      vibrationRms: 1.9,
      temperature: 36.2,
      current: 18.0,
      pressure: 1.05,
      rpm: 360,
      timestampMs: Date.now(),
    },
  },
  {
    id: 'pump-01',
    name: 'Slurry Pump BFP-01',
    faName: 'پمپ دوغاب سنگین تغذیه فیلترپرس BFP-01',
    type: 'Heavy-Duty Slurry Centrifugal',
    faType: 'پمپ گریز از مرکز معدنی لاینردار',
    section: 'واحد آبگیری باطله و فیلتراسیون',
    criticality: 'high',
    healthScore: 85,
    confidenceScore: 99.9,
    status: 'advisory',
    rulHours: 510,
    isoClass: 'Class II',
    lastTruthBlockId: 'TB-2026-980131',
    model3DConfig: {
      type: 'pump',
      position: [2.5, 0, 0.5],
      scale: [1, 1, 1],
    },
    telemetry: {
      vibrationRms: 3.7,
      temperature: 58.9,
      current: 38.6,
      pressure: 6.8,
      rpm: 1450,
      timestampMs: Date.now(),
    },
  },
];

export const PRESET_SCENARIOS: FaultScenario[] = [
  {
    id: 'bearing-degradation-demo-01',
    titleFa: 'سایش تدریجی یاتاقان کمپرسور K-04',
    titleEn: 'Gradual Bearing Degradation (K-04)',
    assetId: 'compressor-04',
    descriptionFa: 'شبیه‌سازی سایش شیار خارجی یاتاقان ساچمه‌ای، بالا رفتن ارتعاش RMS، جهش فرکانس BPFO در طیف FFT و گرم شدن بدنه بر اساس بند ۹.۲ سند معماری.',
    faultTimeline: [
      {
        simulatedTimeMs: 5000,
        faultType: 'bearing_wear',
        affectedSignal: 'vibrationRms',
        rampDurationMs: 15000,
        severityTarget: 6.8,
        description: 'آغاز ترک میکروسکوپی در قفسه یاتاقان و افت کارایی روانکاری',
      },
      {
        simulatedTimeMs: 18000,
        faultType: 'thermal_rise',
        affectedSignal: 'temperature',
        rampDurationMs: 10000,
        severityTarget: 91.5,
        description: 'افزایش اصطکاک مکانیکی و بالا رفتن دمای پوسته کمپرسور به بیش از ۹۰ درجه',
      },
      {
        simulatedTimeMs: 25000,
        faultType: 'critical_threshold_breach',
        affectedSignal: 'vibrationRms',
        rampDurationMs: 5000,
        severityTarget: 10.4,
        description: 'ورود ارتعاش به منطقه خطر D استاندارد ISO 10816 و صدور دستور توقف ایمن',
      },
    ],
  },
  {
    id: 'thermal-runaway-motor-02',
    titleFa: 'افزایش ناگهانی دمای استاتور موتور M-201',
    titleEn: 'Sudden Stator Overheating (M-201)',
    assetId: 'motor-201',
    descriptionFa: 'شبیه‌سازی انسداد کانال هوارسانی یا جریان اضافه فاز در الکتروموتور آسیاب، افت سریع عایق‌بندی و افزایش ناگهانی دمای سیم‌پیچ.',
    faultTimeline: [
      {
        simulatedTimeMs: 4000,
        faultType: 'current_surge',
        affectedSignal: 'current',
        rampDurationMs: 6000,
        severityTarget: 78.5,
        description: 'اضافه بار ناگهانی آسیاب و افزایش آمپراژ عبوری از سیم‌پیچ',
      },
      {
        simulatedTimeMs: 9000,
        faultType: 'thermal_rise',
        affectedSignal: 'temperature',
        rampDurationMs: 12000,
        severityTarget: 112.0,
        description: 'عبور دمای استاتور از کلاس عایقی F (بیش از ۱۰۵ درجه)',
      },
    ],
  },
  {
    id: 'rotor-unbalance-cv-03',
    titleFa: 'عدم‌تعادل دینامیکی روتور نوار نقاله CV-12',
    titleEn: 'Rotor Dynamic Unbalance (CV-12)',
    assetId: 'conveyor-12',
    descriptionFa: 'پدیده چسبیدن گل و بار سنگین روی درام متحرک نوار نقاله که هارمونیک 1X ارتعاشات را تشدید کرده و به سازه تنش وارد می‌کند.',
    faultTimeline: [
      {
        simulatedTimeMs: 5000,
        faultType: 'mass_unbalance',
        affectedSignal: 'vibrationRms',
        rampDurationMs: 14000,
        severityTarget: 7.6,
        description: 'انحراف لنگری و ارتعاش شدید با فرکانس چرخش درام (1X)',
      },
    ],
  },
];

export class SyntheticDataEngine {
  private prng: PseudoRandom;
  private buffers: Map<string, RingBuffer<TelemetryData>>;
  private activeScenario: FaultScenario | null = null;
  private scenarioElapsedMs = 0;
  private simulationSpeed = 1;
  private isRunning = true;
  private truthBlockCounter = 980132;

  constructor() {
    this.prng = new PseudoRandom(1369);
    this.buffers = new Map();
    INITIAL_ASSETS.forEach((asset) => {
      const buf = new RingBuffer<TelemetryData>(500);
      // Preload with 40 realistic historical points
      for (let i = 40; i >= 0; i--) {
        const timeOffset = Date.now() - i * 2000;
        buf.push({
          ...asset.telemetry,
          vibrationRms: Math.max(0.5, asset.telemetry.vibrationRms + this.prng.gaussian(0, 0.15)),
          temperature: asset.telemetry.temperature + this.prng.gaussian(0, 0.4),
          current: asset.telemetry.current + this.prng.gaussian(0, 0.5),
          pressure: asset.telemetry.pressure + this.prng.gaussian(0, 0.05),
          rpm: asset.telemetry.rpm + this.prng.gaussian(0, 2),
          timestampMs: timeOffset,
        });
      }
      this.buffers.set(asset.id, buf);
    });
  }

  setScenario(scenarioId: string | null) {
    if (!scenarioId) {
      this.activeScenario = null;
      this.scenarioElapsedMs = 0;
      return;
    }
    const found = PRESET_SCENARIOS.find((s) => s.id === scenarioId);
    if (found) {
      this.activeScenario = found;
      this.scenarioElapsedMs = 0;
    }
  }

  getActiveScenario(): FaultScenario | null {
    return this.activeScenario;
  }

  setSpeed(speed: number) {
    this.simulationSpeed = speed;
  }

  getSpeed(): number {
    return this.simulationSpeed;
  }

  togglePause(): boolean {
    this.isRunning = !this.isRunning;
    return this.isRunning;
  }

  getIsRunning(): boolean {
    return this.isRunning;
  }

  reset() {
    this.activeScenario = null;
    this.scenarioElapsedMs = 0;
    this.buffers.clear();
    INITIAL_ASSETS.forEach((asset) => {
      const buf = new RingBuffer<TelemetryData>(500);
      for (let i = 40; i >= 0; i--) {
        buf.push({
          ...asset.telemetry,
          timestampMs: Date.now() - i * 2000,
        });
      }
      this.buffers.set(asset.id, buf);
    });
  }

  // Generate a tick for all assets
  tick(deltaMs: number = 1000): { assets: Asset[]; newTruthBlocks: TruthBlock[] } {
    if (!this.isRunning) {
      return {
        assets: INITIAL_ASSETS,
        newTruthBlocks: [],
      };
    }

    const effectiveDelta = deltaMs * this.simulationSpeed;
    if (this.activeScenario) {
      this.scenarioElapsedMs += effectiveDelta;
    }

    const newTruthBlocks: TruthBlock[] = [];
    const updatedAssets: Asset[] = [];

    INITIAL_ASSETS.forEach((asset) => {
      const buf = this.buffers.get(asset.id)!;
      const latest = buf.getLatest() || asset.telemetry;

      // Base cyclical simulation + Gaussian noise
      const now = Date.now();
      const cyclePeriod = 3600000; // 1 hour
      const cycleOffset = (now % cyclePeriod) / cyclePeriod;
      const cycleSine = Math.sin(cycleOffset * 2 * Math.PI);

      let vib = asset.telemetry.vibrationRms + cycleSine * 0.2 + this.prng.gaussian(0, 0.12);
      let temp = asset.telemetry.temperature + cycleSine * 1.5 + this.prng.gaussian(0, 0.3);
      let cur = asset.telemetry.current + cycleSine * 1.0 + this.prng.gaussian(0, 0.4);
      let pres = asset.telemetry.pressure + cycleSine * 0.05 + this.prng.gaussian(0, 0.04);
      let rpm = asset.telemetry.rpm + this.prng.gaussian(0, 2);

      // Apply scenario faults if this asset is targeted
      const currentScenario = this.activeScenario;
      if (currentScenario && currentScenario.assetId === asset.id) {
        const timeline = currentScenario.faultTimeline || [];
        for (const event of timeline) {
          if (this.scenarioElapsedMs >= event.simulatedTimeMs) {
            const timeSinceStart = this.scenarioElapsedMs - event.simulatedTimeMs;
            const progress = event.rampDurationMs > 0 ? Math.min(1.0, timeSinceStart / event.rampDurationMs) : 1.0;

            if (event.affectedSignal === 'vibrationRms') {
              vib = vib + progress * (event.severityTarget - vib);
            } else if (event.affectedSignal === 'temperature') {
              temp = temp + progress * (event.severityTarget - temp);
            } else if (event.affectedSignal === 'current') {
              cur = cur + progress * (event.severityTarget - cur);
            }
          }
        }
      }

      vib = Math.max(0.4, Number(vib.toFixed(2)));
      temp = Math.max(20.0, Number(temp.toFixed(1)));
      cur = Math.max(0.0, Number(cur.toFixed(1)));
      pres = Math.max(0.1, Number(pres.toFixed(2)));
      rpm = Math.max(0, Math.round(rpm));

      const newSample: TelemetryData = {
        vibrationRms: vib,
        temperature: temp,
        current: cur,
        pressure: pres,
        rpm,
        timestampMs: now,
      };

      buf.push(newSample);

      // Determine Health Score & Status based on vibration & temperature thresholds
      let status: Asset['status'] = 'normal';
      let health = 100 - (vib / 10) * 35 - Math.max(0, (temp - 60) * 0.8);
      health = Math.max(12, Math.min(100, Math.round(health)));

      if (vib >= 7.1 || temp >= 100) {
        status = 'critical';
      } else if (vib >= 4.5 || temp >= 80) {
        status = 'warning';
      } else if (vib >= 2.5 || temp >= 68) {
        status = 'advisory';
      }

      const calculatedRul = Math.max(12, Math.round((health / 100) * 1200 * (1 - (vib > 4.5 ? 0.6 : 0))));

      const truthBlockId = `TB-2026-${++this.truthBlockCounter}`;
      const hashStr = computeMockSha256(`${truthBlockId}-${JSON.stringify(newSample)}`);
      const tb: TruthBlock = {
        truthBlockId,
        id: truthBlockId,
        assetId: asset.id,
        deviceId: `DEV-SENS-${asset.id.toUpperCase()}-01`,
        deviceModel: 'VISTA-Edge-Piezo-Triaxial v2.4',
        sensorId: `DEV-SENS-${asset.id.toUpperCase()}-01`,
        firmwareHash: '0x8f3c091d8a4f21b77ea',
        firmwareVersion: 'v2.4.1-edge',
        calibrationRecord: {
          lastCalibrated: '2026-02-15',
          validUntil: '2027-02-15',
          certId: `CAL-CERT-IR-882-${asset.id.slice(-2)}`,
          driftOffset: 0.02,
        },
        calibrationExpiry: '۱۴۰۵/۱۱/۲۶',
        timestampMs: now,
        timestamp: new Date(now).toISOString(),
        syncErrorBoundMs: 6.8, // ±6.8ms NTP/PTP precision
        syncErrorMs: 6.8,
        schemaVersion: '1.4-iso13374',
        confidenceScore: 99.8,
        payload: newSample,
        cryptographicHash: hashStr,
        hash: hashStr,
        signature: `ECDSA-SHA256:04f81c9a...${asset.id}`,
        validationStatus: 'verified',
      };

      newTruthBlocks.push(tb);

      updatedAssets.push({
        ...asset,
        telemetry: newSample,
        healthScore: health,
        status,
        rulHours: calculatedRul,
        lastTruthBlockId: truthBlockId,
      });
    });

    return {
      assets: updatedAssets,
      newTruthBlocks,
    };
  }

  getBufferForAsset(assetId: string): TelemetryData[] {
    return this.buffers.get(assetId)?.getAll() || [];
  }

  getFFTSpectrum(assetId: string): Array<{ frequency: number; amplitude: number; harmonic?: string }> {
    const asset = INITIAL_ASSETS.find((a) => a.id === assetId) || INITIAL_ASSETS[0];
    const latest = this.buffers.get(asset.id)?.getLatest() || asset.telemetry;
    const { vibrationRms, rpm } = latest;

    const f0 = Math.round(rpm / 60); // e.g. 50 Hz
    const bpfo = Math.round(f0 * 3.6); // outer race fault frequency
    const bpfi = Math.round(f0 * 5.4); // inner race fault frequency

    const bins: Array<{ frequency: number; amplitude: number; harmonic?: string }> = [];
    for (let f = 10; f <= 1000; f += 10) {
      let amp = 0.08 + (Math.sin(f * 13) * 0.03 + 0.03);

      let harmonic: string | undefined = undefined;
      if (Math.abs(f - f0) < 6) {
        amp += vibrationRms * 0.45;
        harmonic = '1X';
      } else if (Math.abs(f - f0 * 2) < 6) {
        amp += vibrationRms * 0.28;
        harmonic = '2X';
      } else if (Math.abs(f - f0 * 3) < 6) {
        amp += vibrationRms * 0.15;
        harmonic = '3X';
      } else if (Math.abs(f - bpfo) < 6) {
        amp += (vibrationRms > 4.5 ? 0.4 : 0.08) * vibrationRms;
        harmonic = 'BPFO';
      }

      bins.push({
        frequency: f,
        amplitude: Number(amp.toFixed(3)),
        harmonic,
      });
    }

    return bins;
  }
}

// Global Singleton Engine
export const dataEngine = new SyntheticDataEngine();

// FFT Spectrum Generator for Vibration Page
export interface FftPeak {
  frequencyHz: number;
  amplitude: number;
  label?: string;
}

export function generateFftSpectrum(vibrationRms: number, rpm: number): { frequencies: number[]; amplitudes: number[]; peaks: FftPeak[] } {
  const f0 = rpm / 60; // 1X Running speed (e.g. ~50 Hz for 3000 RPM)
  const frequencies: number[] = [];
  const amplitudes: number[] = [];

  const maxFreq = 600; // Hz
  const step = 2; // Hz

  const peaks: FftPeak[] = [
    { frequencyHz: Math.round(f0), amplitude: vibrationRms * 0.45, label: '1X (دور نامی)' },
    { frequencyHz: Math.round(f0 * 2), amplitude: vibrationRms * 0.25, label: '2X (عدم‌هم‌راستایی)' },
    { frequencyHz: Math.round(f0 * 3), amplitude: vibrationRms * 0.12, label: '3X (هارمونیک)' },
    { frequencyHz: Math.round(f0 * 3.65), amplitude: (vibrationRms > 4.5 ? 0.38 : 0.05) * vibrationRms, label: 'BPFO (شیار خارجی یاتاقان)' },
    { frequencyHz: Math.round(f0 * 5.4), amplitude: (vibrationRms > 5.5 ? 0.28 : 0.03) * vibrationRms, label: 'BPFI (شیار داخلی یاتاقان)' },
  ];

  for (let f = 10; f <= maxFreq; f += step) {
    frequencies.push(f);
    // Background noise floor
    let amp = 0.05 + Math.random() * 0.04;

    // Add peak contributions using Gaussian shape around peaks
    for (const p of peaks) {
      const dist = Math.abs(f - p.frequencyHz);
      if (dist < 12) {
        amp += p.amplitude * Math.exp(-(dist * dist) / 10);
      }
    }
    amplitudes.push(Number(amp.toFixed(3)));
  }

  return { frequencies, amplitudes, peaks };
}
