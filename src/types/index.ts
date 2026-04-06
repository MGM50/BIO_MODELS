export interface Label {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags?: string[];
}

export interface Unit {
  name: string;
  labels: Label[];
}

export interface Grade {
  grade: string;
  title: string;
  units: Unit[];
  icon?: React.ReactNode;
}

export interface ActiveSection {
  grade: string;
  unit: string;
}
