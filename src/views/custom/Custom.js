import React, { Component } from 'react'
import '../custom/Custom.css'
import {
    Button, Input, Table, Modal, Popover, Select,
    message, DatePicker, Space, Popconfirm
} from 'antd'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'
import axios from '../../http'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import moment from 'moment'

const { Option } = Select;

class Custom extends Component {
    state = {
        // 加载表格
        loading: false,
        // 所有客户数据
        data: [],
        // 搜索框数据
        searchValue: '',
        // 新增客户信息弹框
        customAdd: false,
        // 新增内美辽师
        addPopover: false,
        // 员工列表
        employList: null,
        // 关联员工
        employ: null,
        // 关联员工ID
        employId: null,
        // 客户姓名
        name: null,
        // 客户电话
        userPhone: null,
        // 客户等级
        level: 'E',
        // 客户生日
        birth: null,
        // 修改客户信息弹框
        customEdit: false,
        // 客户消费订单详情
        expenseDetail: false,
        // 客户订单详情表数据
        expenseDetailData: [],
        // 客户ID
        customId: null,
        // 添加客户消费信息弹框
        addExpense: false,
        // 客户消费行为
        behavior: 1,
        // 客户消费金额
        money: null,

        selectLevel: ''
    }
    componentDidMount() {
        this.setState({ loading: true })
        // 获取员工信息
        this.getEmploy()
        // 查询所有
        this.getAllCustom()
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
                let newData = res.data.data
                for (let i = 0; i < newData.length; i++) {
                    newData[i].key = i + 1
                }
                this.setState({ data: newData, loading: false })
            })
            .catch(err => {
                console.log('查询所有客户失败', err)
            })
    }

    // 搜索客户
    search = () => {
        let user = JSON.parse(localStorage.getItem('user'))
        const { searchValue, selectLevel } = this.state
        if (searchValue === '') {
            message.warning('请先输入搜索内容!')
        } else {
            axios({
                method: 'GET',
                url: '/client',
                params: {
                    parm: searchValue,
                    enterId: user.id,
                    clientLevel: selectLevel
                }
            })
                .then(res => {
                    console.log('搜索成功', res)
                    let newData = res.data.data
                    for (let i = 0; i < newData.length; i++) {
                        newData[i].key = i + 1
                    }
                    console.log(newData)
                    this.setState({ data: newData })
                })
                .catch(err => {
                    console.log('搜索失败', err)
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
                console.log('获取员工信息成功', res)
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
    // 新增客户
    addCustom = () => {
        let user = JSON.parse(localStorage.getItem('user'))
        const { name, userPhone, employId, level, birth } = this.state
        console.log(level, '客户等级')
        if (name === null || userPhone === null) {
            message.warning('请填写完整信息')
        } else {
            axios({
                method: 'POST',
                url: '/client',
                data: {
                    enterId: user.id,
                    name: name,
                    userPhone: userPhone,
                    staff_id: employId,
                    level: level,
                    birthday: birth
                }
            })
                .then(res => {
                    console.log('新增客户成功', res)

                    if (res.data.status === 200) {
                        message.success('新增客户成功')
                        this.setState({ loading: true, customAdd: false }, () => {
                            this.getAllCustom()
                            this.setState({
                                name: null,
                                userPhone: null,
                                employId: null,
                                level: 'E'
                            })
                        })
                    } else {
                        message.error(res.data.message)
                    }
                })
                .catch(err => {
                    console.log('新增客户失败', err)
                    message.error('新增客户失败')
                })
        }

    }
    // 修改客户信息
    editCustom = () => {
        let user = JSON.parse(localStorage.getItem('user'))
        const { name, userPhone, employId, level, customId, birth } = this.state
        console.log(customId)
        if (name === null || userPhone === null) {
            message.warning('请输入完整信息')
        } else {
            axios({
                method: 'PUT',
                url: '/client',
                data: {
                    enterId: user.id,
                    name: name,
                    userPhone: userPhone,
                    staff_id: employId,
                    level: level,
                    id: customId,
                    birthday: birth
                }
            })
                .then(res => {
                    if (res.data.status === 200) {
                        console.log('修改客户信息成功', res)
                        message.success(res.data.message)
                        this.getAllCustom()
                        this.setState({ customEdit: false })
                    } else {
                        console.log('修改客户信息失败', res)
                        message.error(res.data.message)
                    }
                })
                .catch(err => {
                    console.log('修改客户信息失败', err)
                    message.error("修改失败")
                })
        }

    }
    // 查询客户消费订单
    toExpenseDetail = customId => {
        axios({
            method: 'GET',
            url: '/client/record',
            params: {
                clientId: customId
            }
        })
            .then(res => {
                console.log('查询客户消费订单成功', res)
                this.setState({ expenseDetail: true, expenseDetailData: res.data.data, customId: customId })
            })
            .catch(err => {
                console.log('查询客户消费订单失败', err)
                message.error('查询消费订单失败')
            })
    }
    // 添加客户消费信息
    addExpense = () => {
        const { behavior, money, customId } = this.state
        console.log(behavior)
        axios({
            method: 'POST',
            url: '/client/record',
            data: {
                behavior: behavior,
                money: money,
                clientId: customId
            }
        })
            .then(res => {
                console.log('添加客户消费信息成功', res)
                if (res.data.status === 200) {
                    this.toExpenseDetail(customId)
                    // this.getAllCustom()
                    this.clientLevel()
                    this.setState({ money: null })
                    message.success(res.data.message)
                } else {
                    this.setState({ money: null })
                    message.error(res.data.message)
                }
                this.setState({ addExpense: false })
            })
            .catch(err => {
                console.log('添加客户消费信息失败', err)
                message.error('添加失败')
            })
    }
    // 按客户等级查询
    clientLevel = () => {
        const { selectLevel } = this.state
        let user = JSON.parse(localStorage.getItem('user'))
        axios({
            method: 'GET',
            url: '/client',
            params: {
                enterId: user.id,
                clientLevel: selectLevel
            }
        })
            .then(res => {
                console.log('搜索成功', res)
                let newData = res.data.data
                for (let i = 0; i < newData.length; i++) {
                    newData[i].key = i + 1
                }
                console.log(newData)
                this.setState({ data: newData })
            })
            .catch(err => {
                console.log('搜索失败', err)
            })
    }
    // 客户生日
    getBirth = e => {
        console.log(e)
        const birth = e._d.getFullYear() + '-' + (e._d.getMonth() + 1) + '-' + e._d.getDate()
        console.log(birth)
        this.setState({ birth: birth })
    }
    // 删除客户
    delCustom = id => {
        axios({
            method: 'DELETE',
            url: `/client?clientId=${id}`,
            // data: {
            //     clientId: id
            // }
        })
            .then(res => {
                console.log('删除客户成功', res)
                if (res.data.status === 200) {
                    this.getAllCustom()
                } else {
                    message.error(res.data.message)
                }
            })
            .catch(err => {
                console.log('删除客户失败', err)
            })
    }

    render = () => {
        const { loading, data, searchValue, customAdd,
            addPopover, employList, employ, name,
            userPhone, customEdit, expenseDetail, expenseDetailData,
            addExpense, money, level, selectLevel, birth } = this.state
        const columns = [
            {
                title: '序号',
                key: 'key',
                dataIndex: 'key',
                align: 'center'
            },
            {
                title: '客户姓名',
                key: 'name',
                dataIndex: 'name',
                align: 'center'
            }, {
                title: '客户电话',
                key: 'userPhone',
                dataIndex: 'userPhone',
                align: 'center'
            }, {
                title: '总充值金额',
                key: 'recharge',
                dataIndex: 'recharge',
                align: 'center',
                render: text => {
                    if (text === null) {
                        return (<span>0</span>)
                    } else {
                        return (<span>{text}</span>)
                    }
                }
            }, {
                title: '已消费金额',
                key: 'amount',
                dataIndex: 'amount',
                align: 'center',
                render: text => {
                    if (text === null) {
                        return (<span>0</span>)
                    } else {
                        return (<span>{text}</span>)
                    }
                }
            }, {
                title: '未消费金额',
                key: 'balance',
                dataIndex: 'balance',
                align: 'center',
                render: text => {
                    if (text === null) {
                        return (<span>0</span>)
                    } else {
                        return (<span>{text}</span>)
                    }
                }
            }, {
                title: '客户级别',
                key: 'level',
                dataIndex: 'level',
                align: 'center'
            }, {
                title: '消费详情',
                key: 'expenseDetail',
                render: (text, record) => (
                    <Button type="primary" onClick={() => {
                        console.log(record)
                        this.toExpenseDetail(record.id)
                    }
                    }>查看</Button>
                ),
                align: 'center'
            }, {
                title: '操作',
                key: 'action',
                render: (text, record) => (
                    <Space>
                        <Button type="primary" onClick={() =>
                            this.setState({
                                customEdit: true,
                                customId: record.id,
                                name: record.name,
                                userPhone: record.userPhone,
                                employ: record.staff,
                                level: record.level,
                                birth: record.birthday
                            })
                        }>修改</Button>
                        <Popconfirm
                            title="请您确认是否删除?"
                            onConfirm={() => this.delCustom(record.id)}
                            okText="是"
                            cancelText="否"
                        >
                            <Button type="primary" danger>删除</Button>
                        </Popconfirm>
                    </Space>
                ),
                align: 'center'
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
                    this.setState({ addPopover: false, employId: record.id, employ: record.staffName })
                }}>选择</a>

            },
        ]
        const expenseDetailColums = [
            {
                title: '时间',
                dataIndex: 'createTime',
                key: 'createTime',
                render: text => <span>{text.split('T')[0] + ' '}{text.split('T')[1]}</span>,
                align: 'center'
            }, {
                title: '消费行为',
                dataIndex: 'behavior',
                key: 'behavior',
                render: text => {
                    if (text === 1) {
                        return (<span style={{ color: '#13CE66' }}>充值</span>)
                    } else {
                        return (<span style={{ color: 'red' }}>消费</span>)
                    }
                },
                align: 'center'
            }, {
                title: '消费金额',
                dataIndex: 'money',
                key: 'money',
                align: 'center'
            },
        ]
        return (
            <div className="custom">
                <div className="homeIndex-header">
                    <span>客户管理</span>
                </div>

                <div className="customTable">

                    <div className="customTableHeader">
                        <Input
                            style={{ width: 150, margin: '0 20px' }}
                            placeholder='请输入姓名或手机号'
                            value={searchValue}
                            onChange={e => this.setState({ searchValue: e.target.value })}
                        />
                        <div className='search-btn' onClick={this.search}><SearchOutlined />搜索</div>

                        <span className="goods-search-refresh"
                            onClick={() => this.setState({ searchValue: '' }, () => this.getAllCustom())}>刷新</span>

                        <div className='add-btn' onClick={() =>
                            this.setState({
                                customAdd: true,
                                name: null,
                                userPhone: null,
                                employ: null,
                                level: 'E',
                                birth: null
                            })
                        }><PlusOutlined />新增客户</div>

                        <Select
                            style={{ width: 150 }}
                            onChange={e => this.setState({ selectLevel: e }, () => this.clientLevel())}
                            defaultValue="客户级别"
                            allowClear={true}
                            placeholder="全部">
                            <Option value="">全部</Option>
                            <Option value="A">客户级别A</Option>
                            <Option value="B">客户级别B</Option>
                            <Option value="C">客户级别C</Option>
                            <Option value="D">客户级别D</Option>
                            <Option value="E">客户级别E</Option>
                        </Select>
                    </div>

                    <Table
                        columns={columns}
                        dataSource={data}
                        style={{ textAlign: 'center' }}
                        pagination={{ pageSize: 10, position: ['bottomLeft'] }}
                        loading={loading}
                        locale={{ emptyText: '暂无数据' }} />

                </div>

                {/* 添加客户信息模态框 */}
                <Modal
                    visible={customAdd}
                    title="新增客户信息"
                    onOk={() => this.addCustom()}
                    onCancel={() => this.setState({ customAdd: false, addPopover: false })}
                    destroyOnClose={true}
                    bodyStyle={{ fontSize: '15px', padding: '10px', color: '#666666' }}
                    width={800}
                    okText='确定'
                    cancelText="取消"
                >
                    <div className="addCustom">
                        <div className="addCustomItem">
                            <span>客户姓名:</span>
                            <Input
                                placeholder="请输入" style={{ width: 200 }}
                                value={name}
                                onChange={e => this.setState({ name: e.target.value })}
                            />
                        </div>
                        <div className="addCustomItem">
                            <span>客户电话:</span>
                            <Input
                                placeholder="请输入"
                                style={{ width: 200 }}
                                value={userPhone}
                                onChange={e => this.setState({ userPhone: e.target.value })}
                            />
                        </div>
                        <div className="addCustomItem">
                            <span>客户生日:</span>
                            <DatePicker
                                locale={locale}
                                style={{ width: 120 }}
                                allowClear={false}
                                onChange={this.getBirth}
                            />
                        </div>
                        <div className="addCustomItem">
                            <span>客户等级:</span>
                            <Select defaultValue={level} onChange={e => this.setState({ level: e })} style={{ width: 120 }}>
                                <Option value="A">A</Option>
                                <Option value="B">B</Option>
                                <Option value="C">C</Option>
                                <Option value="D">D</Option>
                                <Option value="E">E</Option>
                            </Select>
                        </div>
                        <div className="addCustomItem">
                            <span>美疗师:</span>
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
                                    onVisibleChange={addPopover => this.setState({ addPopover })}
                                    visible={addPopover}>
                                    {employ
                                        ? <Button type="primary" style={{ width: 120 }} onClick={() => this.setState({ addPopover: true })}>{employ}</Button>
                                        : <Button type="primary" style={{ width: 120 }} danger onClick={() => this.setState({ addPopover: true })}>点击关联员工</Button>}
                                </Popover>
                            </div>
                        </div>
                    </div>

                </Modal>
                {/* 修改客户信息模态框 */}
                <Modal
                    visible={customEdit}
                    title="修改客户信息"
                    onOk={() => this.editCustom()}
                    onCancel={() => this.setState({ customEdit: false })}
                    destroyOnClose={true}
                    bodyStyle={{ fontSize: '15px', padding: '10px', color: '#666666' }}
                    width={800}
                    okText='确定'
                    cancelText="取消"
                >
                    <div className="addCustom">
                        <div className="addCustomItem">
                            <span>客户姓名:</span>
                            <Input
                                placeholder="请输入" style={{ width: 200 }}
                                value={name}
                                onChange={e => this.setState({ name: e.target.value })}
                            />
                        </div>
                        <div className="addCustomItem">
                            <span>客户电话:</span>
                            <Input
                                placeholder="请输入"
                                style={{ width: 200 }}
                                value={userPhone}
                                onChange={e => this.setState({ userPhone: e.target.value })}
                            />
                        </div>
                        <div className="addCustomItem">
                            <span>客户生日:</span>
                            <DatePicker
                                locale={locale}
                                allowClear={false}
                                onChange={this.getBirth}
                                value={birth ? moment(birth, 'YYYY-MM-DD') : birth}
                            />
                        </div>
                        <div className="addCustomItem">
                            <span>客户等级:</span>
                            <Select defaultValue={level} onChange={e => this.setState({ level: e })} style={{ width: 120 }}>
                                <Option value="A">A</Option>
                                <Option value="B">B</Option>
                                <Option value="C">C</Option>
                                <Option value="D">D</Option>
                                <Option value="E">E</Option>
                            </Select>
                        </div>
                        <div className="addCustomItem">
                            <span>美疗师:</span>
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
                                    onVisibleChange={addPopover => this.setState({ addPopover })}
                                    visible={addPopover}>
                                    {employ
                                        ? <Button type="primary" style={{ width: 120 }} onClick={() => this.setState({ addPopover: true })}>{employ}</Button>
                                        : <Button type="primary" style={{ width: 120 }} danger onClick={() => this.setState({ addPopover: true })}>点击关联员工</Button>}
                                </Popover>
                            </div>
                        </div>
                    </div>
                </Modal>

                {/* 客户消费订单详情 */}
                <Modal
                    visible={expenseDetail}
                    title="客户消费订单详情表"
                    onOk={() => this.setState({ expenseDetail: false })}
                    onCancel={() => this.setState({ expenseDetail: false })}
                    destroyOnClose={true}
                    bodyStyle={{ fontSize: '15px', padding: '10px', color: '#666666' }}
                    width={600}
                    okText='确定'
                    cancelText="取消"
                >
                    <Button type="primary" style={{ margin: 10 }} onClick={() => this.setState({ addExpense: true, behavior: 1 })}>添加</Button>
                    <Table
                        columns={expenseDetailColums}
                        dataSource={expenseDetailData}
                        style={{ textAlign: 'center' }}
                        pagination={{ pageSize: 4 }}
                        locale={{ emptyText: '暂无订单数据' }} />

                </Modal>

                {/* 添加客户消费信息 */}
                <Modal
                    visible={addExpense}
                    title="客户消费订单详情表"
                    onOk={() => this.addExpense()}
                    onCancel={() => this.setState({ addExpense: false })}
                    destroyOnClose={true}
                    bodyStyle={{ fontSize: '15px', padding: '10px', color: '#666666' }}
                    width={600}
                    okText='确定'
                    cancelText="取消"
                >
                    <div className="addExpense">
                        <div className="addExpenseItem">
                            <span>客户消费行为:</span>
                            <Select defaultValue="1" style={{ width: 200 }}
                                // onChange={e => console.log(e)}
                                onChange={e => {
                                    console.log(e)
                                    this.setState({ behavior: e })
                                }}
                            >
                                <Option value="1">充值</Option>
                                <Option value="2">消费</Option>
                            </Select>
                        </div>
                        <div className="addExpenseItem">
                            <span>客户消费金额:</span>
                            <Input
                                placeholder="请输入"
                                style={{ width: 200 }}
                                value={money}
                                onChange={e => this.setState({ money: e.target.value })}
                            />
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default Custom