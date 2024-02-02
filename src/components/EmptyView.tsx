import { List } from "@raycast/api";
import { Module } from "../types";

function EmptyView(props: { modules: Module[] }) {
  if (props.modules.length > 0) {
    return <List.EmptyView icon="😕" title="No matching modules found" />;
  }
  return <List.EmptyView icon="🤖" title="No modules" />;
}

export default EmptyView;
