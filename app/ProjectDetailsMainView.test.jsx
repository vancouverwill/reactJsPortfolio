import ProjectDetailsMainView from "./ProjectDetailsMainView";
import React from "react";
import { mount } from "enzyme";


describe("ProjectDetailsMainView", () => {
  let props;
  let mountedProjectDetailsMainView;
  const projectDetailsMainView = () => {
    if (!mountedProjectDetailsMainView) {
      mountedProjectDetailsMainView = mount(
        <ProjectDetailsMainView {...props} />
      );
    }
    return mountedProjectDetailsMainView;
  };

  beforeEach(() => {
    props = {
      currentProject: {
        name: "testProjectName",
        shortDescription: "sampleShortDescription",
        active: undefined,
        fontColor: "#0f0f0f",
        selctProject: jest.fn(),
        handleProjectDetailsShow: jest.fn()
      },
      handleProjectListShow: jest.fn()
    };
    mountedProjectDetailsMainView = undefined;
  });

  it("always renders a div", () => {
    const divs = projectDetailsMainView().find("div");
    expect(divs.length).toBeGreaterThan(0);
  });

  describe("when current Project is set", () => {
    it("it's main div contains children", () => {
      expect(projectDetailsMainView().find("div").children().toBeDefined);
    });
  });

  describe("when current Project is NOT set", () => {
    beforeEach(() => {
      props.currentProject = undefined;
    });
    it("it's main div is empty", () => {
      expect(projectDetailsMainView().find("div").children().toBeUndefined);
    });
  });
});