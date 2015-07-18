
var Container = React.createClass({
            getInitialState: function() {
              return {
                title: "Submit TimeSheet",
                projects: projects,
                currentProject : projects[0],
                previousProject : null,
                animating : false
              };
            },
            updateCurrentProject: function(projectName) {
              console.log("updateCurrentProject " + projectName)
              this.setState({"animating" : true})
              for (var i = 0; i < this.state.projects.length; i++) {
                if (this.state.projects[i].name == projectName) {
                  console.log(this.state.projects[i])
                  this.setState({"previousProject" : this.state.currentProject});
                  this.setState({"currentProject" : this.state.projects[i]});
                  this.state.projects[i].active = true;
                  console.log(this.state.projects[i])
                  // delete projects[i]
                  
                  // break;
                } else {
                  this.state.projects[i].active = false;
                }
              }
              this.setState(projects);

              var self = this;
              this.timeout = setTimeout(function(){ 
                self.setState({"animating" : false}) 
              }, 2000);
            },
            render: function() {
              if (this.state.animating) {
                var animatingSentence = "animation : in progress"
              }
              else {
                var animatingSentence = "animation : static"
              }
               
              return (
                <div id="mainView"> 
                  <p>{this.state.title}</p>
                  <p>{animatingSentence}</p>
                  <p>currentProject {this.state.currentProject}</p>
                  <p>previousProject {this.state.previousProject}</p>
                  <ProjectList projects={this.state.projects} clickCurrentProject={this.updateCurrentProject}></ProjectList>
                   <ProjectViews projects={this.state.projects} currentProject={this.state.currentProject}></ProjectViews>
                </div>

              );
            }
        });


         var ProjectList = React.createClass({
            getInitialState: function() {
                return {
                    projects : []
                };
            },
            handleProjectShow: function(projectName) {
              console.log(projectName);
              this.props.clickCurrentProject(projectName);
              console.log(this.props.projects);
            },
            render: function() {
                console.log(this.props)
                var loop = this.props.projects.map(function (e) {
                      return (
                            <ProjectName name={e.name} active={e.active} handleProjectShow={this.handleProjectShow}></ProjectName>
                        );
                    }, this);
                return (
                    <div id="ProjectList">
                        <h3>Project List</h3>
                        {loop}
                    </div>
            );
            }
         });

         var ProjectName = React.createClass({
            handleProjectShow: function() {
              // console.log(this.props.name);
              this.props.handleProjectShow(this.props.name);
            },
            render: function() {
              var temp = React;
              var cx = React.addons.classSet;
              var classes = cx({
                'active': this.props.active,
                'project-title' : true
              });
              return (
                <h4 className={classes} onClick={this.handleProjectShow}>
                  project - {this.props.name} {this.props.active
                  }</h4>
                )
            }
         });

         var ProjectViews = React.createClass({
            getInitialState: function() {
                return {
                };
            },
            render: function() {
              

                // else {
                //   var imageUrl = "none";
                //   var imageUrl = "url('images/italy1.jpg')";
                // }
                // console.log("imageUrl")
                // console.log(imageUrl)

                  
                  var projectsLoop = this.props.projects.map(function (project) {

                    // if (this.props.currentProject.images !== undefined && this.props.currentProject.images[0]) {
                    if (project.images !== undefined && project.images[0]) {
                      console.log("not undefined")
                      // this.setState({imageUrl : this.props.currentProject.images[0]})

                      var imageUrl = "url('images/" + project.images[0] + "')";

                      console.log("imageUrl")
                      console.log(imageUrl)
                      var backgroundStyles = {"backgroundImage" : imageUrl}
                    }

                    if (this.props.currentProject.name == project.name) {
                      var temp = React;
                      var cx = React.addons.classSet;
                      var classes = cx({
                        'active': true, 
                        'opacityShow' : true,
                        'opacityTransition' : true
                      });
                    }
                    else {
                      var temp = React;
                      var cx = React.addons.classSet;
                      var classes = cx({
                        'active': false, 
                        'opacityHide' : true,
                        'opacityTransition' : true
                      });
                    }



                      return (
                            <div id="ProjectView__p" style={backgroundStyles} className={classes} class="projectView">
                              <p>current project :{project.currentProject}</p>
                              <p>color {project.color} </p>
                              <p>image  {project}</p>
                            </div>
                        );
                    }, this);


              return (
                                <div id="ProjectViews_container__p">
                  {projectsLoop} 
                </div>
              );
            }
         });


        React.render(
          <Container />,
        document.getElementById('container')
      );