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

const tab = [
    {
        id: 1,
        name: '首页',
        icon: <HomeOutlined />,
        path: '/home/homeindex'
    }, {
        id: 2,
        name: '商品管理',
        icon: <MenuFoldOutlined />,
        path: '/home/goods'
    }, {
        id: 3,
        name: '订单管理',
        icon: 'home',
        path: '/home/order'
    }, {
        id: 4,
        name: '员工列表',
        icon: 'home',
        path: '/home/employee'
    }, {
        id: 5,
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

    render() {
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

                    </Col>
                    <Col span={20} className="home-content">
                        <Redirect from="/home" to="/home/homeindex" />
                        <Route path="/home/homeindex" component={HomeIndex} />
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

export default Home