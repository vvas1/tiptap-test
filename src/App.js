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
  TextField,
} from "@mui/material";
import { useState, useCallback, useMemo } from "react";
import { VideoExtension } from "./VideoExtension";
import { FloatableImage } from "./FloatableImage";

// Custom hook for managing modal states
const useModalManager = () => {
  const [modals, setModals] = useState({
    link: false,
    image: false,
    video: false,
  });
  const [urlInput, setUrlInput] = useState("");

  const openModal = useCallback((type) => {
    setModals(prev => ({ ...prev, [type]: true }));
  }, []);

  const closeModal = useCallback((type) => {
    setModals(prev => ({ ...prev, [type]: false }));
    setUrlInput("");
  }, []);

  return {
    modals,
    urlInput,
    setUrlInput,
    openModal,
    closeModal,
  };
};

// Custom hook for editor configuration
const useEditorConfig = (onContentUpdate) => {
  return useEditor({
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
      onContentUpdate(editor.getHTML());
    },
  });
};

// Toolbar Button Component
const ToolbarButton = ({ onClick, children, variant = "outlined", ...props }) => (
  <Button onClick={onClick} variant={variant} {...props}>
    {children}
  </Button>
);

// Format Toolbar Component
const FormatToolbar = ({ editor }) => {
  const formatButtons = useMemo(() => [
    { action: () => editor?.chain().focus().toggleBold().run(), label: "Bold" },
    { action: () => editor?.chain().focus().toggleItalic().run(), label: "Italic" },
    { action: () => editor?.chain().focus().toggleUnderline().run(), label: "Underline" },
    { action: () => editor?.chain().focus().toggleStrike().run(), label: "Strike" },
  ], [editor]);

  const headingButtons = useMemo(() => 
    Array.from({ length: 6 }, (_, i) => ({
      action: () => editor?.chain().focus().toggleHeading({ level: i + 1 }).run(),
      label: `H${i + 1}`,
    })),
    [editor]
  );

  return (
    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
      {formatButtons.map(({ action, label }) => (
        <ToolbarButton key={label} onClick={action}>
          {label}
        </ToolbarButton>
      ))}
      {headingButtons.map(({ action, label }) => (
        <ToolbarButton key={label} onClick={action}>
          {label}
        </ToolbarButton>
      ))}
    </Box>
  );
};

// Media Toolbar Component
const MediaToolbar = ({ editor, onOpenModal, onImageFloat }) => {
  const mediaButtons = useMemo(() => [
    { action: () => onOpenModal("link"), label: "Add/Edit Link" },
    { action: () => editor?.chain().focus().unsetLink().run(), label: "Remove Link" },
    { action: () => onOpenModal("image"), label: "Add Image" },
    { action: () => onImageFloat("left"), label: "Float Left" },
    { action: () => onImageFloat("right"), label: "Float Right" },
    { action: () => onImageFloat(null), label: "Clear Float" },
    { action: () => onOpenModal("video"), label: "Add Video" },
  ], [editor, onOpenModal, onImageFloat]);

  return (
    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
      {mediaButtons.map(({ action, label }) => (
        <ToolbarButton key={label} onClick={action}>
          {label}
        </ToolbarButton>
      ))}
    </Box>
  );
};

// URL Dialog Component
const UrlDialog = ({ open, onClose, onSubmit, title, label, value, onChange }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <TextField
        autoFocus
        margin="dense"
        label={label}
        type="url"
        fullWidth
        value={value}
        onChange={onChange}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={onSubmit}>Insert</Button>
    </DialogActions>
  </Dialog>
);

// Content Preview Component
const ContentPreview = ({ content }) => (
  <Box mt={4}>
    <h3>Current HTML:</h3>
    <div dangerouslySetInnerHTML={{ __html: content }} />
  </Box>
);

const TiptapEditor = () => {
  const [content, setContent] = useState("");
  const { modals, urlInput, setUrlInput, openModal, closeModal } = useModalManager();
  
  const editor = useEditorConfig(setContent);

  const handleSetLink = useCallback(() => {
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
    closeModal("link");
  }, [editor, urlInput, closeModal]);

  const handleInsertImage = useCallback(() => {
    if (!editor || !urlInput) return;
    
    editor
      .chain()
      .focus()
      .setImage({ src: urlInput, style: "float: right; margin: 8px;" })
      .run();
    closeModal("image");
  }, [editor, urlInput, closeModal]);

  const handleInsertVideo = useCallback(() => {
    if (!editor || !urlInput) return;
    
    editor
      .chain()
      .focus()
      .insertContent({
        type: "youtube",
        attrs: { src: urlInput },
      })
      .run();
    closeModal("video");
  }, [editor, urlInput, closeModal]);

  const handleImageFloat = useCallback((direction) => {
    if (!editor) return;
    
    const { state, view } = editor;
    const { selection } = state;
    const node = view.state.doc.nodeAt(selection.from);

    if (node?.type.name === "image") {
      editor
        .chain()
        .focus()
        .updateAttributes("image", { float: direction })
        .run();
    }
  }, [editor]);

  const handleUrlInputChange = useCallback((e) => {
    setUrlInput(e.target.value);
  }, [setUrlInput]);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <FormatToolbar editor={editor} />
      <MediaToolbar 
        editor={editor} 
        onOpenModal={openModal} 
        onImageFloat={handleImageFloat} 
      />

      <EditorContent editor={editor} />

      <UrlDialog
        open={modals.link}
        onClose={() => closeModal("link")}
        onSubmit={handleSetLink}
        title="Insert/Edit Link"
        label="URL"
        value={urlInput}
        onChange={handleUrlInputChange}
      />

      <UrlDialog
        open={modals.image}
        onClose={() => closeModal("image")}
        onSubmit={handleInsertImage}
        title="Insert Image"
        label="Image URL"
        value={urlInput}
        onChange={handleUrlInputChange}
      />

      <UrlDialog
        open={modals.video}
        onClose={() => closeModal("video")}
        onSubmit={handleInsertVideo}
        title="Insert Video"
        label="Video URL"
        value={urlInput}
        onChange={handleUrlInputChange}
      />

      <ContentPreview content={content} />
    </Container>
  );
};

export default TiptapEditor;
