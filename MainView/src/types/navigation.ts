export type FeatureKey = 'Sum' | 'Calculator' | 'API' | 'Form' | 'Graphs';

export interface FeatureOption {
  key: FeatureKey;
  label: string;
  description: string;
  route: string;
}
