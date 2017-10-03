import ProjectDetailsIntroView from "./ProjectDetailsIntroView";
import React from "react";
import { mount } from "enzyme";


describe("PortfolioContainer", () => {
  let props;
  let mountedProjectDetailsIntroView;
  const projectDetailsIntroView = () => {
    if (!mountedProjectDetailsIntroView) {
      mountedProjectDetailsIntroView = mount(
        <ProjectDetailsIntroView {...props} />
      );
    }
    return mountedProjectDetailsIntroView;
  };

  beforeEach(() => {
    props = {
      currentProject:undefined
    };
    mountedProjectDetailsIntroView = undefined;
  });

  it("always renders a div", () => {
    const divs = projectDetailsIntroView().find("div");
    expect(divs.length).toBeGreaterThan(0);
  });

  describe("when current Project is NOT set", () => {
    it("does not render a Header tag", () => {
      expect(projectDetailsIntroView().find("h2").length).toBe(0);
    });
  });

  describe("when current Project is set", () => {
    beforeEach(() => {
      props.currentProject = {name: "testProjectName",
        shortDescription: "sampleShortDescription",
        active: undefined,
        fontColor: "#0f0f0f",
        selctProject: jest.fn(),
        handleProjectDetailsShow: jest.fn()};
    });
    it("it renders a Header tag", () => {
      expect(projectDetailsIntroView().find("h2").length).toBe(1);
    });
  });
});