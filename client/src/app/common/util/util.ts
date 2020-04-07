import { Attendee } from "./../../models/Attendee";
import { IActivity } from "../../models/activity";
import { IUser } from "../../models/user";

export const combineDateAndTime = (date: Date, time: Date) => {
  const timeString = time.getHours() + ":" + time.getMinutes() + ":00";

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dateString = `${year}-${month}-${day}`;

  return new Date(dateString + " " + timeString);
};

export const setActivityProps = (activity: IActivity, user: IUser) => {
  activity.date = new Date(activity.date);
  activity.isGoing = activity.attendees.some(
    (x) => x.userName === user.userName
  );
  activity.isHost = activity.attendees.some(
    (x) => x.userName === user.userName && x.isHost
  );
  activity.host = activity.attendees.filter((x) => x.isHost)[0];
  return activity;
};

export const createAttendee = (user: IUser): Attendee => {
  return {
    displayName: user.displayName,
    isHost: false,
    userName: user.userName,
    image: user.imageUrl!,
  };
};
