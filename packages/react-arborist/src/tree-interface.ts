import { DataManager } from "./data/data-manager";
import { IdObj, TreeProps } from "./types";

export class TreeInterface<T extends IdObj> {
  props: TreeProps<T>;
  data: DataManager<T>;

  constructor(props: TreeProps<T>) {
    this.props = props;
    this.data = new DataManager(props.data);
  }
}
