export class Group {
  id: number;
  name: string;
  path: string;
  full_path: string;
  parent_id: number;
}

export type Groups = Group[];
