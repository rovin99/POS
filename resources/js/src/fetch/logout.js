når man trykker på button   med username, så skal den logge ud mde fetch :const handleLogout = async () => {
    try {
      const response = await fetch(`${APIConfig.baseDomain}/apishh/logud.php`, {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        Cookies.remove("isLoggedIn");
        Cookies.remove("username");
        setIsLoggedIn(false);
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Logud fejlede", error);
    }
  }; også ferjen fra cookie osv