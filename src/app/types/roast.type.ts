export interface Roast {
  _id: string;
  userId: string;

  name: string;
  roaster: string;

  origin?: string[];
  composition?: '' | 'single origin' | 'blend';
  processMethod?: '' | 'washed' | 'natural';
  roastedFor?: string[];
  tastingNotes?: [ string ];
  rating?: number;
  notes?: string;
}

export interface NewRoast {
  name: string;
  roaster: string;

  origin?: string[];
  composition?: '' | 'single origin' | 'blend';
  processMethod?: '' | 'washed' | 'natural';
  tastingNotes?: string[];
  rating?: number;
  notes?: string;
}
