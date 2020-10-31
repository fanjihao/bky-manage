import React, { Component } from 'react'
import axios from '../../http'
import './Cashier.css'
import { Input, Select, Button, Space, Table, Modal, Popconfirm, message, Popover, Image, DatePicker } from 'antd'
import moment from 'moment'
// import locale from 'antd/lib/date-picker/locale/zh_CN'
import { CloseCircleOutlined, EyeOutlined, EyeInvisibleOutlined, SearchOutlined, DownloadOutlined } from '@ant-design/icons'
import XLSX from 'xlsx'

const { RangePicker } = DatePicker
const { Option } = Select
const { TextArea } = Input
const dateFormat = 'YYYY/MM/DD'

class Cashier extends Component {
    state = {
        tabCheck: 1,
        eyeTrue: false,
        allEyeTrue: false,
        orderVisible: false,
        modalType: '',
        startTime: '2020-07-25',
        endTime: '2020-09-25',

        islook: false,
        linkEmploy: '',
        visible: false,
        username: '',
        orderId: '',
        orderName: '',
        orderNum: '',
        orderStagePrice: '',
        orderPayType: '',
        orderPrice: '',
        orderPay: '',
        orderCreate: '',
        orderRemarks: '',
        orderOtherNum: '',
        type: '',
    }

    changeEyeTrue = () => {
        this.setState({
            eyeTrue: !this.state.eyeTrue
        })
    }
    changeAllEye = () => {
        this.setState({
            allEyeTrue: !this.state.allEyeTrue
        })
    }
    detail = (type, i) => {
        this.setState({
            orderVisible: true,
            modalType: type
        })
    }
    exportExcel = (headers, data, fileName = '请假记录表.xlsx') => {
        const _headers = headers
            .map((item, i) => Object.assign({}, { key: item.key, title: item.title, position: String.fromCharCode(65 + i) + 1 }))
            .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { key: next.key, v: next.title } }), {});
    
        const _data = data
            .map((item, i) => headers.map((key, j) => Object.assign({}, { content: item[key.key], position: String.fromCharCode(65 + j) + (i + 2) })))
            // 对刚才的结果进行降维处理（二维数组变成一维数组）
            .reduce((prev, next) => prev.concat(next))
            // 转换成 worksheet 需要的结构
            .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.content } }), {});
    
        // 合并 headers 和 data
        const output = Object.assign({}, _headers, _data);
        // 获取所有单元格的位置
        const outputPos = Object.keys(output);
        // 计算出范围 ,["A1",..., "H2"]
        const ref = `${outputPos[0]}:${outputPos[outputPos.length - 1]}`;
    
        // 构建 workbook 对象
        const wb = {
            SheetNames: ['mySheet'],
            Sheets: {
                mySheet: Object.assign(
                    {},
                    output,
                    {
                        '!ref': ref,
                        '!cols': [{ wpx: 45 }, { wpx: 100 }, { wpx: 200 }, { wpx: 80 }, { wpx: 150 }, { wpx: 100 }, { wpx: 300 }, { wpx: 300 }],
                    },
                ),
            },
        };
    
        // 导出 Excel
        XLSX.writeFile(wb, fileName);
    }
    // 改变日期
    setTime = e => {
        console.log(e, 'ddddddddddd')
        // const id = this.props.userInfo.id
        // const startTime = e[0]._d.getFullYear() + '-' + (e[0]._d.getMonth() + 1) + '-' + e[0]._d.getDate()
        // const endTime = e[1]._d.getFullYear() + '-' + (e[1]._d.getMonth() + 1) + '-' + e[1]._d.getDate()
        // console.log(startTime, '---', endTime)
        // this.setState({
        //     startTime: startTime,
        //     endTime: endTime
        // })
    }

    render() {
        const { tabCheck, eyeTrue, allEyeTrue, orderVisible,
            linkEmploy, visible, username, orderId, orderName, orderNum, orderStagePrice, orderPayType,
            orderPrice, orderPay, orderCreate, orderRemarks,
            orderOtherNum, modalType, type, startTime, endTime, } = this.state
        const columns = [
            {
                title: '序号',
                dataIndex: 'id',
                key: 'id',
                render: text => <a>{text}</a>,
                align:'center'
            },
            {
                title: '项目图片',
                dataIndex: 'photo',
                key: 'photo',
                render: src => {
                    let arr = src.split(',')
                    return (
                        <Image className='goods-item-img' src={arr[0]}></Image>
                    )
                },
                align:'center'
            },
            {
                title: '项目名称',
                dataIndex: 'name',
                key: 'name',
                align:'center'
            },
            {
                title: '分类',
                dataIndex: 'cateName',
                key: 'cateName',
                align:'center'
            },
            {
                title: '实付金额',
                dataIndex: 'truePay',
                key: 'truePay',
                render: text => <>￥{text}</>,
                align:'center'
            },
            {
                title: '订单总额',
                key: 'totalPrice',
                dataIndex: 'totalPrice',
                render: text => <>￥{text}</>,
                align:'center'
            },
            {
                title: '销量',
                key: 'sales',
                dataIndex: 'sales',
                render: tags => (
                    <>{tags}</>
                ),
                align:'center'
            },
            {
                title: '库存',
                key: 'stock',
                dataIndex: 'stock',
                render: tags => (
                    <>{tags}</>
                ),
                align:'center'
            },
            {
                title: '交易时间',
                key: 'tradingTime',
                dataIndex: 'tradingTime',
                render: tags => (
                    <>{tags}</>
                ),
                align:'center'
            },
            {
                title: '客户备注',
                key: 'remarks',
                dataIndex: 'remarks',
                render: (text, record) => <>{text}</>,
                align:'center'
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => {
                    return <Space>
                        <span className='look-action actions' onClick={() => this.detail('look', 0)}>查看</span>
                        <span className='edit-action actions' onClick={() => this.detail('edit', record)}>编辑</span>
                    </Space>
                },
                align:'center'
            },
        ]
        const data = [
            {
                id: 1,
                photo: '',
                name: '项目名',
                cateName: '线上订单',
                truePay: 199,
                totalPrice: 399,
                sales: 999,
                stock: 9999,
                tradingTime: '2020-10-10',
                remarks: '备注信息'
            }
        ]
        let date = new Date()
        return (
            <div className="cashier">
                <div className='cashierTop'>
                    <span>收银管理</span>
                </div>
                <div className='cashierHeader'>
                    <div className='headerTips'>
                        <div className='sumTotal' style={{ marginBottom: 20 }}>
                            <span style={{ float: "left" }}>10月实收总额</span>
                            <span style={{ float: "right" }}>123单</span>
                        </div>
                        <div className='sumTotal'>
                            <div style={{ float: "left", overflow: 'hidden' }}>
                                {eyeTrue
                                    ? <span className='month-num'>15400</span>
                                    : <span className='month-num'>*****</span>}
                                <span style={{ float: "left", margin: '8px 10px', color: '#1089EB' }}>元</span>
                            </div>
                            <div style={{ float: "right" }}>
                                {eyeTrue
                                    ? <EyeInvisibleOutlined className='eyeIcon' onClick={this.changeEyeTrue} />
                                    : <EyeOutlined className='eyeIcon' onClick={this.changeEyeTrue} />}
                            </div>
                        </div>
                    </div>
                    <div className='headerTips'>
                        <div className='sumTotal' style={{ marginBottom: 20 }}>
                            <span style={{ float: "left" }}>10月订单总额</span>
                            <span style={{ float: "right" }}>123单</span>
                        </div>
                        <div className='sumTotal'>
                            <div style={{ float: "left", overflow: 'hidden' }}>
                                {allEyeTrue
                                    ? <span className='month-num'>15400</span>
                                    : <span className='month-num'>*****</span>}
                                <span style={{ float: "left", margin: '8px 10px', color: '#1089EB' }}>元</span>
                            </div>
                            <div style={{ float: "right" }}>
                                {allEyeTrue
                                    ? <EyeInvisibleOutlined className='eyeIcon' onClick={this.changeAllEye} />
                                    : <EyeOutlined className='eyeIcon' onClick={this.changeAllEye} />}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='goodsBody'>
                    <div className='goodsBodyTab'>
                        <div className={tabCheck === 1 ? 'gtActive' : 'gbTabBtn'}
                            onClick={() => this.setState({ tabCheck: 1 })}>全部订单</div>
                        <div className={tabCheck === 2 ? 'gtActive' : 'gbTabBtn'}
                            onClick={() => this.setState({ tabCheck: 2 })}>线上订单</div>
                        <div className={tabCheck === 3 ? 'gtActive' : 'gbTabBtn'}
                            onClick={() => this.setState({ tabCheck: 3 })}>线下订单</div>
                        <div className='tableTips'>
                            “线上”即app成交订单，“线下”即收银牌收银订单。线下订单提交后需操作完善订单详情。
                        </div>
                    </div>
                    <div className='gbTableTop'>
                        <RangePicker
                            // locale={locale}
                            className='datePicker'
                            value={[moment(startTime, dateFormat), moment(endTime, dateFormat)]}
                            format={dateFormat}
                            onChange={this.setTime}
                        />
                        <Input placeholder='请输入商品名' className='nameInput'></Input>
                        <Select className='classSelect' placeholder='分类' allowClear={true} clearIcon={<CloseCircleOutlined />}>
                            <Option value={1} label='线上订单'>线上订单</Option>
                            <Option value={2} label='线下订单'>线下订单</Option>
                        </Select>
                        <div className='search-btn'><SearchOutlined />搜索</div>
                        <div className='daochu-btn' onClick={() => {
                            this.exportExcel(columns, data,"人员名单.xlsx")
                        }}><DownloadOutlined />导出表格</div>
                    </div>
                    <div style={{ width: '100%', paddingBottom: 10 }}>
                        <Table columns={columns}
                            dataSource={data}
                            style={{ textAlign: 'center', paddingBottom: '10px' }}
                            pagination={{ pageSize: 10 }}
                            locale={{ emptyText: '暂无数据' }} />
                    </div>
                </div>
                <Modal
                    visible={orderVisible}
                    title="订单信息"
                    onOk={() => this.setState({ orderVisible: false })}
                    onCancel={() => this.setState({ orderVisible: false })}
                    footer={[
                        modalType === 'edit' ?
                            <Button key="submit" type="primary" onClick={() => this.stageChange()}>
                                确认修改
                        </Button> : null
                    ]}
                    destroyOnClose={true}
                    bodyStyle={{ fontSize: '15px', padding: '10px', color: '#666666' }}
                    width={800}
                >
                    <div className='modalheader'>
                        <div className='modalItem'>
                            <span style={{ marginRight: 10 }}>美疗师</span>
                            <Popover
                                content={
                                    <a>ddd</a>
                                    // <Table columns={employColumns}
                                    //     dataSource={data}
                                    //     style={{ textAlign: 'center' }}
                                    //     pagination={{ pageSize: 2 }} 
                                    //     locale={{emptyText:'暂无数据'}} />
                                }
                                trigger="hover"
                                visible={visible}
                            // onVisibleChange={this.handleVisibleChange}
                            >
                                <Input style={{ width: 150, margin: '0 20px' }}
                                    placeholder='关联员工'
                                    disabled={this.state.islook}
                                    value={linkEmploy}
                                    onFocus={() => this.setState({ visible: true })}></Input>
                            </Popover>
                        </div>
                        <div className='modalItem'>
                            <span style={{ marginRight: 10 }}>客户</span>
                            <Input style={{ width: 150, margin: '0 20px' }}
                                placeholder='客户姓名/昵称'
                                disabled={this.state.islook}
                                value={username}
                                onChange={e => this.setState({ username: e.target.value })}></Input>
                        </div>
                    </div>
                    <div className='modalBody'>
                        <div className='modalBodyChild'>
                            <div className='mbLabel'>
                                <span>订单编号</span>
                                <span>{orderId}</span>
                                <span style={{ color: '#1089EB' }}>复制</span>
                            </div>
                            <div className='mbLabel'>
                                <span style={{ marginRight: 10 }}>项目名称</span>
                                <span>{orderName}</span>
                            </div>
                            <div className='mbLabel'>
                                <span style={{ marginRight: 10 }}>项目总数</span>
                                <span>1</span>
                            </div>
                            <div className='mbLabel'>
                                <span style={{ marginRight: 10 }}>分类</span>
                                <span>线下订单</span>
                            </div>
                            <div className='mbLabel'>
                                <span style={{ marginRight: 10 }}>库存</span>
                                <span>123</span>
                            </div>
                            <div className='mbLabel'>
                                <span style={{ marginRight: 10 }}>支付方式</span>
                                <span style={{ color: '#13CE66' }}>{orderPayType}</span>
                            </div>
                            <div className='mbLabel'>
                                <span style={{ marginRight: 10 }}>创建时间</span>
                                <span>2020-05-20 11：20：20</span>
                            </div>
                        </div>
                        <div className='modalBodyChild'>
                            <div className='mbLabel'>
                                <span style={{ marginRight: 10 }}>订单状态</span>
                                <span>
                                    {type === 4 ? '未支付' : '已支付'}
                                </span>
                            </div>
                            <div className='mbLabel'>
                                <span style={{ marginRight: 10 }}>项目分期总额</span>
                                <span>{orderPrice}</span>
                            </div>
                            <div className='mbLabel'>
                                <span style={{ marginRight: 10 }}>分期状态</span>
                                <span style={{ color: '#1089EB' }}>正常分期中</span>
                            </div>
                            <div className='mbLabel'>
                                <span style={{ marginRight: 10 }}>销量</span>
                                <span>1000</span>
                            </div>
                            <div className='mbLabel'>
                                <span style={{ marginRight: 10 }}>项目分期</span>
                                <span>￥{orderStagePrice}/{orderNum}期</span>
                                <span style={{ color: '#1089EB' }}>剩余￥{orderStagePrice}/{orderOtherNum}期</span>
                            </div>
                            <div className='mbLabel'>
                                <span style={{ marginRight: 10 }}>实际支付</span>
                                <span>￥300</span>
                            </div>
                        </div>
                    </div>
                    <div className='modalNote'>
                        <div style={{ width: '100%' }}><span>备注</span></div>
                        <div>
                            <TextArea rows={4} value={orderRemarks} disabled={this.state.islook}
                                onChange={e => this.setState({ orderRemarks: e.target.value })} />
                        </div>
                    </div>
                </Modal>
                <div className='footer-statistical'>
                    <span>总销售额：￥{132564.00}</span>
                    <span>线上总销售额：￥{12345.00}</span>
                    <span>线下总销售额：￥{12345.00}</span>
                </div>
            </div>
        )
    }
}

export default Cashier