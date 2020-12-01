import React, { Component } from "react"
import './home.css'
import { Layout, Menu } from 'antd'
import {
    HomeOutlined, ShoppingOutlined, AccountBookOutlined, SettingOutlined,
    TeamOutlined, TransactionOutlined, UserAddOutlined, ShopOutlined
} from '@ant-design/icons'
import { Route, NavLink, Redirect } from 'react-router-dom'
import HomeIndex from '../homeIndex/HomeIndex'
import Goods from '../goods/Goods'
import Order from '../order/Order'
import Employee from '../employee/Employee'
import Setting from '../setting/Setting'
import Cashier from '../cashier/Cashier'
import Custom from '../custom/Custom'
import Spell from '../spell/Spell'
import { connect } from 'react-redux'

const { Content, Sider } = Layout
const { SubMenu } = Menu

class Home extends Component {
    state = {
        merchantName: null
    }

    // 退出登录
    loginOut = () => {
        this.props.history.push({
            pathname: '/login'
        })
    }

    componentDidMount() {
        const merchantName = JSON.parse(localStorage.getItem('user')).merchantName
        this.setState({ merchantName })
    }

    render = () => {
        const { userInfo } = this.props
        const { merchantName } = this.state
        return (
            <div className="home">
                <Layout>
                    <Sider
                        style={{
                            overflow: 'auto',
                            height: '100vh',
                            position: 'fixed',
                            left: 0,
                            background: 'white',
                            fontWeight: 700
                        }}
                        width={250}
                    >
                        <div className="header">
                            <img src={require('../../assets/imgs/logo.png')} className="header-image" alt="图标"></img>
                            <h2>博客云商家版</h2>
                        </div>
                        <Menu theme="light" mode="inline" defaultSelectedKeys={['1']} style={{textAlign: 'center'}}>
                            <Menu.Item key="1" icon={<HomeOutlined />}>
                                <NavLink to='/home/homeindex'>
                                    <span className='nav-span'>首页</span>
                                </NavLink>
                            </Menu.Item>
                            <Menu.Item key="2" icon={<TransactionOutlined />}>
                                <NavLink to='/home/cashier'>
                                    <span  className='nav-span'>收银管理</span>
                                </NavLink>
                            </Menu.Item>
                            <Menu.Item key="3" icon={<UserAddOutlined />}>
                                <NavLink to='/home/custom'>
                                    <span  className='nav-span'>客户管理</span>
                                    </NavLink>
                            </Menu.Item>
                            <Menu.Item key="4" icon={<ShoppingOutlined />}>
                                <NavLink to='/home/goods'>
                                    <span  className='nav-span'>商品管理</span></NavLink>
                            </Menu.Item>
                            <Menu.Item key="5" icon={<ShopOutlined />}>
                                <NavLink to='/home/spell'>
                                    <span  className='nav-span'>拼团管理</span></NavLink>
                            </Menu.Item>
                            <Menu.Item key="6" icon={<AccountBookOutlined />}>
                                <NavLink to='/home/order'>
                                    <span  className='nav-span'>订单管理</span></NavLink>
                            </Menu.Item>
                            <Menu.Item key="7" icon={<TeamOutlined />}>
                                <NavLink to='/home/employee'>
                                    <span  className='nav-span'>员工管理</span></NavLink>
                            </Menu.Item>
                            <Menu.Item key="8" icon={<SettingOutlined />}>
                                <NavLink to='/home/setting'>
                                    <span  className='nav-span'>设置</span></NavLink>
                            </Menu.Item>
                        </Menu>

                        <div className="loginOut">
                            {
                                userInfo.avatar
                                    ? <img className="headImage" alt="loginLogo" src={userInfo.avatar} />
                                    : <img className="headImage" alt="loginLogo" src={require('../../assets/imgs/logo.png')} />
                            }
                            <p className="welcome">欢迎：{merchantName}</p>
                            <p className="out" onClick={this.loginOut}>退出登录</p>
                        </div>
                    </Sider>
                    <Layout className="site-layout" style={{ marginLeft: 250 }}>
                        <Content style={{ overflow: 'initial', background: 'white' }}>
                            <div className="site-layout-background">
                                <Redirect from="/home" to="/home/homeindex" />
                                <Route path="/home/homeindex" component={HomeIndex} />
                                <Route path="/home/cashier" component={Cashier} />
                                <Route path="/home/goods" component={Goods} />
                                <Route path="/home/order" component={Order} />
                                <Route path="/home/employee" component={Employee} />
                                <Route path="/home/setting" component={Setting} />
                                <Route path="/home/custom" component={Custom} />
                                <Route path="/home/spell" component={Spell} />
                            </div>
                        </Content>
                    </Layout>
                </Layout>,
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        userInfo: state.userReducer.user
    }
}

export default connect(mapStateToProps)(Home)