import React from 'react';
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';

class ProfileIcon extends React.Component {
    constructor(props){
        super(props);
        this.state={
            dropDownOpen: false
        }
    }

    toggle=()=>{
        this.setState(prevState=>({
            dropDownOpen: !prevState.dropDownOpen
        }))
    }

    onSignOut=()=>{
        const token=window.sessionStorage.getItem('token');
        fetch('https://organicblis.com/node/signout',{
            method: 'put',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': token
            }})
        window.sessionStorage.removeItem('token');
        this.props.onRouteChange('signout');
    }

    render(){
        return(
            <div className='pa-4 tc'>
                <div className="d-flex justify-content-center p-5">
                    <Dropdown isOpen={this.state.dropDownOpen} toggle={this.toggle}>
                        <DropdownToggle
                            data-toggle="dropdown"
                            tag="span"
                        >
                            <img
                                src="http://tachyons.io/img/logo.jpg"
                                className="br-100 ba h3 w3 dib" alt="avatar"/>
                        </DropdownToggle>
                        <DropdownMenu 
                            className='b--transparent shadow-5'
                            style={{marginTop: '20px', backgroundColor: 'rgba(255, 255, 255, 0.5)'}}>
                            <DropdownItem onClick={this.props.toggleModal}>View Profile</DropdownItem>
                            <DropdownItem onClick={this.onSignOut}>Sign Out</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
                
            </div>
        )
    }
}

export default ProfileIcon;