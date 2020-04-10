import { RootStore } from "./rootStore";
import { observable, action, runInAction, computed } from "mobx";
import Profile from "../models/profile";
import agent from "../api/agent";
import { toast } from "react-toastify";
import Photo from "../models/photo";

export default class ProfileStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable profile: Profile | null = null;
  @observable loading = true;
  @observable uploading = false;

  @computed get isCurrentUser() {
    const { user } = this.rootStore.userStore;
    if (user && this.profile) {
      return user.userName === this.profile.userName;
    }
    return false;
  }

  @action loadProfile = async (userName: string) => {
    this.loading = true;
    try {
      const profile = await agent.Profiles.get(userName);
      runInAction(() => {
        this.profile = profile;
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action uploadPhoto = async (file: Blob) => {
    this.uploading = true;
    try {
      var photo = await agent.Profiles.uploadPhoto(file);
      runInAction(() => {
        this.profile!.photos.push(photo);
        if (photo.isMain) {
          this.rootStore.userStore.user!.imageUrl = photo.url;
          this.profile!.image = photo.url;
        }
      });
    } catch (error) {
      console.log(error);
      toast.error("Upload failed.");
    } finally {
      runInAction(() => {
        this.uploading = false;
      });
    }
  };

  @action setMainPhoto = async (photo: Photo) => {
    this.loading = true;
    try {
      await agent.Profiles.setMainPhoto(photo.id);
      runInAction(() => {
        this.rootStore.userStore.user!.imageUrl = photo.url;
        this.profile!.photos.find((a) => a.isMain)!.isMain = false;
        this.profile!.photos.find((a) => a.id === photo.id)!.isMain = true;
        this.profile!.image = photo.url;
        this.loading = false;
      });
    } catch (error) {
      toast.error("Problem setting photo as main");
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action deletePhoto = async (photo: Photo) => {
    this.loading = true;
    try {
      await agent.Profiles.deletePhoto(photo.id);
      runInAction(() => {
        this.profile!.photos = this.profile!.photos.filter(
          (a) => a.id !== photo.id
        );
        this.loading = false;
      });
    } catch (error) {
      toast.error("Problem deleting the photo");
      runInAction(() => {
        this.loading = false;
      });
    }
  };
}
