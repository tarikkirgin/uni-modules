import { useCallback } from "react";
import { Courses } from "../types";
import { Form, Action, ActionPanel, useNavigation } from "@raycast/api";

function CreateModuleForm(props: {
  defaultTitle?: string;
  defaultModuleCode?: string;
  defaultCourse?: Courses;
  defaultSemester?: number;
  defaultYear?: number;
  onCreate: (title: string, module_code: string, course: Courses, semester: number, year: number, url: string) => void;
}) {
  const { onCreate, defaultCourse = Courses.CS, defaultSemester = "First", defaultYear = 1 } = props;
  const { pop } = useNavigation();

  const handleSubmit = useCallback(
    (values: { title: string; module_code: string; course: Courses; semester: number; year: number; url: string }) => {
      onCreate(values.title, values.module_code, values.course, values.semester, values.year, values.url);
      pop();
    },
    [onCreate, pop]
  );

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Create module" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField id="title" title="Module Title" placeholder="Computer Architecture" />
      <Form.Dropdown id="course" defaultValue={defaultCourse} title="Course">
        <Form.Dropdown.Item value={Courses.CS} title={Courses.CS} />
        <Form.Dropdown.Item value={Courses.PSYC} title={Courses.PSYC} />
      </Form.Dropdown>
      <Form.TextField id="module_code" title="Module Code" placeholder="COMP1211" />
      <Form.Dropdown id="semester" defaultValue={defaultSemester.toString()} title="Semester">
        <Form.Dropdown.Item value="1" title="First" />
        <Form.Dropdown.Item value="2" title="Second" />
      </Form.Dropdown>
      <Form.Dropdown id="year" defaultValue={defaultYear.toString()} title="Year">
        <Form.Dropdown.Item value="1" title="First" />
        <Form.Dropdown.Item value="2" title="Second" />
        <Form.Dropdown.Item value="3" title="Third" />
      </Form.Dropdown>
      <Form.TextField id="url" title="URL" placeholder="https://minerva.leeds.ac.uk/ultra/courses/_550937_1/outline" />
    </Form>
  );
}

export default CreateModuleForm;
