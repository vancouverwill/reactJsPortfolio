import ContactModal from "./ContactModal.js";
import PropTypes from "prop-types";
import React from "react";

class HeaderBar  extends React.Component {
  render= () => {
    return (
      <div id="HeaderBar">
        <ContactModal hideContactView={this.props.hideContactView} ></ContactModal>
        <div id="contactSection" className="headerBarFont">
          <p>
            <a  href="https://github.com/vancouverwill/reactJsPortfolio">Source</a>
            &nbsp;
            <span id="contactButton"  onClick={this.props.showContactView} >Contact</span>
          </p>
        </div>
        <p className="headerBarFont projectClose" onClick={this.props.handleProjectListShow} >
            Return to articles
        </p>
        <div className="headerBar">&nbsp;
        </div>
      </div>
    );
  }
}
HeaderBar.propTypes = {
  handleProjectListShow: PropTypes.func,
  hideContactView: PropTypes.func,
  showContactView: PropTypes.func,
};

export default HeaderBar;