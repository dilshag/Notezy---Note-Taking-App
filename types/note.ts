export interface Note {
  file: null;
  audio: null;
  video: null;
  image: null;
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt?: { seconds: number; nanoseconds?: number };
}
