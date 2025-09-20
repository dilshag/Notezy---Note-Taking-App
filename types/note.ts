// export interface Note {
//   file: null;
//   audio: null;
//   video: null;
//   image: null;
//   id: string;
//   title: string;
//   content: string;
//   category: string;
//   createdAt?: { seconds: number; nanoseconds?: number };
// }


export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  
  // Store URLs (or null if not uploaded)
  //file?: string | null;
  audio?: string | null;
  //video?: string | null;
  //image?: string | null;
  imageUrl?: string | null;
  videoUrl?: string | null;
  fileUrl?: string | null;
  
  
  createdAt?: { seconds: number; nanoseconds?: number } | Date;
}
