import React from 'react';
import { Concept, ModuleData } from '../../types/curriculum';
import { QueryLensVisualizer } from './QueryLensVisualizer';
import { RelationalBridgeVisualizer } from './RelationalBridgeVisualizer';
import { SchemaBlueprintVisualizer } from './SchemaBlueprintVisualizer';
import { PerformanceWaterfallVisualizer } from './PerformanceWaterfallVisualizer';

interface ConceptVisualSwitchProps {
  concept: Concept;
  module: ModuleData;
}

export const ConceptVisualSwitch: React.FC<ConceptVisualSwitchProps> = ({ concept, module }) => {
  const day = module.day;
  const conceptId = concept.id.toLowerCase();

  // Route archetype based on concept topic and day
  if (day === 5 || day === 6 || day === 7 || conceptId.includes('relation') || conceptId.includes('join')) {
    return <RelationalBridgeVisualizer />;
  }

  if (day === 2 || day === 3 || day === 8 || conceptId.includes('schema') || conceptId.includes('model') || conceptId.includes('enum')) {
    return <SchemaBlueprintVisualizer />;
  }

  if (day >= 10 || conceptId.includes('perf') || conceptId.includes('n1') || conceptId.includes('transaction')) {
    return <PerformanceWaterfallVisualizer />;
  }

  // Default for Days 1, 4 and querying concepts: The Query Lens
  return <QueryLensVisualizer conceptId={concept.id} defaultModel="Student" />;
};
