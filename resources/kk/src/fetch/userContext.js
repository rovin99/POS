// UserContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import APIConfig from "../components/config";

const UserContext = createContext({
  userLists: {},
  comments: [], // Standardværdi som tom array
  fetchUsers: () => {},
  fetchComments: () => {},
});

export function useUsers() {
  return useContext(UserContext);
}

export const UserProvider = ({ children }) => {
  // Ændr 'users' til at være et objekt med nøgler for hver userType
  const [userLists, setUserLists] = useState({});
  const [fetchedUserTypes, setFetchedUserTypes] = useState([]);
  const [comments, setComments] = useState([]);

  const refreshUsers = async () => {
    setFetchedUserTypes([]); // Nulstiller, så brugere kan genindlæses
    setUserLists({}); // Optionelt: Ryd den nuværende brugerliste
};
  
  useEffect(() => {
    fetchComments();
  }, []);

  const fetchUsers = async (userType) => {
    if (!fetchedUserTypes.includes(userType)) {
      try {
        const response = await fetch(
          `${window.App.url}/fetch-client-users?userType=${userType}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();

        // Opdater 'userLists' ved at tilføje de nye brugere under den relevante 'userType'
        setUserLists((prev) => ({
          ...prev,
          [userType]: data, // Tilføj de nye brugere under den korrekte 'userType'
        }));

        setFetchedUserTypes((prev) => [...prev, userType]);
      } catch (error) {
        console.error("Error fetching users:", error);
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
    <UserContext.Provider value={{ userLists, comments, fetchUsers, refreshUsers }}>
      {children}
    </UserContext.Provider>
  );
};
