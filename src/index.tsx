import { useCallback, useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { Action, ActionPanel, Icon, List, LocalStorage, Color } from "@raycast/api";
import { Module, Courses } from "./types";
import { CreateModuleAction, DeleteModuleAction, AppendDefaultsAction, EmptyView } from "./components";
import { useFrecencySorting } from "@raycast/utils";

type State = {
  modules: Module[];
  isLoading: boolean;
};

const DEFAULT_SEMESTER = "11";

const DEFAULT_MODULES: Module[] = [
  {
    id: nanoid(),
    course: Courses.CS,
    title: "Fundamental Mathematical Concepts",
    module_code: "COMP1421",
    semester: 1,
    year: 1,
    url: "https://minerva.leeds.ac.uk/ultra/courses/_550939_1/outline",
  },
  {
    id: nanoid(),
    course: Courses.CS,
    title: "Computer Architecture",
    module_code: "COMP1211",
    semester: 1,
    year: 1,
    url: "https://minerva.leeds.ac.uk/ultra/courses/_550937_1/outline",
  },
  {
    id: nanoid(),
    course: Courses.CS,
    title: "Procedural Programming",
    module_code: "COMP1711",
    semester: 1,
    year: 1,
    url: "https://minerva.leeds.ac.uk/ultra/courses/_550941_1/outline",
  },
  {
    id: nanoid(),
    course: Courses.CS,
    title: "Professional Computing",
    module_code: "COMP1911",
    semester: 1,
    year: 1,
    url: "https://minerva.leeds.ac.uk/ultra/courses/_550943_1/outline",
  },
  {
    id: nanoid(),
    course: Courses.PSYC,
    title: "Introduction to Psychology",
    module_code: "PSYC1601",
    semester: 1,
    year: 1,
    url: "https://minerva.leeds.ac.uk/ultra/courses/_548972_1/outline",
  },
  {
    id: nanoid(),
    course: Courses.CS,
    title: "Introduction to Web Technologies",
    module_code: "COMP1021",
    semester: 2,
    year: 1,
    url: "https://minerva.leeds.ac.uk/ultra/courses/_550935_1/outline",
  },
];

function getIcon(course: string) {
  if (course == "Computer Science") {
    return { source: Icon.Monitor, tintColor: Color.Blue };
  } else if (course == "Psychology") {
    return { source: Icon.TwoPeople, tintColor: Color.Magenta };
  } else {
    return Icon.Book;
  }
}

export default function Command() {
  const [state, setState] = useState<State>({
    modules: DEFAULT_MODULES,
    isLoading: true,
  });

  useEffect(() => {
    (async () => {
      const storedModules = await LocalStorage.getItem<string>("modules");

      if (!storedModules) {
        setState((previous) => ({ ...previous, isLoading: false }));
        return;
      }

      try {
        const modules: Module[] = JSON.parse(storedModules);
        setState((previous) => ({
          ...previous,
          modules: modules,
          isLoading: false,
        }));
      } catch (e) {
        // can't decode modules
        setState((previous) => ({ ...previous, modules: DEFAULT_MODULES, isLoading: false }));
      }
    })();
  }, []);

  useEffect(() => {
    LocalStorage.setItem("modules", JSON.stringify(state.modules));
  }, [state.modules]);

  const handleCreate = useCallback(
    (title: string, module_code: string, course: Courses, semester: number, year: number, url: string) => {
      const newModules = [...state.modules, { id: nanoid(), title, module_code, course, semester, year, url }];
      setState((previous) => ({ ...previous, modules: newModules }));
    },
    [state.modules, setState]
  );

  const handleDelete = useCallback(
    (index: number) => {
      const newModules = [...state.modules];
      newModules.splice(index, 1);
      setState((previous) => ({ ...previous, modules: newModules }));
    },
    [state.modules, setState]
  );

  const handleAppend = useCallback(() => {
    const newModules = [...state.modules, ...DEFAULT_MODULES];
    setState((previous) => ({ ...previous, modules: newModules }));
  }, [state.modules, setState]);

  const { data: modules, visitItem } = useFrecencySorting(state.modules);

  const [filteredModules, filterModules] = useState(modules);
  const [searchText, setSearchText] = useState("");
  const [dropdownValue, setDropdownValue] = useState("");

  useEffect(() => {
    filterModules(
      modules.filter(
        (module) =>
          (module.title.toLowerCase().includes(searchText.toLowerCase()) ||
            module.module_code.toLowerCase().includes(searchText.toLowerCase())) &&
          `${module.year}${module.semester}` === dropdownValue
      )
    );
  }, [searchText, dropdownValue]);

  return (
    <List
      filtering={false}
      onSearchTextChange={setSearchText}
      isLoading={state.isLoading}
      searchBarPlaceholder="Search modules..."
      searchBarAccessory={
        <List.Dropdown
          defaultValue={DEFAULT_SEMESTER}
          tooltip="Filter by time period"
          onChange={setDropdownValue}
          storeValue={true}
        >
          <List.Dropdown.Section title="Year 1">
            <List.Dropdown.Item title={"Year 1 - Semester 1"} value="11" icon={Icon.Calendar} />
            <List.Dropdown.Item title={"Year 1 - Semester 2"} value="12" icon={Icon.Calendar} />
          </List.Dropdown.Section>
          <List.Dropdown.Section title="Year 2">
            <List.Dropdown.Item title={"Year 2 - Semester 1"} value="21" icon={Icon.Calendar} />
            <List.Dropdown.Item title={"Year 2 - Semester 2"} value="22" icon={Icon.Calendar} />
          </List.Dropdown.Section>
          <List.Dropdown.Section title="Year 3">
            <List.Dropdown.Item title={"Year 3 - Semester 1"} value="31" icon={Icon.Calendar} />
            <List.Dropdown.Item title={"Year 3 - Semester 2"} value="32" icon={Icon.Calendar} />
          </List.Dropdown.Section>
        </List.Dropdown>
      }
    >
      <EmptyView modules={state.modules} onCreate={handleCreate} onRestore={handleAppend} />
      {filteredModules.map((module, index) => (
        <List.Item
          key={module.id}
          title={module.title}
          accessories={[{ text: module.module_code }]}
          icon={getIcon(module.course)}
          actions={
            <ActionPanel>
              <ActionPanel.Section>
                <Action.OpenInBrowser url={module.url} onOpen={() => visitItem(module)} />
                <Action.CopyToClipboard content={module.url} onCopy={() => visitItem(module)} />
              </ActionPanel.Section>
              <ActionPanel.Section>
                <CreateModuleAction onCreate={handleCreate} />
                <DeleteModuleAction onDelete={() => handleDelete(index)} />
                <AppendDefaultsAction onRestore={handleAppend} />
              </ActionPanel.Section>
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
