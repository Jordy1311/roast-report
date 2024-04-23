export interface Roast {
  _id: string;
  composition?: string;
  name: string;
  origin?: [ string ];
  processMethod?: string;
  roastedFor?: [ string ];
  roaster: string;
  tastingNotes?: [ string ];
  userId: string;
}
