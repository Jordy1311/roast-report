export type RoastCompositions = '' | 'Single Origin' | 'Blend';

export type RoastProcessMethods = '' | 'Washed' | 'Natural' | 'Honey' | 'Anaerobic Natural';

export interface Roast {
  _id: string;
  userId: string;

  name: string;
  roaster: string;

  origin?: string[];
  composition?: RoastCompositions;
  processMethod?: RoastProcessMethods;
  roastedFor?: string[];
  tastingNotes?: string[];
  rating?: number;
  notes?: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface NewRoast {
  name: string;
  roaster: string;

  origin?: string[];
  composition?: RoastCompositions;
  processMethod?: RoastProcessMethods;
  tastingNotes?: string[];
  rating?: number;
  notes?: string;
}
