// import PortfolioContainer from "./PortfolioContainer";
import ProjectList from "./ProjectList";
import ProjectName from "./ProjectName";
import React from "react";
import { mount } from "enzyme";


describe("ProjectList", () => {
  let props;
  let mountedProjectList;
  const projectList = () => {
    if (!mountedProjectList) {
      mountedProjectList = mount(
        <ProjectList {...props} />
      );
    }
    return mountedProjectList;
  };

  beforeEach(() => {
    props = {
      currentProjectIndex: -1,
      projects: [],
      imagesReady: false,
      selctProject: jest.fn(),
      handleProjectDetailsShow: jest.fn(),
      chooseProjectOne: jest.fn()
    };
    mountedProjectList = undefined;
  });

  it("always renders a div", () => {
    const divs = projectList().find("div");
    expect(divs.length).toBeGreaterThan(0);
  });

  it("will not render any projects when no projects are loaded", () => {
    expect(projectList().find(ProjectName).length).toBe(0);
  });

  describe("when projects are loaded", () => {
    beforeEach(() => {
      props.projects.push({
        name: "testProjectName",
        shortDescription: "sampleShortDescription",
        active: undefined,
        fontColor: "#0f0f0f",
        selctProject: jest.fn(),
        handleProjectDetailsShow: jest.fn()
      });
      props.projects.push({
        name: "testProjectName Two",
        shortDescription: "sampleShortDescription",
        active: true,
        fontColor: "#fff0000",
        selctProject: jest.fn(),
        handleProjectDetailsShow: jest.fn()
      });
    });
    it("when the images are loaded it will render the number of projects which are passed in", () => {
      props.imagesReady = true;    
      expect(projectList().find(ProjectName).length).toBe(2);
    });
    it("when the images are not loaded it will render not render any projects", () => {
      props.imagesReady = false;    
      expect(projectList().find(ProjectName).length).toBe(0);
    });
  });
});