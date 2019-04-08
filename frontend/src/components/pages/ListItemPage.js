import React, { Component } from 'react';
import {Container} from 'reactstrap';


import ItemModal from '../ItemModal';
import MyItemList from '../MyItemList';

export default class ListItemPage extends Component {
  render() {
    return (
      <div>
        <Container>
            <ItemModal/>
            <MyItemList/>
        </Container>
      </div>
    )
  }
}

