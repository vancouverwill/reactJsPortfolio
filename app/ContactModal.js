import PropTypes from "prop-types";
import React from"react";

class ContactModal  extends React.Component {
  render = () => {
    return (
      <div id="modalContactView" className="active">
        <div className="closeButton modalCloseButton" onClick={this.props.hideContactView} >
          <i className="fa fa-times fa-2x" onClick={this.props.hideContactView}></i>
        </div>
        <div className="modalContactViewText">
              contact : willmelbourne@gmail.com
          <a href="https://ca.linkedin.com/in/willmelbourne" target="_blank" rel="noopener">
            <span className="circleBorder">
              <i className="fa fa-linkedin fa-lg"></i>
            </span>
          </a>
          <a href="mailto:willmelbourne@gmail.com">
            <span className="circleBorder">
              <i className="fa fa-envelope fa-lg"></i>
            </span>
          </a>
          <a href="https://github.com/vancouverwill" target="_blank" rel="noopener">
            <span className="circleBorder">
              <i className="fa fa-github-alt fa-lg"></i>
            </span>
          </a>
        </div>
      </div>
    );
  }
}
ContactModal.propTypes = {
  hideContactView: PropTypes.func,
};

export default ContactModal;