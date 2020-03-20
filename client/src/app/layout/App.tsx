import React, { useState, useEffect, Fragment, SyntheticEvent } from "react";
import { Container } from "semantic-ui-react";
import "./styles.css";
import { IActivity } from "../models/activity";
import { NavBar } from "../../features/nav/nav-bar.component";
import { ActivityDashboard } from "../../features/activities/dashboard/activity-dashboard.component";
import agent from "../api/agent";
import { SpinnerComponent } from "./spinner.component";

const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(
    null
  );
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState('');

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.find(x => x.id === id) || null);
    setEditMode(false);
  };

  const handleOpenCreateForm = () => {
    setSelectedActivity(null);
    setEditMode(true);
  };

  const handleCreateActivity = (activity: IActivity) => {
    setSubmitting(activity.id);
    agent.Activities.create(activity)
      .then(() => {
        setActivities([...activities, activity]);
        setEditMode(false);
        setSelectedActivity(activity);
      })
      .then(() => setSubmitting(''));
  };

  const handleEditActivity = (activity: IActivity) => {
    setSubmitting(activity.id);
    agent.Activities.edit(activity)
      .then(() => {
        setActivities([
          ...activities.filter(a => a.id !== activity.id),
          activity
        ]);
        setEditMode(false);
        setSelectedActivity(activity);
      })
      .then(() => setSubmitting(''));
  };

  const handleDeleteActivity = (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
    setSubmitting(id);
    agent.Activities.delete(id)
      .then(() => {
        setActivities(activities.filter(x => x.id !== id));
      })
      .then(() => setSubmitting(''));
  };

  useEffect(() => {
    agent.Activities.list()
      .then(response => {
        let activities: IActivity[] = [];
        response.forEach(x => {
          x.date = x.date.split(".")[0];
          activities.push(x);
        });
        setActivities(activities);
      })
      .then(() => setLoading(false));
  }, []);

  if (loading)
    return <SpinnerComponent inverted={true} content="Loading activities..." />;

  return (
    <Fragment>
      <NavBar openCreateForm={handleOpenCreateForm} />
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard
          activities={activities}
          selectActivity={handleSelectActivity}
          selectedActivity={selectedActivity!}
          editMode={editMode}
          setEditMode={setEditMode}
          setSelectedActivity={setSelectedActivity}
          createActivity={handleCreateActivity}
          editActivity={handleEditActivity}
          deleteActivity={handleDeleteActivity}
          submitting={submitting}
        />
      </Container>
    </Fragment>
  );
};

export default App;
