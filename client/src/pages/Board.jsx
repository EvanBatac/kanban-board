import { useParams } from "react-router-dom";
import api from "../api/client";
import { useEffect, useState } from "react";

export default function Board() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    async function getBoardById() {
      setError("");
      try {
        const res = await api.get(`/boards/${id}`);
        console.log(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    }
    getBoardById();
  }, [id]);
  return <h1>{id}</h1>;
}
