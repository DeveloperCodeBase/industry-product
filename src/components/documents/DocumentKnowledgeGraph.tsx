import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import {
  Network,
  Search,
  Filter,
  Layers,
  FileText,
  Activity,
  Cpu,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  HardDrive,
  Info,
  Sliders,
  Sparkles,
  GitCompare,
  Box
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export type KnowledgeNodeType = 'asset' | 'component' | 'document' | 'standard';

export interface KnowledgeNode extends d3.SimulationNodeDatum {
  id: string;
  labelFa: string;
  labelEn: string;
  type: KnowledgeNodeType;
  code: string;
  assetId?: string;
  assetNameFa?: string;
  summaryFa: string;
  tags: string[];
  revision?: string;
  date?: string;
  hash?: string;
  importance: number; // 1 to 5 (controls visual radius)
}

export interface KnowledgeLink extends d3.SimulationLinkDatum<KnowledgeNode> {
  id: string;
  source: string | KnowledgeNode;
  target: string | KnowledgeNode;
  relationship: 'governs' | 'monitors' | 'part_of' | 'audits' | 'applies_to' | 'references';
  relationshipLabelFa: string;
  weight: number;
}

// Initial rich industrial graph data
export const INITIAL_KNOWLEDGE_NODES: KnowledgeNode[] = [
  // 1. Assets
  {
    id: 'asset-k04',
    labelFa: 'کمپرسور گاز فشار بالا K-04',
    labelEn: 'High-Pressure Gas Compressor K-04',
    type: 'asset',
    code: 'K-04',
    assetId: 'compressor-04',
    assetNameFa: 'کمپرسور رفت‌وبرگشتی K-04',
    summaryFa: 'کمپرسور فرآیندی بحرانی پالایشگاه عسلویه مجهز به سنسورهای ارتعاشاتی لایه صفر پردو و ثبت بلوک حقیقت.',
    tags: ['کمپرسور', 'فشار بالا', 'عسلویه', 'تجهیز بحرانی'],
    importance: 5
  },
  {
    id: 'asset-p02',
    labelFa: 'پمپ سانتریفیوژ انتقال خوراک P-02',
    labelEn: 'Feed Transfer Centrifugal Pump P-02',
    type: 'asset',
    code: 'P-02',
    assetId: 'pump-02',
    assetNameFa: 'پمپ سانتریفیوژ P-02',
    summaryFa: 'پمپ گریز از مرکز انتقال هیدروکربن سنگین با دور نامی ۲۹۵۰ دور بر دقیقه و مانیتورینگ آنلاین کاویتاسیون.',
    tags: ['پمپ', 'سانتریفیوژ', 'خوراک فرآیندی'],
    importance: 4
  },
  {
    id: 'asset-m01',
    labelFa: 'الکتروموتور ولتاژ متوسط M-01',
    labelEn: 'Medium-Voltage Induction Motor M-01',
    type: 'asset',
    code: 'M-01',
    assetId: 'motor-01',
    assetNameFa: 'الکتروموتور محرک M-01',
    summaryFa: 'موتور الکتریکی القایی ۳۵۰ کیلووات تامین‌کننده گشتاور ورودی کمپرسور K-04 با مانیتورینگ حرارت سیم‌پیچ استاتور.',
    tags: ['موتور', 'الکتریکی', 'استاتور'],
    importance: 4
  },

  // 2. Components
  {
    id: 'comp-bearing-skf',
    labelFa: 'یاتاقان غلتشی کروی SKF 23144 CC',
    labelEn: 'SKF 23144 CC Spherical Roller Bearing',
    type: 'component',
    code: 'BRG-23144',
    assetId: 'compressor-04',
    assetNameFa: 'کمپرسور گاز K-04',
    summaryFa: 'بیرینگ شفت محرک اصلی در معرض تنش‌های ارتعاشی دورانی و پایش‌شده با فرکانس BPFO=217.4Hz.',
    tags: ['یاتاقان', 'SKF', 'بیرینگ', 'BPFO', 'روانکاری'],
    importance: 4
  },
  {
    id: 'comp-seal-53a',
    labelFa: 'سیل مکانیکی دوار Plan 53A',
    labelEn: 'Plan 53A Dual Mechanical Seal',
    type: 'component',
    code: 'SEAL-P53A',
    assetId: 'pump-02',
    assetNameFa: 'پمپ سانتریفیوژ P-02',
    summaryFa: 'سیستم آب‌بندی مکانیکی دوگانه تحت فشار ازت (N2 Cushion) جهت ایزولاسیون کامل سیال قابل اشتعال.',
    tags: ['مکانیکال سیل', 'Plan-53A', 'فشار ازت', 'آب‌بندی'],
    importance: 3
  },
  {
    id: 'comp-coupling',
    labelFa: 'کوپلینگ انعطاف‌پذیر دیسکی',
    labelEn: 'Flexible Metallic Disc Coupling',
    type: 'component',
    code: 'CPL-FLEX-01',
    assetId: 'compressor-04',
    assetNameFa: 'کمپرسور گاز K-04',
    summaryFa: 'انتقال‌دهنده گشتاور بین موتور M-01 و شفت ورودی کمپرسور با پایش عدم‌هم‌راستایی لیزری (Misalignment).',
    tags: ['کوپلینگ', 'انعطاف‌پذیر', 'انحراف محوری'],
    importance: 3
  },
  {
    id: 'comp-impeller',
    labelFa: 'پروانه هیدرولیکی ۶ پره',
    labelEn: '6-Vane Enclosed Hydraulic Impeller',
    type: 'component',
    code: 'IMP-6V',
    assetId: 'pump-02',
    assetNameFa: 'پمپ سانتریفیوژ P-02',
    summaryFa: 'پروانه چدن داکتیل ضد سایش با فرکانس پره‌گذری BPF برابر با ۲۹۵ هرتز.',
    tags: ['پروانه', 'هیدرولیک', 'کاویتاسیون', 'BPF'],
    importance: 3
  },
  {
    id: 'comp-crosshead',
    labelFa: 'کراس‌هد و راد کمپرسور K-04',
    labelEn: 'Crosshead & Piston Rod Assembly',
    type: 'component',
    code: 'CRH-K04',
    assetId: 'compressor-04',
    assetNameFa: 'کمپرسور گاز K-04',
    summaryFa: 'مجموعه لغزنده انتقال حرکت دورانی لنگ به حرکت خطی پیستون با اندازه‌گیری افت عمودی میله (Rod Drop).',
    tags: ['کراس‌هد', 'میله پیستون', 'Rod Drop'],
    importance: 3
  },

  // 3. Technical Documents & Reports
  {
    id: 'doc-audit-k04',
    labelFa: 'گزارش ممیزی ارتعاشاتی و تحلیل سلامت یاتاقان K-04',
    labelEn: 'Vibration Audit & Bearing Health Report K-04',
    type: 'document',
    code: 'VIN-AUD-2026-K04',
    assetId: 'compressor-04',
    assetNameFa: 'کمپرسور گاز K-04',
    revision: 'Rev 2.1',
    date: '۱۴۰۵/۰۶/۰۲',
    hash: '0x8f4c9a72b10e34d7',
    summaryFa: 'گزارش رسمی تشخیص عیب رینگ خارجی با دمدولاسیون پوش هیلبرت و تعیین زمان بهینه تعویض بیرینگ بدون توقف فرآیند.',
    tags: ['ممیزی', 'BPFO', 'کرتوزیس', 'گزارش فنی'],
    importance: 4
  },
  {
    id: 'doc-sop-k04',
    labelFa: 'دستورالعمل SOP تعمیرات پیش‌بینانه و روانکاری بیرینگ K-04',
    labelEn: 'Predictive Maintenance & Bearing Lubrication SOP',
    type: 'document',
    code: 'VIN-SOP-BRG-23144',
    assetId: 'compressor-04',
    assetNameFa: 'کمپرسور گاز K-04',
    revision: 'Rev 3.1',
    date: '۱۴۰۵/۰۴/۱۸',
    hash: '0x3d17e92a8c54ff10',
    summaryFa: 'پروتکل اجرایی فیلر زدن لقی C3، تزریق ۲۲۲ گرم گریس در فواصل ۱۵۰۰ ساعته و استفاده از هیتر القایی.',
    tags: ['SOP', 'روانکاری', 'لقی C3', 'تعمیرات'],
    importance: 3
  },
  {
    id: 'doc-pid-k04',
    labelFa: 'نقشه لوله‌کشی و ابزاردقیق P&ID کمپرسور K-04',
    labelEn: 'P&ID Piping & Instrumentation Diagram K-04',
    type: 'document',
    code: 'PID-K04-DWG-042',
    assetId: 'compressor-04',
    assetNameFa: 'کمپرسور گاز K-04',
    revision: 'Rev 4.2',
    date: '۱۴۰۵/۰۵/۲۰',
    hash: '0x17bfa4902cd98e11',
    summaryFa: 'نقشه مهندسی استقرار ترانسمیترهای فشار PT-104، سنسورهای سرعت VT-201 و اینترلاک‌های حفاظتی ESD.',
    tags: ['P&ID', 'نقشه مهندسی', 'ابزاردقیق', 'اینترلاک'],
    importance: 4
  },
  {
    id: 'doc-manual-p02',
    labelFa: 'دفترچه راهنمای نگهداری و عیب‌یابی پمپ P-02',
    labelEn: 'Centrifugal Pump Maintenance Manual P-02',
    type: 'document',
    code: 'VIN-MAN-PMP-P02',
    assetId: 'pump-02',
    assetNameFa: 'پمپ سانتریفیوژ P-02',
    revision: 'Rev 3.0',
    date: '۱۴۰۵/۰۲/۱۴',
    hash: '0x4e61d8b9201fa49c',
    summaryFa: 'مستند کارخانه‌ای هم‌راستاسازی لیزری شفت، تست ارتعاشات بدون بار و حدود کاویتاسیون پوسته حلزونی.',
    tags: ['دفترچه راهنما', 'پمپ', 'هم‌راستاسازی'],
    importance: 3
  },
  {
    id: 'doc-contract-583302',
    labelFa: 'قرارداد رسمی واگذاری لایسنس و دوقلوی صنعتی ویستا (ثبت ۵۸۳۳۰۲)',
    labelEn: 'Official Vista Industrial License & EPC Contract #583302',
    type: 'document',
    code: 'VIN-IND-2026/09',
    assetId: 'compressor-04',
    assetNameFa: 'تمام تجهیزات پالایشگاهی',
    revision: 'Rev 2.0 Final',
    date: '۱۴۰۵/۰۶/۱۷',
    hash: '0x583302abcdef9911',
    summaryFa: 'پیمان حقوقی الزام به دسترسی ۹۹.۹۵٪، ممیزی بلوک حقیقت و استقرار ایزوله در شبکه فرآیندی پتروشیمی.',
    tags: ['قرارداد', 'ثبت ۵۸۳۳۰۲', 'SLA', 'حقوقی'],
    importance: 4
  },
  {
    id: 'doc-rcfa-k04',
    labelFa: 'گزارش تحلیل علل ریشه‌ای خرابی (RCFA) لرزش شفت K-04',
    labelEn: 'Root Cause Failure Analysis (RCFA) Shaft Vibration K-04',
    type: 'document',
    code: 'RCFA-2025-09',
    assetId: 'compressor-04',
    assetNameFa: 'کمپرسور گاز K-04',
    revision: 'Rev 1.0',
    date: '۱۴۰۴/۰۹/۱۰',
    hash: '0xbb1923485ccdde01',
    summaryFa: 'بررسی اثر عدم روانکاری کافی بیرینگ بر ایجاد خراش اولیه میکروکرک در سطح تماس ساچمه و رینگ خارجی.',
    tags: ['RCFA', 'علل ریشه‌ای', 'میکروکرک', 'خرابی گذشته'],
    importance: 3
  },

  // 4. Standards
  {
    id: 'std-iso10816',
    labelFa: 'استاندارد بین‌المللی ارزیابی ارتعاشات ISO 10816-3',
    labelEn: 'ISO 10816-3 Machinery Vibration Standard',
    type: 'standard',
    code: 'ISO 10816-3',
    summaryFa: 'مرجع علمی تعیین حدود ۴ گانه کیفیت کارکرد ماشین‌آلات صنعتی (Zones A, B, C, D) بر حسب سرعت مؤثر RMS.',
    tags: ['ISO', 'ارتعاشات', 'Zone-A-D', 'حدود مجاز'],
    importance: 4
  },
  {
    id: 'std-api670',
    labelFa: 'استاندارد سیستم‌های حفاظت ماشین‌آلات API 670',
    labelEn: 'API 670 Machinery Protection Systems Standard',
    type: 'standard',
    code: 'API 670',
    summaryFa: 'الزامات چیدمان سنسورهای جریان گردابی جابجایی شفت، شتاب‌سنج‌ها و فرمان‌های تریپ سخت‌افزاری دو از سه (2oo3).',
    tags: ['API 670', 'حفاظت ماشین', 'اینترلاک', 'سنسور لبه'],
    importance: 4
  },
  {
    id: 'std-iec62443',
    labelFa: 'استاندارد امنیت سایبری و ایزولاسیون شبکه IEC 62443-3-3',
    labelEn: 'IEC 62443-3-3 Industrial Cybersecurity Standard',
    type: 'standard',
    code: 'IEC 62443',
    summaryFa: 'معماری امنیتی جداسازی مناطق پردو، قفل سخت‌افزاری دیتادیود و امضای رمزنگاری‌شده بلاک‌های حقیقت داده.',
    tags: ['IEC 62443', 'امنیت سایبری', 'پردو', 'دیود داده'],
    importance: 4
  }
];

export const INITIAL_KNOWLEDGE_LINKS: KnowledgeLink[] = [
  // Asset to Component
  { id: 'l-k04-brg', source: 'asset-k04', target: 'comp-bearing-skf', relationship: 'part_of', relationshipLabelFa: 'شامل یاتاقان', weight: 3 },
  { id: 'l-k04-cpl', source: 'asset-k04', target: 'comp-coupling', relationship: 'part_of', relationshipLabelFa: 'متصل با کوپلینگ', weight: 2 },
  { id: 'l-k04-crh', source: 'asset-k04', target: 'comp-crosshead', relationship: 'part_of', relationshipLabelFa: 'دارای مکانیزم کراس‌هد', weight: 3 },
  { id: 'l-m01-cpl', source: 'asset-m01', target: 'comp-coupling', relationship: 'part_of', relationshipLabelFa: 'کوپل‌شده به', weight: 2 },
  { id: 'l-p02-seal', source: 'asset-p02', target: 'comp-seal-53a', relationship: 'part_of', relationshipLabelFa: 'مجهز به سیل 53A', weight: 3 },
  { id: 'l-p02-imp', source: 'asset-p02', target: 'comp-impeller', relationship: 'part_of', relationshipLabelFa: 'دارای پروانه', weight: 3 },

  // Document to Asset
  { id: 'l-audit-k04', source: 'doc-audit-k04', target: 'asset-k04', relationship: 'audits', relationshipLabelFa: 'ممیزی تجهیز K-04', weight: 4 },
  { id: 'l-sop-k04', source: 'doc-sop-k04', target: 'asset-k04', relationship: 'governs', relationshipLabelFa: 'دستورالعمل اجرایی', weight: 3 },
  { id: 'l-pid-k04', source: 'doc-pid-k04', target: 'asset-k04', relationship: 'references', relationshipLabelFa: 'نقشه P&ID', weight: 4 },
  { id: 'l-man-p02', source: 'doc-manual-p02', target: 'asset-p02', relationship: 'governs', relationshipLabelFa: 'دفترچه نگهداری', weight: 3 },
  { id: 'l-contract-k04', source: 'doc-contract-583302', target: 'asset-k04', relationship: 'governs', relationshipLabelFa: 'پیمان استقرار رسمی', weight: 3 },
  { id: 'l-contract-p02', source: 'doc-contract-583302', target: 'asset-p02', relationship: 'governs', relationshipLabelFa: 'تعهدات پایش SLA', weight: 2 },

  // Document to Component
  { id: 'l-audit-brg', source: 'doc-audit-k04', target: 'comp-bearing-skf', relationship: 'monitors', relationshipLabelFa: 'پایش طیف BPFO یاتاقان', weight: 5 },
  { id: 'l-sop-brg', source: 'doc-sop-k04', target: 'comp-bearing-skf', relationship: 'governs', relationshipLabelFa: 'رویه روانکاری بیرینگ', weight: 4 },
  { id: 'l-rcfa-brg', source: 'doc-rcfa-k04', target: 'comp-bearing-skf', relationship: 'references', relationshipLabelFa: 'تحلیل فرسایش ساچمه', weight: 3 },
  { id: 'l-pid-crh', source: 'doc-pid-k04', target: 'comp-crosshead', relationship: 'monitors', relationshipLabelFa: 'سنسورهای راد دراپ', weight: 3 },
  { id: 'l-man-imp', source: 'doc-manual-p02', target: 'comp-impeller', relationship: 'monitors', relationshipLabelFa: 'بررسی سایش پروانه', weight: 3 },
  { id: 'l-man-seal', source: 'doc-manual-p02', target: 'comp-seal-53a', relationship: 'governs', relationshipLabelFa: 'رویه تست فشار سیل', weight: 3 },

  // Standards to Documents & Components
  { id: 'l-iso-audit', source: 'std-iso10816', target: 'doc-audit-k04', relationship: 'governs', relationshipLabelFa: 'استاندارد مرجع ارزیابی', weight: 4 },
  { id: 'l-iso-k04', source: 'std-iso10816', target: 'asset-k04', relationship: 'applies_to', relationshipLabelFa: 'تعیین حدود آستانه لرزش', weight: 3 },
  { id: 'l-api-pid', source: 'std-api670', target: 'doc-pid-k04', relationship: 'governs', relationshipLabelFa: 'الزامات ابزاردقیق', weight: 3 },
  { id: 'l-api-crh', source: 'std-api670', target: 'comp-crosshead', relationship: 'applies_to', relationshipLabelFa: 'سنسور ادی‌کارنت API', weight: 3 },
  { id: 'l-iec-contract', source: 'std-iec62443', target: 'doc-contract-583302', relationship: 'governs', relationshipLabelFa: 'الزام امنیتی دیتادیود', weight: 4 }
];

export const DocumentKnowledgeGraph: React.FC = () => {
  const { setSelectedAssetId } = useApp();

  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(INITIAL_KNOWLEDGE_NODES[0]);
  const [filterType, setFilterType] = useState<KnowledgeNodeType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [repulsionStrength, setRepulsionStrength] = useState<number>(-280);
  const [linkDistance, setLinkDistance] = useState<number>(85);

  // Nodes & links filtered by category and search
  const { filteredNodes, filteredLinks } = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const nodeIdsAllowed = new Set<string>();
    const nodes = INITIAL_KNOWLEDGE_NODES.filter((node) => {
      if (filterType !== 'all' && node.type !== filterType) return false;
      if (q) {
        const inFa = node.labelFa.toLowerCase().includes(q) || node.summaryFa.toLowerCase().includes(q);
        const inEn = node.labelEn.toLowerCase().includes(q);
        const inTags = node.tags.some((t) => t.toLowerCase().includes(q));
        const inCode = node.code.toLowerCase().includes(q);
        if (!inFa && !inEn && !inTags && !inCode) return false;
      }
      nodeIdsAllowed.add(node.id);
      return true;
    });

    const links = INITIAL_KNOWLEDGE_LINKS.filter((link) => {
      const sourceId = typeof link.source === 'object' ? (link.source as KnowledgeNode).id : link.source;
      const targetId = typeof link.target === 'object' ? (link.target as KnowledgeNode).id : link.target;
      return nodeIdsAllowed.has(sourceId as string) && nodeIdsAllowed.has(targetId as string);
    });

    return { filteredNodes: nodes, filteredLinks: links };
  }, [filterType, searchQuery]);

  // Connected nodes for the selected node
  const connectedNeighbors = useMemo(() => {
    if (!selectedNode) return [];
    const connectedIds = new Set<string>();

    INITIAL_KNOWLEDGE_LINKS.forEach((link) => {
      const sId = typeof link.source === 'object' ? (link.source as KnowledgeNode).id : link.source;
      const tId = typeof link.target === 'object' ? (link.target as KnowledgeNode).id : link.target;
      if (sId === selectedNode.id) connectedIds.add(tId as string);
      if (tId === selectedNode.id) connectedIds.add(sId as string);
    });

    return INITIAL_KNOWLEDGE_NODES.filter((n) => connectedIds.has(n.id));
  }, [selectedNode]);

  // D3 Force Simulation Setup
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = containerRef.current.clientHeight || 600;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Deep clones of nodes and links for simulation
    const simNodes: KnowledgeNode[] = filteredNodes.map((d) => ({ ...d }));
    const simLinks: KnowledgeLink[] = filteredLinks.map((d) => ({
      ...d,
      source: typeof d.source === 'object' ? (d.source as KnowledgeNode).id : d.source,
      target: typeof d.target === 'object' ? (d.target as KnowledgeNode).id : d.target
    }));

    // Main zoom container group
    const g = svg.append('g').attr('class', 'everything');

    // Setup zoom & pan
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Initial center zoom
    svg.call(zoom.transform, d3.zoomIdentity.translate(width / 2, height / 2).scale(0.85));

    // Force Simulation definition
    const simulation = d3
      .forceSimulation<KnowledgeNode>(simNodes)
      .force(
        'link',
        d3
          .forceLink<KnowledgeNode, KnowledgeLink>(simLinks)
          .id((d) => d.id)
          .distance(linkDistance)
          .strength(0.7)
      )
      .force('charge', d3.forceManyBody().strength(repulsionStrength))
      .force('center', d3.forceCenter(0, 0))
      .force('collide', d3.forceCollide().radius((d) => (d as KnowledgeNode).importance * 12 + 10));

    // Color definitions
    const getNodeColor = (type: KnowledgeNodeType) => {
      switch (type) {
        case 'asset':
          return '#0284c7'; // Sky-600
        case 'component':
          return '#d97706'; // Amber-600
        case 'document':
          return '#9333ea'; // Purple-600
        case 'standard':
          return '#10b981'; // Emerald-500
        default:
          return '#64748b';
      }
    };

    const getNodeBorderColor = (type: KnowledgeNodeType) => {
      switch (type) {
        case 'asset':
          return '#38bdf8'; // Sky-400
        case 'component':
          return '#fbbf24'; // Amber-400
        case 'document':
          return '#c084fc'; // Purple-400
        case 'standard':
          return '#34d399'; // Emerald-400
        default:
          return '#94a3b8';
      }
    };

    // Render Links
    const linkGroup = g.append('g').attr('class', 'links');
    const link = linkGroup
      .selectAll('line')
      .data(simLinks)
      .enter()
      .append('line')
      .attr('stroke', '#334155')
      .attr('stroke-width', (d) => Math.max(1.5, d.weight * 0.8))
      .attr('stroke-opacity', 0.6)
      .attr('stroke-dasharray', (d) => (d.relationship === 'applies_to' || d.relationship === 'references' ? '3,3' : 'none'));

    // Render Link Text labels (optional)
    let linkLabel: d3.Selection<SVGTextElement, KnowledgeLink, SVGGElement, unknown> | null = null;
    if (showLabels) {
      const linkLabelGroup = g.append('g').attr('class', 'link-labels');
      linkLabel = linkLabelGroup
        .selectAll('text')
        .data(simLinks)
        .enter()
        .append('text')
        .text((d) => d.relationshipLabelFa)
        .attr('font-size', '9px')
        .attr('fill', '#94a3b8')
        .attr('text-anchor', 'middle')
        .attr('font-family', 'inherit')
        .attr('dy', -3);
    }

    // Render Nodes Group
    const nodeGroup = g.append('g').attr('class', 'nodes');
    const node = nodeGroup
      .selectAll('g')
      .data(simNodes)
      .enter()
      .append('g')
      .attr('cursor', 'pointer')
      .call(
        d3
          .drag<SVGGElement, KnowledgeNode>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    // Node outer glow / aura
    node
      .append('circle')
      .attr('r', (d) => d.importance * 7 + 10)
      .attr('fill', (d) => getNodeColor(d.type))
      .attr('fill-opacity', 0.15)
      .attr('stroke', (d) => getNodeBorderColor(d.type))
      .attr('stroke-width', 1.5)
      .attr('stroke-opacity', 0.4);

    // Node core circle
    node
      .append('circle')
      .attr('r', (d) => d.importance * 6 + 6)
      .attr('fill', (d) => getNodeColor(d.type))
      .attr('stroke', (d) => getNodeBorderColor(d.type))
      .attr('stroke-width', 2)
      .attr('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))');

    // Node text label
    node
      .append('text')
      .text((d) => d.labelFa)
      .attr('y', (d) => d.importance * 7 + 22)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .attr('fill', '#f1f5f9')
      .attr('stroke', '#090d16')
      .attr('stroke-width', 3)
      .attr('paint-order', 'stroke')
      .attr('font-family', 'inherit');

    // Node code pill label
    node
      .append('text')
      .text((d) => d.code)
      .attr('y', 4)
      .attr('text-anchor', 'middle')
      .attr('font-size', '9px')
      .attr('font-weight', 'bold')
      .attr('fill', '#ffffff')
      .attr('font-family', 'monospace');

    // Node Click Handler
    node.on('click', (_event, d) => {
      setSelectedNode(d);

      // Highlight links connected to this node
      link
        .attr('stroke', (l) => {
          const s = typeof l.source === 'object' ? (l.source as KnowledgeNode).id : l.source;
          const t = typeof l.target === 'object' ? (l.target as KnowledgeNode).id : l.target;
          return s === d.id || t === d.id ? '#38bdf8' : '#334155';
        })
        .attr('stroke-width', (l) => {
          const s = typeof l.source === 'object' ? (l.source as KnowledgeNode).id : l.source;
          const t = typeof l.target === 'object' ? (l.target as KnowledgeNode).id : l.target;
          return s === d.id || t === d.id ? 3 : 1.5;
        })
        .attr('stroke-opacity', (l) => {
          const s = typeof l.source === 'object' ? (l.source as KnowledgeNode).id : l.source;
          const t = typeof l.target === 'object' ? (l.target as KnowledgeNode).id : l.target;
          return s === d.id || t === d.id ? 1 : 0.25;
        });
    });

    // Simulation tick loop
    simulation.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as KnowledgeNode).x || 0)
        .attr('y1', (d) => (d.source as KnowledgeNode).y || 0)
        .attr('x2', (d) => (d.target as KnowledgeNode).x || 0)
        .attr('y2', (d) => (d.target as KnowledgeNode).y || 0);

      if (linkLabel) {
        linkLabel
          .attr('x', (d) => (((d.source as KnowledgeNode).x || 0) + ((d.target as KnowledgeNode).x || 0)) / 2)
          .attr('y', (d) => (((d.source as KnowledgeNode).y || 0) + ((d.target as KnowledgeNode).y || 0)) / 2);
      }

      node.attr('transform', (d) => `translate(${d.x || 0},${d.y || 0})`);
    });

    return () => {
      simulation.stop();
    };
  }, [filteredNodes, filteredLinks, repulsionStrength, linkDistance, showLabels]);

  const getNodeBadgeClass = (type: KnowledgeNodeType) => {
    switch (type) {
      case 'asset':
        return 'bg-sky-500/20 text-sky-400 border-sky-500/30';
      case 'component':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'document':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'standard':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const getNodeTypeLabelFa = (type: KnowledgeNodeType) => {
    switch (type) {
      case 'asset':
        return 'تجهیز فرآیندی (Asset)';
      case 'component':
        return 'جزء مکانیکی (Component)';
      case 'document':
        return 'سند فنی و ممیزی (Report/Doc)';
      case 'standard':
        return 'استاندارد مرجع (Standard)';
      default:
        return 'موجودیت دانش';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Network size={22} />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white">گراف دانش پیوند اسناد فنی و دارایی‌های مکانیکی</h1>
              <span className="text-xs text-sky-400 font-mono">D3.js Force Simulation • پایش روابط متقابل قطعات، گزارش‌ها و استانداردها</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2 max-w-3xl leading-relaxed">
            ردیابی بصری چگونگی اتصال گزارش‌های ممیزی ارتعاشی، نقشه‌های P&ID، استانداردهای ISO 10816 و دستورالعمل‌های تعمیراتی به یاتاقان‌ها، سیل‌ها و قطعات دوار کارخانه.
          </p>
        </div>

        {/* Quick Route Links */}
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="#/doc-comparison"
            className="px-3 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <GitCompare size={14} />
            <span>مقایسه‌گر نسخ اسناد (Diff)</span>
          </a>
          <a
            href="#/offline-docs"
            className="px-3 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <HardDrive size={14} />
            <span>مدیریت اسناد آفلاین</span>
          </a>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-2xl">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              filterType === 'all'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            همه موجودیت‌ها ({INITIAL_KNOWLEDGE_NODES.length})
          </button>
          <button
            onClick={() => setFilterType('asset')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
              filterType === 'asset'
                ? 'bg-sky-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Box size={13} className="text-sky-400" />
            <span>تجهیزات اصلی (3)</span>
          </button>
          <button
            onClick={() => setFilterType('component')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
              filterType === 'component'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu size={13} className="text-amber-400" />
            <span>اجزای مکانیکی (5)</span>
          </button>
          <button
            onClick={() => setFilterType('document')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
              filterType === 'document'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText size={13} className="text-purple-400" />
            <span>گزارش‌ها و نقشه‌ها (6)</span>
          </button>
          <button
            onClick={() => setFilterType('standard')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
              filterType === 'standard'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck size={13} className="text-emerald-400" />
            <span>استانداردها (3)</span>
          </button>
        </div>

        {/* Search input */}
        <div className="relative min-w-[220px]">
          <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در گره‌ها و تگ‌ها..."
            className="w-full bg-slate-950 text-slate-200 text-xs py-1.5 pr-8 pl-3 rounded-xl border border-slate-800 focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* Main Graph Canvas & Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left/Main Column: D3 Graph Canvas */}
        <div className="lg:col-span-2 relative bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden min-h-[560px] flex flex-col">
          {/* Canvas Floating Overlay Controls */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-slate-900/90 backdrop-blur border border-slate-800 p-1.5 rounded-2xl shadow-lg">
            <button
              onClick={() => setShowLabels(!showLabels)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-medium transition-colors ${
                showLabels ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="نمایش برچسب روابط خطوط"
            >
              برچسب روابط
            </button>
            <div className="h-4 w-px bg-slate-800" />
            <div className="flex items-center gap-1 text-slate-400 text-xs px-1">
              <Sliders size={13} />
              <input
                type="range"
                min="-500"
                max="-100"
                value={repulsionStrength}
                onChange={(e) => setRepulsionStrength(Number(e.target.value))}
                className="w-16 accent-sky-500 cursor-pointer"
                title="نیروی دافعه گره‌ها"
              />
            </div>
          </div>

          {/* D3 SVG Container */}
          <div ref={containerRef} className="w-full flex-1 min-h-[500px]">
            <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
          </div>

          {/* Legend Bottom Bar */}
          <div className="p-3 border-t border-slate-800/80 bg-slate-900/70 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-3 rounded-full bg-sky-500" />
                <span>تجهیز (Asset)</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span>جزء مکانیکی (Component)</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-3 rounded-full bg-purple-500" />
                <span>سند / گزارش (Document)</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span>استاندارد (Standard)</span>
              </span>
            </div>

            <div className="text-[11px] text-slate-500 font-mono">
              {filteredNodes.length} گره • {filteredLinks.length} یال ارتباطی
            </div>
          </div>
        </div>

        {/* Right Column: Node Inspector & Linked Documents Card */}
        <div className="space-y-4">
          {selectedNode ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-5">
              {/* Node Header */}
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border ${getNodeBadgeClass(selectedNode.type)}`}>
                    {getNodeTypeLabelFa(selectedNode.type)}
                  </span>
                  <span className="font-mono text-xs text-slate-400 bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800">
                    کد: {selectedNode.code}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mt-2.5 leading-snug">{selectedNode.labelFa}</h3>
                <p className="text-xs font-mono text-slate-400">{selectedNode.labelEn}</p>
              </div>

              {/* Summary */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs leading-relaxed text-slate-300">
                {selectedNode.summaryFa}
              </div>

              {/* Tags */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-400">برچسب‌ها و تگ‌های صنعتی:</span>
                <div className="flex flex-wrap gap-1">
                  {selectedNode.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-slate-800 text-[11px] text-slate-300 font-mono"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Metadata if document */}
              {selectedNode.type === 'document' && (
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5 text-xs">
                  {selectedNode.revision && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">نسخه سند:</span>
                      <span className="text-white font-mono font-bold">{selectedNode.revision}</span>
                    </div>
                  )}
                  {selectedNode.date && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">تاریخ تصویب:</span>
                      <span className="text-slate-300">{selectedNode.date}</span>
                    </div>
                  )}
                  {selectedNode.hash && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">هش بلوک حقیقت:</span>
                      <span className="text-emerald-400 font-mono text-[11px]">{selectedNode.hash}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                {selectedNode.assetId && (
                  <button
                    onClick={() => {
                      setSelectedAssetId(selectedNode.assetId!);
                      window.location.hash = '#/twin';
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-md shadow-sky-600/30"
                  >
                    <Box size={14} />
                    <span>مشاهده در دوقلوی سه‌بعدی (3D Twin)</span>
                  </button>
                )}

                {selectedNode.type === 'document' && (
                  <a
                    href="#/doc-comparison"
                    className="w-full py-2 px-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <GitCompare size={14} />
                    <span>بررسی تغییرات در مقایسه‌گر سند (Diff)</span>
                  </a>
                )}

                {selectedNode.id === 'comp-bearing-skf' && (
                  <a
                    href="#/vibration"
                    className="w-full py-2 px-3 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Activity size={14} />
                    <span>مشاهده طیف ارتعاشات FFT و BPFO</span>
                  </a>
                )}
              </div>

              {/* Connected Neighborhood */}
              <div className="pt-3 border-t border-slate-800 space-y-2.5">
                <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Network size={14} className="text-sky-400" />
                  موجودیت‌های متصل در گراف ({connectedNeighbors.length}):
                </h4>
                <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                  {connectedNeighbors.map((neighbor) => (
                    <div
                      key={neighbor.id}
                      onClick={() => setSelectedNode(neighbor)}
                      className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800/80 cursor-pointer flex items-center justify-between gap-2 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-slate-200 truncate">{neighbor.labelFa}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{neighbor.code}</div>
                      </div>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${getNodeBadgeClass(neighbor.type)}`}>
                        {neighbor.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-slate-400 space-y-3">
              <Info size={32} className="mx-auto text-slate-600" />
              <p className="text-xs">جهت بررسی مشخصات، متادیتا و اسناد متصل، روی یکی از گره‌های گراف کلیک نمایید.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
