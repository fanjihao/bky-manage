import React, { Component } from 'react'
import '../goods/Goods.css'
import { Input, Select, Button, Space, Table, Tag, Popconfirm } from 'antd'

const { Option } = Select

class Order extends Component {
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
                title: '分期数',
                key: 'numOfStage',
                dataIndex: 'numOfStage',
                render: tags => (
                    <>{tags}</>
                ),
            },
            {
                title: '关联员工',
                key: 'sales',
                dataIndex: 'sales',
                render: tags => (
                    <>{tags}</>
                ),
            },
            {
                title: '项目状态',
                key: 'state',
                dataIndex: 'state',
                render: state => {
                    if(state === '未完成分期') {
                        return <Tag color='blue'>未完成分期</Tag>
                    } else if(state === '分期中') {
                        return <Tag color='blue'>分期中</Tag>
                    } else if(state === '已完成分期') {
                        return <Tag color="blue">已完成分期</Tag>
                    } else {
                        return <Tag color="gold">异常分期</Tag>
                    }
                },
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => {
                    if(record.state === '已完成分期') {
                        return (<Space size="middle">
                                    <a style={{color:'#1089EB'}} onClick={() => console.log('我点了', record)}>查看订单</a>
                                    <Popconfirm
                                        title="请您确认是否删除?"
                                        onConfirm={() => this.confirm(record)}
                                        onCancel={this.cancel}
                                        okText="是"
                                        cancelText="否"
                                    >
                                        <a style={{color:'#FF5A5A'}}>删除</a>
                                    </Popconfirm>
                                </Space>)
                    } else if(record.state === '未完成分期') {
                        return (<Space size="middle">
                                    <a style={{color:'#1089EB'}} onClick={() => console.log('我点了', record)}>查看订单</a>
                                    <a style={{color:'#13CE66'}} onClick={() => console.log('我点了', record)}>修改</a>
                                </Space>)
                    } else {
                        return (<Space size="middle">
                                    <a style={{color:'#1089EB'}} onClick={() => console.log('我点了', record)}>查看订单</a>
                                </Space>)
                    }
                }
                    
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
                state:'未完成分期', 
            },
            {
                no: '2',
                name: 'Jim Green',
                kindname: '美容类',
                price:998,
                numOfStage:'12期',
                sales:9228,
                state:'已完成分期', 
            },
            {
                no: '3',
                name: 'Joe Black',
                kindname: '美容类',
                price:998,
                numOfStage:'12期',
                sales:9228,
                state:'分期中', 
            },
            {
                no: '4',
                name: 'Jim Green',
                kindname: '美容类',
                price:998,
                numOfStage:'12期',
                sales:9228,
                state:'异常分期', 
            }
        ]
        const { goodsIndex, goodsTable } = this.state
        return (
            <div className='goods'>
                <div className='goodsHeaderTop'>
                    <span>订单管理</span>
                </div>
                <div className='goodsHeaderBody'>
                    <div className={goodsIndex === 1 ? 'goodsActive' : 'ghBodyBtn'}
                        onClick={() => this.setState({goodsIndex:1})}>门店分期项目</div>
                    <div className={goodsIndex === 2 ? 'goodsActive' : 'ghBodyBtn'}
                        onClick={() => this.setState({goodsIndex:2})}>线上商品</div>
                </div>
                <div className='goodsBody'>
                    <div className='gbTableTop'>
                        <Input style={{ width: 150, margin: '0 20px' }}
                            placeholder='请输入搜索条件'></Input>
                        <Select style={{ width: 150, margin: '0 20px 0 0' }}
                            placeholder='分类'>
                            <Option value="jack">Jack</Option>
                            <Option value="lucy">Lucy</Option>
                        </Select>
                        <Button style={{ margin: '0 20px 0 0', backgroundColor: '#13CE66', borderColor: '#13CE66' }} type='primary'>搜索</Button>
                    </div>
                    <div style={{ width: '100%' }}>
                        <Table columns={columns} 
                            dataSource={data} 
                            style={{textAlign:'center'}}
                            pagination={{pageSize:2}} />
                    </div>
                </div>
            </div>
        )
    }
}

export default Order