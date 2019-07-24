import React from 'react'
import { Icon, Badge, Dropdown, Menu, Modal } from 'antd'
import screenfull from 'screenfull'
import { Link, withRouter } from 'react-router-dom'
import { isAuthenticated } from '../../utils/Session'
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withNamespaces } from 'react-i18next';
import merge from 'lodash/merge';
import keys from 'lodash/keys';
import {bindActionCreators} from 'redux';

import {  LoginOut }  from  '../../action/actions';
const values = require('lodash/values');
const EntityLabels = require('../../constants/entities');
function mapStateToProps(state, ownProps) {
  const entities= state['entities'];

  const tokenEntity = entities[EntityLabels.token];
  const token = tokenEntity && values(tokenEntity) && values(tokenEntity)[0];
  console.log('tokentoken'+ JSON.stringify(token))
  return {
    token
  };
}

function mapDispatchToProps(dispatch) {
  const actions = {

    LoginOut
  };
  return bindActionCreators(actions, dispatch);
}

@connect(
    mapStateToProps, mapDispatchToProps
)
@withRouter
//withRouter一定要写在前面，不然路由变化不会反映到props中去
class HeaderBar extends React.Component {
  state = {
    icon: 'arrows-alt',
    count: 100,
    visible: false,
    avatar: require('./img/04.jpg')
  }

  componentDidMount () {
    screenfull.onchange(() => {
      this.setState({
        icon: screenfull.isFullscreen ? 'shrink' : 'arrows-alt'
      })
    })
  }

  componentWillUnmount () {
    screenfull.off('change')
  }

  toggle = () => {
    this.props.onToggle()
  }
  screenfullToggle = () => {
    if (screenfull.enabled) {
      screenfull.toggle()
    }
  }
  logout = () => {

    console.log('this.props.location'+JSON.stringify(this.props.location))
    // this.props.appStore.toggleLogin(false)
    this.props.LoginOut();
  }

  render () {
    const {icon, count, visible, avatar} = this.state
    const {token, collapsed, location} = this.props
    const notLogin = (
      <div>
        <Link to={{pathname: '/login', state: {from: location}}} style={{color: 'rgba(0, 0, 0, 0.65)'}}>登录</Link>&nbsp;
        <img src={require('../../assets/img/defaultUser.jpg')} alt=""/>
      </div>
    )
    const menu = (
      <Menu className='menu-content' theme="dark">
        <Menu.ItemGroup title='用户中心' className='menu-group'>
          <Menu.Item>你好 - {token && token.username}</Menu.Item>
          <Menu.Item>个人信息</Menu.Item>
          <Menu.Item><span onClick={this.logout}>退出登录</span></Menu.Item>
        </Menu.ItemGroup>
        <Menu.ItemGroup title='设置中心' className='menu-group'>
          <Menu.Item>个人设置</Menu.Item>
          <Menu.Item>系统设置</Menu.Item>
        </Menu.ItemGroup>
      </Menu>
    )
    const login = (
      <Dropdown overlay={menu}>
        <img onClick={() => this.setState({visible: true})} src={avatar} alt=""/>
      </Dropdown>
    )
    return (
      <div id='headerbar'>
        <Icon
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          className='trigger'
          onClick={this.toggle}/>


        { menu }
        <div style={{lineHeight: '64px', float: 'right'}}>
          <ul className='header-ul'>
            <li><Icon type={icon} onClick={this.screenfullToggle}/></li>
            <li onClick={() => this.setState({count: 0})}>
              <Badge count={true ? count : 0} overflowCount={99} style={{marginRight: -17}}>
                <Icon type="notification"/>
              </Badge>
            </li>
            <li>
              {token ? login : notLogin}
            </li>
          </ul>
        </div>
        <Modal
          footer={null} closable={false}
          visible={visible}
          wrapClassName="vertical-center-modal"
          onCancel={() => this.setState({visible: false})}>
          <img src={avatar} alt="" width='100%'/>
        </Modal>
      </div>
    )
  }
}

export default HeaderBar