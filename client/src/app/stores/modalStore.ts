import { RootStore } from "./rootStore";
import { observable, action } from "mobx";

export default class ModalStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable.shallow modal = {
    open: false,
    body: null
  };

  @action show = (content: any) => {
    this.modal.open = true;
    this.modal.body = content;
  };

  @action close = () => {
    this.modal.open = false;
    this.modal.body = null;
  };
}
