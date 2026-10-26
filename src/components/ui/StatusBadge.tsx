import React from 'react';
import type { ResearchEpistemicStatus, RoadmapStatus } from '../../data/siteContent';

export type BadgeStatusType =
  | ResearchEpistemicStatus
  | RoadmapStatus
  | 'Concept Visualisation'
  | 'Concept Architecture'
  | 'Active Track'
  | 'Exploratory'
  | string;

interface StatusBadgeProps {
  status?: BadgeStatusType;
  label?: string;
  variant?: 'concept' | 'research' | 'planned' | 'future' | 'validated' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * Decorative pill-shaped status badges have been intentionally decommissioned
 * across the interface to uphold radical minimalism and eliminate visual clutter.
 */
export const StatusBadge: React.FC<StatusBadgeProps> = () => {
  return null;
};
