import React, { Component } from 'react'
import axios from '../../http'
import './Cashier.css'
import { Input, Select, Space, Table, Modal, message, Image, DatePicker, Popover, Button } from 'antd'
import moment from 'moment'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import { CloseCircleOutlined, EyeOutlined, EyeInvisibleOutlined, SearchOutlined, DownloadOutlined, PlusOutlined } from '@ant-design/icons'
import XLSX from 'xlsx'

const { RangePicker } = DatePicker
const { Option } = Select
const { TextArea } = Input
const dateFormat = 'YYYY/MM/DD'

class Cashier extends Component {
    state = {
        // tab切换
        tabCheck: 1,
        // 价格隐藏
        eyeTrue: true,
        allEyeTrue: true,
        // 是否显示模态框
        orderVisible: false,
        // 时间
        startTime: null,
        endTime: null,
        time: null,
        // 订单表数据
        data: [],
        // 本月实收总额
        monthTrueNum: null,
        // 本月实际订单数
        monthTrueCount: null,
        // 本月订单总额
        monthNum: null,
        // 本月订单数
        monthCount: null,
        // 总销售额
        allNum: null,
        // 线上总销售额
        onlineNum: null,
        // 线下总销售额
        offlineNum: null,
        // 用户id
        id: null,
        // 订单类型
        orderType: 0,
        // 商品名
        goodsName: '',

        // 订单号
        orderId: null,
        // 订单状态
        paid: null,
        // 项目名称
        name: null,
        // 项目分期总额
        amount: null,
        // 项目分期总数
        stagesNum: null,
        // 分期状态
        type: null,
        // 分类
        classify: 1,
        // 销量
        sales: 0,
        // 库存
        stock: 0,
        // 每期金额
        stagesPrice: 0,
        // 已支付分期数
        stagesNumber: 0,
        // 剩余分期数
        surplus: 0,
        // 支付方式
        payType: null,
        // 实际支付金额
        payPrice: 0,
        // 订单创建时间
        addTime: null,
        // 备注
        mark: null,
        // 美疗师
        staffName: null,
        staffId: null,
        // 客户电话
        userPhone: null,
        loading: false,
        // 员工
        employList: null,
        // 气泡
        visible: false,
        // 添加线下
        offlineAmount: '',
        offlineUserPhone: '',
        addVisible: false,
        offlineStaff: '',
        offlineMark: '',
        projectList: [],
        projectName: '',
        projectImage: '',
        projectId: '',
        // 客户
        custom: null,
        // 客户气泡弹框
        customVisible: false,
        // 客户列表
        customData: [],
        // 客户等级
        clientLevel: null,
        // 客户Id
        clientId: null,
        // 客户姓名
        clientName: null
    }
    // 隐藏信息
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
    // 订单详情
    detail = (type, record) => {
        axios({
            method: 'GET',
            url: `/cash/detail/{orderId}`,
            params: {
                orderId: record.orderId
            }
        })
            .then(res => {
                console.log('获取订单详细信息成功', res)
                this.setState({
                    orderId: res.data.data.orderId,
                    paid: res.data.data.paid,
                    name: res.data.data.name,
                    amount: res.data.data.amount,
                    stagesNum: res.data.data.stagesNum,
                    type: res.data.data.type,
                    classify: res.data.data.classify,
                    sales: res.data.data.sales,
                    stock: res.data.data.stock,
                    stagesPrice: res.data.data.stagesPrice,
                    stagesNumber: res.data.data.stagesNumber,
                    surplus: res.data.data.surplus,
                    payType: res.data.data.payType,
                    payPrice: res.data.data.payPrice,
                    addTime: res.data.data.addTime,
                    mark: res.data.data.mark,
                    staffName: res.data.data.staffName,
                    userPhone: res.data.data.userPhone,
                    staffId: res.data.data.staffId,
                    clientLevel: res.data.data.clientLevel,
                    clientName: res.data.data.clientName
                }, () => {
                    this.setState({
                        orderVisible: true
                    })
                })
            })
            .catch(err => {
                console.log('获取订单详细信息失败', err)
            })


    }
    exportExcel = (headers, data, fileName) => {
        if (data.length === 0) {
            message.warning('没有数据，不能导出')
        } else {
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
    }
    // 改变日期
    setTime = e => {
        console.log(e, 'ddddddddddd')
        const id = JSON.parse(localStorage.getItem('user')).id
        const startTime = e[0]._d.getFullYear() + '-' + (e[0]._d.getMonth() + 1) + '-' + e[0]._d.getDate()
        const endTime = e[1]._d.getFullYear() + '-' + (e[1]._d.getMonth() + 1) + '-' + e[1]._d.getDate()
        console.log(startTime, '---', endTime)
        this.setState({
            startTime: startTime,
            endTime: endTime
        }, () => {
            // 订单数据
            this.getOrderData(id, 1)
            // 月营收数据
            this.getMonthData(id)
        })
    }
    // 月营收数据
    getMonthData = id => {
        const { time } = this.state
        axios({
            method: 'GET',
            url: '/cash/money',
            params: {
                date: time,
                enterId: id
            }
        })
            .then(res => {
                console.log('查询月营收数据成功', res)
                this.setState({
                    monthTrueNum: res.data.data.actOrderMoneyMonth,
                    monthNum: res.data.data.orderMoneyMonth,
                    monthTrueCount: res.data.data.actCount,
                    monthCount: res.data.data.sumCount
                })
            })
            .catch(err => {
                console.log('查询月营收数据失败', err)
            })
    }
    // 总营收数据
    getAllData = id => {
        axios({
            method: 'GET',
            url: '/cash/sum',
            params: {
                enterId: id
            }
        })
            .then(res => {
                console.log('查询总营收数据成功', res)
                this.setState({
                    allNum: res.data.data.onMoney + res.data.data.offMoney,
                    onlineNum: res.data.data.onMoney,
                    offMoney: res.data.data.offMoney
                })
            })
            .catch(err => {
                console.log('查询总营收数据失败', err)
            })
    }
    // 订单数据
    getOrderData = (id, type) => {
        const { startTime, endTime, goodsName } = this.state
        // console.log(goodsName)
        axios({
            method: 'GET',
            url: '/cash/order',
            params: {
                startDate: startTime,
                endDate: endTime,
                enterId: id,
                classify: type,
                name: goodsName
            }
        })
            .then(res => {
                console.log('查询订单数据成功', res)
                if (res.data.data) {
                    let data = res.data.data
                    data.map(item => {
                        item.key = item.orderId
                    })
                    this.setState({ data, loading: false })
                } else {
                    this.setState({ data: [], loading: false })
                }
            })
            .catch(err => {
                console.log('查询订单失败', err)
            })
    }
    // 获取员工信息
    getEmploy = () => {
        let user = JSON.parse(localStorage.getItem('user'))
        axios({
            url: '/merchantOrder/listStoreStaff',
            method: 'GET',
            params: {
                enterId: user.id,
                limit: 10,
                name: '',
                offset: 1,
                order: '',
                phone: '',
            }
        })
            .then(res => {
                console.log('查询员工信息成功', res)
                if (res.data.data.list) {
                    let list = res.data.data.list
                    list.map(item => item.key = item.id)
                    this.setState({
                        employList: list
                    })
                }
            })
            .catch(err => {
            })
    }
    // 获取商家项目
    getProject = () => {
        const id = JSON.parse(localStorage.getItem('user')).id
        axios({
            url: '/consume',
            method: 'GET',
            params: {
                enter: id
            }
        })
            .then(res => {
                console.log('获取商家项目成功', res)
                if (res.data.data) {
                    let data = res.data.data
                    data.map(item => item.key = item.phases_id)
                    this.setState({
                        projectList: data
                    })
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
    // 查询所有客户
    getAllCustom = () => {
        let user = JSON.parse(localStorage.getItem('user'))
        axios({
            method: 'GET',
            url: '/client/all',
            params: {
                enterId: user.id
            }
        })
            .then(res => {
                console.log('查询所有客户成功', res)
                this.setState({ customData: res.data.data.reverse() })
            })
            .catch(err => {
                console.log('查询所有客户失败', err)
            })
    }
    componentDidMount() {
        const date = new Date()
        let Y = date.getFullYear()
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
        let D = date.getDate() + 1;
        const nowDate = Y + '-' + M + '-' + D
        // console.log(nowDate)

        date.setMonth(date.getMonth() - 1)
        let y = date.getFullYear()
        let m = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
        let d = date.getDate()
        const preDate = y + '-' + m + '-' + d
        // console.log(preDate)

        const id = JSON.parse(localStorage.getItem('user')).id

        this.setState({
            startTime: preDate,
            endTime: nowDate,
            id: id,
            time: nowDate,
            loading: true
        }, () => {
            // console.log(id)
            // 本月销量
            this.getMonthData(id)
            // 总营收数据
            this.getAllData(id)
            // 订单数据
            this.getOrderData(id, 1)
            // 员工
            this.getEmploy()
            // 商店项目
            this.getProject()
            // 客户
            this.getAllCustom()
        })
    }
    // 搜索
    search = () => {
        this.setState({ loading: true })
        const { orderType } = this.state
        const id = JSON.parse(localStorage.getItem('user')).id
        this.getOrderData(id, orderType + 1)
    }
    // 添加线下订单
    addProject = () => {
        this.setState({
            addVisible: true
        })
    }
    addOrder = () => {
        const { offlineAmount, offlineUserPhone, offlineStaff, offlineMark,
            projectId, projectImage, projectName } = this.state
        let user = JSON.parse(localStorage.getItem('user'))
        axios({
            url: '/consume',
            method: 'POST',
            data: {
                amount: Number(offlineAmount),
                classify: 2,
                enterId: user.id,
                image: projectImage,
                mark: offlineMark,
                name: projectName,
                orderId: '',
                phasesId: projectId,
                staff: offlineStaff,
                storeId: user.systemStoreId,
                userPhone: offlineUserPhone
            }
        })
            .then(res => {
                console.log('添加线下订单成功', res)
            })
            .catch(err => {
                console.log('添加线下订单失败', err)
            })
    }
    // 时间戳转换
    formatTime = (time) => {
        let newMonth, newDay, newMin, newSec, newHours
        let date = new Date(time * 1000)
        // console.log(date, time)
        let newYear = date.getFullYear()
        let month = date.getMonth() + 1;
        if (month < 10) {
            newMonth = '0' + month
        } else { newMonth = month }
        let day = date.getDate();
        if (day < 10) {
            newDay = '0' + day
        } else { newDay = day }
        let hours = date.getHours();
        if (hours < 10) {
            newHours = '0' + hours
        } else { newHours = hours }
        let minutes = date.getMinutes();
        if (minutes < 10) {
            newMin = '0' + minutes
        } else { newMin = minutes }
        let seconds = date.getSeconds();
        if (seconds < 10) {
            newSec = '0' + seconds
        } else { newSec = seconds }
        return newYear + '-' + newMonth + '-' + newDay + ' ' + newHours + ':' + newMin + ':' + newSec
    }
    // 修改订单信息
    updateOrder = () => {
        const { staffId, mark, orderId, classify, clientId, clientLevel, clientName, amount, tabCheck } = this.state
        console.log(clientName)
        const id = JSON.parse(localStorage.getItem('user')).id
        axios({
            method: 'POST',
            url: '/cash/update',
            data: {
                staffId,
                mark,
                orderId,
                classify,
                clientLevel,
                clientId,
                clientName,
                enterId: id,
                amount
            }
        })
            .then(res => {
                console.log('修改订单信息成功', res)
                if (res.data.status === 200) {
                    message.success('修改成功')
                    this.getOrderData(id, tabCheck)
                    this.setState({ visible: false, orderVisible: false })
                } else {
                    message.error('修改失败')
                }
            })
            .catch(err => {
                console.log('修改订单信息失败', err)
                message.error('修改失败')
            })
    }
    render() {
        const { tabCheck, eyeTrue, allEyeTrue, orderVisible,
            startTime, endTime, data, monthCount,
            monthNum, monthTrueCount, monthTrueNum, allNum,
            onlineNum, offlineNum, id, orderType,
            orderId, paid, name, amount,
            stagesNum, type, classify, sales,
            stock, stagesPrice,
            // stagesNumber,
            surplus,
            payType, payPrice, addTime, mark,
            staffName, goodsName, time, loading,
            employList, visible, userPhone,
            // 线下
            offlineAmount, offlineUserPhone, addVisible, offlineStaff, offlineMark, projectList, projectVis,
            projectName, projectImage, clientName,
            customData, customVisible, clientLevel } = this.state

        let newData
        if (data.length > 0) {
            newData = data.filter(item => {
                return item.classify === orderType
            })
        } else {
            newData = []
        }
        const newText = orderType === 1 ? '线上商品收银统计表' : '线下商品收银统计表'
        const columns = [
            {
                title: '项目图片',
                dataIndex: 'image',
                key: 'image',
                render: text => {
                    let src
                    if (text) {
                        src = text.split(',')[0]
                    }
                    return (
                        <Image className='goods-item-img' src={src}></Image>
                    )
                },
                align: 'center'
            },
            {
                title: '项目名称',
                dataIndex: 'name',
                key: 'name',
                align: 'center'
            },
            {
                title: '实付金额',
                dataIndex: 'payPrice',
                key: 'payPrice',
                align: 'center',
                render: text => <>￥{text}</>
            },
            {
                title: '订单总额',
                key: 'totalPrice',
                dataIndex: 'totalPrice',
                align: 'center',
                render: text => <>￥{text}</>
            },
            {
                title: '交易时间',
                key: 'creatTime',
                dataIndex: 'creatTime',
                align: 'center'
            },
            {
                title: '客户电话',
                key: 'userPhone',
                align: 'center',
                dataIndex: 'userPhone'
            },
            {
                title: '客户备注',
                key: 'mark',
                dataIndex: 'mark',
                align: 'center',
                render: text => (<>{text ? text : '无'}</>)
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => {
                    return <Space>
                        <span className='look-action actions' onClick={() => this.detail('look', record)}>查看详情</span>
                        {/* <span className='edit-action actions' onClick={() => this.detail('edit', record)}>编辑</span> */}
                    </Space>
                },
                align: 'center'
            },
        ]
        const employColumns = [
            {
                title: '编号',
                dataIndex: 'id',
                key: 'id'
            },
            {
                title: '姓名',
                dataIndex: 'staffName',
                key: 'staffName',
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => <a onClick={() => {
                    if (addVisible) {
                        this.setState({ visible: false, offlineStaff: record.id })
                    } else {
                        this.setState({ visible: false, staffName: record.staffName, staffId: record.id })
                    }
                }}>选择</a>

            },
        ]
        const projectColumns = [
            {
                title: '编号',
                dataIndex: 'phases_id',
                key: 'phases_id'
            },
            {
                title: '项目名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => <a onClick={() => {
                    this.setState({ projectVis: false, projectName: record.name, projectImage: record.image, projectId: record.phases_id })
                }}>选择</a>

            },
        ]
        const customColumns = [
            {
                title: '姓名',
                key: 'name',
                dataIndex: 'name',
                align: 'center'
            },
            {
                title: '电话',
                key: 'userPhone',
                dataIndex: 'userPhone',
                align: 'center'
            },
            {
                title: '客户等级',
                key: 'level',
                dataIndex: 'level',
                align: 'center'
            }, {
                title: '操作',
                key: 'action',
                render: (text, record) => <a onClick={() => {
                    console.log(record)
                    this.setState({ clientLevel: record.level, customVisible: false, clientId: record.id, clientName: record.name })
                }}>选择</a>,
                align: 'center'
            },
        ]
        return (
            <div className="cashier">
                <div className='cashierTop'>
                    <span>收银管理</span>
                </div>
                <div className='cashierHeader'>

                    <div className='headerTips'>
                        <div className='sumTotal' style={{ marginBottom: 20 }}>
                            <span style={{ float: "left" }}>{time ? time.split('-')[1] : null}月实收总额</span>
                            <span style={{ float: "right", height: 32 }}>{monthTrueCount ? monthTrueCount : '0'}单</span>
                        </div>
                        <div className='sumTotal'>
                            <div style={{ float: "left", overflow: 'hidden' }}>
                                {eyeTrue
                                    ? <span className='month-num'>{monthTrueNum ? monthTrueNum : '0'}</span>
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
                            <span style={{ float: "left" }}>{time ? time.split('-')[1] : null}月订单总额</span>
                            <span style={{ float: "right" }}>{monthCount ? monthCount : '0'}单</span>
                        </div>
                        <div className='sumTotal'>
                            <div style={{ float: "left", overflow: 'hidden' }}>
                                {allEyeTrue
                                    ? <span className='month-num'>{monthNum ? monthNum : '0'}</span>
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
                            onClick={() => {
                                this.setState({ tabCheck: 1, loading: true })
                                this.getOrderData(id, 1)
                            }}>全部订单</div>
                        <div className={tabCheck === 2 ? 'gtActive' : 'gbTabBtn'}
                            onClick={() => {
                                this.setState({ tabCheck: 2, loading: true })
                                this.getOrderData(id, 2)
                            }}>线上订单</div>
                        <div className={tabCheck === 3 ? 'gtActive' : 'gbTabBtn'}
                            onClick={() => {
                                this.setState({ tabCheck: 3, loading: true })
                                this.getOrderData(id, 3)
                            }}>线下订单</div>
                        <div className='tableTips'>
                            “线上”即app成交订单，“线下”即收银牌收银订单。线下订单提交后需操作完善订单详情。
                        </div>
                    </div>
                    <div className='gbTableTop'>
                        <RangePicker
                            locale={locale}
                            className='datePicker'
                            value={[moment(startTime, dateFormat), moment(endTime, dateFormat)]}
                            format={dateFormat}
                            onChange={this.setTime}
                            allowClear={false}
                        />

                        <Input placeholder='输入商品名或客户电话查询'
                            className='nameInput'
                            value={goodsName}
                            onChange={e => this.setState({ goodsName: e.target.value })}
                        />
                        {/* <Select className='classSelect'
                            placeholder='全部'
                            allowClear={true}
                            value={orderType}
                            clearIcon={<CloseCircleOutlined />}
                            onChange={
                                e => {
                                    this.setState({ orderType: e })
                                }
                            }>
                            <Option value={0}>全部订单</Option>
                            <Option value={1} label='线上订单'>线上订单</Option>
                            <Option value={2} label='线下订单'>线下订单</Option>
                        </Select> */}
                        <div className='search-btn' onClick={this.search}><SearchOutlined />搜索</div>
                        <div className='add-btn' style={{ width: 130 }} onClick={this.addProject}>
                            <PlusOutlined />新增线下订单
                        </div>
                        <div className='daochu-btn' onClick={() => {
                            this.exportExcel(columns, newData, newText)
                        }}><DownloadOutlined />导出</div>

                    </div>
                    <div style={{ width: '100%', paddingBottom: 10 }}>
                        <Table
                            columns={columns}
                            dataSource={data}
                            style={{ textAlign: 'center', paddingBottom: '10px' }}
                            pagination={{ pageSize: 4, position: ['bottomLeft'] }}
                            locale={{ emptyText: '暂无数据' }}
                            loading={loading}
                        />
                    </div>
                </div>
                {/* 添加线下订单 */}
                <Modal
                    visible={addVisible}
                    title="订单信息"
                    onOk={() => this.addOrder()}
                    onCancel={() => this.setState({ addVisible: false, projectVis: false, visible: false })}
                    destroyOnClose={true}
                    bodyStyle={{ fontSize: '15px', padding: '10px', color: '#666666' }}
                    width={800}
                    okText='确定'
                    cancelText="取消"
                >
                    <div className='addBody'>
                        <div className=''>
                            <div className='cashmbLabel'>
                                <span className='add-pro-span'>美疗师</span>
                                <div className='input-box'>
                                    <Popover
                                        content={<Table
                                            columns={employColumns}
                                            dataSource={employList}
                                            style={{ textAlign: 'center' }}
                                            pagination={{ pageSize: 2 }}
                                            locale={{ emptyText: '暂无数据' }} />}
                                        trigger="click"
                                        placement="bottom"
                                        visible={visible}
                                        onVisibleChange={visible => this.setState({ visible })}
                                    >
                                        {offlineStaff
                                            ? <Button type="primary" style={{ width: 120 }} onClick={() => this.setState({ projectVis: true })}>{offlineStaff}</Button>
                                            : <Button type="primary" style={{ width: 120 }} danger onClick={() => this.setState({ visible: true })}>点击关联员工</Button>}
                                    </Popover>
                                </div>
                            </div>
                            <div className='cashmbLabel'>
                                <span className='add-pro-span'>办理项目</span>
                                <div className='input-box'>
                                    <Popover
                                        content={<Table
                                            columns={projectColumns}
                                            dataSource={projectList}
                                            style={{ textAlign: 'center' }}
                                            pagination={{ pageSize: 5 }}
                                            locale={{ emptyText: '暂无数据' }} />}
                                        trigger="click"
                                        placement="bottom"
                                        onVisibleChange={projectVis => this.setState({ projectVis })}
                                        visible={projectVis}>
                                        {projectName
                                            ? <Button type="primary" style={{ width: 120 }} onClick={() => this.setState({ projectVis: true })}>{projectName}</Button>
                                            : <Button type="primary" style={{ width: 120 }} danger onClick={() => this.setState({ projectVis: true })}>点击选择项目</Button>}
                                    </Popover>
                                </div>
                            </div>
                            <div className='project-img'>
                                <span className='add-pro-span'>项目图片</span>
                                <div className='input-box'>
                                    {projectImage
                                        ? <div style={{ width: 150, height: 150, border: '1px solid #eee', overflow: 'hidden', lineHeight: '150px', textAlign: 'center' }}>
                                            <Image src={projectImage} style={{ width: '100%', height: '100%' }}></Image>
                                        </div>
                                        : <div style={{ width: 150, height: 150, border: '1px solid #eee' }}></div>}
                                </div>
                            </div>
                            <div className='cashmbLabel'>
                                <span className='add-pro-span'>消费金额</span>
                                <div className='input-box'>
                                    <Input placeholder='请输入用户消费金额' value={offlineAmount} style={{ width: 200 }}
                                        onChange={(e) => this.setState({ offlineAmount: e.target.value })}></Input>
                                </div>
                            </div>
                            <div className='cashmbLabel'>
                                <span className='add-pro-span'>用户手机号</span>
                                <div className='input-box'>
                                    <Input placeholder='请输入用户手机号' value={offlineUserPhone} style={{ width: 200 }}
                                        onChange={(e) => this.setState({ offlineUserPhone: e.target.value })}></Input>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='modalNote'>
                        <div style={{ width: '100%' }}><span>客户喜好</span></div>
                        <div>
                            <TextArea rows={4}
                                value={offlineMark}
                                onChange={e => this.setState({ offlineMark: e.target.value })}
                            />
                        </div>
                    </div>
                </Modal>
                {/* 订单信息详情 */}
                <Modal
                    visible={orderVisible}
                    title="订单信息"
                    onOk={() => this.updateOrder()}
                    onCancel={() => this.setState({ orderVisible: false, visible: false, customVisible: false })}
                    destroyOnClose={true}
                    bodyStyle={{ fontSize: '15px', padding: '10px', color: '#666666' }}
                    width={800}
                    okText="修改"
                    cancelText="取消"
                >
                    <div className='modalheader'>
                        <div className='modalItem'>
                            <span style={{ marginRight: 10 }}>美疗师</span>
                            {/* <span>{staffName ? staffName : '未分配美疗师'}</span> */}
                            <Popover
                                content={<Table
                                    columns={employColumns}
                                    dataSource={employList}
                                    style={{ textAlign: 'center' }}
                                    pagination={{ pageSize: 2 }}
                                    locale={{ emptyText: '暂无数据' }} />}
                                trigger="click"
                                onVisibleChange={visible => this.setState({ visible })}
                                placement="bottom"
                                visible={visible}
                            >

                                {
                                    staffName
                                        ? <Button type="primary" style={{ width: 120 }} onClick={() => this.setState({ visible: true })}>{staffName}</Button>
                                        : <Button type="primary" style={{ width: 120 }} danger onClick={() => this.setState({ visible: true })}>点击关联员工</Button>
                                }
                            </Popover>

                        </div>
                        <div className='modalItem'>
                            <span style={{ marginRight: 10 }}>客户</span>
                            <Popover
                                content={<Table
                                    columns={customColumns}
                                    dataSource={customData}
                                    style={{ textAlign: 'center' }}
                                    pagination={{ pageSize: 2 }}
                                    locale={{ emptyText: '暂无数据' }} />}
                                trigger="click"
                                onVisibleChange={customVisible => this.setState({ customVisible })}
                                placement="bottom"
                                visible={customVisible}
                            >

                                {
                                    clientLevel
                                        ? <Button style={{ width: 120 }} type="primary" onClick={() => this.setState({ customVisible: true })}>{clientName + '-' + clientLevel}</Button>
                                        : <Button style={{ width: 120 }} type="primary" danger onClick={() => this.setState({ customVisible: true })}>点击关联客户</Button>
                                }
                            </Popover>
                        </div>
                    </div>
                    <div className='modalBody'>
                        <div className='modalBodyChild'>
                            <div className='mbLabel'>
                                <span>订单编号</span>
                                <span>{orderId}</span>
                                {/* <span style={{ color: '#1089EB' }}>复制</span> */}
                            </div>
                            <div className='mbLabel'>
                                <span style={{ marginRight: 10 }}>项目名称</span>
                                <span>{name}</span>
                            </div>
                            <div className='mbLabel'>
                                <span style={{ marginRight: 10 }}>项目总数</span>
                                <span>{stagesNum}</span>
                            </div>
                            <div className='mbLabel'>
                                <span style={{ marginRight: 10 }}>分类</span>
                                <span>{classify === 1 ? '线上项目' : '线下项目'}</span>
                            </div>
                            <div className='mbLabel'>
                                <span style={{ marginRight: 10 }}>库存</span>
                                <span>{stock}</span>
                            </div>
                            <div className='mbLabel'>
                                <span style={{ marginRight: 10 }}>支付方式</span>
                                <span style={{ color: '#13CE66' }}>
                                    {payType === 'bank' ? '银行卡' : null}
                                    {payType === 'alipay' ? '支付宝' : null}
                                    {payType === 'weixin' ? '微信' : null}
                                </span>
                            </div>
                            <div className='mbLabel'>
                                <span style={{ marginRight: 10 }}>创建时间</span>
                                <span>{addTime}</span>
                            </div>
                        </div>
                        <div className='modalBodyChild'>
                            <div className='mbLabel'>
                                <span style={{ marginRight: 10 }}>订单状态</span>
                                <span>{paid === 0 ? '未支付' : '已支付'}</span>
                            </div>

                            {amount === null ? null : <div className='mbLabel'>
                                <span style={{ marginRight: 10 }}>项目分期总额</span>
                                <span>{amount}</span>
                            </div>}

                            {type === null ? null : <div className='mbLabel'>
                                <span style={{ marginRight: 10 }}>分期状态</span>
                                <span style={{ color: '#1089EB' }}>
                                    {type === 1 ? '分期中' : null}
                                    {type === 2 ? '已完成分期' : null}
                                    {type === 3 ? '异常分期' : null}
                                    {type === 4 ? '未处理' : null}
                                </span>
                            </div>}

                            <div className='mbLabel'>
                                <span style={{ marginRight: 10 }}>销量</span>
                                <span>{sales}</span>
                            </div>

                            {amount === null ? null : <div className='mbLabel'>
                                <span style={{ marginRight: 10 }}>项目分期</span>
                                <span>￥{stagesNum * stagesPrice}/{stagesNum}</span>
                                {
                                    surplus === 0 ? null : <span style={{ color: '#1089EB' }}>剩余{stagesPrice}/{surplus}期</span>
                                }
                            </div>}

                            <div className='mbLabel'>
                                <span style={{ marginRight: 10 }}>实际支付</span>
                                <span>￥{payPrice}</span>
                            </div>

                            <div className='mbLabel'>
                                <span style={{ marginRight: 10 }}>客户电话</span>
                                <span>{userPhone}</span>
                            </div>
                        </div>
                    </div>
                    <div className='modalNote'>
                        <div style={{ width: '100%' }}><span>备注</span></div>
                        <div>
                            <TextArea rows={4}
                                value={mark}
                                onChange={e => this.setState({ mark: e.target.value })}
                            />
                        </div>
                    </div>
                </Modal>

                <div className='footer-statistical'>
                    <span>总销售额：￥{allNum ? allNum : 0}</span>
                    <span>线上总销售额：￥{onlineNum ? onlineNum : 0}</span>
                    <span>线下总销售额：￥{offlineNum ? offlineNum : 0}</span>
                </div>
            </div>
        )
    }
}


export default Cashier