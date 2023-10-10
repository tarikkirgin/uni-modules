import { Action, Icon } from "@raycast/api";

function AppendDefaultsAction(props: { onRestore: () => void }) {
  return (
    <Action
      icon={Icon.Undo}
      title="Append default modules"
      shortcut={{ modifiers: ["ctrl"], key: "r" }}
      onAction={props.onRestore}
    />
  );
}

export default AppendDefaultsAction;
