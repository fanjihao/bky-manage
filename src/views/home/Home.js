import React, { Component } from "react"
import './home.css'
import { Row, Col } from 'antd'
import { HomeOutlined, SettingFilled, MenuFoldOutlined } from '@ant-design/icons'
import { Route, NavLink, Redirect } from 'react-router-dom'
import HomeIndex from '../homeIndex/HomeIndex'
import Goods from '../goods/Goods'
import Order from '../order/Order'
import Employee from '../employee/Employee'
import Setting from '../setting/Setting'
import Cashier from '../cashier/Cashier'
import { connect } from 'react-redux'

const tab = [
    {
        id: 1,
        name: '首页',
        icon: <HomeOutlined />,
        path: '/home/homeindex'
    }, , {
        id: 2,
        name: '收银管理',
        icon: <SettingFilled />,
        path: '/home/cashier'
    },{
        id: 3,
        name: '商品管理',
        icon: <MenuFoldOutlined />,
        path: '/home/goods'
    }, {
        id: 4,
        name: '订单管理',
        icon: 'home',
        path: '/home/order'
    }, {
        id: 5,
        name: '员工管理',
        icon: 'home',
        path: '/home/employee'
    }, {
        id: 6,
        name: '设置',
        icon: <SettingFilled />,
        path: '/home/setting'
    },
]

class Home extends Component {
    state = {

    }
    componentDidMount() {

    }

    // 切换选项卡
    checkTab = (i) => {
        this.setState({
            checkCode: i
        })
    }

    // 退出登录
    loginOut = () => {
        this.props.history.push({
            pathname: '/login'
        })
    }

    render() {
        const { userInfo } = this.props
        return (
            <div className="home">
                <Row>
                    <Col span={4} className="home-navigate">
                        <div className="header">
                            <img src={require('../../assets/imgs/logo.png')} className="header-image" alt="图标"></img>
                            <h2>博客云商家版</h2>
                        </div>

                        {
                            tab.map((item, index) => {
                                return (
                                    <div key={item.id} className="tab">
                                        <NavLink to={item.path} className="tab-items">{item.name}</NavLink>
                                    </div>
                                )
                            })
                        }

                        <div className="loginOut">
                            
                            {
                                userInfo.avatar 
                                ? <img  className="headImage" alt="loginLogo" src={userInfo.avatar}/>
                                : <img  className="headImage" alt="loginLogo" src={require('../../assets/imgs/logo.png')}/>
                            }
                            <p className="welcome">欢迎{userInfo.merchantName}</p>
                            <p className="out" onClick={this.loginOut}>退出登录</p>
                        </div>
                    </Col>
                    <Col span={20} className="home-content">
                        <Redirect from="/home" to="/home/homeindex" />
                        <Route path="/home/homeindex" component={HomeIndex} />
                        <Route path="/home/cashier" component={Cashier} />
                        <Route path="/home/goods" component={Goods} />
                        <Route path="/home/order" component={Order} />
                        <Route path="/home/employee" component={Employee} />
                        <Route path="/home/setting" component={Setting} />
                    </Col>
                </Row>
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