import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { VideoExtension } from "./VideoExtension";
import { FloatableImage } from "./FloatableImage";

const TiptapEditor = () => {
  const [linkOpen, setLinkOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [content, setContent] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Link.configure({ openOnClick: false }),
      FloatableImage,
      VideoExtension,
    ],
    content: "<p>Hello World!</p>",
    onUpdate: ({ editor }) => {
      console.log(editor.getJSON());
      console.log(editor.getHTML());
      
      setContent(editor.getHTML()); // You can also use getJSON() if you prefer
    },
  });

  const setLink = () => {
    if (!editor) return;
    if (urlInput === "") {
      editor.chain().focus().unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: urlInput })
        .run();
    }
    setLinkOpen(false);
    setUrlInput("");
  };

  const insertImage = () => {
    if (!editor || !urlInput) return;
    editor
      .chain()
      .focus()
      .setImage({ src: urlInput, style: "float: right; margin: 8px;" })
      .run();
    setImageOpen(false);
    setUrlInput("");
  };
  const insertVideo = () => {
    if (!editor || !urlInput) return;
    editor
      .chain()
      .focus()
      .insertContent({
        type: "youtube",
        attrs: { src: urlInput },
      })
      .run();
    setVideoOpen(false);
    setUrlInput("");
  };

  const setImageFloat = (direction) => {
    const { state, view } = editor;
    const { selection } = state;
    const node = view.state.doc.nodeAt(selection.from);

    if (node?.type.name === "image") {
      editor
        ?.chain()
        .focus()
        .updateAttributes("image", { float: direction })
        .run();
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
        <Button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          variant="outlined"
        >
          Bold
        </Button>
        <Button
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          variant="outlined"
        >
          Italic
        </Button>
        <Button
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          variant="outlined"
        >
          Underline
        </Button>
        <Button
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          variant="outlined"
        >
          Strike
        </Button>

        <Button
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 1 }).run()
          }
          variant="outlined"
        >
          H1
        </Button>
        <Button
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 2 }).run()
          }
          variant="outlined"
        >
          H2
        </Button>
        <Button
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 3 }).run()
          }
          variant="outlined"
        >
          H3
        </Button>
        <Button
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 4 }).run()
          }
          variant="outlined"
        >
          H4
        </Button>
        <Button
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 5 }).run()
          }
          variant="outlined"
        >
          H5
        </Button>
        <Button
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 6 }).run()
          }
          variant="outlined"
        >
          H6
        </Button>
      </Box>
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
        <Button variant="outlined" onClick={() => setLinkOpen(true)}>
          Add/Edit Link
        </Button>
        <Button
          variant="outlined"
          onClick={() => editor?.chain().focus().unsetLink().run()}
        >
          Remove Link
        </Button>
        <Button variant="outlined" onClick={() => setImageOpen(true)}>
          Add Image
        </Button>
        <Button variant="outlined" onClick={() => setImageFloat("left")}>
          Float Left
        </Button>
        <Button variant="outlined" onClick={() => setImageFloat("right")}>
          Float Right
        </Button>
        <Button variant="outlined" onClick={() => setImageFloat(null)}>
          Clear Float
        </Button>
        <Button variant="outlined" onClick={() => setVideoOpen(true)}>
          Add Video
        </Button>
      </Box>

      <EditorContent editor={editor} />

      {/* Link Dialog */}
      <Dialog open={linkOpen} onClose={() => setLinkOpen(false)}>
        <DialogTitle>Insert/Edit Link</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="URL"
            type="url"
            fullWidth
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLinkOpen(false)}>Cancel</Button>
          <Button onClick={setLink}>Insert</Button>
        </DialogActions>
      </Dialog>

      {/* Image Dialog */}
      <Dialog open={imageOpen} onClose={() => setImageOpen(false)}>
        <DialogTitle>Insert Image</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Image URL"
            type="url"
            fullWidth
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageOpen(false)}>Cancel</Button>
          <Button onClick={insertImage}>Insert</Button>
        </DialogActions>
      </Dialog>

      {/* Video Dialog */}
      <Dialog open={videoOpen} onClose={() => setVideoOpen(false)}>
        <DialogTitle>Insert Video</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Video URL"
            type="url"
            fullWidth
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVideoOpen(false)}>Cancel</Button>
          <Button onClick={insertVideo}>Insert</Button>
        </DialogActions>
      </Dialog>
      <Box mt={4}>
        <h3>Current HTML:</h3>
        <div dangerouslySetInnerHTML={{__html: content}}></div>
      </Box>
    </Container>
  );
};

export default TiptapEditor;
