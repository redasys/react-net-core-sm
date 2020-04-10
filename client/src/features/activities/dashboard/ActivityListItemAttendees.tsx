import React from "react";
import { List, Image, Popup } from "semantic-ui-react";
import { Attendee } from "../../../app/models/Attendee";

interface Props {
  attendees: Attendee[];
}

const ActivityListItemAttendees: React.FC<Props> = ({ attendees }) => {
  return (
    <List horizontal>
      {attendees.map((attendee) => (
        <List.Item key={attendee.userName}>
          <Popup
            header={attendee.displayName}
            trigger={<Image size="mini" circular src={attendee.image || "/assets/user.png"} />}
          />
        </List.Item>
      ))}
    </List>
  );
};

export default ActivityListItemAttendees;
