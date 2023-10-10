interface Module {
  id: string;
  title: string;
  module_code: string;
  course: string;
  semester: string;
  year: number;
  url: string;
}

export const enum Courses {
  CS = "Computer Science",
  PSYC = "Psychology",
}

export type { Module };
