import React, { Component } from 'react'
import './Goods.css'
import { Input, Select, Button, Space, Table, Tag, Popconfirm } from 'antd'

const { Option } = Select

class Goods extends Component {
    constructor(props) {
        super(props)
        this.state = {
            goodsIndex:1,
            goodsTable:1
        }
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
    render() {
        const columns = [
            {
                title: '项目编号',
                dataIndex: 'no',
                key: 'no',
                render: text => <a>{text}</a>,
            },
            {
                title: '项目图片',
                dataIndex: 'img',
                key: 'img',
                render: src => {
                    return (
                        <img className='tableGoodsImg'></img>
                    )
                }
            },
            {
                title: '项目名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '分类名称',
                dataIndex: 'kindname',
                key: 'kindname',
            },
            {
                title: '项目价格',
                dataIndex: 'price',
                key: 'price',
            },
            {
                title: '分期数上限',
                key: 'numOfStage',
                dataIndex: 'numOfStage',
                render: tags => (
                    <>{tags}</>
                ),
            },
            {
                title: '销量',
                key: 'sales',
                dataIndex: 'sales',
                render: tags => (
                    <>{tags}</>
                ),
            },
            {
                title: '系统状态',
                key: 'state',
                dataIndex: 'state',
                render: state => {
                    if(state === '未上架') {
                        return (
                            <Tag color='red'>未上架</Tag>
                        )
                    } else if(state === '上架') {
                        return (
                            <Tag color='#1890FF'>上架</Tag>
                        )
                    } else {
                        return <Tag color="blue">已删除</Tag>
                    }
                },
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => {
                    if(record.state !== '已删除') {
                        return  <Space size="middle">
                                    <a style={{color:'#13CE66'}} onClick={() => console.log('我点了', record)}>修改</a>
                                    <Popconfirm
                                        title="请您确认是否删除?"
                                        onConfirm={() => this.confirm(record)}
                                        onCancel={this.cancel}
                                        okText="是"
                                        cancelText="否"
                                    >
                                        <a style={{color:'#FF5A5A'}}>删除</a>
                                    </Popconfirm>
                                </Space>
                    } else {
                        return  <Space size="middle">
                                    <Popconfirm
                                        title="请您确认是否恢复?"
                                        onConfirm={() => this.restore(record)}
                                        onCancel={this.cancel}
                                        okText="是"
                                        cancelText="否"
                                    >
                                        <a style={{color:'#13CE66'}}>恢复</a>
                                    </Popconfirm>
                                    <Popconfirm
                                        title="请您确认是否彻底删除?"
                                        onConfirm={() => this.realDel(record)}
                                        onCancel={this.cancel}
                                        okText="是"
                                        cancelText="否"
                                    >
                                        <a style={{color:'#FF5A5A'}}>彻底删除</a>
                                    </Popconfirm>
                                </Space>
                    }
                },
            },
        ]
        const data = [
            {
                no: '1',
                name: 'John Brown',
                kindname: '美容类',
                price:998,
                numOfStage:'18期',
                sales:9228,
                state:'上架', // 上下架状态
            },
            {
                no: '2',
                name: 'Jim Green',
                kindname: '美容类',
                price:998,
                numOfStage:'12期',
                sales:9228,
                state:'已删除', // 上下架状态
            },
            {
                no: '3',
                name: 'Joe Black',
                kindname: '美容类',
                price:998,
                numOfStage:'12期',
                sales:9228,
                state:'上架', // 上下架状态
            },
            {
                no: '4',
                name: 'Jim Green',
                kindname: '美容类',
                price:998,
                numOfStage:'12期',
                sales:9228,
                state:'未上架', // 上下架状态
            },
            {
                no: '5',
                name: 'Joe Black',
                kindname: '美容类',
                price:998,
                numOfStage:'12期',
                sales:9228,
                state:'已删除', // 上下架状态
            },
        ]
        const delData = data.filter(item => item.state === '已删除')
        const trueData = data.filter(item => item.state !== '已删除')
        const { goodsIndex, goodsTable } = this.state
        return (
            <div className='goods'>
                <div className='goodsHeaderTop'>
                    <span>商品管理</span>
                </div>
                <div className='goodsHeaderBody'>
                    <div className={goodsIndex === 1 ? 'goodsActive' : 'ghBodyBtn'}
                        onClick={() => this.setState({goodsIndex:1})}>门店分期项目</div>
                    <div className={goodsIndex === 2 ? 'goodsActive' : 'ghBodyBtn'}
                        onClick={() => this.setState({goodsIndex:2})}>线上商品</div>
                </div>
                <div className='goodsBody'>
                    <div className='goodsBodyTab'>
                        <div className={goodsTable === 1 ? 'gtActive' : 'gbTabBtn'}
                            onClick={() => this.setState({goodsTable:1})}>出售中</div>
                        <div className={goodsTable === 2 ? 'gtActive' : 'gbTabBtn'}
                            onClick={() => this.setState({goodsTable:2})}>待上架</div>
                        <div className={goodsTable === 3 ? 'gtActive' : 'gbTabBtn'}
                            onClick={() => this.setState({goodsTable:3})}>回收站</div>
                    </div>
                    <div className='gbTableTop'>
                        <Input style={{ width: 150, margin: '0 20px' }}
                            placeholder='请输入搜索条件'></Input>
                        <Select style={{ width: 150, margin: '0 20px 0 0' }}
                            placeholder='分类'>
                            <Option value="jack">Jack</Option>
                            <Option value="lucy">Lucy</Option>
                        </Select>
                        <Button style={{ margin: '0 20px 0 0', backgroundColor: '#13CE66', borderColor: '#13CE66' }} type='primary'>搜索</Button>
                        {goodsTable === 1 
                        ? <Button style={{ margin: '0 20px 0 0' }} type='primary'>+新增分期项目</Button>
                        : null}
                    </div>
                    <div style={{ width: '100%' }}>
                        {goodsTable === 3 ?
                        <Table columns={columns} 
                            dataSource={delData} 
                            style={{textAlign:'center'}}
                            pagination={{pageSize:2}} /> : 
                        <Table columns={columns} 
                            dataSource={trueData} 
                            style={{textAlign:'center'}}
                            pagination={{pageSize:2}} />}
                    </div>
                </div>
            </div>
        )
    }
}

export default Goods