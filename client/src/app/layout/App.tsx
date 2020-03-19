import React, { useState, useEffect, Fragment } from "react";
import { Container } from "semantic-ui-react";
import "./styles.css";
import axios from "axios";
import { IActivity } from "../models/activity";
import { NavBar } from "../../features/nav/nav-bar.component";
import { ActivityDashboard } from "../../features/activities/dashboard/activity-dashboard.component";

const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);
  const [editMode, setEditMode] = useState(false);

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.find(x => x.id === id) || null);
    setEditMode(false);
  }

  const handleOpenCreateForm = () => {
    setSelectedActivity(null);
    setEditMode(true);
  }

  const handleCreateActivity = (activity: IActivity) => {
    setActivities([...activities, activity]);
    setEditMode(false);
    setSelectedActivity(activity);
  }

  const handleEditActivity = (activity: IActivity) => {
    setActivities([...activities.filter(a => a.id !== activity.id), activity]);
    setEditMode(false);
    setSelectedActivity(activity);
  }

  const handleDeleteActivity = (id: string)=>{
    setActivities(activities.filter(x=>x.id!==id));
  }

  useEffect(() => {
    axios
      .get<IActivity[]>("http://localhost:5000/api/activities")
      .then(response => {
        let activities: IActivity[] = [];
        response.data.forEach(x => {
          x.date = x.date.split('.')[0];
          activities.push(x);
        })
        setActivities(activities);
      });
  }, []);

  return (
    <Fragment>
      <NavBar openCreateForm={handleOpenCreateForm} />
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard activities={activities}
          selectActivity={handleSelectActivity}
          selectedActivity={selectedActivity!}
          editMode={editMode}
          setEditMode={setEditMode}
          setSelectedActivity={setSelectedActivity}
          createActivity={handleCreateActivity}
          editActivity={handleEditActivity}
          deleteActivity={handleDeleteActivity}
        />
      </Container>
    </Fragment>
  );
};

export default App;
