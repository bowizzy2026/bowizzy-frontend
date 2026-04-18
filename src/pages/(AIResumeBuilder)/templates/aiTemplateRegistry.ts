import { lazy } from 'react';

const AiTemplate1Display = lazy(() => import('./display/AiTemplate1Display'));
const AiTemplate2Display = lazy(() => import('./display/AiTemplate2Display'));
const AiTemplate3Display = lazy(() => import('./display/AiTemplate3Display'));
const AiTemplate4Display = lazy(() => import('./display/AiTemplate4Display'));
const AiTemplate5Display = lazy(() => import('./display/AiTemplate5Display'));
const AiTemplate6Display = lazy(() => import('./display/AiTemplate6Display'));
const AiTemplate7Display = lazy(() => import('./display/AiTemplate7Display'));
const AiTemplate8Display = lazy(() => import('./display/AiTemplate8Display'));
const AiTemplate9Display = lazy(() => import('./display/AiTemplate9Display'));

const AiTemplate1PDF = lazy(() => import('./pdf/AiTemplate1PDF'));
const AiTemplate2PDF = lazy(() => import('./pdf/AiTemplate2PDF'));
const AiTemplate3PDF = lazy(() => import('./pdf/AiTemplate3PDF'));
const AiTemplate4PDF = lazy(() => import('./pdf/AiTemplate4PDF'));
const AiTemplate5PDF = lazy(() => import('./pdf/AiTemplate5PDF'));
const AiTemplate6PDF = lazy(() => import('./pdf/AiTemplate6PDF'));
const AiTemplate7PDF = lazy(() => import('./pdf/AiTemplate7PDF'));
const AiTemplate8PDF = lazy(() => import('./pdf/AiTemplate8PDF'));
const AiTemplate9PDF = lazy(() => import('./pdf/AiTemplate9PDF'));

export interface AiTemplateInfo {
  id: string;
  name: string;
  primaryColor: string;
  displayComponent: React.LazyExoticComponent<React.FC<any>>;
  pdfComponent: React.LazyExoticComponent<React.FC<any>>;
  importPdf: () => Promise<{ default: React.FC<any> }>;
}

export const aiTemplateRegistry: AiTemplateInfo[] = [
  {
    id: 'ai-1',
    name: 'Classic',
    primaryColor: '#1a1a1a',
    displayComponent: AiTemplate1Display,
    pdfComponent: AiTemplate1PDF,
    importPdf: () => import('./pdf/AiTemplate1PDF'),
  },
  {
    id: 'ai-2',
    name: 'Corporate',
    primaryColor: '#1e3a5f',
    displayComponent: AiTemplate2Display,
    pdfComponent: AiTemplate2PDF,
    importPdf: () => import('./pdf/AiTemplate2PDF'),
  },
  {
    id: 'ai-3',
    name: 'Sidebar',
    primaryColor: '#2d3748',
    displayComponent: AiTemplate3Display,
    pdfComponent: AiTemplate3PDF,
    importPdf: () => import('./pdf/AiTemplate3PDF'),
  },
  {
    id: 'ai-4',
    name: 'Bold Accent',
    primaryColor: '#b91c1c',
    displayComponent: AiTemplate4Display,
    pdfComponent: AiTemplate4PDF,
    importPdf: () => import('./pdf/AiTemplate4PDF'),
  },
  {
    id: 'ai-5',
    name: 'Elegant',
    primaryColor: '#0f766e',
    displayComponent: AiTemplate5Display,
    pdfComponent: AiTemplate5PDF,
    importPdf: () => import('./pdf/AiTemplate5PDF'),
  },
  {
    id: 'ai-6',
    name: 'Modern Split',
    primaryColor: '#4338ca',
    displayComponent: AiTemplate6Display,
    pdfComponent: AiTemplate6PDF,
    importPdf: () => import('./pdf/AiTemplate6PDF'),
  },
  {
    id: 'ai-7',
    name: 'Minimal Clean',
    primaryColor: '#374151',
    displayComponent: AiTemplate7Display,
    pdfComponent: AiTemplate7PDF,
    importPdf: () => import('./pdf/AiTemplate7PDF'),
  },
  {
    id: 'ai-8',
    name: 'Executive',
    primaryColor: '#1e293b',
    displayComponent: AiTemplate8Display,
    pdfComponent: AiTemplate8PDF,
    importPdf: () => import('./pdf/AiTemplate8PDF'),
  },
  {
    id: 'ai-9',
    name: 'Professional',
    primaryColor: '#334155',
    displayComponent: AiTemplate9Display,
    pdfComponent: AiTemplate9PDF,
    importPdf: () => import('./pdf/AiTemplate9PDF'),
  },
];
