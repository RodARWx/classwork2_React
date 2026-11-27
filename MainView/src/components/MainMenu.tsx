import { useState, type ComponentType } from 'react';
import {
  ArrowRight,
  BarChart3,
  Calculator,
  CheckCircle2,
  ClipboardList,
  Globe,
  Plus,
} from 'lucide-react';
import type { FeatureKey, FeatureOption } from '../types/navigation';
import './MainMenu.css';

interface MainMenuProps {
  /**
   * Optional callback invoked when a user selects a feature module.
   * Teammates can connect routing/navigation here later.
   */
  onNavigate?: (feature: FeatureKey) => void;
}

const FEATURE_ICONS: Record<FeatureKey, ComponentType<{ size?: number; 'aria-hidden'?: boolean }>> = {
  Sum: Plus,
  Calculator: Calculator,
  API: Globe,
  Form: ClipboardList,
  Graphs: BarChart3,
};

const FEATURES: FeatureOption[] = [
  {
    key: 'Sum',
    label: 'Sum',
    description: 'Add numbers and view instant totals',
    route: '/sum',
  },
  {
    key: 'Calculator',
    label: 'Calculator',
    description: 'Arithmetic operations, history, and unit converter',
    route: '/calculator',
  },
  {
    key: 'API',
    label: 'API',
    description: 'Fetch and explore external data endpoints',
    route: '/api',
  },
  {
    key: 'Form',
    label: 'Form',
    description: 'Structured inputs with schema validation',
    route: '/form',
  },
  {
    key: 'Graphs',
    label: 'Graphs',
    description: 'Interactive charts and visual analytics',
    route: '/graphs',
  },
];

export function MainMenu({ onNavigate }: MainMenuProps) {
  const [selectedFeature, setSelectedFeature] = useState<FeatureOption | null>(null);

  const handleSelect = (feature: FeatureOption) => {
    setSelectedFeature(feature);

    if (onNavigate) {
      onNavigate(feature.key);
    }
  };

  return (
    <div className="main-menu">
      <nav className="feature-list" aria-label="Application modules">
        {FEATURES.map((feature) => {
          const Icon = FEATURE_ICONS[feature.key];
          const isSelected = selectedFeature?.key === feature.key;

          return (
            <button
              key={feature.key}
              type="button"
              className={`feature-btn ${isSelected ? 'is-selected' : ''}`}
              onClick={() => handleSelect(feature)}
            >
              <span className="feature-btn-icon" aria-hidden="true">
                <Icon size={20} aria-hidden={true} />
              </span>

              <span className="feature-btn-content">
                <span className="feature-btn-title">{feature.label}</span>
                <span className="feature-btn-desc">{feature.description}</span>
              </span>

              <ArrowRight className="feature-btn-arrow" size={18} aria-hidden="true" />
            </button>
          );
        })}
      </nav>

      {selectedFeature && (
        <div className="main-preview-banner" role="status">
          <CheckCircle2 size={18} aria-hidden="true" />
          <span>
            Selected <strong>{selectedFeature.label}</strong> (<code>{selectedFeature.route}</code>) — Ready for route integration.
          </span>
        </div>
      )}
    </div>
  );
}
