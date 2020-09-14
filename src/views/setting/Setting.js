import React, { Component } from 'react'
import './Setting.css'
import { Button, Input, Select } from 'antd'

export default class Setting extends Component {
    constructor(props) {
        super(props)
        this.state = {
            faren:'张三',
            farenphone:'13364589964'
        }
    }
    render() {
        const { faren, farenphone } = this.state
        return (
            <div className='setting'>
                <div className='setHeaderTop'>
                    <span>设置</span>
                </div>
                <div className='setHeaderBody'>
                    <Button size='large' type="primary">保存修改</Button>
                    <Button size='large' className='shBodyBtn'>取消</Button>
                </div>
                <div className='settingBody'>
                    <div className='settingSection'>
                        <div className='sectionTitle'>
                            <span style={{color:'#1089EB'}}>商户资料</span>
                        </div>
                        <div className='sectionBody'>
                            <div className='sbodyForm'>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>商户名称</span>
                                    </div>
                                    <div className='formItemCon'>
                                        <span>山西艾莉好看撒有限公司</span>
                                    </div>
                                </div>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>年销售额</span>
                                    </div>
                                    <div className='formItemCon'>
                                        <span>215654元</span>
                                    </div>
                                </div>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>统一社会信用代码</span>
                                    </div>
                                    <div className='formItemCon'>
                                        <span>157921155151545625</span>
                                    </div>
                                </div>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>注册地址</span>
                                    </div>
                                    <div className='formItemCon'>
                                        <span>山西省太原市小店区中贸广场6号楼一单元</span>
                                    </div>
                                </div>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>法定代表人</span>
                                    </div>
                                    <div className='formItemCon'>
                                        <Input
                                            value={faren}></Input>
                                    </div>
                                </div>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>法人手机号</span>
                                    </div>
                                    <div className='formItemCon'>
                                        <Input 
                                            value={farenphone}></Input>
                                    </div>
                                </div>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>营业执照照片</span>
                                    </div>
                                    <div className='formItemImg'>
                                        <div className='fItemConimg'></div>
                                    </div>
                                </div>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>法人身份证人像面</span>
                                    </div>
                                    <div className='formItemImg'>
                                        <div className='fItemConimg'></div>
                                    </div>
                                </div>
                            </div>
                            <div className='sbodyForm'>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>年销售量</span>
                                    </div>
                                    <div className='formItemCon'>
                                        <span>13246789单</span>
                                    </div>
                                </div>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>商户性质</span>
                                    </div>
                                    <div className='formItemCon'>
                                        <span>个体商户</span>
                                    </div>
                                </div>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>成立日期</span>
                                    </div>
                                    <div className='formItemCon'>
                                        <span>2005-05-05</span>
                                    </div>
                                </div>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>注册资本</span>
                                    </div>
                                    <div className='formItemCon'>
                                        <span>200万元</span>
                                    </div>
                                </div>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>法人身份证号</span>
                                    </div>
                                    <div className='formItemCon'>
                                        <Input
                                            placeholder='请输入'></Input>
                                    </div>
                                </div>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>营业期限</span>
                                    </div>
                                    <div className='formItemCon'>
                                        <Input
                                            placeholder='请输入'></Input>
                                    </div>
                                </div>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>开户许可证照片</span>
                                    </div>
                                    <div className='formItemImg'>
                                        <div className='fItemConimg'></div>
                                    </div>
                                </div>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>法人身份证国徽面</span>
                                    </div>
                                    <div className='formItemImg'>
                                        <div className='fItemConimg'></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='settingSection'>
                        <div className='sectionTitle'>
                            <span style={{color:'#1089EB'}}>账户信息</span>
                        </div>
                        <div className='sectionBody'>
                            <div className='sbodyForm'>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>收款账户类型</span>
                                    </div>
                                    <div className='formItemCon'>
                                        <Select
                                            placeholder='请输入'></Select>
                                    </div>
                                </div>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>开户身份证号</span>
                                    </div>
                                    <div className='formItemCon'>
                                        <Input
                                            placeholder='请输入'></Input>
                                    </div>
                                </div>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>账户卡号</span>
                                    </div>
                                    <div className='formItemCon'>
                                        <Input
                                            placeholder='请输入'></Input>
                                    </div>
                                </div>
                            </div>
                            <div className='sbodyForm'>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>账户名称</span>
                                    </div>
                                    <div className='formItemCon'>
                                        <Input
                                            placeholder='请输入'></Input>
                                    </div>
                                </div>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>账户银行</span>
                                    </div>
                                    <div className='formItemCon'>
                                        <Input
                                            placeholder='请输入'></Input>
                                    </div>
                                </div>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>预留手机号</span>
                                    </div>
                                    <div className='formItemCon'>
                                        <Input
                                            placeholder='请输入'></Input>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='settingSection'>
                        <div className='sectionTitle'>
                            <span style={{color:'#1089EB'}}>门店资料</span>
                        </div>
                        <div className='sectionBody'>
                            <div className='sbodyForm'>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>门店名称</span>
                                    </div>
                                    <div className='formItemCon'>
                                        <Input
                                            placeholder='请输入'></Input>
                                    </div>
                                </div>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>门店招牌照片</span>
                                    </div>
                                    <div className='formItemImg'>
                                        <div className='fItemConimg'></div>
                                    </div>
                                </div>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>门店街景照片</span>
                                    </div>
                                    <div className='formItemImg'>
                                        <div className='fItemConimg'></div>
                                    </div>
                                </div>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>负责人姓名</span>
                                    </div>
                                    <div className='formItemCon'>
                                        <Input
                                            placeholder='请输入'></Input>
                                    </div>
                                </div>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>负责人电话</span>
                                    </div>
                                    <div className='formItemCon'>
                                        <Input
                                            placeholder='请输入'></Input>
                                    </div>
                                </div>
                            </div>
                            <div className='sbodyForm'>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>营业时间</span>
                                    </div>
                                    <div className='formItemCon'>
                                        <Input
                                            placeholder='请输入'></Input>
                                    </div>
                                </div>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>门店内景照片</span>
                                    </div>
                                    <div className='formItemImg'>
                                        <div className='fItemConimg'></div>
                                    </div>
                                </div>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>其他照片</span>
                                    </div>
                                    <div className='formItemImg'>
                                        <div className='fItemConimg'></div>
                                    </div>
                                </div>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>负责人身份证号</span>
                                    </div>
                                    <div className='formItemCon'>
                                        <Input
                                            placeholder='请输入'></Input>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}