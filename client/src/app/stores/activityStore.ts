import { setActivityProps, createAttendee } from "./../common/util/util";
import { IActivity } from "./../models/activity";
import { observable, action, computed, runInAction } from "mobx";
import { SyntheticEvent } from "react";
import agent from "../api/agent";
import { history } from "../..";
import { toast } from "react-toastify";
import { RootStore } from "./rootStore";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";

export default class ActivityStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable activityRegistry = new Map();

  @observable activity: IActivity | null = null;
  @observable loadingInitial = false;

  @observable target = "";

  @observable.ref hubConnection: HubConnection | null = null;

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
        activities.forEach((activity) => {
          setActivityProps(activity, this.rootStore.userStore.user!);
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
      return activity;
    }
    this.loadingInitial = true;
    try {
      activity = await agent.Activities.details(id);
      runInAction("getting activity", () => {
        this.activity = setActivityProps(
          activity,
          this.rootStore.userStore.user!
        );
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
      const attendee = createAttendee(this.rootStore.userStore.user!);
      attendee.isHost = true;
      let attendees = [];
      attendees.push(attendee);
      activity.attendees = attendees;
      activity.comments = [];
      activity.isHost = true;
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

  @action attendActivity = async () => {
    this.rootStore.submitting = true;
    const attendee = createAttendee(this.rootStore.userStore.user!);
    try {
      await agent.Activities.attend(this.activity!.id);
      runInAction("attending", () => {
        this.activity!.attendees.push(attendee);
        this.activity!.isGoing = true;
        this.activityRegistry.set(this.activity!.id, this.activity);
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction("turn off spinner", () => {
        this.rootStore.submitting = false;
      });
    }
  };

  @action unAttendActivity = async () => {
    this.rootStore.submitting = true;
    try {
      await agent.Activities.unAttend(this.activity!.id);
      runInAction("unAttending", () => {
        this.activity!.attendees = this.activity!.attendees.filter(
          (x) => x.userName !== this.rootStore.userStore.user!.userName
        );
        this.activity!.isGoing = false;
        this.activityRegistry.set(this.activity!.id, this.activity);
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction("turn off spinner", () => {
        this.rootStore.submitting = false;
      });
    }
  };

  @action createHubConnection = (id:string) => {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl("http://localhost:5000/chat", {
        accessTokenFactory: () => this.rootStore.commonStore.token!,
      })
      .configureLogging(LogLevel.Information)
      .build();

    this.hubConnection
      .start()
      .then(() => console.log(this.hubConnection!.state))
      .then(()=>{
        console.log('Attenpting to join group');
        this.hubConnection!.invoke("AddToGroup", id);
      })
      .catch((error) => console.log("error connecting hub", error));

    this.hubConnection.on("ReceiveComment", (comment) => {
      console.log("receive comment", comment);
      runInAction(() => this.activity!.comments.push(comment));
    });
    
    this.hubConnection.on('Send', (message)=>{
      toast.info(message);
    })
  };

  @action closeHubConnection = () => {
    this.hubConnection!.invoke('RemoveFromGroup', this.activity!.id).then(()=>{this.hubConnection!.stop()});
  };

  @action addComment = async (values: any) => {
    values.activityId = this.activity!.id;
    try {
      await this.hubConnection!.invoke("SendComment", values);
    } catch (error) {
      console.log(error);
    }
  };
}
