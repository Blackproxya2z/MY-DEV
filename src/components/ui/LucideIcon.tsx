import React from 'react';
import {
  Sparkles,
  Palette,
  Code2,
  Share2,
  Store,
  Briefcase,
  FileSpreadsheet,
  Layout,
  Globe,
  Terminal,
  ShoppingBag,
  Facebook,
  Linkedin,
  ArrowUpRight,
  Compass,
  Layers,
  CheckCircle2,
  BookOpen,
  Mail,
  MessageSquare,
  ShieldCheck,
  type LucideProps,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  Sparkles,
  Palette,
  Code2,
  Share2,
  Store,
  Briefcase,
  FileSpreadsheet,
  Layout,
  Globe,
  Terminal,
  ShoppingBag,
  Facebook,
  Linkedin,
  ArrowUpRight,
  Compass,
  Layers,
  CheckCircle2,
  BookOpen,
  Mail,
  MessageSquare,
  ShieldCheck,
};

export function DynamicLucideIcon({
  name,
  className = 'w-5 h-5',
}: {
  name?: string | null;
  className?: string;
}) {
  const IconComponent = (name && ICON_MAP[name]) || Sparkles;
  return <IconComponent className={className} aria-hidden="true" />;
}

