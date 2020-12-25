import React, { Component } from 'react'
import '../subscribe/Subscribe.css'
import {
    Image, Popover, Tag, Table, Input, Modal,
    Select, Radio, Upload, message, InputNumber,
    Space, Popconfirm, DatePicker, Button
} from 'antd'
import { SearchOutlined, SyncOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import axios from '../../http'
import moment from 'moment'
import locale from 'antd/lib/date-picker/locale/zh_CN'

const { TextArea } = Input
const { Option } = Select

export default class BookingManage extends Component {
    state = {
        emptyText: '暂无信息',
        loading: false,

        // 时间
        time: null,
        // 当天时间
        nowDate: null,
        // 预约数据
        subData: [],
        // 搜索值
        searchVal: '',
        // 员工列表
        employList: [],
        employ: '',
        employVisble: false,

        // 公共id、
        emp: '',
        empModal: false,
        empMoney: '',
        subsId: '',
        contactEmp: '',

        promptModal: false
    }
    componentDidMount() {
        const date = new Date()
        let Y = date.getFullYear()
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
        let D = date.getDate();
        const nowDate = Y + '-' + M + '-' + D
        console.log(nowDate)
        this.setState({
            nowDate: nowDate,
            time: nowDate
        }, () => {
            this.getSbuData()
            this.getEmploy()
        })

    }
    // 获取时间
    getTime = e => {
        const time = e._d.getFullYear() + '-' + (e._d.getMonth() + 1) + '-' + e._d.getDate()
        console.log(time)
        this.setState({ time }, () => {
            this.getSbuData()
        })
    }
    // 获取预约数据
    getSbuData = () => {
        this.setState({ loading: true })
        const { time } = this.state
        const id = JSON.parse(localStorage.getItem('user')).id
        axios({
            method: 'GET',
            url: '/sub',
            params: {
                enterId: id,
                data: time
            }
        })
            .then(res => {
                console.log('获取预约数据成功', res)
                if (res.data.status === 200) {
                    let data = res.data.data
                    data.map((item,index) => {
                        item.key = index + 1
                    })
                    this.setState({
                        subData: data,
                        loading: false,
                        promptModal: false,
                        promptInfo: '',
                        subsId: '',
                        subState: '',
                        emp: '',
                        empModal: false
                    })
                } else {
                    message.error(res.data.message)
                }
            })
            .catch(err => {
                console.log('获取预约数据失败', err)
            })
    }
    // 设置预约状态
    // setReach = (e, id) => {
    //     axios({
    //         method: 'PUT',
    //         url: '/sub',
    //         data: {
    //             reach: e,
    //             id: id
    //         }
    //     })
    //         .then(res => {
    //             console.log('设置成功', res)
    //             if (res.data.status === 200) {
    //                 message.success(res.data.status)
    //                 this.getSbuData()
    //             } else {
    //                 message.error(res.data.message)
    //             }
    //         })
    //         .catch(err => {
    //             console.log('设置失败', err)
    //         })
    // }
    // 修改警示
    promptHandle = () => {
        const { promptInfo, subsId, subState, emp, } = this.state
        if (promptInfo === 'employ') { // 绑定员工
            axios({
                url: '/sub/staffMoney',
                method: 'PUT',
                data: {
                    staffId: emp.id,
                    id: subsId
                }
            })
                .then(res => {
                    console.log(res, 'ssssssssssssss')
                    if (res.data.status === 200) {
                        this.getSbuData()
                    } else {
                        message.error(res.data.message)
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        } else { // 修改状态
            axios({
                method: 'PUT',
                url: '/sub',
                data: {
                    reach: subState,
                    id: subsId
                }
            })
                .then(res => {
                    console.log('设置成功', res)
                    if (res.data.status === 200) {
                        message.success(res.data.status)
                        this.getSbuData()
                    } else {
                        message.error(res.data.message)
                    }
                })
                .catch(err => {
                    console.log('设置失败', err)
                })
        }
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
                if (res.data.status === 200) {
                    let list = res.data.data.list
                    list.map(item => item.key = item.id)
                    this.setState({
                        employList: list
                    })
                } else {
                    message.error(res.data.message)
                }

            })
            .catch(err => {
                console.log('查询员工信息失败', err)
            })
    }
    // 确认绑定
    okHandle = () => {
        axios({
            url: '/sub/staffMoney',
            method: 'PUT',
            data: {
                staffId: this.state.emp.id,
                money: this.state.empMoney,
                id: this.state.subsId
            }
        })
            .then(res => {
                console.log(res, 'ssssssssssssss')
                if (res.data.status === 200) {
                    this.getSbuData()
                    // this.setState({
                    //     empModal: false
                    // })
                } else {
                    message.error(res.data.message)
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
    render() {
        const { emptyText, loading, subData, time, searchVal, employ, employVisble, employList, empModal, empMoney,
            promptModal, contactEmp } = this.state

        const subColumns = [
            {
                title: '预约编号',
                dataIndex: 'key',
                key: 'key',
                align: 'center'
            },
            {
                title: '预约项目图片',
                dataIndex: 'image',
                key: 'image',
                render: text => <img src={text} className='tableGoodsImg' />,
                align: 'center'
            },
            {
                title: '项目名称',
                dataIndex: 'serviceName',
                key: 'serviceName',
                align: 'center'
            },
            {
                title: '预约客户',
                dataIndex: 'userName',
                key: 'userName',
                align: 'center'
            },
            {
                title: '客户电话',
                dataIndex: 'phone',
                key: 'phone',
                align: 'center',
                render: text => text === null ? <span>暂无</span> : <span>{text}</span>
            },
            {
                title: '预约时间段',
                key: 'subsTime',
                dataIndex: 'subsTime',
                align: 'center'
            },
            {
                title: '预约状态',
                key: 'reach',
                dataIndex: 'reach',
                align: 'center',
                render: (text, record) => <Select value={text} style={{ width: 120 }} onChange={e => {
                    this.setState({
                        promptModal: true,
                        promptInfo: 'subState',
                        subsId: record.id,
                        subState: e
                    })
                }}>
                    <Option value={0}>预约中</Option>
                    <Option value={1}>已到店</Option>
                    <Option value={2}>已取消</Option>
                </Select>
            },
            {
                title: '服务金额',
                key: 'serviceMoney',
                dataIndex: 'serviceMoney',
                align: 'center',
                render: (text, record) => {
                    if (record.reach === 1) {
                        let dom
                        if (text) {
                            dom = <Button
                                style={{ width: 120 }}
                                type="default"
                                onClick={() => {
                                    let staffName
                                    if (record.staffId) {
                                        staffName = record.staffName
                                    } else {
                                        staffName = '未关联'
                                    }
                                    this.setState({
                                        empModal: true,
                                        subsId: record.id,
                                        contactEmp: staffName
                                    })
                                }}>{text}</Button>
                        } else {
                            dom = <Button
                                style={{ width: 120 }}
                                type="default"
                                onClick={() => {
                                    let staffName
                                    if (record.staffId) {
                                        staffName = record.staffName
                                    } else {
                                        staffName = '未关联'
                                    }
                                    this.setState({
                                        empModal: true,
                                        subsId: record.id,
                                        contactEmp: staffName
                                    })
                                }}>未设置</Button>
                        }
                        return dom

                    } else {
                        return (
                            <Button type="default" disabled={true} style={{ width: 120 }}>不能设置</Button>
                        )
                    }
                }
            },
            {
                title: '关联员工',
                dataIndex: 'staffName',
                key: 'staffName',
                align: 'center',
                render: (text, re) => {
                    if (re.reach === 2) {
                        return <Button type="default" style={{ width: 120 }} disabled={true}>不能关联</Button>
                    } else {
                        let dom
                        if (re.staffId) {
                            dom =
                                <Popover
                                    content={<Table
                                        columns={employColumns}
                                        dataSource={employList}
                                        style={{ textAlign: 'center' }}
                                        pagination={{ pageSize: 5 }}
                                        locale={{ emptyText: '暂无数据' }} />}
                                    trigger="click">
                                    {/* <div>员工：{re.staffName}{re.serviceMoney}</div> */}
                                    <Button
                                        style={{ width: 120 }}
                                        type="primary"
                                        onClick={() => this.setState({ subsId: re.id })}
                                    >{re.staffName}</Button>
                                </Popover>
                        } else {
                            dom =
                                <Popover
                                    content={<Table
                                        columns={employColumns}
                                        dataSource={employList}
                                        style={{ textAlign: 'center' }}
                                        pagination={{ pageSize: 5 }}
                                        locale={{ emptyText: '暂无数据' }} />}
                                    trigger="click">
                                    {/* <div onClick={() => this.setState({ subsId: re.id })}>点击关联员工</div> */}
                                    <Button
                                        style={{ width: 120 }}
                                        type="primary" danger
                                        onClick={() => this.setState({ subsId: re.id })}
                                    >点击关联员工</Button>
                                </Popover>
                        }
                        return dom
                    }
                }
            }
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
                    this.setState({
                        emp: record,
                        promptModal: true,
                        promptInfo: 'employ'
                    })
                }}>选择</a>

            },
        ]
        return (
            <div className="subscribe">
                <div className="homeIndex-header">
                    <span>预约管理</span>
                </div>

                <div className="search">
                    <DatePicker
                        style={{ marginLeft: 20 }}
                        onChange={e => this.getTime(e)}
                        locale={locale}
                        value={moment(time, 'YYYY-MM-DD')}
                        allowClear={false}
                    />
                    {/* <Input
                        placeholder="请输入项目名搜索"
                        className="spell-searchInput"
                        value={searchVal}
                        onChange={e => this.setState({ searchVal: e.target.value })}
                    />
                    <div className='spell-searchBtn search-btn' >
                        <SearchOutlined />
                        <span>搜索</span>
                    </div> */}
                    <div className="spell-refresh" style={{margin: 20}} onClick={() => this.getSbuData()}>
                        <SyncOutlined />
                        <span>刷新</span>
                    </div>
                </div>
                <Modal
                    visible={promptModal}
                    title="提示"
                    onOk={this.promptHandle}
                    onCancel={() => this.setState({ empModal: false })}
                    okText='确定'
                    cancelText='取消'
                    destroyOnClose={true}
                    bodyStyle={{ padding: '10px', color: '#666666' }}
                    afterClose={() => this.setState({ goodsProId: '' })}
                    maskClosable={false}
                >
                    <div>
                        <div style={{ width: '100%', display: 'inline-block', height: 50, textAlign: 'center', lineHeight: '50px', paddingRight: 20 }}>
                            <ExclamationCircleOutlined color='orange' style={{ marginRight: 20, color: 'orange' }} />确认修改预约信息？
                        </div>
                    </div>
                </Modal>

                {/* 绑定提成 */}
                <Modal
                    visible={empModal}
                    title="绑定"
                    onOk={this.okHandle}
                    onCancel={() => this.setState({ empModal: false })}
                    okText='确定'
                    cancelText='取消'
                    destroyOnClose={true}
                    bodyStyle={{ padding: '10px', color: '#666666' }}
                    afterClose={() => this.setState({ goodsProId: '' })}
                    maskClosable={false}
                >
                    <div>
                        <div style={{ width: '100%' }}>
                            <div style={{ width: '30%', display: 'inline-block', height: 50, textAlign: 'right', lineHeight: '50px', paddingRight: 20 }}>关联员工：</div>
                            <div style={{ width: '70%', display: 'inline-block', height: 50, textAlign: 'left', lineHeight: '50px' }}>{contactEmp}</div>
                        </div>
                        <div style={{ width: '100%', height: 50, overflow: 'hidden' }}>
                            <span style={{ width: '30%', display: 'inline-block', height: 50, textAlign: 'right', paddingRight: 20 }}>请输入提成：</span>
                            <Input style={{ width: 200 }} value={empMoney} onChange={e => this.setState({ empMoney: e.target.value })}></Input>
                        </div>
                    </div>
                </Modal>
                <Table
                    columns={subColumns}
                    dataSource={subData}
                    style={{ textAlign: 'center' }}
                    pagination={{ pageSize: 8, position: ['bottomLeft'] }}
                    loading={loading}
                    locale={{ emptyText: emptyText }} />
            </div>
        )
    }
}