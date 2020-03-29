import { UserFormValues } from "../models/user";
import { observable, action, computed, configure, runInAction } from "mobx";
import agent from "../api/agent";
import { history } from "../..";
import { IUser } from "../models/user";
import { RootStore } from "./rootStore";

configure({ enforceActions: "always" });

export default class UserStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;  
  }

  @observable user: IUser | null = null;

  @computed get isLoggedIn() {
    return !!this.user;
  }

  @action register = async (values: UserFormValues) => {
    try{
      const user = await agent.User.register(values);
      this.rootStore.commonStore.setToken(user.token);
      this.rootStore.modalStore.close();
      runInAction(() => (this.user = user));
      history.push('/assbook');    
    }catch(error){
      console.log(error);
      runInAction(() => (this.user = null));
      throw error;
    }
  }

  @action login = async (values: UserFormValues) => {
    try {
      const user = await agent.User.login(values);
      runInAction(() => (this.user = user));
      this.rootStore.commonStore.setToken(user.token);
      this.rootStore.modalStore.close();
      history.push("/assbook");
    } catch (ex) {
      console.log('login:', ex);
      throw ex;
    }
  };

  @action logout = () => {
    this.user = null;
    this.rootStore.commonStore.setToken(null);
    history.push("/");
  };

  @action getUser = async () => {
    try {
      const user = await agent.User.current();
      runInAction(() => {
        this.user = user;
      });
    } catch (error) {
      console.log(error);
    }
  };
}
