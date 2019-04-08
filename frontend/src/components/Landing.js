import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardImg,
  CardTitle,
  CardBody,
  CardText,
  Button
} from 'reactstrap';

import './CSS/LandingStyle.css';
import ArrowButton from '../images/arrow-button.svg';
import ManagementPic from '../images/management.jpg';
import VirtualizationPic from '../images/virtualization.jpg';
import NavigationPic from '../images/navigation.jpg'

class Landing extends Component {
  render() {
    return (<div>
      <Container style={{marginTop: "8rem"}}>
        <Row>
          <h3 className="headline"> Ho Chi Minh University of Technology </h3>
        </Row>
        <Row className="mb-5">
          <h4 className="sub-headline">Graduation Thesis</h4>
        </Row>

        <Row>
          <Col md="4">
            <Card>
              <CardImg top width="100%" height="10vw" src={ManagementPic} />
              <CardBody>
                <CardTitle>Management</CardTitle>
                <CardText>Some quick example text to build on the card title and make up the bulk of the card's content.</CardText>
                <Button href="/management" right="true"><img className="arrow-btn" src={ArrowButton} alt=""></img></Button>
              </CardBody>
            </Card>
          </Col>

          <Col md="4">
            <Card>
              <CardImg top width="100%" height="10vw" src={NavigationPic} />
              <CardBody>
                <CardTitle>Navigation</CardTitle>
                <CardText>Some quick example text to build on the card title and make up the bulk of the card's content.</CardText>
                <Button right="true"><img className="arrow-btn" src={ArrowButton} alt=""></img></Button>
              </CardBody>
            </Card>
          </Col>

          <Col md="4">
            <Card>
              <CardImg top width="100%" height="10vw" src={VirtualizationPic} />
              <CardBody>
                <CardTitle>Virtualization</CardTitle>
                <CardText>Some quick example text to build on the card title and make up the bulk of the card's content.</CardText>
                <Button right="true"><img className="arrow-btn" src={ArrowButton} alt=""></img></Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <footer className="footer-distributed">
        <div className="footer-left">
          <h3>Company<span>logo</span></h3>

          <div className="footer-links">
            <div>Thesis.</div>
          </div>

          <p className="footer-company-name">HCMUT &copy; 2019</p>
        </div>

        <div className="footer-center">
          <div>
            <i className="fa fa-map-marker"></i>
            <p><span>268 Lý Thường Kiệt, Phường 14, Quận 10</span> Hồ Chí Minh</p>
          </div>

          <div>
            <i className="fa fa-phone"></i>
            <p>+033 378 2879</p>
          </div>

          <div>
            <i className="fa fa-envelope"></i>
            <p><a href="mailto:support@company.com">tdcnguyen1997@gmail.com</a></p>
          </div>
        </div>

        <div className="footer-right">
          <p className="footer-company-about">
            <span>About the thesis</span>
            Lorem ipsum dolor sit amet, consectateur adispicing elit. Fusce euismod convallis velit, eu auctor lacus vehicula sit amet.
            </p>

          <div className="footer-icons">
            <a href="#"><i className="fa fa-facebook"></i></a>
            <a href="#"><i className="fa fa-twitter"></i></a>
            <a href="#"><i className="fa fa-linkedin"></i></a>
            <a href="#"><i className="fa fa-github"></i></a>
          </div>
        </div>
      </footer>
    </div>
    );
  }
}
export default Landing;