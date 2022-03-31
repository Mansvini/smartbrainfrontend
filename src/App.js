import React, {Component} from 'react';
import Navigation from './components/Navigation/Navigation';
import Register from './components/Register/Register';
import Signin from './components/Signin/Signin';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particles from 'react-tsparticles';
import Modal from './components/Modal/Modal';
import Profile from './components/Profile/Profile';
import './App.css';

const particlesOptions={
  background: {
    color: {
      value: "",
    },
  },
  fpsLimit: 60,
  interactivity: {
    events: {
      onClick: {
        enable: true,
        mode: "push",
      },
      onHover: {
        enable: true,
        mode: "repulse",
      },
      resize: true,
    },
    modes: {
      bubble: {
        distance: 400,
        duration: 2,
        opacity: 0.8,
        size: 40,
      },
      push: {
        quantity: 4,
      },
      repulse: {
        distance: 130,
        duration: 1.0,
      },
    },
  },
  particles: {
    color: {
      value: "#ffffff",
    },
    links: {
      color: "#ffffff",
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 1.0,
    },
    collisions: {
      enable: true,
    },
    move: {
      direction: "none",
      enable: true,
      outMode: "bounce",
      random: false,
      speed: 1,
      straight: false,
    },
    number: {
      density: {
        enable: false,
        area: 800,
      },
      value: 70,
    },
    opacity: {
      value: 0.5,
    },
    shape: {
      type: "circle",
    },
    size: {
      random: true,
      value: 2,
    },
  },
  detectRetina: true,
}

const initialState={
  input:'',
  imageUrl:'',
  boxes:[],
  route: 'signin',
  isSignedIn: false,
  isProfileOpen: false,
  user:{
    id:'',
    name:'',
    email:'',
    entries:0,
    joined:'',
    pet:'',
    age:''
  }
}

class App extends Component {
  constructor(){
    super();
    this.state=initialState;
  }

  componentDidMount(){
    const token= window.sessionStorage.getItem('token');
    if (token){
      fetch('https://organicblis.com/node/signin', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      })
      .then(resp=>resp.json())
      .then(data=>{
        if(data && data.id){
          this.fetchUserFromId(token, data.id);
        }
      })
      .catch(console.log)
    }
  }

  fetchUserFromId=(token, id)=>{
    fetch(`https://organicblis.com/profile/${id}`,{
      method: 'get',
      headers: {
      'Content-Type': 'application/json',
      'Authorization': token
      }
    })
    .then(resp=>resp.json())
    .then(user=>{
      if(user && user.email){
      this.loadUser(user);
      this.onRouteChange('home');
      }
    })
}

  onImageInputChange=(event)=>{
    this.setState({input:event.target.value});
  }

  onPictureSubmit=()=>{
    this.setState({imageUrl:this.state.input});
    fetch('https://organicblis.com/node/imageurl',{
          method:'post',
          headers: {'Content-Type': 'application/json',
                    'Authorization': window.sessionStorage.getItem('token')
                    },
          body: JSON.stringify({
            input: this.state.input
          })
        })
      .then(response=>response.json())
        .then(response=> {
          if(response){
          fetch('https://organicblis.com/node/image',{
            method:'put',
            headers: {'Content-Type': 'application/json',
                      'Authorization': window.sessionStorage.getItem('token')
                      },
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
          .then(response=>response.json())
          .then(count=>{
            this.setState(Object.assign(this.state.user, {entries: count}))
          })
          .catch(console.log)
          }
        this.displayFaceBox(this.calculateFaceLocations(response))
      })
      .catch(err=>console.log(err));
  }

  loadUser=(data)=>{
    this.setState({user:{
      id:data.id,
      name:data.name,
      email:data.email,
      entries:data.entries,
      joined:data.joined,
      age: data.age,
      pet:data.pet
    }})
  }

  calculateFaceLocations=(data)=>{
    if(data && data.outputs){
      const image=document.getElementById('inputimage');
      const width=Number(image.width);
      const height=Number(image.height);
      const faceRegions=data.outputs[0].data.regions;
      const clarifaiFaces=faceRegions.map(region=>{
        return region.region_info.bounding_box;
      })
      const boxes=clarifaiFaces.map(bounding_box=>{
        return{
          leftCol: bounding_box.left_col * width,
          rightCol: width - (bounding_box.right_col * width),
          topRow: bounding_box.top_row * height,
          bottomRow: height - (bounding_box.bottom_row * height)
        }
      })
      return boxes;
    }
    return;
  }

  displayFaceBox=(boxes)=>{
    if(boxes){
      this.setState({boxes:boxes})
    }
  }

  onRouteChange =(route) =>{
    if(route==='signout'){
      return this.setState(initialState)
    } else if(route==='home'){
      this.setState({isSignedIn:true})
    }
    this.setState({route: route});
  }

  toggleModal=()=>{
    this.setState(prevState=>({
      ...prevState,
      isProfileOpen: !prevState.isProfileOpen
    }))
  }

  render(){
    const {isSignedIn, imageUrl, route, boxes, isProfileOpen, user}= this.state;
    return (
      <div className="App">
        <Particles id="tsparticles"
          className="particless"
          options={particlesOptions}
        />
        <Navigation 
          onRouteChange={this.onRouteChange} 
          isSignedIn={isSignedIn}
          toggleModal={this.toggleModal}/>
        {isProfileOpen &&
          <Modal>
            <Profile 
              toggleModal={this.toggleModal}
              user={user}
              loadUser={this.loadUser}
            />
          </Modal>
        }
        {route==='home' 
        ? <div>
            <Logo/>
            <Rank 
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm 
              onImageInputChange={this.onImageInputChange} 
              onPictureSubmit={this.onPictureSubmit}
            />
            <FaceRecognition 
              imageUrl={imageUrl}
              boxes={boxes}
            />
          </div>
        : (route==='register'
          ? <Register 
              fetchUserFromId={this.fetchUserFromId}
            />
          : <Signin
              loadUser={this.loadUser}
              onRouteChange={this.onRouteChange}
              fetchUserFromId={this.fetchUserFromId}
            />
          )
        }
      </div>
    );
  }
}

export default App;
