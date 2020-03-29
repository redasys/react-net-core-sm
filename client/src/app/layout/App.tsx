import React, { Fragment, useContext, useEffect } from "react";
import { Container } from "semantic-ui-react";
import NavBar from "../../features/nav/NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { observer } from "mobx-react-lite";
import {
  Route,
  withRouter,
  RouteComponentProps,
  Switch
} from "react-router-dom";
import { HomePage } from "../../features/home/homePage";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import NotFound from "./NotFound";
import {ToastContainer} from 'react-toastify';
import LoginForm from "../../features/User/LoginForm";
import { RootStoreContext } from "../stores/rootStore";
import LoadingComponent from "./LoadingComponent";
import ModalContainer from "../common/modal/modalContainer";

const App: React.FC<RouteComponentProps> = ({ location }) => {
  const rootStore = useContext(RootStoreContext);
  const {setAppLoaded, token, appLoaded} = rootStore.commonStore;
  const {getUser} = rootStore.userStore;

  useEffect(()=>{
    if(token){
      getUser().finally(()=>setAppLoaded());
    }else{
      setAppLoaded()
    }
  }, [getUser, setAppLoaded, token]);

  if(!appLoaded) return <LoadingComponent content='Loading app...' />

  return (
    <Fragment>
      <ModalContainer/>
      <ToastContainer position='bottom-right' />
      <Route exact path="/" component={HomePage} />
      <Route
        path="/(.+)"
        render={() => (
          <Fragment>
            <NavBar />
            <Container style={{ marginTop: "7em" }}>
              <Switch>
                <Route exact path="/assbook" component={ActivityDashboard} />
                <Route
                  key={location.key}
                  path={["/create", "/edit/:id"]}
                  component={ActivityForm}
                />
                <Route path="/assbook/:id" component={ActivityDetails} />
                <Route path="/login" component={LoginForm} />
                <Route component={NotFound} />
              </Switch>
            </Container>
          </Fragment>
        )}
      />
    </Fragment>
  );
};

export default withRouter(observer(App));
