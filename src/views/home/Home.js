import React, { Component } from "react"
import '../home/home.css'
import { Row, Col } from 'antd'
import { HomeOutlined, SettingFilled, MenuFoldOutlined } from '@ant-design/icons'

const tab = [
    {
        id: 1,
        name: '首页',
        icon: <HomeOutlined />
    }, {
        id: 2,
        name: '商品管理',
        icon: <MenuFoldOutlined />
    }, {
        id: 3,
        name: '订单管理',
        icon: 'home'
    }, {
        id: 4,
        name: '员工列表',
        icon: 'home'
    }, {
        id: 5,
        name: '设置',
        icon: <SettingFilled />
    },
]

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            checkCode: 0
        }
    }

    // 切换选项卡
    checkTab = (i) => {
        this.setState({
            checkCode: i
        })
    }

    render() {
        const { checkCode } = this.state
        return (
            <div className="home">
                <Row>
                    <Col span={3} className="home-navigate">
                        <div className="header">
                            <img src={require('../../assets/img/logo.png')} className="header-image" alt="图标"></img>
                            <h2>博客云商家版</h2>
                        </div>

                        {
                            tab.map((item,index) => {
                                return (
                                    <div key={item.id} className="tab">
                                        <div className="tab-items" id = {checkCode === index ? 'check-tab-items' : ''} onClick={() => this.checkTab(index)}>{item.name}</div>
                                    </div>
                                )
                            })
                        }

                    </Col>
                    <Col span={20} className="home-content">
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Home