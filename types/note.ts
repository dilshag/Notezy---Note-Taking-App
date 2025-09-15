export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt?: { seconds: number; nanoseconds?: number };
}
