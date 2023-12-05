/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";
import styled from "@emotion/styled";
import { useParams } from "react-router-dom";

const Component = styled.div`
  background: #f5f5f5;
`;

const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ["clean"], // remove formatting button
];
const Editor = () => {
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const quillServer = new Quill("#container", {
      theme: "snow",
      modules: {
        toolbar: toolbarOptions,
      },
    });
    quillServer.disable();
    quillServer.setText("Loading the document...");
    setQuill(quillServer);
  }, []);

  useEffect(() => {
    const socketServer = io("http://localhost:9000");
    setSocket(socketServer);
    return () => {
      socketServer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket === null || quill === null) return;
    const handleChange = (delta, oldData, source) => {
      if (source !== "user") return;

      socket && socket.emit("send-changes", delta);
    };
    quill && quill.on("text-change", handleChange);
    return () => {
      quill && quill.off("text-change", handleChange);
    };
  }, [quill, socket]);

  useEffect(() => {
    if (socket === null || quill === null) return;
    const handleChange = (delta) => {
      quill.updateContents(delta);
    };
    socket && socket.on("receive-changes", handleChange);
    return () => {
      socket && socket.off("receive-changes", handleChange);
    };
  }, [quill, socket]);

  useEffect(() => {
    if (socket === null || quill === null) return;

    socket &&
      socket.once("load-document", (document) => {
        quill && quill.setContents(document);
        quill && quill.enable();
      });

    socket && socket.emit("get-document", id);
  }, [quill, socket, id]);

  useEffect(() => {
    if (socket === null || quill === null) return;

    const interval = setInterval(() => {
      socket && socket.emit("save-document", quill.getContents());
      setShowSavedMessage(true);
      setTimeout(() => {
        setShowSavedMessage(false);
      }, 1500);
    }, 1500);

    return () => {
      clearInterval(interval);
    };
  }, [socket, quill]);

  return (
    <Component>
      {showSavedMessage && <Box className="save">Saved!</Box>}
      <Box id="container" className="container"></Box>
    </Component>
  );
};

export default Editor;
