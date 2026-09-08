// Vista Industrial Truth Platform - Core Type Definitions
// Developed by: Vista Intelligent Network (شرکت شبکه هوشمند ابتکار ویستا)

export type HardwareEdgeClass = 'Edge-E' | 'Edge-P' | 'Edge-C';

export interface CalibrationRecord {
  lastCalibrated?: string;
  validUntil?: string;
  certId: string;
  driftOffset?: number;
  calibrationDate?: string;
  expiryDate?: string;
  laboratoryName?: string;
  maxErrorPercent?: number;
  traceabilityStandard?: string;
}

export interface TimestampPTP {
  utcIso?: string;
  epochMs?: number;
  clockUncertaintyNs?: number;
  ptpSyncLocked?: boolean;
  grandmasterClockId?: string;
}

export interface ShapFactor {
  feature: string;
  impact: number;
  descriptionFa: string;
}

export interface TelemetryData {
  [key: string]: any;
  vibrationRms: number; // mm/s
  vibrationPeak?: number; // mm/s
  temperature: number; // °C
  current: number; // A (Amperes)
  pressure: number; // bar
  rpm: number; // Revolutions per minute
  acousticEmissionDb?: number;
  powerFactor?: number;
  timestampMs?: number;
  activePowerKw?: number;
}

export type SensorReadings = TelemetryData;

export interface TruthBlock {
  truthBlockId: string;
  id?: string; // alias for id
  assetId: string;
  edgeClass?: HardwareEdgeClass;
  deviceId?: string;
  deviceModel?: string;
  sensorId?: string;
  firmwareVersion?: string;
  firmwareHash?: string;
  schemaVersion?: string;
  calibration?: CalibrationRecord;
  calibrationRecord?: CalibrationRecord;
  calibrationExpiry?: string;
  timestamp?: any;
  timestampMs?: number;
  syncErrorBoundMs?: number;
  syncErrorMs?: number;
  readings?: TelemetryData;
  payload?: any;
  confidenceScore?: number;
  queryableUncertaintyPercent?: number;
  rawSampleChecksumSha256?: string;
  cryptographicHash?: string;
  hash?: string; // alias
  blockSignatureSha256?: string;
  signature?: string;
  validationStatus?: string;
  auditStatus?: 'verified' | 'suspect' | 'cal_expired' | 'offline_buffered';
}

export type IndustryType = 'cement' | 'steel' | 'petrochemical' | 'automotive' | 'mining' | 'gas';

export type AssetType = string;

export type HealthStatus = 'normal' | 'advisory' | 'warning' | 'critical' | 'healthy' | 'maintenance';

export type VibrationIsoZone = 'A' | 'B' | 'C' | 'D'; // ISO 10816/20816

export interface Asset3DConfig {
  type: 'compressor' | 'motor' | 'conveyor' | 'pump' | 'tower' | 'mixer';
  position: [number, number, number];
  scale: [number, number, number] | number;
}

export interface Asset {
  id: string;
  name: string;
  faName: string;
  type: AssetType;
  faType?: string;
  industry?: IndustryType;
  industryFa?: string;
  location?: string;
  section?: string;
  criticality?: 'critical' | 'high' | 'medium' | 'low';
  healthScore: number; // 0-100
  status: HealthStatus;
  statusLabelFa?: string;
  rulHours: number; // Remaining Useful Life
  confidenceScore: number; // 0-100%
  vibrationIsoZone?: VibrationIsoZone;
  isoClass?: string;
  edgeClass?: HardwareEdgeClass;
  telemetry: TelemetryData;
  lastTruthBlockId?: string;
  model3DConfig?: Asset3DConfig;
  nominalSpecs?: {
    maxRpm: number;
    nominalPowerKw: number;
    normalVibrationLimit: number;
    criticalTempLimit: number;
    bearingModel: string;
  };
  bearingFrequencies?: {
    bpfo: number; // Ball Pass Frequency Outer
    bpfi: number; // Ball Pass Frequency Inner
    bsf: number;  // Ball Spin Frequency
    ftf: number;  // Fundamental Train Frequency
  };
}

export interface FaultStep {
  simulatedTimeMs: number;
  faultType: string;
  affectedSignal: string;
  rampDurationMs: number;
  severityTarget: number;
  description: string;
}

export interface FaultScenario {
  id?: string;
  scenarioId?: string;
  titleFa?: string;
  nameFa?: string;
  titleEn?: string;
  assetId: string;
  industry?: IndustryType;
  description?: string;
  descriptionFa?: string;
  faultTimeline?: FaultStep[];
  realWorldContext?: string;
  parameters?: Record<string, any>;
  impactSummaryFa?: string;
  recommendedActionFa?: string;
}

export type TwinMaturityMode = 'descriptive' | 'informative' | 'predictive' | 'autonomous';
export type TwinMaturityLevel = 1 | 2 | 3 | 4;

export type SupportedLanguage = 'fa' | 'en' | 'ar' | 'tr';
export type ThemeMode = 'dark' | 'light';

export interface TwinMaturityDetails {
  level: TwinMaturityLevel;
  nameFa: string;
  subtitleFa: string;
  descriptionFa: string;
  features: string[];
}

export type UserRole = 'admin' | 'reliability_engineer' | 'operator' | 'auditor' | 'executive' | 'reliability';

export interface UserProfile {
  id?: string;
  name?: string;
  nameFa?: string;
  role: UserRole;
  titleFa?: string;
  roleTitleFa?: string;
  departmentFa?: string;
  email?: string;
  avatar?: string;
  avatarUrl?: string;
  avatarInitials?: string;
  permissions: string[];
}

export interface TechGiantBenchmark {
  vendor: string;
  faVendor?: string;
  platform: string;
  strengths: string;
  weaknesses: string;
  truthChainSupport?: string;
  cloudDependence?: string;
  iranSanctionRisk?: string;
  architectureLayer?: string;
  gapWithTruthBlock?: string;
}

export interface HafezeIncidentRecord {
  incidentId: string;
  truthBlockId: string;
  assetId: string;
  timestamp: string;
  severity: 'high' | 'medium' | 'critical';
  physicalSymptom: string;
  erpWorkOrderId: string;
  cmmsWorkOrderType: string;
  standardOperatingProcedure: string;
  historicalPrecedent: string;
  technicianNotes: string;
  signedBy: string;
  isImmutableTruthLinked: boolean;
}
