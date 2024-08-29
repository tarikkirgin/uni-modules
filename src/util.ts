import { Icon, Color } from "@raycast/api";
import fs from "fs";
import { Module } from "./types";
import { join } from "path";
import { homedir } from "os";

export function getIcon(course: string) {
  if (course == "COMP") {
    return { source: Icon.Monitor, tintColor: Color.Blue };
  } else if (course == "PSYC") {
    return { source: Icon.TwoPeople, tintColor: Color.Magenta };
  } else {
    return { source: Icon.Book, tintColor: Color.PrimaryText };
  }
}

export function getCourseFolderName(course: string) {
  if (course == "COMP") {
    return "CS";
  } else if (course == "PSYC") {
    return "Psychology";
  } else {
    return "Unknown";
  }
}

export function getModuleFolderPath(module: Module) {
  const path = join(
    homedir(),
    "Documents",
    "University",
    getCourseFolderName(module.course),
    `Year ${module.year}`,
    `Semester ${module.semester}`,
    `${module.title} - ${module.module_code}`
  );
  return path;
}

export function createModuleFolder(module: Module) {
  const path = getModuleFolderPath(module);
  fs.mkdirSync(path, { recursive: true });
}
