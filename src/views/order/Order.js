import React, { Component } from 'react'
import '../goods/Goods.css'
import './Order.css'
import { Input, Select, Button, Space, Table, Tag, Modal, message, Image, Popover } from 'antd'
import axios from '../../http/index'
import { SearchOutlined } from '@ant-design/icons'

const { Option } = Select
const { TextArea } = Input

class Order extends Component {
    state = {
        goodsIndex: 1,
        orderVisible: false,
        listPhased: [],
        listOnline: [],
        visible: false,
        modalType: '',
        islook: false,
        orderId: '', // 编号
        orderName: '', // 名字
        orderNum: '', // 分期数
        orderStagePrice: '', // 每期支付
        orderPayType: '', // 支付方式
        orderPrice: '', // 总价
        orderState: '', // 状态
        orderPay: '', // 已支付
        orderCreate: '', // 创建时间
        orderRemarks: '', // 备注
        orderOtherNum: '',
        orderOtherPrice: '',
        data: [],
        linkEmploy: '',
        linkId: '',
        username: '',

        // 
        stageName: '',

        //
        goodsVisible: false,
        goodsOrderid: '',
        goodsOrdertime: '',
        goodsPerson: '',
        goodsPhone: '',
        goodsAddress: '',
        goodsTotalNum: '',
        goodsTotalPrice: '',
        goodsPostage: '',
        goodsState: '',

        stateVisible: '',
        stateVal: '',
        loading: true
    }

    getStoreStage() {
        let user = JSON.parse(localStorage.getItem('user'))
        axios({
            url: '/merchantOrder/listPhasedProject',
            method: 'GET',
            params: {
                enterId: user.id,
                limit: 10,
                offset: 1,
            }
        })
            .then(res => {
                if (res.data.data.list) {
                    let list = res.data.data.list
                    list.map(item => {
                        item.key = item.id
                    })
                    this.setState({
                        listPhased: list,
                        loading: false
                    })
                }
            })
            .catch(err => {
                console.log(err)
                message.error('查询失败')
            })
    }
    getStageState(type) {
        let user = JSON.parse(localStorage.getItem('user'))
        axios({
            url: '/merchantOrder/listPhasedProject',
            method: 'GET',
            params: {
                enterId: user.id,
                limit: 10,
                offset: 1,
                type
            }
        })
            .then(res => {
                if (res.data.data.list) {
                    let list = res.data.data.list
                    list.map(item => {
                        item.key = item.id
                    })
                    this.setState({
                        listPhased: list,
                        loading: false
                    })
                }
            })
            .catch(err => {
                console.log(err)
                message.error('查询失败')
            })
    }
    getStoreOnline = () => {
        let user = JSON.parse(localStorage.getItem('user'))
        axios({
            url: '/merchantOrder/listOnLineProduct',
            method: 'GET',
            params: {
                enterId: user.id,
                limit: 10,
                offset: 1,
                type: '',
                userPhone: ''
            }
        })
            .then(res => {
                if (res.data.data.list) {
                    let list = res.data.data.list
                    list.map(item => {
                        item.key = item.id
                    })
                    this.setState({
                        listOnline: list,
                        loading: false
                    })
                }
            })
            .catch(err => {
                message.error('查询失败')
            })
    }
    componentDidMount() {
        this.getStoreStage()
        this.getEmploy()
    }
    checkList = (i) => {
        this.setState({
            goodsIndex: i
        }, () => {
            if (i === 1) {
                this.getStoreStage()
            } else {
                this.getStoreOnline()
            }
        })
    }
    // 气泡删除
    confirm = (re) => {
        console.log('确认删除', re)
    }
    realDel = (re) => {
        console.log('彻底删除', re)
    }
    restore = re => {
        console.log('恢复', re)
    }
    // 气泡取消
    cancel = () => {
        console.log('取消删除')
    }
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
                this.setState({
                    data: res.data.data.list
                })
            })
            .catch(err => {
            })
    }
    lookOrder = (i, type) => {
        console.log('===============', i)
        if (type === 'look') {
            this.setState({
                islook: true,
                modalType: type,
                orderVisible: true,
                orderId: i.orderId,
                orderName: i.name,
                orderNum: i.stagesNumber,
                orderStagePrice: i.stagesPrice,
                orderPayType: i.payType,
                orderPrice: i.price,
                orderState: i.type,
                orderPay: i.amount,
                orderCreate: i.createTime,
                orderRemarks: i.remarks,
                orderOtherNum: i.surplusNum,
                orderOtherPrice: '',
                username: i.userName,
                linkEmploy: i.staffName,
                type: i.type
            })
        } else {
            this.setState({
                modalType: type,
                islook: false,
                orderVisible: true,
                orderId: i.orderId,
                orderName: i.name,
                orderNum: i.stagesNumber,
                orderStagePrice: i.stagesPrice,
                orderPayType: i.payType,
                orderPrice: i.price,
                orderState: i.type,
                orderPay: i.amount,
                orderCreate: i.createTime,
                orderRemarks: i.remarks,
                orderOtherNum: i.surplusNum,
                orderOtherPrice: '',
                linkEmploy: i.staffName,
                linkId: i.staffId,
                username: i.userName,
                type: i.type
            })
        }
    }
    handleVisibleChange = visible => {
        this.setState({ visible })
    }
    VisibleChange = stateVisible => {
        this.setState({
            stateVisible
        })
    }
    stageChange = () => {
        const { orderId, orderRemarks, linkId, username } = this.state
        axios({
            url: '/merchantOrder/updatePhasedProject',
            method: 'GET',
            params: {
                orderId,
                remarks: orderRemarks,
                staffId: linkId,
                userName: username
            }
        })
            .then(res => {
                message.success('修改成功')
                this.getStoreStage()
                this.setState({
                    orderVisible: false,
                })
            })
            .catch(err => {
                console.log(err)
            })
    }
    //
    editGoods = (i, type) => {
        axios({
            url: '/merchantOrder/storeOrderDetails',
            method: 'GET',
            params: {
                orderId: i.orderId
            }
        })
            .then(res => {
                console.log(res)
                this.setState({
                    goodsVisible: true,
                    goodsOrderid: res.data.orderId,
                    goodsOrdertime: i.creatTime,
                    goodsPerson: res.data.realName,
                    goodsPhone: res.data.userPhone,
                    goodsAddress: res.data.userAddress,
                    goodsTotalNum: res.data.totalNum,
                    goodsTotalPrice: res.data.totalPrice,
                    goodsPostage: res.data.totalPostage,
                    goodsState: res.data.status
                })
            })
            .catch(err => {
                console.log(err)
            })
    }
    render() {
        const columns = [
            {
                title: '项目编号',
                dataIndex: 'id',
                key: 'id',
                render: text => <a>{text}</a>,
            },
            {
                title: '项目图片',
                dataIndex: 'photo',
                key: 'photo',
                render: text => {
                    let src = text.split(',')[0]
                    return <Image className='tableGoodsImg' alt={src} src={src}></Image>
                },
            },
            {
                title: '项目名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '分类名称',
                dataIndex: 'cateName',
                key: 'cateName',
            },
            {
                title: '项目价格',
                dataIndex: 'price',
                key: 'price',
            },
            {
                title: '分期数',
                key: 'stagesNumber',
                dataIndex: 'stagesNumber',
                render: tags => (
                    <>{tags}</>
                ),
            },
            {
                title: '项目状态',
                key: 'type',
                dataIndex: 'type',
                render: (state, record) => {
                    if (state === 4) {
                        return <Tag color='blue'>未处理分期</Tag>
                    } else if (state === 1) {
                        return <div>
                            <Tag color='blue'>分期中</Tag>
                            <p style={{ color: '#1089EB' }}>剩余￥{record.stagesPrice.toFixed(2)}/{record.surplusNum}期</p>
                        </div>
                    } else if (state === 2) {
                        return <Tag color="#87d068">已完成分期</Tag>
                    } else {
                        return <Tag color="gold">异常分期</Tag>
                    }
                },
            },
            {
                title: '客户姓名',
                key: 'userName',
                dataIndex: 'userName',
                render: tags => (
                    <>{tags}</>
                ),
            },
            {
                title: '关联员工',
                key: 'staffName',
                dataIndex: 'staffName',
                render: tags => {
                    if (tags) {
                        return <span>{tags}</span>
                    } else {
                        return <span>未关联</span>
                    }
                },
            },
            {
                title: '创建日期',
                key: 'createTime',
                dataIndex: 'createTime',
                render: state => <>{state}</>,
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => {
                    if (record.type === 2) {
                        return (<Space size="middle">
                            <a style={{ color: '#1089EB' }} onClick={() => this.lookOrder(record, 'look')}>查看订单</a>
                        </Space>)
                    } else {
                        return (<Space size="middle">
                            <a style={{ color: '#1089EB' }} onClick={() => this.lookOrder(record, 'look')}>查看订单</a>
                            <a style={{ color: '#13CE66' }} onClick={() => this.lookOrder(record, 'edit')}>修改</a>
                        </Space>)
                    }
                }

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
                render: (text, record) => <a onClick={() => this.setState({ linkEmploy: record.staffName, linkId: record.id, visible: false })}>选择</a>

            },
        ]
        const colOnline = [
            {
                title: '订单编号',
                dataIndex: 'id',
                key: 'id'
            },
            {
                title: '用户姓名',
                dataIndex: 'realName',
                key: 'realName',
                render: text => <span>{text}</span>
            },
            {
                title: '商品图片',
                dataIndex: 'image',
                key: 'image',
                render: src => {
                    let arr = src.split(',')
                    return (
                        <Image className='tableGoodsImg' src={arr[0]}></Image>
                    )
                }
            },
            {
                title: '商品名称',
                dataIndex: 'storeName',
                key: 'storeName',
            },
            {
                title: '实际支付',
                dataIndex: 'payPrice',
                key: 'payPrice',
            },
            {
                title: '支付状态',
                key: 'status',
                dataIndex: 'status',
                render: state => {
                    if (state === 5) {
                        return <Tag>待付款</Tag>
                    } else if (state === 0) {
                        return <Tag>待发货</Tag>
                    } else if (state === 1) {
                        return <Tag>待收货</Tag>
                    } else if (state === 2) {
                        return <Tag>已收货</Tag>
                    } else if (state === '退款中') {
                        return <Tag>退款中</Tag>
                    } else if (state === '已退款') {
                        return <Tag>已退款</Tag>
                    } else {
                        return <Tag>已删除</Tag>
                    }
                },
            },
            {
                title: '创建时间',
                key: 'creatTime',
                dataIndex: 'creatTime',
                render: tags => (
                    <span>{tags}</span>
                ),
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) =>
                    <Space size="middle">
                        <a style={{ color: '#1089EB' }} onClick={() => this.editGoods(record)}>查看详情</a>
                    </Space>
            },
        ]
        const { goodsIndex, orderVisible, listOnline, listPhased,
            orderId, orderName, orderNum, orderStagePrice, orderPayType,
            orderPrice, orderState, orderPay, orderCreate, orderRemarks,
            orderOtherNum, username, modalType, visible, stateVisible, data, linkEmploy,
            stageName, type, stateVal, loading,
            goodsVisible, goodsOrderid, goodsOrdertime, goodsPerson, goodsPhone, goodsAddress,
            goodsTotalNum, goodsTotalPrice, goodsPostage, goodsState } = this.state
        let stateDom
        if (orderState === 1) {
            stateDom = <span>正常分期中</span>
        } else if (orderState === 2) {
            stateDom = <span>分期已完成</span>
        } else if (orderState === 3) {
            stateDom = <span>分期已逾期</span>
        } else {
            stateDom = <span>未处理分期</span>
        }
        return (
            <div className='goods'>
                <div className='goodsHeaderTop'>
                    <span>订单管理</span>
                </div>
                <div className='goodsHeaderBody'>
                    <div className={goodsIndex === 1 ? 'goodsActive' : 'ghBodyBtn'}
                        onClick={() => this.checkList(1)}>门店分期项目</div>
                    <div className={goodsIndex === 2 ? 'goodsActive' : 'ghBodyBtn'}
                        onClick={() => this.checkList(2)}>线上商品</div>
                </div>
                <div className='goodsBody'>
                    {goodsIndex === 1
                        ? <div className='gbTableTop'>
                            <Input style={{ width: 150, margin: '0 20px' }}
                                placeholder='请输入项目名称'
                                value={stageName}
                                onChange={e => this.setState({ stageName: e.target.value })}></Input>
                            <Popover
                                content={
                                    <div style={{ display: "flex", flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                        <span className='flexitem' onClick={() => {
                                            this.setState({ stateVal: '未处理分期' }, () => {
                                                this.getStageState(4)
                                            })
                                        }}>未处理分期</span>
                                        <span className='flexitem' onClick={() => {
                                            this.setState({ stateVal: '分期中' }, () => {
                                                this.getStageState(1)
                                            })
                                        }}>分期中</span>
                                        <span className='flexitem' onClick={() => {
                                            this.setState({ stateVal: '已完成分期' }, () => {
                                                this.getStageState(2)
                                            })
                                        }}>已完成分期</span>
                                        <span className='flexitem' onClick={() => {
                                            this.setState({ stateVal: '异常分期' }, () => {
                                                this.getStageState(3)
                                            })
                                        }}>异常分期</span>
                                    </div>
                                }
                                trigger="hover"
                                visible={stateVisible}
                                onVisibleChange={this.VisibleChange}
                            >
                                <Input style={{ width: 150, margin: '0 20px' }}
                                    placeholder='分期状态'
                                    value={stateVal}
                                    onFocus={() => this.setState({ stateVisible: true })}
                                    onChange={e => this.setState({ stateVal: e.target.value })}></Input>
                            </Popover>
                            {/* <Button style={{ margin: '0 20px 0 0', backgroundColor: '#13CE66', borderColor: '#13CE66' }} type='primary'
                                >搜索</Button> */}
                            <div className='search-btn' onClick={() => this.setState({ loading: true }, () => { this.getStageState() })}>
                            <SearchOutlined />搜索
                            </div>
                        </div>
                        : <div className='gbTableTop'>
                            <Input style={{ width: 150, margin: '0 20px' }}
                                placeholder='搜索商品名'></Input>
                            <Input style={{ width: 150, margin: '0 20px' }}
                                placeholder='搜索用户名'></Input>
                            <Input style={{ width: 150, margin: '0 20px' }}
                                placeholder='搜索用户手机号'></Input>
                            <Select style={{ width: 150, margin: '0 20px 0 0' }}
                                placeholder='订单状态'>
                                <Option value="未支付">未支付</Option>
                                <Option value="已支付">已支付</Option>
                                <Option value="未发货">未发货</Option>
                                <Option value="待收货">待收货</Option>
                                <Option value="交易完成">交易完成</Option>
                                <Option value="退款中">退款中</Option>
                                <Option value="已退款">已退款</Option>
                                <Option value="已删除">已删除</Option>
                            </Select>
                            {/* <Button style={{ margin: '0 20px 0 0', backgroundColor: '#13CE66', borderColor: '#13CE66' }} type='primary'
                                onClick={() => this.setState({ loading: true }, () => { this.getStageState() })}>搜索</Button>
                             */}
                            <div className='search-btn' onClick={() => this.setState({ loading: true }, () => { this.getStageState() })}>
                            <SearchOutlined />搜索
                            </div>
                        </div>}
                    <div style={{ width: '100%' }}>
                        {goodsIndex === 1
                            ? <Table columns={columns}
                                dataSource={listPhased}
                                style={{ textAlign: 'center' }}
                                pagination={{ pageSize: 4, position: ['bottomLeft'] }}
                                loading={loading}
                                locale={{ emptyText: '暂无数据' }} />
                            : <Table columns={colOnline}
                                dataSource={listOnline}
                                style={{ textAlign: 'center' }}
                                pagination={{ pageSize: 4, position: ['bottomLeft'] }}
                                loading={loading}
                                locale={{ emptyText: '暂无数据' }} />}
                    </div>
                </div>

                <Modal
                    visible={orderVisible}
                    title="订单详情"
                    onOk={this.handleOk}
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
                                content={<Table columns={employColumns}
                                    dataSource={data}
                                    style={{ textAlign: 'center' }}
                                    pagination={{ pageSize: 2 }}
                                    locale={{ emptyText: '暂无数据' }} />}
                                trigger="hover"
                                visible={visible}
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
                                {/* <span style={{ color: '#1089EB' }}>复制</span> */}
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
                                <span style={{ marginRight: 10 }}>项目分期</span>
                                <span>￥{orderStagePrice}/{orderNum}期</span>
                                <span style={{ color: '#1089EB' }}>剩余￥{orderStagePrice}/{orderOtherNum}期</span>
                            </div>
                            <div className='mbLabel'>
                                <span style={{ marginRight: 10 }}>支付方式</span>
                                <span style={{ color: '#13CE66' }}>
                                    {orderPayType === 'bank' ? '银行卡' : null}
                                    {orderPayType === 'alipay' ? '支付宝' : null}
                                    {orderPayType === 'weixin' ? '微信' : null}
                                </span>
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
                                <span style={{ color: '#1089EB' }}>{stateDom}</span>
                            </div>
                            <div className='mbLabel'>
                                <span style={{ marginRight: 10 }}>实际支付</span>
                                <span>￥{orderPay}</span>
                            </div>
                            <div className='mbLabel'>
                                <span style={{ marginRight: 10 }}>创建时间</span>
                                <span>{orderCreate}</span>
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
                <Modal
                    visible={goodsVisible}
                    title="订单详情"
                    onOk={this.handleOk}
                    onCancel={() => this.setState({ goodsVisible: false })}
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
                    <div style={{ width: '90%', margin: '0 auto' }}>
                        <div className='mbLabel'>
                            <span style={{ marginRight: 10 }}>订单编号：</span>
                            <span>{goodsOrderid}</span>
                        </div>
                        <div className='mbLabel'>
                            <span style={{ marginRight: 10 }}>创建时间：</span>
                            <span>{goodsOrdertime}</span>
                        </div>
                        <div className='mbLabel'>
                            <span style={{ marginRight: 10 }}>收货人：</span>
                            <span>{goodsPerson}</span>
                        </div>
                        <div className='mbLabel'>
                            <span style={{ marginRight: 10 }}>联系电话：</span>
                            <span>{goodsPhone}</span>
                        </div>
                        <div className='mbLabel'>
                            <span style={{ marginRight: 10 }}>收货地址：</span>
                            <span>{goodsAddress}</span>
                        </div>
                        <div className='mbLabel'>
                            <span style={{ marginRight: 10 }}>货物数量：</span>
                            <span>{goodsTotalNum}</span>
                        </div>
                        <div className='mbLabel'>
                            <span style={{ marginRight: 10 }}>订单总金额：</span>
                            <span>{goodsTotalPrice}</span>
                        </div>
                        <div className='mbLabel'>
                            <span style={{ marginRight: 10 }}>运费：</span>
                            <span>{goodsPostage}</span>
                        </div>
                        <div className='mbLabel'>
                            <span style={{ marginRight: 10 }}>订单状态：</span>
                            <span>{goodsState === 0 ? '待发货' : null}</span>
                            <span>{goodsState === 1 ? '待收货' : null}</span>
                            <span>{goodsState === 2 ? '已收货' : null}</span>
                            <span>{goodsState === 5 ? '待付款' : null}</span>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default Order