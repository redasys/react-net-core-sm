import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Icon, Header } from "semantic-ui-react";

interface Props {
  setFile: (files: object[]) => void;
}

const styles = {
  border: "dashed 3px",
  borderColor: "#EEE",
  borderRadius: "5px",
  paddingTop: "30px",
  textAlign: "center" as 'center',
  height: "200px",
};

const dzActive = {
  borderColor: "green",
};

const PhotoDropzone = ({ setFile }: Props) => {
  const onDrop = useCallback((acceptedFiles) => {
      console.log('onDrop', acceptedFiles);
      setFile(
        acceptedFiles.map((x: object) =>
          Object.assign(x, {
            preview: URL.createObjectURL(x),
          })
        )
      );
    },
    [setFile]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      style={isDragActive ? { ...styles, ...dzActive } : { ...styles }}
    >
      <input {...getInputProps()} />
      <Icon size='huge' name='upload' />
      <Header content='Drop image here'/>
    </div>
  );
};

export default PhotoDropzone;
