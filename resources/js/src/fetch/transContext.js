// transContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import APIConfig from "./config";

const transContext = createContext({
  transLists: {},
  comments: [], // Standardværdi som tom array
  fetchtrans: () => {},
  fetchComments: () => {},
});

export function usetrans() {
  return useContext(transContext);
}

export const transProvider = ({ children }) => {
  // Ændr 'trans' til at være et objekt med nøgler for hver transType
  const [transLists, settransLists] = useState({});
  const [fetchedtransTypes, setFetchedtransTypes] = useState([]);
  const [comments, setComments] = useState([]);

  const refreshtrans = async () => {
    setFetchedtransTypes([]); // Nulstiller, så brugere kan genindlæses
    settransLists({}); // Optionelt: Ryd den nuværende brugerliste
};
  

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchtrans = async (transType) => {
    if (!fetchedtransTypes.includes(transType)) {
      try {
        const response = await fetch(
          `${window.App.url}/transactions/transType/?transType=${transType}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();

        // Opdater 'transLists' ved at tilføje de nye brugere under den relevante 'transType'
        settransLists((prev) => ({
          ...prev,
          [transType]: data, // Tilføj de nye brugere under den korrekte 'transType'
        }));

        setFetchedtransTypes((prev) => [...prev, transType]);
      } catch (error) {
        console.error("Error fetching trans:", error);
      }
    }
  };
  const fetchComments = async () => {
    try {
      const response = await fetch(
        `${window.App.url}/comments`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setComments(data); // Opdater kommentardata
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  return (
    <transContext.Provider value={{ transLists, comments, fetchtrans, refreshtrans }}>
      {children}
    </transContext.Provider>
  );
};
