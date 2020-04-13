import React, { useContext, useState } from "react";
import { Tab, Header, Card, Image, Button, Grid } from "semantic-ui-react";
import { RootStoreContext } from "../../app/stores/rootStore";
import PhotoUpload from "../../app/common/photoUpload/photoUpload";
import { observer } from "mobx-react-lite";

const ProfilePhotos = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    profile,
    isCurrentUser,
    uploading,
    uploadPhoto,
    setMainPhoto,
    deletePhoto,
  } = rootStore.profileStore;
  const [addPhotoMode, setAddPhotoMode] = useState(false);
  const [target, setTarget] = useState<string | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<string | undefined>(
    undefined
  );

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16} style={{ paddingBottom: 0 }}>
          <Header floated="left" icon="image" content="Photos" />
          {isCurrentUser && (
            <Button
              floated="right"
              basic
              content={addPhotoMode ? "Cancel" : "Add Photo"}
              onClick={() => {
                setAddPhotoMode(!addPhotoMode);
              }}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {addPhotoMode ? (
            <PhotoUpload
              loading={uploading}
              uploadPhoto={uploadPhoto}
              setAddPhotoMode={setAddPhotoMode}
            />
          ) : (
            <Card.Group itemsPerRow={5}>
              {profile &&
                profile.photos.map((x) => (
                  <Card key={x.id}>
                    <Image src={x.url} />
                    {isCurrentUser && !x.isMain && (
                      <Button.Group fluid widths={2}>                         
                        <Button
                          onClick={(e) => {
                            setMainPhoto(x);
                            setTarget(e.currentTarget.name);
                          }}
                          name={x.id}
                          disabled={x.isMain}
                          loading={uploading && target === x.id}
                          basic
                          positive
                          content="Main"
                        />
                        <Button
                          name={x.id}
                          disabled={x.isMain}
                          onClick={(e) => {
                            deletePhoto(x);
                            setDeleteTarget(e.currentTarget.name);
                          }}
                          loading={uploading && deleteTarget === x.id}
                          basic
                          negative
                          icon="trash"
                        />
                      </Button.Group>
                    )}
                  </Card>
                ))}
            </Card.Group>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(ProfilePhotos);
