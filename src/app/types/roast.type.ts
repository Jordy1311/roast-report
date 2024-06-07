export interface Roast {
  _id: string;
  userId: string;
  name: string;
  roaster: string;

  origin?: [ string ];
  composition?: string;
  processMethod?: string;
  roastedFor?: [ string ];
  tastingNotes?: [ string ];
  rating?: number;
  notes?: string;
}

export interface NewRoast {
  name: string;
  roaster: string;

  composition?: string;
  processMethod?: string;
  notes?: string;
}
