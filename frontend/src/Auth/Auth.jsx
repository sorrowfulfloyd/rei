import React from "react";
import "./Auth.css";

export default function Auth({ onRedirect }) {
  function POSTlogin(e) {
    e.preventDefault();
    fetch(process.env.API_URL + "/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: document.cookie.slice(6),
      },
      body: JSON.stringify({
        username: document.forms[0][0].value,
        password: document.forms[0][1].value,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        alert(
          `Something went wrong\n${response.status} - ${response.statusText}`,
        );
      })
      .then((data) => {
        document.cookie = `token=${data.token}`;
        onRedirect();
      })
      .catch((error) => {
        console.log(error);
        alert(`Something went wrong. Check the console.\n${error}`);
      })
      .finally(() => {
        document.forms[0].reset();
      });
  }
  return (
    <>
      <div id="container">
        <form action="POST" id="loginForm" onSubmit={POSTlogin}>
          <div id="loginFields">
            <h3>Login</h3>
            <div id="formField">
              <input type="text" placeholder="Username" required />
              <input type="password" placeholder="Password" required />
            </div>
          </div>
          <div id="loginSubmit">
            <button id="formSubmit" type="submit" form="loginForm">
              Login
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
