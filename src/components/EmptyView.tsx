import { ActionPanel, List } from "@raycast/api";
import { Module, Courses } from "../types";
import CreateModuleAction from "./CreateModuleAction";
import AppendModuleAction from "./AppendDefaultsAction";

function EmptyView(props: {
  modules: Module[];
  onCreate: (title: string, module_code: string, course: Courses, semester: number, year: number, url: string) => void;
  onRestore: () => void;
}) {
  if (props.modules.length > 0) {
    return (
      <List.EmptyView
        icon="😕"
        title="No matching modules found"
        actions={
          <ActionPanel>
            <CreateModuleAction onCreate={props.onCreate} />
          </ActionPanel>
        }
      />
    );
  }
  return (
    <List.EmptyView
      icon="🤖"
      title="No modules"
      description="Either add a new module or append the defaults."
      actions={
        <ActionPanel>
          <CreateModuleAction onCreate={props.onCreate} />
          <AppendModuleAction onRestore={props.onRestore} />
        </ActionPanel>
      }
    />
  );
}

export default EmptyView;
