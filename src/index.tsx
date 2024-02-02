import { useCallback, useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { Action, ActionPanel, Icon, List, LocalStorage, Color } from "@raycast/api";
import { Module } from "./types";
import { EmptyView } from "./components";
import { useFrecencySorting } from "@raycast/utils";
import data from "./modules.js";

type State = {
  modules: Module[];
  isLoading: boolean;
};

const DEFAULT_SEMESTER = "11";

function getIcon(course: string) {
  if (course == "COMP") {
    return { source: Icon.Monitor, tintColor: Color.Blue };
  } else if (course == "PSYC") {
    return { source: Icon.TwoPeople, tintColor: Color.Magenta };
  } else {
    return Icon.Book;
  }
}

export default function Command() {
  const [state, setState] = useState<State>({
    modules: [],
    isLoading: true,
  });

  useEffect(() => {
    (async () => {
      const storedModulesRaw = await LocalStorage.getItem<string>("modules");

      if (storedModulesRaw) {
        const storedModules: Module[] = JSON.parse(storedModulesRaw);
        setState((previous) => ({ ...previous, modules: storedModules, isLoading: false }));
        return;
      }

      try {
        const modules: Module[] = data;
        setState((previous) => ({
          ...previous,
          modules: modules,
          isLoading: false,
        }));
      } catch (e) {
        // can't decode modules
        setState((previous) => ({ ...previous, isLoading: false }));
      }
    })();
  }, []);

  useEffect(() => {
    LocalStorage.setItem("modules", JSON.stringify(state.modules));
  }, [state.modules]);

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
      <EmptyView modules={state.modules} />
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
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
