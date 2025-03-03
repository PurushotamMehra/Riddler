import { Question } from "./question";
import { User } from "./user";


export interface Quiz {
  id?: number;
  title: string;
  duration: number; // in minutes
  teacher: User;
  questions?: Question[];
}
