import React, { Fragment, useState, useEffect } from "react";
import { Header, Grid, Button } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import PhotoDropzone from "./photoDropzone";
import PhotoCropper from "./photoCropper";

interface Props {
  setAddPhotoMode: (val: boolean) => void;
  loading: boolean;
  uploadPhoto: (file: Blob) => any;
}

export const PhotoUpload = ({ loading, uploadPhoto, setAddPhotoMode }: Props) => {
  const [file, setFile] = useState<any[]>([]);
  // eslint-disable-next-line
  const [image, setImage] = useState<Blob | null>(null);

  useEffect(() => {
    return () => {
      file.forEach((f) => {
        URL.revokeObjectURL(f.preview);
      });
    };
  }, [file]);

  return (
    <Fragment>
      <Grid>
        <Grid.Column width={4}>
          <Header color="teal" sub content="Step 1 - Add Photo" />
          <PhotoDropzone setFile={setFile} />
        </Grid.Column>
        <Grid.Column width={1} />
        <Grid.Column width={4}>
          <Header sub color="teal" content="Step 2 - Resize image" />
          {file.length > 0 && (
            <PhotoCropper setImage={setImage} imagePreview={file[0].preview} />
          )}
        </Grid.Column>
        <Grid.Column width={1} />
        <Grid.Column width={4}>
          <Header sub color="teal" content="Step 3 - Preview & Upload" />
          {file.length > 0 && (
            <Fragment>
              <div
                className="img-preview"
                style={{ minHeight: "200px", overflow: "hidden" }}
              />
              <Button.Group widths={2}>
                <Button
                  positive
                  icon="check"
                  loading={loading}
                  onClick={async () => {
                    uploadPhoto(image!).then(()=>setAddPhotoMode(false));                    
                  }}
                />
                <Button
                  icon="close"
                  disabled={loading}
                  onClick={() => setFile([])}
                />
              </Button.Group>
            </Fragment>
          )}
        </Grid.Column>
      </Grid>
    </Fragment>
  );
};

export default observer(PhotoUpload);
