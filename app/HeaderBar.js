import ContactModal from "./ContactModal.js";
import PropTypes from "prop-types";
import React from "react";

const HeaderBar = ({handleProjectListShow, hideContactView, showContactView}) => {
  return (
    <div id="HeaderBar">
      <ContactModal hideContactView={hideContactView} ></ContactModal>
      <div id="contactSection" className="headerBarFont">
        <p>
          <a  href="https://github.com/vancouverwill/reactJsPortfolio" target="_blank" rel="noopener">Source</a>
          &nbsp;
          <span id="contactButton"  onClick={showContactView} >Contact</span>
        </p>
      </div>
      <p className="headerBarFont projectClose" onClick={handleProjectListShow} >
          Return to articles
      </p>
      <div className="headerBar">&nbsp;
      </div>
    </div>
  );
};
HeaderBar.propTypes = {
  handleProjectListShow: PropTypes.func.isRequired,
  hideContactView: PropTypes.func.isRequired,
  showContactView: PropTypes.func.isRequired,
};

export default HeaderBar;