import React, { useCallback, useLayoutEffect, useState, useRef, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import Header from "../../common/Header/Header";
import "./Dashboard.css";
import { Alert, FormControl, InputLabel, MenuItem, Select, Stack } from "@mui/material";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import PlayingIcon from "@mui/icons-material/PlayCircleFilled";
import StopIcon from "@mui/icons-material/StopCircleRounded";
import { BASE_URL } from "./../../../constants";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../auth/firebase";
import { useAppContext } from "../../../context/hooks/useAppContext";
import { useContextActions } from "../../../context/hooks/useContextActions";

export const Dashboard = () => {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [playingBookId, setPlayingBookId] = useState();
  const audio = useRef();
  const [error, setError] = useState();
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const { language: ctxLanguage } = useAppContext();
  const language = useRef(ctxLanguage);
  const { updateLanguage } = useContextActions();

  const onRowClick = useCallback(
    (params) => {
      navigate(`/book/${params.row.bookId}`);
    },
    [navigate]
  );

  useLayoutEffect(() => {
    const fetchAndUpdateRows = async () => {
      setIsLoading(true);
      try {

        const bodyFormData = new URLSearchParams();
        bodyFormData.append("language", language.current)

        const resp = await axios.get("books", {params : bodyFormData});

        setRows(resp.data);
      } catch (err) {
        setError(err?.message || "Ups! Something went wrong.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndUpdateRows();
  }, []);

  const onClickPlay = async (params) => {
    if (params.id === playingBookId && audio.current) {
      if (audio.current) {
        audio.current.pause();
        audio.current = null;
      }
      setPlayingBookId();
      return;
    }
    setPlayingBookId(params.id);

    if (audio.current) {
      audio.current.pause();
    }

    try {
      const formData = new URLSearchParams();
      formData.append("userId", user?.uid);
      formData.append("text", params.row.description);
      formData.append("language", language.current);

      const resp = await axios.post("play", formData);
      let urlEntity = new URL(`${resp.data.fileName}`);
      //avoid caching by passing a fresh parameter
      urlEntity.searchParams.append("cacheVersion", Date.now());

      audio.current = new Audio(urlEntity.toString());
      audio.current.onended = () => {
        setPlayingBookId();
      };

      audio.current.play();
    } catch (err) {
      setPlayingBookId();
      alert(err);
    }
  };

  const bookIsPlaying = (params) => params.id === playingBookId;

  const columns = [
    { field: "bookId", headerName: "ID", width: 70 },
    { field: "title", headerName: "Title", width: 360 },
    { field: "author", headerName: "Author", width: 350 },
    { field: "publishedDate", headerName: "Published date", width: 160 },
    {
      field: "button",
      headerName: "Play Audio Description",
      width: 160,
      renderCell: (params) => {
        return (
          <Button
            variant="contained"
            color="primary"
            startIcon={bookIsPlaying(params) ? <StopIcon /> : <PlayingIcon />}
            onClick={(event) => {
              event.stopPropagation();
              onClickPlay(params);
            }}
          >
            {bookIsPlaying(params) ? "Stop" : "Play"}
          </Button>
        );
      },
    },
  ];

  const handleDropdownChange = async event => {
    const fetchAndUpdateRows = async () => {
      setIsLoading(true);
      language.current = event.target.value
      updateLanguage(language.current);

      try {

        let bodyFormData = new URLSearchParams();
        bodyFormData.append("language", language.current)

        const resp = await axios.get("books", {params : bodyFormData});
        setRows(resp.data);
      } catch (err) {
        setError(err?.message || "Ups! Something went wrong.");
      } finally {
        setIsLoading(false);
      }
    };


    fetchAndUpdateRows();
  }

  useEffect(() => {
      return () => {
        //stop audio on exit
        if (audio.current) {
            audio.current.pause();
            audio.current = null;
        }
      }
  }, []);

  return (
    <>
      <Header />
      <div className="view dashboard" style={{ height: "calc(100vh - 70px)" }}>
        <div className="dashboard-link">
          Want to add a new book? <Link to="/book/add">Click here</Link> now.
        </div>

        <div>
          <FormControl style={{padding: "10px 0"}}>
            <InputLabel id="language-simple-select-label">Language</InputLabel>
            <Select
              labelId="language-simple-select-label"
              value={language.current}
              label="Language"
              onChange={handleDropdownChange}
            >
              <MenuItem value={"ro"}>Romana</MenuItem>
              <MenuItem value={"en"}>English</MenuItem>
              <MenuItem value={"de"}>Deutch</MenuItem>
              <MenuItem value={"zh"}>Chineza</MenuItem>
            </Select>
          </FormControl>
        </div>

        <DataGrid
          rows={rows}
          className="data-table"
          loading={isLoading}
          getRowId={(row) => row.bookId}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5]}
          checkboxSelection
          onRowClick={onRowClick}
        />
        {error && (
          <Stack sx={{ width: "100%", paddingTop: "20px" }} spacing={2}>
            <Alert severity="error">{error}</Alert>
          </Stack>
        )}
      </div>
    </>
  );
};