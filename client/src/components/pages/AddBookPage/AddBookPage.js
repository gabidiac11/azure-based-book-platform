import React, { useRef, useState } from "react";
import Box from "@mui/material/Box";
import Header from "../../common/Header/Header";
import {
  Alert,
  Button,
  FormControl,
  Input,
  InputLabel,
  Stack,
  Typography,
  FormHelperText,
  TextField,
} from "@mui/material";
import { SendRounded, PhotoCamera } from "@mui/icons-material";
import MobileDatePicker from "@mui/lab/MobileDatePicker";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router";
import { dateToString } from "../../../utils";
import axios from "axios";
import "./AddBookPage.css";

export const AddBookPage = () => {
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publishedDate, setPublishedDate] = useState(new Date());
  const [description, setDescription] = useState("");

  const [imgFile, setImgFile] = useState(null);
  const uploadInputRef = useRef(null);

  const navigate = useNavigate();

  const findAndSignalErrors = () => {
    const _errors = {};
    Object.entries({
      title,
      author,
      publishedDate,
      description,
      imgFile,
    }).forEach(([name, value]) => {
      if (!value) {
        _errors[name] = "Field required";
        return;
      }

      if (name === "imgFile" && !imgFile?.[0]) {
        _errors[name] = "Field required";
        return;
      }
    });
    setErrors({ ..._errors });

    return Object.entries(_errors).length > 0;
  };

  const onChangeTextField = (name, value) => {
    if (errors[name]) {
      delete errors[name];
      setErrors({ ...errors });
    }

    const [, changeCallback] = Object.entries({
      setTitle,
      setAuthor,
      setDescription,
      setImgFile,
      setPublishedDate,
    }).find(
      ([funcName]) => funcName.toLowerCase() === `set${name.toLowerCase()}`
    );

    changeCallback(value);
  };

  const generatePayload = () => {
    const formData = new FormData();
    formData.append("imgFile", imgFile[0], imgFile[0].name);
    Object.entries({
      title,
      description,
      author,
      publishedDate: dateToString(publishedDate),
    }).forEach(([name, value]) => {
      formData.append(name, value);
    });

    return formData;
  };

  const submit = async () => {
    const hasError = findAndSignalErrors();
    if (!hasError) {
      setGeneralError("");
      setIsLoading(true);
      try {
        const resp = await axios.post("books", generatePayload());
        navigate(`/book/${resp.data.bookId}`);
      } catch (err) {
        const _errors = {};
        const errorFields = err?.response?.data?.fields;
        if (errorFields && typeof errorFields === "object") {
          [
            "title",
            "description",
            "publishedDate",
            "author",
            "imgFile",
          ].forEach((name) => {
            _errors[name] = errorFields[name];
          });
        }

        setErrors(_errors);
        setGeneralError(err?.response?.data?.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="view add-book-view">
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
      >
        <Typography
          variant="h5"
          gutterBottom
          component="div"
          className="heading"
        >
          Add book
        </Typography>
        <div className="form-wrapper">
          <div>
            <FormControl
              error={!!errors.title}
              variant="standard"
              className="form-control"
            >
              <InputLabel htmlFor="component-input-title">Title</InputLabel>
              <Input
                id="component-input-title"
                label="title"
                name="title"
                value={title}
                onChange={(e) =>
                  onChangeTextField(e.target.name, e.target.value)
                }
                aria-describedby="book-title-error-text"
              />
              <FormHelperText id="book-title-error-text">
                {errors.title}
              </FormHelperText>
            </FormControl>
            <FormControl
              error={!!errors.author}
              variant="standard"
              className="form-control"
            >
              <InputLabel htmlFor="component-input-author">Author</InputLabel>
              <Input
                id="component-input-author"
                label="author"
                name="author"
                value={author}
                onChange={(e) =>
                  onChangeTextField(e.target.name, e.target.value)
                }
                aria-describedby="book-author-error-text"
              />
              <FormHelperText id="book-author-error-text">
                {errors.author}
              </FormHelperText>
            </FormControl>
          </div>
          <div>
            <FormControl
              error={!!errors.description}
              variant="standard"
              className="form-control"
            >
              <InputLabel htmlFor="component-input-description">
                Description
              </InputLabel>
              <Input
                id="component-input-description"
                label="Description"
                name="description"
                value={description}
                onChange={(e) =>
                  onChangeTextField(e.target.name, e.target.value)
                }
                aria-describedby="book-description-error-text"
              />
              <FormHelperText id="book-description-error-text">
                {errors.description}
              </FormHelperText>
            </FormControl>

            <FormControl
              error={!!errors.imgFile}
              variant="standard"
              className="form-control"
            >
              <label
                style={{ display: "flex", alignItems: "flex-end" }}
                htmlFor="component-input-imgFile-file-input"
              >
                <InputLabel htmlFor="component-input-imgFile">Photo</InputLabel>
                <Input
                  label="imgFile"
                  id="component-input-imgFile"
                  name="imgFile"
                  value={imgFile?.[0] ? imgFile[0].name : "No file.."}
                  onClick={() => uploadInputRef.current?.click()}
                  aria-describedby="book-imgFile-error-text"
                />
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                >
                  <PhotoCamera />
                </IconButton>
                <input
                  accept="image/*"
                  ref={uploadInputRef}
                  className="input-file"
                  style={{ display: "none" }}
                  onChange={(e) => onChangeTextField("imgFile", e.target.files)}
                  name="imgFile"
                  id="component-input-imgFile-file-input"
                  multiple
                  type="file"
                />
              </label>
              <FormHelperText id="book-imgFile-error-text">
                {errors.imgFile}
              </FormHelperText>
            </FormControl>
          </div>
          <div>
            <MobileDatePicker
              label="Published date"
              value={publishedDate}
              onChange={(newValue) => {
                onChangeTextField("publishedDate", newValue);
              }}
              renderInput={(params) => (
                <FormControl
                  error={!!errors.publishedDate}
                  variant="standard"
                  className="form-control"
                >
                  <InputLabel htmlFor="component-input-publishedDate">
                    Published date
                  </InputLabel>
                  <Input
                    {...params.inputProps}
                    id="component-input-publishedDate"
                    label="publishedDate"
                    name="publishedDate"
                    readOnly
                    aria-describedby="book-publishedDate-error-text"
                  />
                  <FormHelperText id="book-publishedDate-error-text">
                    {errors.publishedDate}
                  </FormHelperText>
                </FormControl>
              )}
            />
          </div>
        </div>
        <div>
          <Button
            variant="contained"
            color="primary"
            className="submit-btn"
            startIcon={<SendRounded />}
            disabled={isLoading}
            onClick={submit}
          >
            {isLoading ? "Loading..." : "Submit"}
          </Button>
        </div>

        {generalError && (
          <Stack sx={{ width: "100%", paddingTop: "20px" }} spacing={2}>
            <Alert severity="error">{generalError}</Alert>
          </Stack>
        )}
      </Box>
    </div>
  );
};
