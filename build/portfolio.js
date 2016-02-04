/*global require, apiUrl*/

var ReactCSSTransitionGroup = require("react-addons-css-transition-group");
var React = require("react");
var classNames = require("classnames");
var ReactDOM = require("react-dom");
var Jquery = require("jquery");

var hash = {};
var cache = [];

function add(url) {
    if (!hash[url]) {
        hash[url] = new Image();
        hash[url].src = url;

        cache.push(hash[url]);
    }
    return hash[url];
}

function get(url) {
    return add(url);
}

function imgRequestUrlLoad(url) {

    var image = get(url);

    return new Promise(function (resolve, reject) {
        var handleSuccess = function handleSuccess() {
            resolve(image);
        };

        if (image.naturalWidth && image.naturalHeight) {
            //Image is loaded, go ahead and change the state
            handleSuccess();
        } else {
            image.addEventListener("load", handleSuccess, false);
            image.addEventListener("error", reject, false);
        }
    });
}

function imgLoad(url) {
    // Create new promise with the Promise() constructor;
    // This has as its argument a function
    // with two parameters, resolve and reject
    return new Promise(function (resolve, reject) {
        // Standard XHR to load an image
        var request = new XMLHttpRequest();
        request.open("GET", url);
        request.responseType = "blob";
        // When the request loads, check whether it was successful
        request.onload = function () {
            if (request.status === 200) {
                // If successful, resolve the promise by passing back the request response
                resolve(request.response);
            } else {
                // If it fails, reject the promise with a error message
                reject(Error("Image didn\'t load successfully; error code:" + request.statusText));
            }
        };
        request.onerror = function () {
            // Also deal with the case when the entire request fails to begin with
            // This is probably a network error, so reject the promise with an appropriate message
            reject(Error("There was a network error."));
        };
        // Send the request
        request.send();
    });
}

function loadImages(urls) {
    var promises = urls.map(imgRequestUrlLoad);
    return Promise.all(promises);
}

var PageLoadingClass = React.createClass({
    displayName: "PageLoadingClass",

    propTypes: {
        url: React.PropTypes.string
    },
    getInitialState: function () {
        return {
            projects: undefined,
            ready: false,
            ajaxState: undefined
        };
    },
    componentWillMount: function () {
        this.loadCommentsFromServer();
    },
    handleSuccess: function () {
        this.setState({ ready: true });
    },
    handleError: function () {
        this.setState({ ajaxState: "failed" });
    },
    loadCommentsFromServer: function () {
        Jquery.ajax({
            url: this.props.url,
            dataType: "json",
            success: function (apiProjects) {

                var projects = [];
                var allImages = [];

                apiProjects.forEach(function (apiProject) {
                    var project = {};
                    project.name = apiProject.title.rendered;
                    project.shortDescription = apiProject.project_short_description;
                    project.description = apiProject.content.rendered;
                    project.fontColor = apiProject.font_color;

                    project.images = [];

                    if (apiProject.gallery_set !== undefined && apiProject.gallery_set.length > 0) {
                        apiProject.gallery_set.forEach(function (galleryImage) {
                            project.images.push(galleryImage.url);
                            allImages.push(galleryImage.url);
                        });
                    }
                    projects.push(project);
                });

                this.setState({ projects: projects });

                loadImages(allImages).then(this.handleSuccess, this.handleError);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
                console.log('could not load projects');
                this.handleError();
            }.bind(this)
        });
    },
    render: function () {

        if (this.state.ajaxState == undefined) {
            return React.createElement(PortfolioContainer, { projects: this.state.projects, imageReady: this.state.ready });
        } else {
            return React.createElement(
                "div",
                { className: "text-center" },
                React.createElement(
                    "h3",
                    null,
                    "Sorry projects are not available to view right now :("
                ),
                React.createElement(
                    "h3",
                    null,
                    "Please try again later...."
                )
            );
        }
    }
});

var PortfolioContainer = React.createClass({
    displayName: "PortfolioContainer",

    propTypes: {
        projects: React.PropTypes.array,
        imageReady: React.PropTypes.bool
    },
    isAnimating: false,
    currentProjectIndex: -1,
    animationDirection: "movingUp",
    animationDuration: 1200,
    getInitialState: function () {
        return {
            title: "Portfolio Site",
            showContactModal: false,
            showListView: true,
            currentProject: undefined,
            showIsAnimating: false,
            items: []
        };
    },
    selctProject: function (projectName) {
        if (this.state.currentProject === undefined || this.state.currentProject.name != projectName) {
            this.updateCurrentProject(projectName);
        } else {
            this.handleProjectDetailsShow();
        }
    },
    updateCurrentProject: function (projectName) {
        if (this.isAnimating === true) return;
        if (this.state.showListView === false) return;

        this.setAnimating();
        for (var i = 0; i < this.props.projects.length; i++) {
            if (this.props.projects[i].name == projectName) {
                if (i < this.currentProjectIndex) {
                    this.animationDirection = "movingDown";
                } else {
                    this.animationDirection = "movingUp";
                }
                this.setState({ "currentProject": this.props.projects[i] });
                this.currentProjectIndex = i;
                this.props.projects[i].active = true;
                var currentProject = this.props.projects[i];
            } else {
                this.props.projects[i].active = false;
            }
        }

        if (currentProject !== undefined) {
            this.setState({ "animatedProject": currentProject });
            this.setState({ "animatedImageUrl": currentProject.images[0] });
            this.setState({ "animatedImageUrlIndex": 0 });
        } else {
            // no project means reset
            this.animationDirection = "movingDown";
            this.currentProjectIndex = -1;
            this.setState({ "animatedProject": null });
            this.setState({ "animatedImageUrl": null });
            this.setState({ "animatedImageUrlIndex": null });
        }

        this.setNotAnimating();
    },
    handleProjectDetailsShow: function () {
        this.setAnimating();
        this.setState({ "showListView": false });
        this.setNotAnimating();
    },
    handleProjectListShow: function () {
        this.isAnimating = false;
        this.setState({ "showListView": true });
    },
    hideContactView: function () {
        this.setState({ "showContactModal": false });
    },
    showContactView: function () {
        this.setState({ "showContactModal": true });
    },
    componentDidMount: function () {
        var elem = ReactDOM.findDOMNode(this);
        elem.addEventListener("wheel", this.handleWheel);
        elem.addEventListener("touchmove", this.handleSwipe);
        elem.addEventListener("touchstart", this.handleSwipeStart);
    },
    handleWheel: function (event) {
        if (this.state.showListView == true) {
            event.preventDefault();
        }

        if (this.isAnimating !== false) return;

        if (event.deltaY < 0) this.moveDown();
        if (event.deltaY > 0) this.moveUp();
    },
    handleSwipe: function (event) {
        if (this.state.showListView == true) {
            event.preventDefault();
        }
        if (this.isAnimating !== false) return;

        if (event.touches[0].screenY < this.startY) {
            this.moveUp();
        } else {
            this.moveDown();
        }
    },
    handleSwipeStart: function (event) {
        this.startY = event.touches[0].screenY;
    },
    chooseProjectOne: function () {
        this.moveUp();
    },
    moveUp: function () {
        if (this.props.projects == undefined) return;

        if (this.currentProjectIndex < this.props.projects.length - 1) {
            this.updateCurrentProject(this.props.projects[this.currentProjectIndex + 1].name);
        }
    },
    moveDown: function () {
        if (this.props.projects == undefined) return;

        if (this.currentProjectIndex > 0) {
            this.updateCurrentProject(this.props.projects[this.currentProjectIndex - 1].name);
        }

        if (this.currentProjectIndex == 0) {
            this.updateCurrentProject("");
        }
    },
    setAnimating: function () {
        this.isAnimating = true;
        this.setState({ "showIsAnimating": true });
    },
    setNotAnimating: function () {
        var self = this;

        this.timeout = setTimeout(function () {
            self.isAnimating = false;
            self.setState({ "showIsAnimating": false });
        }, this.animationDuration);
    },
    clickLeftIndividualProjectCarousel: function () {
        if (this.isAnimating === true) return;
        this.setAnimating();

        this.animationDirection = "movingLeft";
        var newIndex;

        if (this.state.animatedImageUrlIndex != 0) {
            newIndex = this.state.animatedImageUrlIndex - 1;
        } else {
            newIndex = this.state.currentProject.images.length - 1;
        }

        this.setState({ "animatedImageUrl": this.state.currentProject.images[newIndex] });
        this.setState({ "animatedImageUrlIndex": newIndex });

        this.setNotAnimating();
    },
    clickRightIndividualProjectCarousel: function () {
        if (this.isAnimating === true) return;
        this.setAnimating();

        this.animationDirection = "movingRight";
        var newIndex;

        if (this.state.animatedImageUrlIndex != this.state.currentProject.images.length - 1) {
            newIndex = this.state.animatedImageUrlIndex + 1;
        } else {
            newIndex = 0;
        }

        this.setState({ "animatedImageUrl": this.state.currentProject.images[newIndex] });
        this.setState({ "animatedImageUrlIndex": newIndex });

        this.setNotAnimating();
    },
    render: function () {

        var animatingStatusClass = classNames({
            "animating_active": this.state.showIsAnimating
        });

        var overallStatusClasses;

        if (this.props.imageReady == false) {
            overallStatusClasses = "imageLoadingView_active";
        } else if (this.state.showListView == true && this.currentProjectIndex == -1) {
            overallStatusClasses = "intialView_active";
        } else if (this.state.showListView == true && this.currentProjectIndex != -1) {
            overallStatusClasses = "projectListView_active";
        } else if (this.state.currentProject.images.length == 1) {
            overallStatusClasses = "projectDetailsView_active singleImageProject";
        } else {
            overallStatusClasses = "projectDetailsView_active";
        }

        if (this.state.showContactModal == true) {
            overallStatusClasses += " modalView_active";
        }

        return React.createElement(
            "div",
            { id: "mainView", className: overallStatusClasses },
            React.createElement(
                "div",
                { id: "animatingStatus", className: animatingStatusClass },
                React.createElement(
                    "div",
                    { id: "modalContactView", className: "active" },
                    React.createElement(
                        "div",
                        { className: "closeButton modalCloseButton", onClick: this.hideContactView },
                        React.createElement("i", { className: "fa fa-times fa-2x" })
                    ),
                    React.createElement(
                        "div",
                        { className: "modalContactViewText" },
                        "contact : willmelbourne@gmail.com",
                        React.createElement(
                            "a",
                            { href: "https://ca.linkedin.com/in/willmelbourne", target: "_blank" },
                            React.createElement(
                                "span",
                                { className: "circleBorder" },
                                React.createElement("i", { className: "fa fa-linkedin fa-lg" })
                            )
                        ),
                        React.createElement(
                            "a",
                            { href: "mailto:willmelbourne@gmail.com" },
                            React.createElement(
                                "span",
                                { className: "circleBorder" },
                                React.createElement("i", { className: "fa fa-envelope fa-lg" })
                            )
                        ),
                        React.createElement(
                            "a",
                            { href: "https://github.com/vancouverwill", target: "_blank" },
                            React.createElement(
                                "span",
                                { className: "circleBorder" },
                                React.createElement("i", { className: "fa fa-github-alt fa-lg" })
                            )
                        )
                    )
                ),
                React.createElement(
                    "p",
                    { id: "contactButton", className: "headerBarFont", onClick: this.showContactView },
                    "Contact"
                ),
                React.createElement(
                    "p",
                    { className: "headerBarFont projectClose", onClick: this.handleProjectListShow },
                    "Return to articles"
                ),
                React.createElement(
                    "div",
                    { className: "headerBar" },
                    " "
                ),
                React.createElement(
                    "div",
                    { id: "leftArrow__individualProjecCarousel", className: "arrow__individualProjecCarousel" },
                    React.createElement("i", { className: "fa fa-chevron-left", onClick: this.clickLeftIndividualProjectCarousel })
                ),
                React.createElement(
                    "div",
                    { id: "rightArrow__individualProjecCarousel", className: "arrow__individualProjecCarousel" },
                    React.createElement("i", { className: "fa fa-chevron-right", onClick: this.clickRightIndividualProjectCarousel })
                ),
                React.createElement(ProjectDetailsIntroView, { currentProject: this.state.currentProject }),
                React.createElement(
                    "div",
                    { className: "projectListView" },
                    React.createElement(ProjectAnimationContainer, { animationDirection: this.animationDirection, animationDuration: this.animationDuration, animatedImageUrl: this.state.animatedImageUrl }),
                    React.createElement(
                        "div",
                        { id: "projectListContainer" },
                        React.createElement(ProjectList, { projects: this.props.projects, selctProject: this.selctProject, handleProjectDetailsShow: this.handleProjectDetailsShow, chooseProjectOne: this.chooseProjectOne, imageReady: this.props.imageReady, currentProjectIndex: this.currentProjectIndex })
                    )
                ),
                React.createElement(
                    "div",
                    { className: "projectDetailsMainView" },
                    React.createElement(ProjectDetailsMainView, { currentProject: this.state.currentProject, handleProjectListShow: this.handleProjectListShow })
                )
            )
        );
    }
});

var ProjectAnimationContainer = React.createClass({
    displayName: "ProjectAnimationContainer",

    propTypes: {
        animatedImageUrl: React.PropTypes.string,
        animationDirection: React.PropTypes.string
    },
    getInitialState: function () {
        return {};
    },
    render: function () {
        var animateProject;

        if (this.props.animatedImageUrl != null) {
            var imageUrl = "url('" + this.props.animatedImageUrl + "')";
            var backgroundStyles = { "backgroundImage": imageUrl };

            animateProject = React.createElement(
                "div",
                { key: this.props.animatedImageUrl, className: "portfolioSlide" },
                React.createElement("div", { className: "slideImage", style: backgroundStyles }),
                React.createElement("div", { className: "slideImageOpacityOverlay" })
            );
        }

        return React.createElement(
            "div",
            { id: "portfolioProjectAnimationContainer", className: this.props.animationDirection },
            React.createElement(
                ReactCSSTransitionGroup,
                {
                    transitionName: "portfolioProjectAnimation",
                    transitionEnterTimeout: this.props.animationDuration,
                    transitionLeaveTimeout: this.props.animationDuration
                },
                animateProject
            )
        );
    }
});

var ProjectList = React.createClass({
    displayName: "ProjectList",

    propTypes: {
        currentProjectIndex: React.PropTypes.number,
        projects: React.PropTypes.array,
        imageReady: React.PropTypes.bool,
        selctProject: React.PropTypes.func,
        handleProjectDetailsShow: React.PropTypes.func,
        chooseProjectOne: React.PropTypes.func
    },
    selctProject: function (projectName) {
        this.props.selctProject(projectName);
    },
    handleProjectDetailsShow: function () {
        this.props.handleProjectDetailsShow();
    },
    chooseProjectOne: function () {
        this.props.chooseProjectOne();
    },
    componentWillUpdate: function () {

        if (this.props.projects !== undefined && this.props.currentProjectIndex !== -1) {

            var projectTitleHeight = 120;
            var projectTitleEmHeight = 12; // this has to be matched to the .projectTitle CSS height property so that the animation moves up relative to the length of the menu

            var verticalMovementInPixels = (this.props.currentProjectIndex + 0.5) * projectTitleHeight + 120;
            var verticalMovementInEm = (this.props.currentProjectIndex + 0.5) * projectTitleEmHeight;

            var projectTitles = document.getElementsByClassName('projectTitle');

            // var verticalMovementInPixels = projectTitles[this.props.currentProjectIndex].offsetTop - 80;

            // below code is to test out aligning from bottom of page

            var parentElement = projectTitles[this.props.currentProjectIndex].offsetParent;

            var tempOffSetHeight = parentElement.offsetHeight;

            var offSetTop = projectTitles[this.props.currentProjectIndex].offsetTop;

            var offsetBottom = parentElement.offsetHeight - projectTitles[this.props.currentProjectIndex].offsetTop - 80;

            // this.verticalMovement = {transform: "translateY(-" + verticalMovementInEm +  "em)"};
            // this.verticalMovement = {transform: "translateY(-" + verticalMovementInPixels +  "px)"};
            this.verticalMovement = { top: "-" + verticalMovementInPixels + "px" };

            // this.verticalMovement = {bottom: "+" + verticalMovementInPixels +  "px"};
        } else {
                // this.verticalMovement = {transform: "translateY(-" + 0 +  "px)"};
                this.verticalMovement = { top: "-" + 0 + "px" };
                //

                // below code is to test out aligning from bottom of page

                var menu = document.getElementById("projectList");
                var menuHeight = menu.offsetHeight;

                var containers = document.getElementsByClassName("projectListView");
                var containersHeight = containers[0].offsetHeight;

                var displacementFromBottom = menu.offsetHeight - containers[0].offsetHeight;

                // this.verticalMovement = {bottom: "" + displacementFromBottom +  "px"};
            }
    },
    componentDidUpdate: function () {
        if (this.props.projects !== undefined && this.props.currentProjectIndex == -1) {
            console.log("testing for projects loading, this would be the place to switch to bottom css positioning");
        }
    },
    render: function () {
        var loop;

        if (this.props.projects !== undefined && this.props.imageReady == true) {
            loop = this.props.projects.map(function (project) {
                return React.createElement(ProjectName, { key: project.name, name: project.name, active: project.active, fontColor: project.fontColor, shortDescription: project.shortDescription, selctProject: this.selctProject, handleProjectDetailsShow: this.handleProjectDetailsShow });
            }, this);
        }

        return React.createElement(
            "div",
            { id: "projectList", style: this.verticalMovement },
            React.createElement(
                "p",
                { className: "introExplainingText" },
                "scroll down to view some of the key projects ",
                React.createElement("i", { className: "fa fa-arrow-down introText__arrow", onClick: this.chooseProjectOne })
            ),
            React.createElement(
                "div",
                { className: "text-center loadingState" },
                React.createElement("i", { className: "fa fa-spinner fa-pulse fa-5x" }),
                React.createElement(
                    "h3",
                    null,
                    "projects loading"
                )
            ),
            React.createElement(
                "div",
                { id: "projectListMenu" },
                loop
            )
        );
    }
});

var ProjectName = React.createClass({
    displayName: "ProjectName",

    propTypes: {
        name: React.PropTypes.string,
        shortDescription: React.PropTypes.string,
        active: React.PropTypes.bool,
        selctProject: React.PropTypes.func,
        handleProjectDetailsShow: React.PropTypes.func
    },
    selctProject: function () {
        this.props.selctProject(this.props.name);
    },
    handleProjectDetailsShow: function () {
        this.props.handleProjectDetailsShow();
    },
    render: function () {
        var classes = classNames({
            "active": this.props.active,
            "projectTitle": true
        });

        var fontColor;
        if (this.props.active == true) {
            fontColor = { "color": this.props.fontColor };
        }

        return React.createElement(
            "div",
            { className: classes },
            React.createElement(
                "h4",
                { onClick: this.selctProject, style: fontColor },
                this.props.name
            ),
            React.createElement("p", { className: "projectShortDescription", dangerouslySetInnerHTML: { __html: this.props.shortDescription } }),
            React.createElement(
                "p",
                { className: "arrowSeeProjectDetails", onClick: this.handleProjectDetailsShow },
                "Read More  ",
                React.createElement("i", { className: "fa fa-arrow-right " })
            )
        );
    }
});

var ProjectDetailsIntroView = React.createClass({
    displayName: "ProjectDetailsIntroView",

    propTypes: {
        currentProject: React.PropTypes.object
    },
    render: function () {
        if (this.props.currentProject === undefined) {
            return React.createElement("div", { className: "projectDetailsIntroView" });
        } else {
            return React.createElement(
                "div",
                { className: "projectDetailsIntroView" },
                React.createElement(
                    "h2",
                    null,
                    this.props.currentProject.name
                ),
                React.createElement("p", { dangerouslySetInnerHTML: { __html: this.props.currentProject.shortDescription } })
            );
        }
    }
});

var ProjectDetailsMainView = React.createClass({
    displayName: "ProjectDetailsMainView",

    propTypes: {
        currentProject: React.PropTypes.object,
        handleProjectListShow: React.PropTypes.func
    },
    handleProjectListShow: function () {
        this.props.handleProjectListShow();
    },
    render: function () {
        if (this.props.currentProject === undefined) {
            return React.createElement("div", null);
        } else {
            return React.createElement(
                "div",
                { key: this.props.currentProject.name, className: "projectDetailsContent" },
                React.createElement(
                    "span",
                    { className: "pointer" },
                    React.createElement(
                        "i",
                        { className: "fa fa-arrow-up", onClick: this.handleProjectListShow },
                        "Back to Projects"
                    )
                ),
                React.createElement(
                    "h2",
                    null,
                    this.props.currentProject.name
                ),
                React.createElement("p", { dangerouslySetInnerHTML: { __html: this.props.currentProject.description } })
            );
        }
    }
});

ReactDOM.render(React.createElement(PageLoadingClass, { url: apiUrl }), document.getElementById("container"));
//# sourceMappingURL=portfolio.js.map