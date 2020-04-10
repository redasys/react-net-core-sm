import React from "react";
import { Item, Button, Label, Segment, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
// import ActivityStore from "../../../app/stores/activityStore";
import { IActivity } from "../../../app/models/activity";
import { format } from "date-fns";
import ActivityListItemAttendees from "./ActivityListItemAttendees";

export const ActivityListItem: React.FC<{ activity: IActivity }> = ({
  activity,
}) => {
  return (
    <Segment.Group>
      <Segment>
        <Item.Group>
          <Item>
            <Item.Image
              size="tiny"
              circular
              src={activity.host.image || "/assets/user.png"}
              style={{marginBottom:'10px'}}
            />
            <Item.Content>
              <Item.Header as={Link} to={`/assbook/${activity.id}`}>
                {activity.title}
              </Item.Header>
              <Item.Description>
                Hosted by
                <Link to={`profile/${activity.host.userName}`} style={{color: "FFF"}}> {activity.host.displayName} </Link>
              </Item.Description>
              <Item.Description>
                {activity.isHost && (
                  <Label
                    basic
                    color="orange"
                    content="You are hosting this event"
                  />
                )}
              </Item.Description>
              <Item.Description>
                {!activity.isHost && activity.isGoing && (
                  <Label
                    basic
                    color="green"
                    content="You are attending this event"
                  />
                )}
              </Item.Description>
              <Item.Extra>
                <Label basic content={activity.category} />
              </Item.Extra>
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <Icon name="clock" />
        {format(activity.date, "h:mm a")}
        <Icon name="marker" />
        {activity.venue}, &nbsp;{activity.city}
      </Segment>
      <Segment secondary>
        <ActivityListItemAttendees attendees={activity.attendees} />
      </Segment>
      <Segment>
        <span>{activity.description}</span>
        <Button
          as={Link}
          to={`/assbook/${activity.id}`}
          floated="right"
          content="View"
          color="blue"
        />
      </Segment>
    </Segment.Group>
  );
};
