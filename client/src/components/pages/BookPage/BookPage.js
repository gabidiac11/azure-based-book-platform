import React, { useLayoutEffect, useState } from "react";
import axios from "axios";
import Header from "../../common/Header/Header";
import "./BookPage.css";
import { Alert, LinearProgress, Stack, Typography } from "@mui/material";
import { useParams } from "react-router";
import { CalendarMonth } from "@mui/icons-material";
import { Box } from "@mui/system";
import { useAppContext } from "../../../context/hooks/useAppContext";
import Moment from "react-moment"

export const BookPage = () => {
  const [book, setBook] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const { id } = useParams();
  const { language } = useAppContext();

  useLayoutEffect(() => {
    const fetchAndUpdateBook = async () => {
      setIsLoading(true);
      try {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append("language", language);

        const resp = await axios.get(`books/${id}`, { params: bodyFormData });
        setBook(resp.data);
      } catch (err) {
        setError(err?.message || "Ups! Something went wrong.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndUpdateBook();
  }, []);

  return (
    <>
      <Header />
      <div className="view">
        {!isLoading && book && (
          <div className="book-wrapper">
            <Box sx={{ width: "100%", maxWidth: 500 }}>
              <Typography variant="h3" gutterBottom component="div">
                {book.title}
              </Typography>
              <Typography variant="h4" gutterBottom component="div">
                {book.author}
              </Typography>
              <Typography
                variant="h6"
                gutterBottom
                component="div"
                style={{ display: "flex" }}
              >
                <span className="icon-wrapper">
                  <CalendarMonth />{" "}
                </span>{" "}
                <span>
                  <Moment format="MMM Do YYYY" date={new Date(book.publishedDate)} />
                </span>
              </Typography>
              <Typography variant="body1" gutterBottom>
                {book.description}
              </Typography>
            </Box>
            <div className="img-wrapper">
              <img alt="img-book" src={book.imgUrl} />
            </div>
          </div>
        )}
        {isLoading && (
          <Stack sx={{ width: "100%", color: "grey.500" }} spacing={2}>
            <LinearProgress color="secondary" />
            <LinearProgress color="success" />
            <LinearProgress color="inherit" />
          </Stack>
        )}
        {error && (
          <Stack sx={{ width: "100%", paddingTop: "20px" }} spacing={2}>
            <Alert severity="error">{error}</Alert>
          </Stack>
        )}
      </div>
    </>
  );
};
