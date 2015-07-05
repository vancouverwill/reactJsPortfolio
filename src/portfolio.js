
var Container = React.createClass({
            getInitialState: function() {
              return {
                title: "Submit TimeSheet",
                projects: projects,
                currentProject : projects[0]
              };
            },
            updateCurrentProject: function(projectName) {
              console.log("updateCurrentProject " + projectName)
              for (var i = 0; i < this.state.projects.length; i++) {
                if (this.state.projects[i].name == projectName) {
                  console.log(this.state.projects[i])
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
            },
            render: function() {
              return (
                <div id="mainView">
                  <p>{this.state.title}</p>
                  <ProjectList projects={this.state.projects} clickCurrentProject={this.updateCurrentProject}></ProjectList>
                   <ProjectView currentProject={this.state.currentProject}></ProjectView>
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
                        <p>Project List</p>
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
                <h3 className={classes} onClick={this.handleProjectShow}>
                  project - {this.props.name} {this.props.active
                  }</h3>
                )
            }
         });

         var ProjectView = React.createClass({
            getInitialState: function() {

                return {
                };
            },
            render: function() {
              if (this.props.currentProject.images !== undefined && this.props.currentProject.images[0] ) {
                  console.log("not undefined")
                  // this.setState({imageUrl : this.props.currentProject.images[0]})

                  var imageUrl = "url('images/" + this.props.currentProject.images[0] + "')";

                  console.log("imageUrl")
                console.log(imageUrl)
                }

                // else {
                //   var imageUrl = "none";
                //   var imageUrl = "url('images/italy1.jpg')";
                // }
                console.log("imageUrl")
                console.log(imageUrl)

                  var backgroundStyles = {"background-image" : imageUrl}

              return (
                <div id="ProjectView__p" style={backgroundStyles}>
                  <p>current project :{this.props.currentProject}</p>
                  <p>color {this.props.currentProject.color} </p>
                  <p>image  {imageUrl}</p>
                </div>
              );
            }
         });


        React.render(
          <Container />,
        document.getElementById('container')
      );