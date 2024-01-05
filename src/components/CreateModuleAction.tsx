import { Action, Icon } from "@raycast/api";
import CreateModuleForm from "./CreateModuleForm";
import { Courses } from "../types";

function CreateModuleAction(props: {
  defaultTitle?: string;
  defaultModuleCode?: string;
  defaultCourse?: Courses;
  defaultSemester?: number;
  defaultYear?: number;
  onCreate: (title: string, module_code: string, course: Courses, semester: number, year: number, url: string) => void;
}) {
  return (
    <Action.Push
      icon={Icon.Pencil}
      title="Add module"
      shortcut={{ modifiers: ["cmd"], key: "n" }}
      target={<CreateModuleForm onCreate={props.onCreate} />}
    />
  );
}

export default CreateModuleAction;
