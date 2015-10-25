'use strict';

var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var React = require('react');
var classNames = require('classnames');
var ReactDOM = require('react-dom');

var Container = React.createClass({
  displayName: 'Container',

  isAnimating: false,
  currentProjectIndex: -1,
  animationDirection: "movingUp",
  animationDuration: 1100,
  // currentState: "home",
  getInitialState: function getInitialState() {
    return {
      title: "Portfolio Site",
      projects: projects,
      showListView: true,
      currentProject: projects[0],
      showIsAnimating: false,
      items: []
    };
  },
  updateCurrentProject: function updateCurrentProject(projectName) {
    if (this.isAnimating === true) return;
    if (this.state.showListView === false) return;

    this.setAnimating();
    for (var i = 0; i < this.state.projects.length; i++) {
      if (this.state.projects[i].name == projectName) {
        if (i < this.currentProjectIndex) {
          this.animationDirection = "movingDown";
        } else {
          this.animationDirection = "movingUp";
        }
        this.setState({ "currentProject": this.state.projects[i] });
        this.currentProjectIndex = i;
        this.state.projects[i].active = true;
        var currentProject = this.state.projects[i];
      } else {
        this.state.projects[i].active = false;
      }
    }
    this.setState(projects);

    // var newItems = this.state.items;

    // newItems.splice(0, 1);

    if (currentProject !== undefined) {
      // newItems = this.state.items.concat(currentProject);
      this.setState({ "animatedProject": currentProject });
      this.setState({ "animatedImageUrl": currentProject.images[0] });
      this.setState({ "animatedImageUrlIndex": 0 });
    } else {
      // no project means reset
      // this.goingDown = true;
      this.animationDirection = "movingDown";
      this.currentProjectIndex = -1;
      this.setState({ "animatedProject": null });
      this.setState({ "animatedImageUrl": null });
      this.setState({ "animatedImageUrlIndex": null });
      // this.setState({"currentProject" : null});
    }

    // this.setState({"items" : newItems});
    this.setNotAnimating();
  },
  handleProjectDetailsShow: function handleProjectDetailsShow() {
    this.setAnimating();
    console.log("handleProjectDetailsShow");
    this.setState({ "showListView": false });
    this.setNotAnimating();
  },
  handleProjectListShow: function handleProjectListShow() {
    this.isAnimating = false;
    this.setState({ "showListView": true });
  },
  showContactView: function showContactView() {
    if (this.state.showListView == false) {
      this.handleProjectListShow();
    }

    // this.currentState = "home";

    this.updateCurrentProject(-1);
  },
  componentDidMount: function componentDidMount() {
    var elem = ReactDOM.findDOMNode(this);
    elem.addEventListener('wheel', this.handleWheel);
  },
  handleWheel: function handleWheel(event) {
    if (this.isAnimating !== false) return;

    if (event.deltaY < 0) this.moveDown();
    if (event.deltaY > 0) this.moveUp();
  },
  chooseProjectOne: function chooseProjectOne() {
    console.log("chooseProjectOne");
    this.moveUp();
  },
  moveUp: function moveUp() {
    if (this.currentProjectIndex < projects.length - 1) {
      this.updateCurrentProject(this.state.projects[this.currentProjectIndex + 1].name);
    }
  },
  moveDown: function moveDown() {
    if (this.currentProjectIndex > 0) {
      this.updateCurrentProject(this.state.projects[this.currentProjectIndex - 1].name);
    }

    if (this.currentProjectIndex == 0) {
      this.updateCurrentProject('');
    }
  },
  setAnimating: function setAnimating() {
    this.isAnimating = true;
    this.setState({ "showIsAnimating": true });
  },
  setNotAnimating: function setNotAnimating() {
    var self = this;

    this.timeout = setTimeout(function () {
      self.isAnimating = false;
      self.setState({ "showIsAnimating": false });
    }, this.animationDuration);
  },
  clickLeftIndividualProjectCarousel: function clickLeftIndividualProjectCarousel(e) {
    if (this.isAnimating === true) return;
    this.setAnimating();

    console.log("clickLeftIndividualProjectCarousel");
    this.animationDirection = "movingLeft";

    if (this.state.animatedImageUrlIndex != 0) {
      var newIndex = this.state.animatedImageUrlIndex - 1;
    } else {
      var newIndex = this.state.currentProject.images.length - 1;
    }

    this.setState({ "animatedImageUrl": this.state.currentProject.images[newIndex] });
    this.setState({ "animatedImageUrlIndex": newIndex });

    this.setNotAnimating();
  },
  clickRightIndividualProjectCarousel: function clickRightIndividualProjectCarousel(e) {
    if (this.isAnimating === true) return;
    this.setAnimating();

    console.log("clickRightIndividualProjectCarousel");
    this.animationDirection = "movingRight";

    if (this.state.animatedImageUrlIndex != this.state.currentProject.images.length - 1) {
      var newIndex = this.state.animatedImageUrlIndex + 1;
    } else {
      var newIndex = 0;
    }

    this.setState({ "animatedImageUrl": this.state.currentProject.images[newIndex] });
    this.setState({ "animatedImageUrlIndex": newIndex });

    this.setNotAnimating();
  },
  render: function render() {

    if (this.animationDirection == "movingUp") {
      var classes = classNames({
        'movingUp': true
      });
    } else if (this.animationDirection == "movingDown") {
      var classes = classNames({
        'movingDown': true
      });
    } else if (this.animationDirection == "movingLeft") {
      var classes = classNames({
        'movingLeft': true
      });
    } else if (this.animationDirection == "movingRight") {
      var classes = classNames({
        'movingRight': true
      });
    }

    if (this.state.showListView == true) {
      if (this.currentProjectIndex == -1) {
        listColor = { "color": "black" };

        var overallStatusClasses = classNames({
          'intialView_active': true,
          'animating_active': this.state.showIsAnimating
        });
      } else {
        listColor = { "color": "white" };

        var overallStatusClasses = classNames({
          'ProjectListView_active': true,
          'animating_active': this.state.showIsAnimating
        });
      }
    } else {

      var overallStatusClasses = classNames({
        'ProjectDetailsView_active': true,
        'animating_active': this.state.showIsAnimating
      });
    }

    var projectDetailsView = React.createElement(
      'div',
      { className: 'projectDetailsView' },
      React.createElement(ProjectDetails, { currentProject: this.state.currentProject, handleProjectListShow: this.handleProjectListShow })
    );
    if (this.currentProjectIndex == -1) {
      var listColor = { "color": "black" };
    } else {
      var listColor = { "color": "white" };
    }

    // var items = this.state.items.map(function(item, i) {
    //   return (
    //     <Project key={item.name} name={item.name} description={item.description} images={item.images}></Project>
    //   );
    // }.bind(this));
    //
    // animatedProject

    if (this.state.animatedImageUrl != null) {
      var imageUrl = "url('images/" + this.state.animatedImageUrl + "')";
      var backgroundStyles = { "backgroundImage": imageUrl };

      var animateProject = React.createElement(
        'div',
        { key: this.state.animatedImageUrl, className: 'portfolioSlide' },
        React.createElement('div', { className: 'slideImage', style: backgroundStyles }),
        React.createElement('div', { className: 'slideImageOpacityOverlay' })
      );
    } else {
      var animateProject = null;
    }

    var loadingIndicator = React.createElement(
      'div',
      null,
      'Loading...'
    );
    var images = [];

    return React.createElement(
      'div',
      { id: 'mainView', className: overallStatusClasses },
      React.createElement(
        'button',
        { id: 'contactButton', type: 'button', className: 'btn btn-default', onClick: this.showContactView },
        'Contact'
      ),
      React.createElement(
        'div',
        { id: 'leftArrow__IndividualProjecCarousel', className: 'arrow__IndividualProjecCarousel' },
        React.createElement('i', { className: 'fa fa-chevron-left', onClick: this.clickLeftIndividualProjectCarousel })
      ),
      React.createElement(
        'div',
        { id: 'rightArrow__IndividualProjecCarousel', className: 'arrow__IndividualProjecCarousel' },
        React.createElement('i', { className: 'fa fa-chevron-right', onClick: this.clickRightIndividualProjectCarousel })
      ),
      React.createElement(
        'div',
        { className: 'projectListView' },
        React.createElement(
          'h1',
          { style: listColor },
          ' Will Melbourne'
        ),
        React.createElement(
          'div',
          { className: 'introTextContainer' },
          React.createElement(
            'p',
            { className: 'introText' },
            'Will Melbourne is a software engineer working in Vancouver Canada ',
            React.createElement('i', { className: 'fa fa-arrow-down introText__arrow', onClick: this.chooseProjectOne })
          )
        ),
        React.createElement(
          'div',
          { id: 'portfolioProjectAnimationContainer', className: classes },
          React.createElement(
            ReactCSSTransitionGroup,
            { transitionName: 'portfolioProjectAnimation', transitionEnterTimeout: 1000, transitionLeaveTimeout: 1000 },
            animateProject
          )
        ),
        React.createElement(ProjectList, { projects: this.state.projects, listColor: listColor, clickCurrentProject: this.updateCurrentProject, handleProjectDetailsShow: this.handleProjectDetailsShow })
      ),
      projectDetailsView
    );
  }
});

var Project = React.createClass({
  displayName: 'Project',

  render: function render() {
    if (this.props.images !== undefined && this.props.images[0]) {
      var imageUrl = "url('images/" + this.props.images[0] + "')";
      var backgroundStyles = { "backgroundImage": imageUrl };
    }

    var leftParagrah = { "position": "absolute", "left": "-15%", "top": "10%" };

    return React.createElement(
      'div',
      { key: this.props.name, className: 'portfolioSlide' },
      React.createElement(
        ReactCSSTransitionGroup,
        { transitionName: 'projectImagesAnimation', transitionEnterTimeout: 5000, transitionLeaveTimeout: 3000 },
        React.createElement('div', { className: 'slideImage', style: backgroundStyles })
      )
    );
  }
});

var ProjectDetails = React.createClass({
  displayName: 'ProjectDetails',

  handleProjectListShow: function handleProjectListShow() {
    this.props.handleProjectListShow();
  },
  render: function render() {
    return React.createElement(
      'div',
      { key: this.props.currentProject.name, className: 'ProjectDetailsContent' },
      React.createElement(
        'span',
        { className: 'pointer' },
        React.createElement(
          'i',
          { className: 'fa fa-arrow-up', onClick: this.handleProjectListShow },
          'Back to Projects'
        )
      ),
      React.createElement(
        'h2',
        null,
        this.props.currentProject.name
      ),
      React.createElement(
        'p',
        null,
        this.props.currentProject.description
      )
    );
  }
});

var ProjectList = React.createClass({
  displayName: 'ProjectList',

  getInitialState: function getInitialState() {
    return {};
  },
  handleProjectShow: function handleProjectShow(projectName) {
    this.props.clickCurrentProject(projectName);
  },
  handleProjectDetailsShow: function handleProjectDetailsShow() {
    this.props.handleProjectDetailsShow();
  },
  render: function render() {
    var loop = this.props.projects.map(function (e) {
      return React.createElement(ProjectName, { key: e.name, name: e.name, fontColor: e.fontColor, shortDescription: e.shortDescription, active: e.active, handleProjectShow: this.handleProjectShow, handleProjectDetailsShow: this.handleProjectDetailsShow });
    }, this);
    return React.createElement(
      'div',
      { id: 'ProjectList' },
      React.createElement(
        'div',
        { id: 'ProjectListMenu', style: this.props.listColor },
        loop
      )
    );
  }
});

var ProjectName = React.createClass({
  displayName: 'ProjectName',

  handleProjectShow: function handleProjectShow() {
    this.props.handleProjectShow(this.props.name);
  },
  handleProjectDetailsShow: function handleProjectDetailsShow() {
    this.props.handleProjectDetailsShow();
  },
  render: function render() {
    var classes = classNames({
      'active': this.props.active,
      'project-title': true
    });

    if (this.props.active == true) {
      var fontColor = { "color": this.props.fontColor };
    } else {
      var fontColor = {};
    }

    return React.createElement(
      'div',
      { className: classes },
      React.createElement('div', { className: 'spacingDivBorder' }),
      React.createElement(
        'h4',
        { onClick: this.handleProjectShow, style: fontColor },
        this.props.name,
        ' ',
        this.props.active,
        React.createElement('i', { className: 'fa fa-arrow-right arrowSeeProjectDetails', onClick: this.handleProjectDetailsShow, style: fontColor })
      ),
      React.createElement(
        'p',
        null,
        this.props.shortDescription
      )
    );
  }
});

var ProjectViews = React.createClass({
  displayName: 'ProjectViews',

  getInitialState: function getInitialState() {
    return {};
  },
  render: function render() {
    var projectsLoop = this.props.projects.map(function (project) {

      if (project.images !== undefined && project.images[0]) {
        var imageUrl = "url('images/" + project.images[0] + "')";
        var backgroundStyles = { "backgroundImage": imageUrl };
      }

      if (this.props.currentProject.name == project.name) {
        var classes = classNames({
          'active': true,
          'opacityShow': true,
          'opacityTransition': true,
          'projectView': true
        });
      } else {
        var classes = classNames({
          'active': false,
          'opacityHide': true,
          'opacityTransition': true,
          'projectView': true
        });
      }

      return React.createElement(
        'div',
        { key: project.name, id: 'ProjectView__p', style: backgroundStyles, className: classes },
        React.createElement(
          'p',
          null,
          'current project :',
          project.currentProject
        ),
        React.createElement(
          'p',
          null,
          'color ',
          project.color,
          ' '
        ),
        React.createElement(
          'p',
          null,
          'image  ',
          project
        )
      );
    }, this);
    return React.createElement(
      'div',
      { id: 'ProjectViews_container__p' },
      projectsLoop
    );
  }
});

ReactDOM.render(React.createElement(Container, null), document.getElementById('container'));