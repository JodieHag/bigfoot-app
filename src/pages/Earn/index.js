import React, {useState, useEffect} from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import {
  Container,
  Row,
  Button,
  Col,
  Card,
  CardBody,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Input,
  Form,
  FormGroup,
  InputGroup,
} from "reactstrap"

import lendingOptions from '../../data/lendingOptions'
import Web3Class from '../../helpers/bigfoot/Web3Class'
import { addressBfBNB } from '../../data/addresses/addresses'

const Earn = props => {

  // initialize wallet variables
  const web3 = props.walletData.web3;
  const userAddress = props.walletData.accounts?.[0];

  const web3Instance = new Web3Class(web3, userAddress);

  const [options, setOptions] = useState(lendingOptions);
  const [isModalOpen, setisModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    option: '', // lending option chosen by the user (defined by option.title)
    action: '', // supply,withdraw
    amount: 0,
  });
  const [supplyBalance, setSupplyBalance] = useState(0);

  useEffect( async () => {
    if(web3) {
      updateSupplyBalance();
    }
  }, [web3]);

  const updateSupplyBalance = async () => {
    const bnbPrice = await web3Instance.getBnbPrice();
    const userBalanceBfbnb = await web3Instance.getUserBalance(addressBfBNB);
    const bfbnbStaked = await web3Instance.getStakedCoins(79); // bfbnb pool id: 79
    const totalUserBalanceUsd = ( parseFloat(userBalanceBfbnb) + parseFloat(bfbnbStaked) ) * bnbPrice;
    setSupplyBalance( totalUserBalanceUsd.toFixed(2) );
  }
  
  const togglemodal = (option = '', action = '') => {
    setFormData({
      option: option,
      action: action,
      amount: 0
    });
    setisModalOpen(!isModalOpen);
  }

  const updateAmount = (value) => {
    let newFormData = {...formData};
    newFormData.amount = value
    setFormData(newFormData);
  }

  const renderFormContent = () => {

    const selectedOption = options.find( option => option.title === formData.option);
    const {title = '', currency = '', icon = ''} = selectedOption || {};
    
    if (formData.action === 'supply') {
      return (
        <React.Fragment>
          <p>I'd like to supply...</p>
          <FormGroup>
            <Row>
              <Col sm="6" lg="8">
                <InputGroup className="mb-3">
                  <Label className="input-group-text">
                    <div className="avatar-xs me-3">
                      <span className={"avatar-title rounded-circle bg-transparent"} >
                        <img src={icon.default} />
                      </span>
                    </div>
                    {currency}
                  </Label>
                  <Input 
                    type="number" 
                    className="form-control" 
                    min={0}
                    step={0.000001}
                    value={formData.amount} 
                    onChange={(e) => updateAmount(e.target.value)}/>
                </InputGroup>
              </Col>
              <Col sm="6" lg="4" className="max-balance-wrapper text-end">
                <span className="me-3">
                  Balance: 0.0000
              </span>
                <Button
                  outline
                  color="primary"
                  onClick={() => {
                    console.log("set max.")
                  }}
                >
                  MAX
              </Button>
              </Col>
            </Row>
          </FormGroup>
        </React.Fragment>
      );
    } else if (formData.action === 'withdraw') {
      return (
        <React.Fragment>
          <p>I'd like to withdraw...</p>
          <FormGroup>
            <Row>
              <Col sm="6" lg="8">
                <InputGroup className="mb-3">
                  <Label className="input-group-text">
                    <div className="avatar-xs me-3">
                      <span className={"avatar-title rounded-circle bg-transparent"} >
                        <img src={icon.default} />
                      </span>
                    </div>
                    {title}
                  </Label>
                  <Input 
                    type="number" 
                    className="form-control" 
                    min={0}
                    step={0.000001}
                    value={formData.amount}
                    onChange={(e) => updateAmount(e.target.value)}/>
                </InputGroup>
              </Col>
              <Col sm="6" lg="4" className="max-balance-wrapper text-end">
                <span className="me-3">
                  Balance: 0.0000
              </span>
                <Button
                  outline
                  color="primary"
                  onClick={() => {
                    console.log("set max.")
                  }}
                >
                  MAX
                </Button>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col xs="12">
                <p>
                  You will get {currency}: xxx
                </p>
              </Col>
            </Row>
          </FormGroup>
        </React.Fragment>
      );
    }
  }

  const renderButtons = (option) => {
    return (
      <>
        <div className="mb-2">
          <Link
            to="#"
            className="btn btn-primary btn-sm w-xs"
            onClick={() => togglemodal(option.title, 'supply')}
          >
            Supply
          </Link>
        </div>
        <div>
          <Link
            to="#"
            className="btn btn-primary btn-sm w-xs"
            onClick={() => togglemodal(option.title, 'withdraw')}
          >
            Withdraw
          </Link>
        </div>
      </>
    );
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>

          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <h4 className="card-title">
                    <i className="mdi mdi-information-variant text-primary h1" />
                    Your info
                  </h4>

                  <Row className="text-center mt-3">
                    <Col sm="12">
                      <div>
                        <p className="mb-2">Supply Balance</p>
                        <p className="total-value">$ {supplyBalance}</p>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xl="12">
              <Card>
                <CardBody>
                  <h4 className="card-title">
                    <i className="mdi mdi-rocket-launch text-primary h1"/>
                    Lending
                  </h4>

                  <div className="table-responsive">
                    <Table className="table table-nowrap align-middle text-center mb-0">
                      <thead>
                        <tr>
                          <th scope="col"></th>
                          <th scope="col">APY</th>
                          <th scope="col">Total Supply</th>
                          <th scope="col">Total Borrow</th>
                          <th scope="col">Utilization</th>
                          <th scope="col">Balance</th>
                          <th scope="col"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {options.map((option, key) => (
                          <tr key={key}>
                            <th scope="row">
                              <div className="d-flex align-items-center">
                                <div className="avatar-xs me-3">
                                  <span className={"avatar-title rounded-circle bg-transparent"} >
                                    <img src={option.icon.default} />
                                  </span>
                                </div>
                                <span>{option.title}</span>
                              </div>
                            </th>
                            <td>
                              <div>
                                {option.isComingSoon ? "" : `${option.apy} %` }
                              </div>
                            </td>
                            <td>
                              <h5 className="font-size-14 mb-1">
                                {option.isComingSoon ? "" : `${option.supply} ${option.currency}` }
                              </h5>
                              <div className="text-muted">
                                {option.isComingSoon ? "" : `($${option.supplyInDollars})` }
                              </div>
                            </td>
                            <td>
                              <h5 className="font-size-14 mb-1">
                                {option.isComingSoon ? "" : `${option.borrow} ${option.currency}` }
                              </h5>
                              <div className="text-muted">
                                {option.isComingSoon ? "" : `($${option.borrowInDollars})` }
                              </div>
                            </td>
                            <td>
                              <h5 className="font-size-14 mb-1">
                                {option.isComingSoon ? "" : `${option.utilization} %` }
                              </h5>
                            </td>
                            <td>
                              <h5 className="font-size-14 mb-1">
                                {option.isComingSoon ? "" : `${option.balance} ${option.currency}` }
                              </h5>
                            </td>
                            <td style={{ width: "120px" }}>
                              {option.isComingSoon ? "Coming Soon" : renderButtons(option) }
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </CardBody>

                <Modal
                  isOpen={isModalOpen}
                  role="dialog"
                  size="lg"
                  autoFocus={true}
                  centered={true}
                  toggle={() => togglemodal()}
                >
                  <div className="modal-content">
                    <ModalHeader toggle={() => togglemodal()}>
                      <span className="text-capitalize">
                        {formData.action}: 
                      </span>
                      &nbsp;
                      {formData.option}
                    </ModalHeader>
                    <ModalBody>
                      <div
                        className="wizard clearfix"
                      >
                        <div className="content clearfix">
                          <Form>
                            {renderFormContent()}
                            <p>
                              Note: BigFoot is a leveraged yield farming/liquidity providing product. There are risks involved when using this product. Please read <a href="#">here</a> to understand the risks involved.
                            </p>
                          </Form>
                        </div>
                        <div className="actions clearfix">
                          <ul role="menu" aria-label="Pagination">
                            <li
                              className={"previous disabled"}
                            >
                              <Link
                                to="#"
                                onClick={() => {
                                  console.log("cancel...")
                                }}
                              >
                                Cancel
                              </Link>
                            </li>
                            <li
                              className={"next"}
                            >
                              <Link
                                to="#"
                                onClick={() => {
                                  console.log("confirm...")
                                }}
                              >
                                Confirm
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </ModalBody>
                  </div>
                </Modal>
              </Card>
            </Col>
          </Row>

        </Container>
      </div>
    </React.Fragment>
  )
}

const mapStateToProps = state => {
  return {
    walletData: state.wallet.walletData,
  }
}

export default connect(mapStateToProps, {} )(Earn);