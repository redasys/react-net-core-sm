import React, { useContext, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import ProfileHeader from "./ProfileHeader";
import ProfileContent from "./ProfileContent";
import { RootStoreContext } from "../../app/stores/rootStore";
import { RouteComponentProps } from "react-router-dom";
import { observer } from "mobx-react-lite";
import LoadingComponent from "../../app/layout/LoadingComponent";

interface RouteParams {
  userName: string;
}

interface Props extends RouteComponentProps<RouteParams> {}

const ProfilePage = ({ match }: Props) => {
  const rootStore = useContext(RootStoreContext);
  const { loading, profile, loadProfile } = rootStore.profileStore;

  useEffect(() => {
    loadProfile(match.params.userName);
    console.log(profile);
    // eslint-disable-next-line 
  }, []);

  if (loading) return <LoadingComponent content="Loading profile..." />;

  return (
    <Grid>
      <Grid.Column width={16}>
        <ProfileHeader profile={profile!} />
        <ProfileContent />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ProfilePage);
