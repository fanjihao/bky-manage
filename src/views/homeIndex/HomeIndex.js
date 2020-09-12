import React, { Component } from 'react'
import './homeIndex.css'
import { DatePicker } from 'antd'
import locale from 'antd/lib/date-picker/locale/zh_CN'

const { RangePicker } = DatePicker;
const stageGoods = [
    {
        id: 1,
        stageType: '分期中',
        stageMoney: '2500'
    }, {
        id: 2,
        stageType: '已完成分期',
        stageMoney: '2500'
    }, {
        id: 3,
        stageType: '异常分期',
        stageMoney: '2500'
    }, {
        id: 4,
        stageType: '一场分期',
        stageMoney: '2500'
    }, {
        id: 5,
        stageType: '分期中',
        stageMoney: '2500'
    }, {
        id: 6,
        stageType: '已完成分期',
        stageMoney: '2500'
    }, {
        id: 7,
        stageType: '分期中',
        stageMoney: '2500'
    },
]

export default class HomeIndex extends Component {
    render() {
        return (
            <div className="homeIndex">
                <div className="homeIndex-header">
                    <span>首页</span>
                </div>

                <div className="homeIndex-date">
                    <RangePicker locale={locale} className="homeIndex-date" />
                </div>
                <div className="homeIndex-statistics">
                    <div className="homeIndex-stage">
                        <div className="homeIndex-stageTitle">
                            <span>分期项目统计：</span>
                            <span className="homeIndex-renderDate">2020-04-20至2020-07-28</span>
                        </div>

                        {/* 分期类型统计 */}
                        <div className="homeIndex-stageStatistics">
                            <div className="homeIndex-stageItems">
                                <div className="stageItems-top ">
                                    <span>分期中</span>
                                    <span>{stageGoods.filter(item => item.stageType === '分期中').length}单</span>
                                </div>
                                <div className="stageItems-bottom">
                                    <span className="stagePrice">{15400}</span>
                                    <span className="stageUnit">元</span>
                                </div>
                            </div>

                            <div className="homeIndex-stageItems">
                                <div className="stageItems-top ">
                                    <span>已完成分期</span>
                                    <span>{stageGoods.filter(item => item.stageType === '已完成分期').length}单</span>
                                </div>
                                <div className="stageItems-bottom">
                                    <span className="stagePrice">{15400}</span>
                                    <span className="stageUnit">元</span>
                                </div>
                            </div>

                            <div className="homeIndex-stageItems">
                                <div className="stageItems-top ">
                                    <span>异常分期</span>
                                    <span>{stageGoods.filter(item => item.stageType === '异常分期').length}单</span>
                                </div>
                                <div className="stageItems-bottom">
                                    <span className="stagePrice">{15400}</span>
                                    <span className="stageUnit">元</span>
                                </div>
                            </div>

                        </div>

                        {/* 分期统计图表 */}
                        <div className="homeIndex-stageCharts">
                            <div className="charts">

                            </div>
                            <div className="stageManage-list">

                            </div>
                        </div>

                        <div className="homeIndex-stageCharts">
                            <div className="charts">

                            </div>
                            <div className="stageManage-list">

                            </div>
                        </div>
                    </div>

                    <div className="homeIndex-online">
                        <div className="homeIndex-onlineTitle">
                            <span>线上商品统计：</span>
                            <span className="homeIndex-renderDate">2020-04-20至2020-07-28</span>
                        </div>
                        <div className="onlineGoodsStatistics">
                            <div className="online-top">
                                <span>商品营业总额</span>
                                <span>{123}单</span>
                            </div>
                            <div className="stageItems-bottom">
                                    <span className="stagePrice">{15400}</span>
                                    <span className="stageUnit">元</span>
                                </div>
                        </div>
                        {/* 店铺信息 */}
                        <div className="storeInfo">
                            <header className="storeInfo-header">
                                <img src={require('../../assets/imgs/logo.png')} alt="商家图标" />
                                <span>19散云溪养生涪城国际店</span>
                            </header>
                            <section className="storeInfo-section">
                                <div className="storeInfo-section-Items">
                                    <span className="storeInfo-section-span1">门店地址</span>
                                    <span>成都市天府一街复城国际T2-25</span>
                                </div>
                                <div className="storeInfo-section-Items">
                                    <span className="storeInfo-section-span1">负责人</span>
                                    <span>***</span>
                                </div>
                                <div className="storeInfo-section-Items">
                                    <span className="storeInfo-section-span1">营业时间</span>
                                    <span>每天8：00 - 22：00</span>
                                </div>
                            </section>

                            <div className="download">
                                <img src={require('../../assets/imgs/QRcode.png')} alt="扫码下载博客云App" className="QRcode"/>
                                <div className="download-text">博客云扫码下载</div>
                            </div>

                            <div className="handle">
                                <p>操作步骤</p>
                                <p>1.扫描二维码下载博客云APP</p>
                                <p>2.免注册直接登陆博客云</p>
                                <p>3.扫描门店二维码开始办理分期项目服务</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}