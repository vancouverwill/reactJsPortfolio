import ProjectName from "./ProjectName";
import React from "react";
import { mount } from "enzyme";


describe("ProjectName", () => {
  let props;
  let mountedProjectName;
  const projectName = () => {
    if (!mountedProjectName) {
      mountedProjectName = mount(
        <ProjectName {...props} />
      );
    }
    return mountedProjectName;
  };

  beforeEach(() => {
    props = {
      name: "testProjectName",
      shortDescription: "sampleShortDescription",
      active: undefined,
      fontColor: "#0f0f0f",
      selctProject: jest.fn(),
      handleProjectDetailsShow: jest.fn()
    };
    mountedProjectName = undefined;
  });

  it("always renders a div", () => {
    const divs = projectName().find("div");
    expect(divs.length).toBeGreaterThan(0);
  });

  describe("the rendered div", () => {
    it("contains everything else that gets rendered", () => {
      const divs = projectName().find("div");
      // When using .find, enzyme arranges the nodes in order such
      // that the outermost node is first in the list. So we can
      // use .first() to get the outermost div.
      const wrappingDiv = divs.first();

      // Enzyme omits the outermost node when using the .children()
      // method on projectName(). This is annoying, but we can use it
      // to verify that wrappingDiv contains everything else this
      // component renders.
      expect(wrappingDiv.children()).toEqual(projectName().children());
    });
  });

  describe("when Project is active", () => {
    beforeEach(() => {
      props.active = true;
    });
    it("font color is the custom font color of that project's h4 tag", () => {
      const h4 = projectName().find("h4");
      expect(h4.props().style.color).toBe(props.fontColor);
    });
    it("should have active class on root div", () => {
      const wrappingDiv = projectName().find("div").first();
      expect(wrappingDiv.hasClass("active")).toBe(true);
    });
  });
  describe("when Project is not active", () => {
    it("font color is not set", () => {
      const h4 = projectName().find("h4");
      expect(h4.props().style.color).toBeNull;
    });
    it("should NOT have active class on root div", () => {
      const wrappingDiv = projectName().find("div").first();
      expect(wrappingDiv.hasClass("active")).toBe(false);
    });
  });
});