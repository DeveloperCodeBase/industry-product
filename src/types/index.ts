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

export type NotificationCategory = 'system' | 'maintenance' | 'security';
export type NotificationSeverity = 'critical' | 'warning' | 'info' | 'success';

export interface IndustrialNotification {
  id: string;
  category: NotificationCategory;
  severity: NotificationSeverity;
  titleFa: string;
  titleEn: string;
  titleAr?: string;
  titleTr?: string;
  messageFa: string;
  messageEn: string;
  messageAr?: string;
  messageTr?: string;
  timestamp: string;
  read: boolean;
  assetId?: string;
  actionRoute?: string;
  actionLabelFa?: string;
  actionLabelEn?: string;
  metadata?: Record<string, any>;
}

// Collaborative Annotation on Technical Diagrams & PDFs
export interface DiagramAnnotation {
  id: string;
  diagramId: string;
  diagramTitle: string;
  xPercent: number; // 0-100% position on canvas
  yPercent: number; // 0-100% position on canvas
  authorName: string;
  authorRole: string;
  authorAvatar?: string;
  category: 'vibration_defect' | 'safety_hazard' | 'maintenance_note' | 'calibration_audit' | 'design_change';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  comment: string;
  timestamp: string;
  status: 'open' | 'in_review' | 'resolved';
  resolvedBy?: string;
  resolvedAt?: string;
}

// Maintenance Log & Component Degradation Trends
export interface ComponentHealthRecord {
  componentName: string;
  componentKey: string;
  healthScore: number; // 0 - 100%
  degradationRate: number; // % per month
  criticality: 'critical' | 'high' | 'medium';
  primaryStressFactor: string;
  recommendedInspectionDays: number;
}

export interface MaintenanceIntervention {
  id: string;
  assetId: string;
  assetName: string;
  component: string;
  suggestedAction: string;
  technicalDetails: string;
  confidenceScore: number; // e.g. 96.5%
  priority: 'emergency' | 'high' | 'scheduled' | 'preventive';
  status: 'completed' | 'in_progress' | 'scheduled' | 'overdue';
  triggeredBy: string;
  suggestedDate: string;
  completedDate?: string;
  technicianName?: string;
  preventedDowntimeHours: number;
  economicSavingsMillionTomans: number;
}

export interface DegradationDataPoint {
  timestamp: string;
  dayIndex: number;
  overallHealth: number; // 0-100%
  bearingWearIndex: number; // 0-10
  vibrationRms: number; // mm/s
  envelopePeakG: number; // g
  temperatureC: number; // °C
  rulForecastHours: number;
  isForecast?: boolean;
}


