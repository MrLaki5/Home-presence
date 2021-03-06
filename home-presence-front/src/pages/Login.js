import React from "react";
import { Redirect } from "react-router-dom";

import Title_HP from "../components/Title_HP";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      login_approved: false,
      login_error: "",
    };
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.sendLogin = this.sendLogin.bind(this);
    this.handleLoginEvent = this.handleLoginEvent.bind(this);
    this.check_authenticated = this.check_authenticated.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  componentDidMount() {
    // If token exists on mounting try to login
    if (!(localStorage.getItem("Token") === null)) {
      this.check_authenticated();
    }
  }

  onKeyDown(event) {
    if (event.key === "Enter") {
      this.sendLogin();
    }
  }

  sendLogin() {
    // create a new XMLHttpRequest
    var xhr = new XMLHttpRequest();

    // get a callback when the server responds
    xhr.addEventListener("load", () => {
      // update the state of the component with the result here
      console.log(xhr.responseText);
      var data_obj = JSON.parse(xhr.responseText);
      var token_acquired = false;
      if (data_obj["status"] === "success") {
        if (data_obj.hasOwnProperty("auth_token")) {
          token_acquired = true;
          localStorage.setItem("Token", data_obj["auth_token"]);
          this.setState(() => ({
            login_approved: true,
          }));
        }
      } else {
        this.setState(() => ({
          login_error: data_obj["message"],
          password: "",
        }));
      }
      if (!token_acquired) {
        localStorage.removeItem("Token");
      }
    });

    var formData = new FormData();
    formData.append("password", this.state.password);

    // open the request with the verb and the url
    xhr.open(
      "POST",
      "http://" +
        process.env.REACT_APP_SERVER_ADDRESS +
        ":" +
        process.env.REACT_APP_SERVER_PORT +
        "/login"
    );
    // send the request
    xhr.send(formData);
  }

  check_authenticated() {
    // create a new XMLHttpRequest
    var xhr = new XMLHttpRequest();

    // get a callback when the server responds
    xhr.addEventListener("load", () => {
      // update the state of the component with the result here
      console.log(xhr.responseText);
      var data_obj = JSON.parse(xhr.responseText);
      var token_acquired = false;
      if (data_obj["status"] === "success") {
        token_acquired = true;
        this.setState((state) => ({
          login_approved: true,
        }));
      }
      if (!token_acquired) {
        localStorage.removeItem("Token");
      }
    });

    // open the request with the verb and the url
    xhr.open(
      "GET",
      "http://" +
        process.env.REACT_APP_SERVER_ADDRESS +
        ":" +
        process.env.REACT_APP_SERVER_PORT +
        "/is_authenticated"
    );
    // set auth header
    xhr.setRequestHeader(
      "Authorization",
      "Bearer " + localStorage.getItem("Token")
    );
    // send the request
    xhr.send();
  }

  handleLoginEvent(event) {
    this.sendLogin();
  }

  handlePasswordChange(event) {
    const value = event.target.value || "";
    this.setState((state) => ({
      password: value,
    }));
  }

  render() {
    if (this.state.login_approved) {
      return (
        <Redirect
          to={{
            pathname: "/",
          }}
        />
      );
    }
    return (
      <Grid container className="MainContainer">
        {/* Title */}
        <Title_HP />

        {/* Title margin */}
        <Grid container item xs={12}>
          <Hidden only={["xs", "sm"]}>
            {/* Button PC */}
            <Button
              size="small"
              disableRipple={true}
              fullWidth
              style={{
                cursor: "initial",
                fontSize: "1.3vw",
                fontFamily: "Collegia",
                borderRadius: "0%",
                color: "var(--main-primary-color)",
                backgroundColor: "var(--main-primary-color)",
                opacity: 0.5,
              }}
            >
              .
            </Button>
          </Hidden>
          <Hidden only={["md", "lg", "xl"]}>
            {/* Button Mobile */}
            <Button
              size="small"
              disableRipple={true}
              fullWidth
              style={{
                cursor: "initial",
                fontSize: "3vw",
                fontFamily: "Collegia",
                borderRadius: "0%",
                color: "var(--main-primary-color)",
                backgroundColor: "var(--main-primary-color)",
                opacity: 0.5,
              }}
            >
              .
            </Button>
          </Hidden>
        </Grid>

        {/* Login part */}
        <Grid container item xs={12} style={{ marginTop: "10%" }}>
          {/* Password */}
          <Grid item only={["md", "lg", "xl"]} md={4}></Grid>
          <Grid item xs={12} md={4}>
            <TextField
              id="standard-full-width"
              label="Password"
              style={{ color: "var(--main-primary-color)" }}
              placeholder="Type password"
              fullWidth
              type="password"
              margin="normal"
              onKeyDown={this.onKeyDown}
              onChange={this.handlePasswordChange}
              value={this.state.password}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item only={["md", "lg", "xl"]} md={4}></Grid>

          {/* Login button */}
          <Grid item only={["md", "lg", "xl"]} md={4}></Grid>
          <Grid item xs={12} md={4}>
            <Hidden only={["xs", "sm"]}>
              {/* Button PC */}
              <Button
                size="small"
                disableRipple={true}
                fullWidth
                style={{
                  fontSize: "1vw",
                  fontFamily: "Collegia",
                  borderRadius: "0%",
                  color: "var(--main-bg-color)",
                  backgroundColor: "var(--main-primary-color)",
                }}
                onClick={() => this.handleLoginEvent()}
              >
                Login
              </Button>
            </Hidden>
            <Hidden only={["md", "lg", "xl"]}>
              {/* Button Mobile */}
              <Button
                size="small"
                disableRipple={true}
                fullWidth
                style={{
                  fontSize: "3vw",
                  fontFamily: "Collegia",
                  borderRadius: "0%",
                  color: "var(--main-bg-color)",
                  backgroundColor: "var(--main-primary-color)",
                }}
                onClick={() => this.handleLoginEvent()}
              >
                Login
              </Button>
            </Hidden>
          </Grid>
          <Grid item only={["md", "lg", "xl"]} md={4}></Grid>

          {/*Error messages */}
          <Grid item only={["md", "lg", "xl"]} md={4}></Grid>
          <Grid item xs={12} md={4}>
            <Hidden only={["xs", "sm"]}>
              {/* Message PC */}
              <div
                className="TitleVersion"
                style={{ color: "var(--main-error-color)" }}
              >
                {this.state.login_error}
              </div>
            </Hidden>
            <Hidden only={["md", "lg", "xl"]}>
              {/* Message Mobile */}
              <div
                className="TitleVersionMobile"
                style={{ color: "var(--main-error-color)" }}
              >
                {this.state.login_error}
              </div>
            </Hidden>
          </Grid>
          <Grid item only={["md", "lg", "xl"]} md={4}></Grid>
        </Grid>
      </Grid>
    );
  }
}

export default Login;
