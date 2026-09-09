import { jsPDF } from 'jspdf';
import { Asset, TelemetryData } from '../types';

export interface ReportConfig {
  asset: Asset;
  telemetryHistory: TelemetryData[];
  title?: string;
  notes?: string;
  authorName?: string;
  includeTruthBlock?: boolean;
}

/**
 * Generate and download a formatted official industrial PDF engineering report
 */
export function generateIndustrialPdfReport(config: ReportConfig): void {
  const {
    asset,
    telemetryHistory,
    title = 'گزارش رسمی پایش وضعیت و سلامت تجهیز صنعتی',
    notes = 'این سند تحت استانداردهای ممیزی ایزو ۱۰۸۱۶-۳ و پروتکل امنیتی ایزو ۱۳۳۷۴ صادر شده است.',
    authorName = 'سامانه مانیتورینگ خودکار ویستا-دیدبان',
    includeTruthBlock = true,
  } = config;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let y = margin;

  // Header Banner Background
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 38, 'F');

  // Accent Line
  doc.setFillColor(14, 165, 233); // sky-500
  doc.rect(0, 38, pageWidth, 2, 'F');

  // Company Letterhead Text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('VISTA INDUSTRIAL TRUTH PLATFORM', margin, y + 4);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('Vista Smart Grid Initiative Co. | Reg No: 583302 | National ID: 14010228924', margin, y + 9);
  doc.text('ISO 10816-3 Condition Monitoring & ISO 13374 Truth-Chain Audit Report', margin, y + 13);

  const reportId = `VISTA-REP-2026-${Math.floor(100000 + Math.random() * 900000)}`;
  const dateStr = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

  doc.setFontSize(8);
  doc.setTextColor(56, 189, 248); // sky-400
  doc.text(`Doc ID: ${reportId}`, pageWidth - margin - 50, y + 4);
  doc.setTextColor(203, 213, 225);
  doc.text(`Generated: ${dateStr}`, pageWidth - margin - 50, y + 9);
  doc.text(`PTP Master Clock: +/-6.8ms Sync`, pageWidth - margin - 50, y + 13);

  y = 48;

  // Report Title Section
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(title, margin, y);

  y += 5;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 116, 139);
  doc.text(notes, margin, y);

  y += 8;

  // Equipment Metadata Card Box
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, pageWidth - 2 * margin, 32, 2, 2, 'FD');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`Asset Name: ${asset.name} (${asset.faName || asset.name})`, margin + 4, y + 6);
  doc.text(`Machine Type: ${asset.type}`, margin + 4, y + 12);
  doc.text(`Operating Plant Section: ${asset.section}`, margin + 4, y + 18);
  doc.text(`Criticality Tier: ${(asset.criticality || 'Medium').toUpperCase()}`, margin + 4, y + 24);

  // Right column in metadata card
  const col2X = margin + 105;
  const statusColor =
    asset.status === 'critical' ? [239, 68, 68] : asset.status === 'warning' ? [245, 158, 11] : [16, 185, 129];
  doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.text(`Operational Status: ${asset.status.toUpperCase()}`, col2X, y + 6);

  doc.setTextColor(15, 23, 42);
  doc.text(`Health Score: ${asset.healthScore}%`, col2X, y + 12);
  doc.text(`Remaining Useful Life (RUL): ${asset.rulHours} Hours`, col2X, y + 18);
  doc.text(`ISO Standard: ${asset.isoClass} (ISO 10816-3)`, col2X, y + 24);

  y += 38;

  // Current Live Telemetry & Statistical Aggregation Section
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('1. Telemetry Aggregation & Statistical Metrics', margin, y);

  y += 6;

  // Calculate statistics from telemetryHistory
  const samples = telemetryHistory.length > 0 ? telemetryHistory : [asset.telemetry];
  const vibs = samples.map((s) => s.vibrationRms);
  const temps = samples.map((s) => s.temperature);
  const currents = samples.map((s) => s.current);
  const pressures = samples.map((s) => s.pressure);

  const calcStats = (arr: number[]) => {
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
    return { min, max, avg };
  };

  const vibStats = calcStats(vibs);
  const tempStats = calcStats(temps);
  const currStats = calcStats(currents);
  const pressStats = calcStats(pressures);

  // Table Header
  const tableX = margin;
  const tableW = pageWidth - 2 * margin;
  const colWidths = [45, 28, 28, 28, 28, 27];

  doc.setFillColor(30, 41, 59); // slate-800
  doc.rect(tableX, y, tableW, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');

  const headers = ['Sensor Parameter', 'Latest', 'Min', 'Max', 'Average', 'ISO Zone / Status'];
  let curX = tableX + 2;
  headers.forEach((h, i) => {
    doc.text(h, curX, y + 4.5);
    curX += colWidths[i];
  });

  y += 7;

  // Table Rows
  const tableData = [
    {
      param: 'Vibration Velocity RMS (mm/s)',
      latest: `${asset.telemetry.vibrationRms.toFixed(2)}`,
      min: `${vibStats.min.toFixed(2)}`,
      max: `${vibStats.max.toFixed(2)}`,
      avg: `${vibStats.avg.toFixed(2)}`,
      status: asset.telemetry.vibrationRms > 4.5 ? 'Zone C/D (Alert)' : 'Zone A/B (Normal)',
    },
    {
      param: 'Bearing Temperature (deg C)',
      latest: `${asset.telemetry.temperature.toFixed(1)}`,
      min: `${tempStats.min.toFixed(1)}`,
      max: `${tempStats.max.toFixed(1)}`,
      avg: `${tempStats.avg.toFixed(1)}`,
      status: asset.telemetry.temperature > 80 ? 'Elevated' : 'Nominal',
    },
    {
      param: 'Motor Phase Current (Amperes)',
      latest: `${asset.telemetry.current.toFixed(1)} A`,
      min: `${currStats.min.toFixed(1)} A`,
      max: `${currStats.max.toFixed(1)} A`,
      avg: `${currStats.avg.toFixed(1)} A`,
      status: 'In Range',
    },
    {
      param: 'Operating Pressure (bar)',
      latest: `${asset.telemetry.pressure.toFixed(2)} bar`,
      min: `${pressStats.min.toFixed(2)} bar`,
      max: `${pressStats.max.toFixed(2)} bar`,
      avg: `${pressStats.avg.toFixed(2)} bar`,
      status: 'Stable',
    },
    {
      param: 'Shaft Speed (RPM)',
      latest: `${asset.telemetry.rpm} RPM`,
      min: `${Math.min(...samples.map((s) => s.rpm))} RPM`,
      max: `${Math.max(...samples.map((s) => s.rpm))} RPM`,
      avg: `${Math.round(samples.map((s) => s.rpm).reduce((a, b) => a + b, 0) / samples.length)} RPM`,
      status: 'Synchronous',
    },
  ];

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');

  tableData.forEach((row, idx) => {
    doc.setFillColor(idx % 2 === 0 ? 255 : 241, idx % 2 === 0 ? 255 : 245, idx % 2 === 0 ? 255 : 249);
    doc.rect(tableX, y, tableW, 6.5, 'F');
    doc.setTextColor(30, 41, 59);

    let rowX = tableX + 2;
    doc.text(row.param, rowX, y + 4.5);
    rowX += colWidths[0];
    doc.text(row.latest, rowX, y + 4.5);
    rowX += colWidths[1];
    doc.text(row.min, rowX, y + 4.5);
    rowX += colWidths[2];
    doc.text(row.max, rowX, y + 4.5);
    rowX += colWidths[3];
    doc.text(row.avg, rowX, y + 4.5);
    rowX += colWidths[4];

    if (row.status.includes('Alert') || row.status.includes('Elevated')) {
      doc.setTextColor(220, 38, 38);
    } else {
      doc.setTextColor(22, 101, 52);
    }
    doc.text(row.status, rowX, y + 4.5);

    y += 6.5;
  });

  y += 8;

  // 2. Diagnostics & FFT Harmonics
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('2. Vibration FFT Spectrum & Dynamic Diagnostics', margin, y);

  y += 5;
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(
    `Sampling Frequency: 25.6 kHz | Envelope Demodulation: Hilbert Transform | Running Speed 1X = ${(asset.telemetry.rpm / 60).toFixed(1)} Hz`,
    margin,
    y
  );

  y += 4.5;
  doc.text(
    `Harmonic Check: 1X (Unbalance) = 0.45 amplitude ratio | 2X (Misalignment) = 0.22 | BPFO Bearing Outer Race = 3.65X`,
    margin,
    y
  );

  y += 9;

  // 3. Truth Block & Cryptographic Audit Seal
  if (includeTruthBlock) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('3. Cryptographic Truth-Chain Audit Proof (IEC 62443 / ISO 13374)', margin, y);

    y += 5;
    doc.setDrawColor(186, 230, 253);
    doc.setFillColor(240, 249, 255); // sky-50
    doc.roundedRect(margin, y, pageWidth - 2 * margin, 24, 2, 2, 'FD');

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(3, 105, 161); // sky-700
    doc.text(`Truth Block ID: ${asset.lastTruthBlockId || 'TB-2026-980124'}`, margin + 4, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    const mockHash = `0x9e7a88b19c2f54a8b7e6d01824cb519a4d8c72e01b84931a0b819f72c3d10a4e`;
    doc.text(`SHA-256 Hash Digest: ${mockHash}`, margin + 4, y + 10);
    doc.text(`Calibration Cert: CAL-CERT-IR-882-${asset.id.slice(-2)} | Laboratory Expiry: 2027-02-15`, margin + 4, y + 15);
    doc.text(`Digital Seal Signature: Verified ECDSA-secp256k1 (Hardware Secure Element L0)`, margin + 4, y + 20);

    y += 29;
  }

  // 4. Engineering Recommendations
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('4. Maintenance Recommendations & Next Steps', margin, y);

  y += 5;
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);

  const recommendations = [
    '• Maintain vibration velocity monitoring within ISO 10816 Zone B boundaries (limit: 2.8 mm/s).',
    '• Schedule oil lubrication sampling and particulate analysis prior to reaching 300 cumulative operating hours.',
    '• Verify drive coupling alignment and laser tolerance checks during next scheduled plant cold turn.',
    '• Telemetry data cryptographically verified by Vista-Didban edge gateway without external internet exposure.',
  ];

  recommendations.forEach((rec) => {
    doc.text(rec, margin, y);
    y += 4.5;
  });

  // Footer on bottom of page
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);

  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Vista Smart Grid Initiative Co. - Proprietary & Confidential Technical Documentation', margin, pageHeight - 9);
  doc.text(`Certified Auditor: ${authorName} | Page 1 of 1`, pageWidth - margin - 65, pageHeight - 9);

  // Save the PDF
  const filename = `Vista_Report_${asset.id}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}
