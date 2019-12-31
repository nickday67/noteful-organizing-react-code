import React, { Component } from "react";
import NotefulForm from "../NotefulForm/NotefulForm";
import ApiContext from "../ApiContext";
import PropTypes from "prop-types";
import config from "../config";
import ErrorBoundary from "../ErrorBoundary";
import "./AddFolder.css";

export default class AddFolder extends Component {
  static defaultProps = {
    history: {
      push: () => {}
    }
  };
  state = {
    isButtonDisabled: true
  };

  onInputChange = e => {
    const hasText = e.target.value.trim().length > 0;
    this.setState({
      isButtonDisabled: !hasText
    });
  };

  static contextType = ApiContext;

  handleSubmit = e => {
    e.preventDefault();
    const folder = {
      name: e.target["folder-name"].value
    };
    fetch(`${config.API_ENDPOINT}/folders`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(folder)
    })
      .then(res => {
        if (!res.ok) return res.json().then(e => Promise.reject(e));
        return res.json();
      })
      .then(folder => {
        this.context.addFolder(folder);
        this.props.history.push(`/folder/${folder.id}`);
      });
  };

  render() {
    return (
      <ErrorBoundary>
        <section className="AddFolder">
          <h2>Create a folder</h2>
          <NotefulForm onSubmit={this.handleSubmit}>
            <div className="field">
              <label htmlFor="folder-name-input">Name</label>
              <input
                type="text"
                id="folder-name-input"
                name="folder-name"
                onChange={this.onInputChange}
              />
            </div>
            <div className="buttons">
              <button type="submit" disabled={this.state.isButtonDisabled}>
                Add folder
              </button>
            </div>
          </NotefulForm>
        </section>
      </ErrorBoundary>
    );
  }
}

AddFolder.propTypes = {
  history: PropTypes.object.isRequired
};
