import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import axiosFixed from 'axios-https-proxy-fix'

export default function App() {
  const [value, setValue] = useState("<p>Peace?</p>");
  const [text, setText] = useState("");

  function onEditorChange(value, editor) {
    setValue(value);
    setText(editor.getContent({format: "text"}))
    axiosFixed.get('/nlp-web-demo/process?text="' + editor.getContent({format: "text"}) + '"', {
      proxy: {
        host: "http://172.104.34.197", 
        port: 80,
      }
    })
      .then(function(response) {
        console.log(response)
      })
      .catch(function(error) {
        console.log(error)
      })
  }

  return (
    <>
      <Editor
        onInit={(evt, editor) => setText(editor.getContent({format: "text"}))}
        onEditorChange={onEditorChange}
        initialValue="<p>Hello Editor</p>"
        init={{
          height: 500,
          menubar: false,
          plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table paste code help wordcount"
          ],
          toolbar: "undo redo | formatselect | " +
          "bold italic backcolor | alignleft aligncenter " +
          "alignright alignjustify | bullist numlist outdent indent | " +
          "removeformat | help",
          content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }"
        }}
      />
      {text}
    </>
  )
}