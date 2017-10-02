import PortfolioContainer from "./PortfolioContainer";
import React from "react";
import { mount } from "enzyme";


describe("PortfolioContainer", () => {
  let props;
  let mountedPortfolioContainer;
  const portfolioContainer = () => {
    if (!mountedPortfolioContainer) {
      mountedPortfolioContainer = mount(
        <PortfolioContainer {...props} />
      );
    }
    return mountedPortfolioContainer;
  };

  beforeEach(() => {
    props = {
      projects: [],
      imagesReady: false,
    };
    mountedPortfolioContainer = undefined;
  });

  it("always renders a div", () => {
    const divs = portfolioContainer().find("div");
    expect(divs.length).toBeGreaterThan(0);
  });
});