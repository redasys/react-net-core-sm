import { IActivity } from "./../models/activity";
import { observable, action, computed, runInAction } from "mobx";
import { SyntheticEvent } from "react";
import agent from "../api/agent";
import { history } from "../..";
import { toast } from "react-toastify";
import { RootStore } from "./rootStore";

export default class ActivityStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable activityRegistry = new Map();

  @observable activity: IActivity | null = null;
  @observable loadingInitial = false;
  
  @observable target = "";

  @computed get activitiesByDate() {
    return this.groupActivitiesByDate(
      Array.from(this.activityRegistry.values())
    );
  }

  groupActivitiesByDate(activities: IActivity[]) {
    const sortedActivities = activities.sort(
      (a, b) => a.date!.getTime() - b.date!.getTime()
    );

    return Object.entries(
      sortedActivities.reduce((activities, activity) => {
        const date = activity.date.toISOString().split("T")[0];
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity];
        return activities;
      }, {} as { [key: string]: IActivity[] })
    );
  }

  @action loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activities = await agent.Activities.list();
      runInAction("loading activities", () => {
        activities.forEach(activity => {
          activity.date = new Date(activity.date);
          this.activityRegistry.set(activity.id, activity);
        });
      });
    } catch (error) {
      runInAction("load activities error", () => {
        this.loadingInitial = false;
      });
    } finally {
      runInAction("clean up", () => (this.loadingInitial = false));
    }
  };

  @action loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) {
      this.activity = activity;
      return activity;
    }
    this.loadingInitial = true;
    try {
      activity = await agent.Activities.details(id);
      runInAction("getting activity", () => {
        activity.date = new Date(activity.date);
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;
      });
      return activity;
    } catch (error) {
      console.log(error);
      runInAction("get activity error", () => (this.loadingInitial = false));
    } finally {
      runInAction("clean up", () => (this.loadingInitial = false));
    }
  };

  @action reset = () => {
    this.activity = null;
  };

  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  @action createActivity = async (activity: IActivity) => {
    this.rootStore.submitting = true;
    try {
      await agent.Activities.create(activity);
      runInAction("create activity", () => {
        this.activityRegistry.set(activity.id, activity);
        this.rootStore.submitting = false;
      });
      history.push(`/assbook/${activity.id}`);
    } catch (error) {
      runInAction("create activity error", () => {
        this.rootStore.submitting = false;
      });
      toast.error("There was a problem submitting your entries");
      console.log(error.response);
    }
  };

  @action editActivity = async (activity: IActivity) => {
    this.rootStore.submitting = true;
    try {
      await agent.Activities.update(activity);
      runInAction("editing activity", () => {
        this.activityRegistry.set(activity.id, activity);
        activity.date = new Date(activity.date);
        this.activity = activity;
        this.rootStore.submitting = false;
      });
      history.push(`/assbook/${activity.id}`);
    } catch (error) {
      runInAction("edit activity error", () => {
        this.rootStore.submitting = false;
      });
      toast.error("There was a problem submitting your entries");
      console.log(error.response);
    }
  };

  @action deleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.rootStore.submitting = true;
    this.target = event.currentTarget.name;
    try {
      await agent.Activities.delete(id);
      runInAction("deleting activity", () => {
        this.activityRegistry.delete(id);
        this.rootStore.submitting = false;
        this.target = "";
      });
    } catch (error) {
      runInAction("delete activity error", () => {
        this.rootStore.submitting = false;
        this.target = "";
      });
      console.log(error);
    }
  };
}
