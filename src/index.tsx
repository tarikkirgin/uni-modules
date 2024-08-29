import { useEffect, useState } from "react";
import { Action, ActionPanel, Icon, List } from "@raycast/api";
import { Module } from "./types";
import { EmptyView } from "./components";
import { useFrecencySorting } from "@raycast/utils";
import { getModuleFolderPath, createModuleFolder, getIcon } from "./util";
import data from "../modules.json";

type State = {
  modules: Module[];
  isLoading: boolean;
};

const DEFAULT_SEMESTER = "11";

export default function Command() {
  const [state, setState] = useState<State>({
    modules: [],
    isLoading: true,
  });

  useEffect(() => {
    try {
      setState((previous) => ({ ...previous, modules: data, isLoading: false }));
    } catch (error) {
      console.error("Failed to load modules", error);
    }
  }, []);

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
      {filteredModules.map((module) => (
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
                <Action.CopyToClipboard
                  title="Copy Name to Clipboard"
                  content={`${module.module_code} - ${module.title}`}
                  shortcut={{ modifiers: ["cmd"], key: "n" }}
                  icon={Icon.Text}
                />
                <Action.CopyToClipboard
                  title="Copy Module Code to Clipboard"
                  content={module.module_code}
                  shortcut={{ modifiers: ["cmd"], key: "c" }}
                  icon={Icon.Number42}
                />
                <Action.Open
                  title="Open in Finder"
                  target={getModuleFolderPath(module)}
                  shortcut={{ modifiers: ["cmd"], key: "o" }}
                />
                <Action
                  title="Create Module Folder"
                  icon={Icon.Folder}
                  onAction={() => createModuleFolder(module)}
                  shortcut={{ modifiers: ["cmd", "shift"], key: "o" }}
                />
              </ActionPanel.Section>
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
