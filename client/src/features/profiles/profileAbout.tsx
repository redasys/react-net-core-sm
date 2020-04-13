import React, { useContext, useState } from "react";
import { RootStoreContext } from "../../app/stores/rootStore";
import { Grid, Tab, Header, Button, Segment } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import UpdateForm from "./updateForm";

const ProfileAbout = () => {
  const rootStore = useContext(RootStoreContext);
  const { profile, isCurrentUser, uploading, updateProfile } = rootStore.profileStore;

  const [editMode, setEditMode] = useState(false);

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16} style={{ paddingBottom: 0 }}>
          <Header floated="left" icon="image" content="About" />
          {isCurrentUser && (
            <Button
              floated="right"
              basic
              content={editMode ? "Cancel" : "Edit Profile"}
              onClick={() => {
                setEditMode(!editMode);
              }}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {profile && editMode ? (
            <UpdateForm profile={profile!} submitting={uploading} setEditMode={setEditMode} update={updateProfile} />
          ) : (
            <Segment>
              <Header>{profile!.displayName}</Header>
              <div>{profile!.bio}</div>
            </Segment>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(ProfileAbout);
