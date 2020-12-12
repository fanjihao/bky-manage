import React, { Component } from 'react'
import '../subscribe/Subscribe.css'
import {
    Image, Popover, Popconfirm, Space, Tag,
    Table, Input, Modal, Select, Radio, Upload,
    message, InputNumber, Button, Calendar, Switch,
    DatePicker, TimePicker
} from 'antd'
import { SearchOutlined, SyncOutlined, PlusOutlined } from '@ant-design/icons'
import axios from '../../http'
import locale from 'antd/lib/date-picker/locale/zh_CN'

const { TextArea } = Input
const { Option } = Select

export default class Subscribe extends Component {
    state = {
        emptyText: '暂无信息',
        loading: false,
        subscribeData: [],
        title: '',
        // 商品分类列表
        treeData: [],
        // 商品分类
        classify: 1,
        // 商品图片列表
        goodsImage: null,
        goodsName: '',
        goodsPrice: '',
        postage: 0,
        sales: '',
        stock: '',
        // 是否积分抵换，1是，0否
        integral: 1,
        // 可抵积分
        intNum: null,
        // 员工提成
        commission: 0,
        // 服务时长
        serviceLengthKey: 1,
        serviceLengthVal: '30分钟',
        // 可预约时间
        timeArr: [
            { id: 5, value: '8:00-8:30' },
            { id: 6, value: '8:30-9:00' },
            { id: 7, value: '9:00-9:30' },
            { id: 8, value: '9:30-10:00' },
            { id: 9, value: '10:00-10:30' },
            { id: 10, value: '10:30-11:00' },
            { id: 11, value: '11:00-11:30' },
            { id: 12, value: '11:30-12:00' },
            { id: 13, value: '13:00-13:30' },
            { id: 14, value: '13:30-14:00' },
            { id: 15, value: '14:00-14:30' },
            { id: 16, value: '14:30-15:00' },
            { id: 17, value: '15:00-15:30' },
            { id: 18, value: '15:30-16:00' },
            { id: 19, value: '16:00-16:30' },
            { id: 20, value: '16:30-17:00' },
            { id: 21, value: '17:00-17:30' },
            { id: 22, value: '17:30-18:00' },
            { id: 23, value: '18:00-18:30' },
            { id: 24, value: '18:30-19:00' },
            { id: 25, value: '19:00-19:30' },
            { id: 26, value: '19:30-20:00' },
            { id: 27, value: '20:00-20:30' },
            { id: 28, value: '20:30-21:00' },
            { id: 29, value: '21:00-21:30' },
            { id: 30, value: '21:30-22:00' },
        ],
        appointmenTime: [],
        timeLoading: true,
        // 最大人数
        limitPerson: 1,
        subVisible: false,
        // 产品详情
        remark: '',
        type: '',
        serviceType: 1,
        // 服务商品ID
        serviceId: null,
        // 搜索框内容
        searchVal: null,
        // 预约状态
        enableSub: 0,
        // 开启拼团模态框
        isSpellGroup: false,
        // 拼团名称
        spellName: '',
        // 拼团时效
        spellTime: 24,
        // 拼团开始日期
        startDate: '',
        startTime: '',
        // 拼团结束日期
        endDate: '',
        endTime: '',
        // 产品图片
        spellImage: null,
        // 拼团价
        spellPrice: 0,
        // 拼团人数
        spellPeople: 2,
        // 库存
        spellStock: '',
        // 销量
        spellSales: '',
        // 邮费
        spellPostage: 0,
        // 拼团图片预览
        spellPreview: false,
        // 拼团活动状态
        spellIsShow: 1,
        // 拼团描述
        spellDescription: '',
        // 拼团商品ID
        spellProductId: '',
        // 积分兑换
        integral: 1,
        // 提成比例
        commission: 0,
        // 拼团服务开始时间
        serviceStartTime: '',
        // 拼团服务结束时间
        serviceEndTime: '',
        // 原价
        originalPrice: '',
        // 拼团折扣
        spellDiscount: ''
    }
    componentDidMount() {
        this.goodsFenleiList()
        this.getService(1)
    }
    // 获取服务商品
    getService = type => {
        this.setState({ loading: true })
        const { searchVal } = this.state
        let user = JSON.parse(localStorage.getItem('user'))
        axios({
            method: 'GET',
            url: '/statistics/service',
            params: {
                enterId: user.id,
                type: type,
                name: searchVal
            }
        })
            .then(res => {
                console.log('查询服务商品成功', res)
                if (res.data.status === 200) {
                    this.setState({
                        subscribeData: res.data.data,
                        loading: false
                    })
                } else {
                    message.error(res.data.message)
                }
            })
            .catch(err => {
                console.log('查询服务商品失败', err)
            })
    }
    // 获取商品分类
    goodsFenleiList = () => {
        axios({
            url: '/api/yxStoreCategory',
            method: 'GET',
            params: {
                page: 0,
                size: 1000,
                sort: 'id,desc'
            }
        })
            .then(res => {
                console.log('获取商品分类成功', res)
                let treeArr = []
                treeArr = res.data.content.map(item => {
                    let obj = {}
                    obj = {
                        title: item.label,
                        value: item.id,
                        children: []
                    }
                    if (item.children) {
                        for (let i = 0; i < item.children.length; i++) {
                            let childObj = {}
                            childObj = {
                                title: item.children[i].label,
                                value: item.children[i].id,
                                pid: item.id
                            }
                            obj.children.push(childObj)
                        }
                    }
                    return obj
                })
                this.setState({ treeData: treeArr })
            })
            .catch(err => {
                console.log('获取商品分类失败', err)
            })
    }
    // 打开新增服务商品模态框
    addSubscribe = () => {
        this.setState({
            // 商品分类
            classify: 1,
            // 商品图片列表
            goodsImage: null,
            goodsName: '',
            goodsPrice: '',
            postage: 0,
            sales: '',
            stock: '',
            // 是否积分抵换，1是，0否
            integral: 1,
            // 员工提成
            commission: 0,
            title: '新增服务商品',
            type: 'add',
            intNum: 0,
            remark: null,
            enableSub: 0,
            serviceLengthVal: '30分钟',
            appointmenTime: [],
            limitPerson: 1,
            visible: true,
        })
    }
    // 上传服务商品照片
    uploadServiceImage = info => {
        const res = info.fileList[0].response
        if (res) {
            console.log('111111111', 'https://www.bkysc.cn/api/files-upload/' + res.data)
            this.setState({
                goodsImage: 'https://www.bkysc.cn/api/files-upload/' + res.data
            })
        }
    }
    // 正则判断员工提成
    setCommission = e => {
        this.setState({ commission: e.target.value }, () => {
            if (this.state.commission) {
                if (!(/^[0-9][0-9]{0,1}$/.test(this.state.commission))) {
                    message.warning('请输入1-99的整数')
                    this.setState({ commission: '' })
                }
            }
        })
    }
    // 新增、编辑服务商品
    addSubscribeGoods = (type) => {
        let user = JSON.parse(localStorage.getItem('user'))
        const { classify, goodsName, goodsImage, goodsPrice,
            sales, intNum, integral, remark, limitPerson, appointmenTime,
            serviceLengthVal, serviceId, enableSub } = this.state
        if (goodsName === '' || goodsImage === '' || goodsPrice === ''
            || sales === '' || intNum === '' || limitPerson === ''
            || appointmenTime.length === 0 || remark === '') {
            message.warning('请确定内容填写完整！')
        } else {
            let appointJSON = {}
            appointmenTime.map(item => {
                appointJSON[item] = limitPerson
            })
            if (type === 'add') {
                axios({
                    method: 'POST',
                    url: '/statistics/service',
                    data: {
                        merId: user.id,
                        cateId: classify,
                        storeName: goodsName,
                        otPrice: goodsPrice,
                        image: goodsImage,
                        ficti: sales,
                        storeInfo: remark,
                        isNew: 0,
                        isBest: 0,
                        isBennefit: 0,
                        useScore: integral,
                        giveIntegral: intNum,
                        appointmentMap: appointJSON,
                        timeQuantum: serviceLengthVal,
                        enableSub: enableSub
                    }
                })
                    .then(res => {
                        if (res.data.status === 200) {
                            console.log('新增服务商品成功', res)
                            this.getService(this.state.serviceType)
                            this.setState({ visible: false })
                        } else {
                            message.error(res.data.message)
                        }
                    })
                    .catch(err => {
                        console.log('新增服务商品失败', err)
                    })
            } else if (type === 'edit') {
                axios({
                    method: 'PUT',
                    url: '/statistics/service',
                    data: {
                        merId: user.id,
                        cateId: classify,
                        storeName: goodsName,
                        otPrice: goodsPrice,
                        image: goodsImage,
                        ficti: sales,
                        storeInfo: remark,
                        isNew: 0,
                        isBest: 0,
                        isBennefit: 0,
                        useScore: integral,
                        giveIntegral: intNum,
                        appointmentMap: appointJSON,
                        timeQuantum: serviceLengthVal,
                        id: serviceId,
                        enableSub: enableSub
                    }
                })
                    .then(res => {
                        if (res.data.status === 200) {
                            console.log('修改服务商品信息成功', res)
                            this.getService(this.state.serviceType)
                            this.setState({ visible: false })
                        } else {
                            console.log(res)
                            message.error(res.data.message)
                        }
                    })
                    .catch(err => {
                        console.log('修改服务商品失败', err)
                        message.error('服务器出错')
                    })
            }
        }

    }
    // 打开编辑框
    editService = record => {
        let appointmenTime = []
        for (let key in JSON.parse(record.appointment)) {
            appointmenTime.push(key)
        }
        let limitPerson = JSON.parse(record.appointment)[appointmenTime[0]]
        this.setState({
            type: 'edit',
            visible: true,
            goodsName: record.storeName,
            goodsImage: record.image,
            classify: record.cateId,
            goodsPrice: record.otPrice,
            sales: record.ficti,
            integral: record.useScore,
            intNum: record.giveIntegral,
            limitPerson: limitPerson,
            appointmenTime: appointmenTime,
            remark: record.storeInfo,
            serviceId: record.id,
            enableSub: record.enableSub
        })
    }
    // 删除服务商品
    delService = id => {
        axios({
            method: 'DELETE',
            url: `/statistics/service?id=${id}`
        })
            .then(res => {
                if (res.data.status === 200) {
                    console.log('删除服务商品成功', res)
                    this.getService(this.state.serviceType)
                } else {
                    message.error(res.data.message)
                }
            })
            .catch(err => {
                console.log('删除服务商品失败', err)
            })
    }
    // 回收站彻底删除
    removeService = id => {
        axios({
            method: 'GET',
            url: '/statistics/removeService',
            params: {
                id: id
            }
        })
            .then(res => {
                if (res.data.status === 200) {
                    console.log('彻底删除成功', res)
                    this.getService(this.state.serviceType)
                    this.setState({ visible: false })
                } else {
                    message.error(res.data.message)
                }
            })
            .catch(err => {
                console.log('彻底删除失败', err)
            })
    }
    // 从回收站恢复
    restoreService = id => {
        axios({
            method: 'GET',
            url: '/statistics/recoveryService',
            params: {
                id: id
            }
        })
            .then(res => {
                if (res.data.status === 200) {
                    console.log('恢复成功', res)
                    this.getService(this.state.serviceType)
                    this.setState({ visible: false })
                } else {
                    message.error(res.data.message)
                }
            })
            .catch(err => {
                console.log('恢复失败', err)
            })
    }
    // 上下架
    changeFrame = id => {
        axios({
            method: 'PUT',
            url: `/statistics/dismountService?id=${id}`,
            // data: {
            //     id: id
            // }
        })
            .then(res => {
                console.log('上下架成功', res)
                this.getService(this.state.serviceType)
            })
            .catch(err => {
                console.log('上下架失败', err)
            })
    }
    // 开启关闭预约
    switchService = (e, id) => {
        let enableSub = e ? 0 : 1
        let user = JSON.parse(localStorage.getItem('user'))
        console.log(enableSub, id)
        axios({
            method: 'PUT',
            url: '/sub/operate',
            data: {
                enterId: user.id,
                productId: id,
                operate: enableSub
            }
        })
            .then(res => {
                console.log('开启或关闭预约成功', res)
                if (res.data.status === 200) {
                    message.success(res.data.message)
                    this.getService(this.state.serviceType)
                } else {
                    message.error(res.data.message)
                }
            })
            .catch(err => {
                console.log('开启或关闭预约失败', err)
            })
    }
    // 打开设置拼团模态框
    spellGroup = data => {
        console.log(data)
        this.setState({
            spellName: data.storeName,
            spellImage: data.image,
            // spellStock: data.stock,
            spellSales: data.ficti,
            // spellPrice: data.price,
            spellProductId: data.id,
            originalPrice: data.price,
            isSpellGroup: true
        })
    }
    // 新增拼团
    addSpellGroup = () => {
        const { spellName, spellTime, spellImage, spellPrice,
            spellPeople, spellSales, spellStock, spellPostage,
            startDate, startTime, endTime, endDate, spellDescription,
            spellIsShow, spellProductId, spellDiscount } = this.state
        let merId = JSON.parse(localStorage.getItem('user')).id
        if (startDate === '' || startTime === '' || endDate === '' || endTime === ''
            || spellDescription === '' || spellDiscount === '' || spellName === ''
            || spellImage === '' || spellPeople === '' || spellSales === ''
            || spellStock === '' || spellPostage === '') {
            message.warning('请确认信息填写完整！')
        } else {
            axios({
                method: 'PUT',
                url: '/api/yxStoreCombination',
                data: {
                    title: spellName,
                    effectiveTime: spellTime,
                    startTimeDate: startDate + ' ' + startTime,
                    endTimeDate: endDate + ' ' + endTime,
                    image: spellImage,
                    price: spellPrice,
                    people: spellPeople,
                    sales: spellSales,
                    stock: spellStock,
                    postage: spellPostage,
                    isShow: spellIsShow,
                    description: spellDescription,
                    productId: spellProductId,
                    merId: merId,
                    isDel: 0,
                    combination: 1,
                    isHost: 0,
                    discount: spellDiscount
                }
            })
                .then(res => {
                    console.log('新增拼团成功', res)
                    this.setState({ isSpellGroup: false })
                    message.success('新增拼团商品成功')
                })
                .catch(err => {
                    console.log('新增拼团失败', err)
                })
        }
    }
    // 上传拼团照片
    uploadSpellImage = info => {
        const res = info.fileList[0].response
        if (res) {
            this.setState({
                spellImage: 'https://www.bkysc.cn/api/files-upload/' + res.data
            })
        }
    }
    // 拼团开始日期
    getStartDate = e => {
        console.log(e)
        const startDate = e._d.getFullYear() + '-' + (e._d.getMonth() + 1) + '-' + e._d.getDate()
        console.log(startDate)
        this.setState({ startDate: startDate })
    }
    // 拼团开始时间
    getStartTime = e => {
        console.log(e)
        let hour = e._d.getHours()
        let minute = e._d.getMinutes()
        let second = e._d.getSeconds()
        if (hour < 10) {
            hour = '0' + hour
        }
        if (minute < 10) {
            minute = '0' + minute
        }
        if (second < 10) {
            second = '0' + second
        }

        const startTime = hour + ':' + minute + ':' + second
        console.log(startTime)
        this.setState({ startTime: startTime })
    }
    // 拼团结束日期
    getEndDate = e => {
        console.log(e)
        const endDate = e._d.getFullYear() + '-' + (e._d.getMonth() + 1) + '-' + e._d.getDate()
        console.log(endDate)
        this.setState({ endDate: endDate })
    }
    // 拼团结束时间
    getEndTime = e => {
        console.log(e)
        let hour = e._d.getHours()
        let minute = e._d.getMinutes()
        let second = e._d.getSeconds()
        if (hour < 10) {
            hour = '0' + hour
        }
        if (minute < 10) {
            minute = '0' + minute
        }
        if (second < 10) {
            second = '0' + second
        }

        const endTime = hour + ':' + minute + ':' + second
        console.log(endTime)
        this.setState({ endTime: endTime })
    }

    // 正则判断线上商品员工提成
    setCommission = e => {
        this.setState({ commission: e.target.value }, () => {
            if (this.state.commission) {
                if (!(/^[0-9][0-9]{0,1}$/.test(this.state.commission))) {
                    message.warning('请输入1-99的整数')
                    this.setState({ commission: '' })
                }
            }
        })
    }
    // 正则判断分期商品员工提成
    setRoyaltyRate = e => {
        this.setState({ royaltyRate: e.target.value }, () => {
            if (this.state.royaltyRate) {
                if (!(/^[0-9][0-9]{0,1}$/.test(this.state.royaltyRate))) {
                    message.warning('请输入1-99的整数')
                    this.setState({ royaltyRate: '' })
                }
            }
        })
    }

    // 拼团商品服务时间
    service = value => {
        console.log(value)
    }

    // 设置拼团折扣
    setDiscount = e => {
        const { originalPrice } = this.state
        const discount = e.target.value
        this.setState({
            spellDiscount: discount,
            spellPrice: originalPrice * discount
        })
    }
    render() {
        const { emptyText, loading, subscribeData, visible, treeData,
            title, classify, goodsImage, goodsName, goodsPrice, postage,
            sales, stock, integral, commission, serviceLengthKey,
            serviceLengthVal, timeArr, timeLoading, appointmenTime,
            limitPerson, intNum, subVisible, remark, type, serviceType,
            searchVal, enableSub, isSpellGroup, spellName, spellTime,
            spellImage, originalPrice, spellDiscount, spellPrice,
            spellPeople, spellStock, spellSales, spellPostage, spellIsShow,
            spellDescription
        } = this.state
        const serviceColumns = [
            {
                title: '服务编号',
                dataIndex: 'id',
                key: 'id',
                align: 'center',
                width: 120
            },
            {
                title: '服务图片',
                dataIndex: 'image',
                key: 'image',
                align: 'center',
                render: text => <img src={text} className='tableGoodsImg' />,
                width: 120
            },
            {
                title: '服务名称',
                dataIndex: 'storeName',
                key: 'storeName',
                align: 'center',
                width: 120
            },
            {
                title: '服务时长',
                dataIndex: 'timeQuantum',
                key: 'timeQuantum',
                align: 'center',
                width: 120
            },
            {
                title: '价格',
                dataIndex: 'otPrice',
                key: 'otPrice',
                align: 'center',
                width: 80
            },
            {
                title: '积分抵扣',
                dataIndex: 'giveIntegral',
                key: 'giveIntegral',
                align: 'center',
                width: 120,
                render: (text, record) => record.useScore === 1 ? <span>{text}</span> : <span>未开启</span>
            },
            {
                title: '销量',
                key: 'ficti',
                dataIndex: 'ficti',
                align: 'center',
                width: 80
            },
            {
                title: '系统状态',
                key: 'isShow',
                dataIndex: 'isShow',
                render: (text, record) => {
                    if (serviceType === 1) {
                        return <Popover content={
                            <Tag
                                style={{ cursor: 'pointer' }}
                                color='red'
                                onClick={() => this.changeFrame(record.id)}
                            >下架</Tag>
                        }>
                            <Tag color='#2596FF'>已上架</Tag>
                        </Popover>
                    } else if (serviceType === 0) {
                        return <Popover content={
                            <Tag
                                color='red'
                                style={{ cursor: 'pointer' }}
                                onClick={() => this.changeFrame(record.id)}
                            >上架</Tag>
                        }>
                            <Tag color='#2596FF'>待上架</Tag>
                        </Popover>
                    } else {
                        return <Tag color='#1890FF'>已删除</Tag>
                    }
                },
                align: 'center',
                width: 120
            },
            {
                title: '预约状态',
                dataIndex: 'enableSub',
                key: 'enableSub',
                align: 'center',
                width: 120,
                render: (text, record) => serviceType === 1
                    ? <Popover
                        content={
                            <span style={{ color: 'red' }}>开启或关闭预约！！！</span>
                        }
                    >
                        <Switch
                            checkedChildren="开启"
                            unCheckedChildren="关闭"
                            checked={text === 0 ? true : false}
                            onClick={e => this.switchService(e, record.id)}
                        />
                    </Popover>
                    : <span>无</span>
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => {
                    if (serviceType === 1) {
                        return (<Space size="middle">
                            <a style={{ color: '#13CE66' }} onClick={() => this.editService(record)} >编辑</a>
                            <Popconfirm
                                title="请您确认是否删除?"
                                onConfirm={() => this.delService(record.id)}
                                okText="是"
                                cancelText="否"
                            >
                                <a style={{ color: '#FF5A5A' }}>删除</a>
                            </Popconfirm>
                            <a style={{ color: '#2C9DFF' }} onClick={() => this.spellGroup(record)}>开启拼团</a>
                        </Space>)
                    } else if (serviceType === 0) {
                        return (<Space size="middle">
                            <a style={{ color: '#13CE66' }} onClick={() => this.editService(record)} >编辑</a>
                            <Popconfirm
                                title="请您确认是否删除?"
                                onConfirm={() => this.delService(record.id)}
                                okText="是"
                                cancelText="否"
                            >
                                <a style={{ color: '#FF5A5A' }}>删除</a>
                            </Popconfirm>
                        </Space>)
                    } else {
                        return (<Space size="middle">
                            <Popconfirm
                                title="请您确认是否恢复?"
                                onConfirm={() => this.restoreService(record.id)}
                                okText="是"
                                cancelText="否"
                            >
                                <a style={{ color: '#13CE66' }}>恢复</a>
                            </Popconfirm>
                            <Popconfirm
                                title="请您确认是否彻底删除?"
                                onConfirm={() => this.removeService(record.id)}
                                okText="是"
                                cancelText="否"
                            >
                                <a style={{ color: '#FF5A5A' }}>彻底删除</a>
                            </Popconfirm>
                        </Space>)
                    }
                },
                align: 'center',
                // width: 500
            },
        ]
        const uploadButtonA = (
            <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上传</div>
            </div>
        )
        return (
            <div className="subscribe">
                <div className="homeIndex-header">
                    <span>线下服务</span>
                </div>

                <div className='goodsBody' style={{ marginTop: 20 }}>
                    <div className='goodsBodyTab'>
                        <div className={serviceType === 1 ? 'gtActive' : 'gbTabBtn'}
                            onClick={() => {
                                this.getService(1)
                                this.setState({ serviceType: 1 })
                            }}>出售中</div>
                        <div className={serviceType === 0 ? 'gtActive' : 'gbTabBtn'}
                            onClick={() => {
                                this.getService(0)
                                this.setState({ serviceType: 0 })
                            }}>待上架</div>
                        <div className={serviceType === 3 ? 'gtActive' : 'gbTabBtn'}
                            onClick={() => {
                                this.getService(3)
                                this.setState({ serviceType: 3 })
                            }}>回收站</div>
                    </div>

                    <div className="search">
                        <Input
                            placeholder="请输入商品名搜索"
                            className="spell-searchInput"
                            value={searchVal}
                            onChange={e => this.setState({ searchVal: e.target.value })}
                        />
                        <div className='spell-searchBtn search-btn' onClick={() => this.getService(this.state.serviceType)}>
                            <SearchOutlined />
                            <span>搜索</span>
                        </div>
                        <div className="spell-refresh" onClick={() => this.getService(serviceType)}>
                            <SyncOutlined />
                            <span>刷新</span>
                        </div>
                        <div className='add-btn add-subscribe-btn' onClick={this.addSubscribe}>
                            <PlusOutlined />
                            <span>新增服务</span>
                        </div>
                    </div>

                    <Table
                        columns={serviceColumns}
                        dataSource={subscribeData}
                        style={{ textAlign: 'center' }}
                        pagination={{ pageSize: 4, position: ['bottomLeft'] }}
                        loading={loading}
                        locale={{ emptyText: emptyText }} />
                </div>

                {/* 添加、编辑模态框 */}
                <Modal
                    visible={visible}
                    onCancel={() => this.setState({ visible: false })}
                    onOk={() => this.addSubscribeGoods(type)}
                    width={800}
                    okText='确定'
                    cancelText="取消"
                    title={title}
                >
                    <div className='goodsModalItem'>
                        <span className='gmiLabel'>商品分类</span>
                        <Select
                            style={{ width: 150 }}
                            onChange={e => this.setState({ value: e })}
                            value={classify}
                        >
                            {
                                treeData.map((item) => (
                                    <Option value={item.value}>{item.title}</Option>
                                ))
                            }
                        </Select>
                    </div>
                    <div className='goodsModalItem'>
                        <span className='gmiLabel'>商品名称</span>
                        <Input
                            placeholder='请输入项目名称'
                            style={{ width: 250 }}
                            value={goodsName}
                            onChange={e => this.setState({ goodsName: e.target.value })}
                        />
                    </div>

                    <div className='goodsModalImg'>
                        <span className='gmiLabel'>商品图片</span>
                        <Upload
                            listType="picture-card"
                            showUploadList={false}
                            action="http://47.108.174.202:9010/upload/files-upload"
                            onChange={this.uploadServiceImage}
                            className='avatar-uploader'
                        >
                            {goodsImage === null
                                ? uploadButtonA
                                : <img src={goodsImage} alt="photos" className='fItemConimg' />}
                        </Upload>
                    </div>

                    <div className='goodsModalItem'>
                        <div className='littleitem'>
                            <span className='littleLabel'>商品价格</span>
                            <Input
                                placeholder='请输入价格'
                                value={goodsPrice}
                                onChange={e => this.setState({ goodsPrice: e.target.value })}
                            />
                        </div>
                        <div className='littleitem'>
                            <span className='littleLabel'>销量</span>
                            <Input
                                placeholder='请输入销量'
                                value={sales}
                                onChange={e => this.setState({ sales: e.target.value })}
                            />
                        </div>
                    </div>

                    <div style={{ margin: '10px 39px' }}>
                        <span className='integralSpan'>积分抵扣</span>
                        <div className="integral">
                            <Radio.Group value={integral} onChange={e => this.setState({ integral: e.target.value })}>
                                <Radio value={1}>开启</Radio>
                                <Radio value={0}>关闭</Radio>
                            </Radio.Group>
                        </div>
                        {
                            integral === 0 ? null : <span className='integralSpan'>可抵积分</span>
                        }
                        {
                            integral === 0 ? null : <div className="integral">
                                <Input
                                    className="commission"
                                    placeholder="请输入整数"
                                    value={intNum}
                                    onChange={e => this.setState({ intNum: e.target.value })}
                                    onBlur={() => {
                                        if (/^([0-9][0-9]*)$/.test(this.state.intNum)) {

                                        } else {
                                            message.warning('请输入整数')
                                            this.setState({ intNum: null })
                                        }
                                    }}
                                />
                            </div>
                        }
                    </div>
                    <div className='goodsModalItem'>
                        <span className='gmiLabel'>服务时长</span>
                        <Select
                            placeholder='请选择服务时长'
                            style={{ width: 250 }}
                            value={serviceLengthVal}
                            onChange={(key, item) => {
                                this.setState({
                                    serviceLengthKey: item.key,
                                    serviceLengthVal: item.children
                                }, () => {
                                    let timeArr
                                    if (this.state.serviceLengthVal === '30分钟') {
                                        timeArr = [
                                            { id: 5, value: '8:00-8:30' },
                                            { id: 6, value: '8:30-9:00' },
                                            { id: 7, value: '9:00-9:30' },
                                            { id: 8, value: '9:30-10:00' },
                                            { id: 9, value: '10:00-10:30' },
                                            { id: 10, value: '10:30-11:00' },
                                            { id: 11, value: '11:00-11:30' },
                                            { id: 12, value: '11:30-12:00' },
                                            { id: 13, value: '13:00-13:30' },
                                            { id: 14, value: '13:30-14:00' },
                                            { id: 15, value: '14:00-14:30' },
                                            { id: 16, value: '14:30-15:00' },
                                            { id: 17, value: '15:00-15:30' },
                                            { id: 18, value: '15:30-16:00' },
                                            { id: 19, value: '16:00-16:30' },
                                            { id: 20, value: '16:30-17:00' },
                                            { id: 21, value: '17:00-17:30' },
                                            { id: 22, value: '17:30-18:00' },
                                            { id: 23, value: '18:00-18:30' },
                                            { id: 24, value: '18:30-19:00' },
                                            { id: 25, value: '19:00-19:30' },
                                            { id: 26, value: '19:30-20:00' },
                                            { id: 27, value: '20:00-20:30' },
                                            { id: 28, value: '20:30-21:00' },
                                            { id: 29, value: '21:00-21:30' },
                                            { id: 30, value: '21:30-22:00' },
                                        ]
                                    } else if (this.state.serviceLengthVal === '60分钟') {
                                        timeArr = [
                                            { id: 31, value: '8:00-9:00' },
                                            { id: 32, value: '9:00-10:00' },
                                            { id: 33, value: '10:00-11:00' },
                                            { id: 34, value: '11:00-12:00' },
                                            { id: 35, value: '13:00-14:00' },
                                            { id: 36, value: '14:00-15:00' },
                                            { id: 37, value: '15:00-16:00' },
                                            { id: 38, value: '16:00-17:00' },
                                            { id: 39, value: '17:00-18:00' },
                                            { id: 40, value: '18:00-19:00' },
                                            { id: 41, value: '19:00-20:00' },
                                            { id: 42, value: '20:00-21:00' },
                                            { id: 43, value: '21:00-22:00' },
                                        ]
                                    } else if (this.state.serviceLengthVal === '90分钟') {
                                        timeArr = [
                                            { id: 44, value: '8:00-9:30' },
                                            { id: 45, value: '9:30-11:00' },
                                            { id: 46, value: '11:00-12:30' },
                                            { id: 47, value: '13:30-15:00' },
                                            { id: 48, value: '15:00-16:30' },
                                            { id: 49, value: '16:30-18:00' },
                                            { id: 50, value: '18:00-19:30' },
                                            { id: 51, value: '19:30-21:00' },
                                            { id: 52, value: '21:00-22:30' },
                                        ]
                                    } else {
                                        timeArr = [
                                            { id: 53, value: '8:00-10:00' },
                                            { id: 54, value: '10:00-12:00' },
                                            { id: 55, value: '13:00-15:00' },
                                            { id: 56, value: '15:00-17:00' },
                                            { id: 57, value: '17:00-19:00' },
                                            { id: 58, value: '19:00-21:00' },
                                        ]
                                    }
                                    this.setState({
                                        timeArr,
                                        appointmenTime: []
                                    })
                                })
                            }}
                        >
                            <Option key={1} label='30分钟'>30分钟</Option>
                            <Option key={2} label='60分钟'>60分钟</Option>
                            <Option key={3} label='90分钟'>90分钟</Option>
                            <Option key={4} label='120分钟'>120分钟</Option>
                        </Select>
                    </div>

                    <div className='subTime'>
                        <span className='gmiLabel'>可预约时间</span>
                        <Select
                            placeholder='请选择可预约时间'
                            style={{ width: 500 }}
                            defaultValue={appointmenTime}
                            value={appointmenTime}
                            mode="multiple"
                            optionLabelProp="label"
                            onChange={(value, label) => {
                                console.log(value)
                                this.setState({
                                    appointmenTime: value
                                })
                            }}
                        >
                            {timeArr.map(item => {
                                return (
                                    <Option key={item.id} label={item.value} value={item.value}>{item.value}</Option>
                                )
                            })}
                        </Select>
                    </div>
                    <div className='goodsModalItem'>
                        <span className='gmiLabel'>服务人数上限</span>
                        <InputNumber
                            min={1}
                            max={10}
                            value={limitPerson}
                            style={{ width: 250 }}
                            onChange={e => this.setState({ limitPerson: e })}
                        />
                    </div>

                    <div className='itemDirecte'>
                        <span className='gmiLabel'>产品详情</span>
                        <TextArea
                            rows={6}
                            style={{ width: '70%' }}
                            value={remark}
                            onChange={e => this.setState({ remark: e.target.value })}
                        />
                    </div>
                </Modal>

                {/* 开启拼团模态框 */}
                <Modal
                    visible={isSpellGroup}
                    onCancel={() => this.setState({ isSpellGroup: false })}
                    onOk={this.addSpellGroup}
                    width={800}
                    okText='确定'
                    cancelText="取消"
                    title="开启拼团"
                >
                    <div style={{ width: '80%', margin: '0 auto' }}>
                        <div className="spellItem">
                            <span className="spellSpan">拼团名称</span>
                            <Input
                                className="spellInput"
                                value={spellName}
                                allowClear={false}
                                onChange={e => this.setState({ spellName: e.target.value })}
                            />
                        </div>

                        {/* <div className="spellItem">
                            <span className="spellSpan">拼团时效</span>
                            <Input
                                className="spellInput"
                                value={spellTime}
                                allowClear={false}
                                onChange={e => this.setState({ spellTime: e.target.value })}
                            />
                        </div> */}

                        <div className="spellItem">
                            <span className="spellSpan">拼团开始时间</span>
                            <DatePicker
                                locale={locale}
                                style={{ marginRight: 10 }}
                                allowClear={false}
                                onChange={this.getStartDate}
                            />
                            <TimePicker
                                locale={locale}
                                allowClear={false}
                                onChange={this.getStartTime}
                            />
                        </div>

                        <div className="spellItem">
                            <span className="spellSpan">拼团结束时间</span>
                            <DatePicker
                                locale={locale}
                                allowClear={false}
                                style={{ marginRight: 10 }}
                                onChange={this.getEndDate}
                            />
                            <TimePicker
                                locale={locale}
                                allowClear={false}
                                onChange={this.getEndTime}
                            />
                        </div>

                        {/* <div className="spellItem">
                                <span className="spellSpan">服务时间段</span>
                                <RangePicker
                                    locale={locale}
                                    // showTime={{ format: 'HH'}}
                                    format="YYYY-MM-DD"
                                    onChange={this.service}
                                    value={moment[serviceStartTime,serviceEndTime]}
                                />
                            </div> */}

                        <div className="spellItem">
                            <span className="spellSpan">产品图片</span>
                            <div className="spellItemImage">
                                <Upload
                                    listType="picture-card"
                                    showUploadList={false}
                                    action="http://47.108.174.202:9010/upload/files-upload"
                                    onChange={this.uploadSpellImage}
                                >
                                    {spellImage === null
                                        ? uploadButtonA
                                        : <img src={spellImage} alt="photos" className='fItemConimg' />}
                                </Upload>
                            </div>
                        </div>

                        <div className="spellItem">
                            <div className="timeItem">
                                <span className="smallSpan">原价</span>
                                <Input
                                    disabled={true}
                                    className="smallInput"
                                    value={originalPrice}
                                // onChange={e => this.setState({ spellPrice: e.target.value })}
                                />
                            </div>
                            <div className="timeItem">
                                <span className="smallSpan">拼团折扣</span>
                                <Input
                                    className="smallInput"
                                    placeholder="请输入两位小数，例如0.85"
                                    value={spellDiscount}
                                    onChange={e => this.setDiscount(e)}
                                    onBlur={() => {
                                        if (this.state.spellDiscount) {
                                            if (!/^\d+(\.\d{0,2})?$/.test(this.state.spellDiscount)) {
                                                message.warning('折扣请正确输入两位小数')
                                                this.setState({
                                                    spellDiscount: '',
                                                    spellPrice: ''
                                                })
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        <div className="spellItem">
                            <div className="timeItem">
                                <span className="smallSpan">拼团价</span>
                                <Input
                                    disabled={true}
                                    className="smallInput"
                                    placeholder="请输入拼团折扣"
                                    value={spellPrice}
                                // onChange={e => this.setState({ spellPrice: e.target.value })}
                                />
                            </div>
                            <div className="timeItem">
                                <span className="smallSpan">拼团人数</span>
                                <Input
                                    className="smallInput"
                                    value={spellPeople}
                                    onChange={e => this.setState({ spellPeople: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="spellItem">
                            <div className="timeItem">
                                <span className="smallSpan">库存</span>
                                <Input
                                    placeholder="请输入库存"
                                    className="smallInput"
                                    value={spellStock}
                                    onChange={e => this.setState({ spellStock: e.target.value })}
                                />
                            </div>
                            <div className="timeItem">
                                <span className="smallSpan">销量</span>
                                <Input
                                    className="smallInput"
                                    value={spellSales}
                                    onChange={e => this.setState({ spellSales: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* <div className="spellItem">
                            <div className="timeItem">
                                <span className="smallSpan">邮费</span>
                                <Input
                                    className="smallInput"
                                    value={spellPostage}
                                    onChange={e => this.setState({ spellPostage: e.target.value })}
                                />
                            </div>

                            <div className="timeItem">
                                <span className="smallSpan">活动状态</span>
                                <div className="spellIsShow">
                                    <Radio.Group value={spellIsShow} onChange={e => this.setState({ spellIsShow: e.target.value })}>
                                        <Radio value={1}>开启</Radio>
                                        <Radio value={0}>关闭</Radio>
                                    </Radio.Group>
                                </div>
                            </div>
                        </div> */}

                        <div className="spellItem">
                            <span className="spellSpan areaSpan">拼团内容</span>
                            <TextArea
                                className="smallInput"
                                rows={4}
                                placeholder="请输入拼团内容及描述"
                                value={spellDescription}
                                onChange={e => this.setState({ spellDescription: e.target.value })}
                            />
                        </div>

                    </div>

                </Modal>
            </div>
        )
    }
}