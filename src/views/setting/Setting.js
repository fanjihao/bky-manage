import React, { Component } from 'react'
import './Setting.css'
import {
    Button, Input, Upload, message,
    Modal
} from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import { connect } from 'react-redux'
import axios from '../../http/index'
// import bankCardAttribution from '../../component/bankCard'

// 预览相关
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

class Setting extends Component {
    state = {
        disabled: true,
        merchantDetailInfo:
        {
            // 注册地址
            province: null,
            city: null,
            district: null,
            // 门店地址
            address: null,
            // 商户名称
            merchantName: null,
            // 成立日期
            addTime: null,
            // 统一社会信用代码
            creditCode: null,
            // 营业期限
            businessTerm: null,
            // 注册资本
            registeredCapital: 0,
            // 法人
            legalPerson: null,
            // 法人身份证号
            idCard: null,
            // 法人手机号
            phone: null,
            // 法人身份证人像面
            humanFace: null,
            // 法人身份证国徽面
            nationalEmblem: null,
            // 营业执照照片
            licensePhoto: null,
            // 开户许可证照片
            accountPhote: null,
            // 收款账户类型
            collectionType: null,
            // 账户名称
            collectionName: null,
            // 开户身份证号
            openCard: null,
            // 账户卡号
            accountNo: null,
            // 预留手机号
            reservePhone: null,
            // 营业时间
            businessTime: null,
            // 门店名称
            name: null,
            // 门店招牌照片
            signboardPhoto: null,
            // 门店内景照片
            storePhoto: null,
            // 门店街景照片
            instaPlacePhoto: null,
            // 其他照片
            otherPhoto: null,
            // 年销售量
            annualSales: 0,
            // 年销售额
            salesVolume: 0,
            // 负责人姓名
            personCharge: null,
            // 负责人身份证号
            personCard: null,
            // 负责人电话
            personPhone: null,
            // 门店ID
            systemStoreId: null,
            // 
            onlineMoeny: 0,
            stagesMoeny: 0,
            // 商户昵称
            nickname: null,
            // 商户头像
            avatar: null,
            // 商户性质
            natureMerchant: null,
            // 账户银行
            depositBank: null
        },
        editStatus: false,
        modalImage: null,
        showModal: false,
        personInfo: null,
        fileList: [],
        newFileList: [],
        previewVisible: false,
        previewImage: '',
        previewTitle: '',
    }
    // 查询商户详细信息
    getUserInfo = id => {

        axios({
            method: 'GET',
            url: `/merchantOrder/merchantDetails?id=${id}`,
        })
            .then(res => {
                let otherImgList = []
                if(res.data.otherPhoto === ''){

                }else{
                    let otherImg = res.data.otherPhoto.split(',')
                    for(let i = 0; i < otherImg.length; i ++ ) {
                        let obj = {
                            uid:i,
                            url:otherImg[i]
                        }
                        otherImgList.push(obj)
                    }
                }
                console.log(otherImgList,res)
                this.setState({
                    merchantDetailInfo: res.data,
                    fileList: otherImgList,
                    newFileList: otherImgList
                })
            })
            .catch(err => {
                console.log('失败', err)
            })
    }
    componentDidMount() {
        const id = JSON.parse(localStorage.getItem('user')).id
        this.getUserInfo(id)
        this.setState({
            personInfo: JSON.parse(localStorage.getItem('user'))
        })
    }
    // 修改信息按钮
    edit = () => {
        this.setState({
            editStatus: true,
            disabled: false
        })
    }
    // 取消修改按钮
    cancel = () => {
        let fileList = this.state.newFileList
        this.setState({
            editStatus: false,
            disabled: true,
            fileList: fileList
        })
    }
    // 保存修改
    save = () => {
        const { merchantDetailInfo, fileList } = this.state
        let photoStr = ''
        let baseUrl = 'https://www.bkysc.cn/api/files-upload/'
        for (let i = 0; i < fileList.length; i++) {
            if (fileList[i].response) {
                if (photoStr === '') {
                    photoStr = baseUrl + fileList[i].response.data
                } else {
                    photoStr = baseUrl + fileList[i].response.data + ',' + photoStr
                }
            } else {
                if (photoStr === '') {
                    photoStr = fileList[i].url
                } else {
                    photoStr = fileList[i].url + ',' + photoStr
                }
            }
        }
        axios({
            method: 'POST',
            url: '/merchantOrder/updateUserEnter',
            data: {
                // 营业期限
                businessTerm: merchantDetailInfo.businessTerm,
                // 法人
                legalPerson: merchantDetailInfo.legalPerson,
                // 法人身份证号
                idCard: merchantDetailInfo.idCard,
                // 法人手机号
                phone: merchantDetailInfo.phone,
                // 法人身份证人像面
                humanFace: merchantDetailInfo.humanFace,
                // 法人身份证国徽面
                nationalEmblem: merchantDetailInfo.nationalEmblem,
                // 营业执照照片
                licensePhoto: merchantDetailInfo.licensePhoto,
                // 开户许可证照片
                accountPhote: merchantDetailInfo.accountPhote,
                // 收款账户类型
                collectionType: merchantDetailInfo.collectionType,
                // 账户名称
                collectionName: merchantDetailInfo.collectionName,
                // 开户身份证号
                openCard: merchantDetailInfo.openCard,
                // 账户卡号
                accountNo: merchantDetailInfo.accountNo,
                // 预留手机号
                reservePhone: merchantDetailInfo.reservePhone,
                // 营业时间
                businessTime: merchantDetailInfo.businessTime,
                // 门店名称
                name: merchantDetailInfo.name,
                // 门店招牌照片
                signboardPhoto: merchantDetailInfo.signboardPhoto,
                // 门店内景照片
                storePhoto: merchantDetailInfo.storePhoto,
                // 门店街景照片
                instaPlacePhoto: merchantDetailInfo.instaPlacePhoto,
                // 负责人姓名
                personCharge: merchantDetailInfo.personCharge,
                // 负责人身份证号
                personCard: merchantDetailInfo.personCard,
                // 负责人电话
                personPhone: merchantDetailInfo.personPhone,
                // 账户银行
                depositBank: merchantDetailInfo.depositBank,
                // 商户id
                id: JSON.parse(localStorage.getItem('user')).id,
                // 门店ID
                systemStoreId: JSON.parse(localStorage.getItem('user')).systemStoreId,
                // 其他照片
                otherPhoto: photoStr,
            }
        })
            .then(res => {
                console.log(res)
                if (res.data.status === 200) {
                    message.success('修改信息成功')
                    // this.setState({fileList: oldFileList})
                    // this.getUserInfo(id)
                } else {
                    message.error('修改信息失败')
                }
                this.setState({
                    editStatus: false,
                    disabled: true
                })
            })
            .catch(err => {
                message.error('修改信息失败')
            })
    }

    // 上传门店招牌照片
    signboardPhotoUpload = info => {
        const res = info.fileList[0].response
        if (res) {
            this.setState({
                merchantDetailInfo: {
                    ...this.state.merchantDetailInfo,
                    signboardPhoto: 'https://www.bkysc.cn/api/files-upload/' + res.data
                }
            })
        }
    }

    // 时间戳转换
    formatTime = (time) => {
        let newMonth, newDay
        // newMin, newSec, newHours
        let date = new Date(time * 1000)
        let newYear = date.getFullYear()
        let month = date.getMonth() + 1;
        if (month < 10) {
            newMonth = '0' + month
        } else { newMonth = month }
        let day = date.getDate();
        if (day < 10) {
            newDay = '0' + day
        } else { newDay = day }
        // let hours = date.getHours();
        // if (hours < 10) {
        //     newHours = '0' + hours
        // } else { newHours = hours }
        // let minutes = date.getMinutes();
        // if (minutes < 10) {
        //     newMin = '0' + minutes
        // } else { newMin = minutes }
        // let seconds = date.getSeconds();
        // if (seconds < 10) {
        //     newSec = '0' + seconds
        // } else { newSec = seconds }
        return newYear + '-' + newMonth + '-' + newDay
    }
    // 关闭预览
    handleCancel = () => this.setState({ previewVisible: false });
    // 预览
    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true
        });
    };
    // 多张图片上传
    handleChange = (info) => {
        if (info.file.status !== 'uploading') {
            console.log('上传的文件', info.fileList)
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} 上传成功`)
            this.setState({
                fileList:info.fileList
            })
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败.`)
        }
    }
    onRemove = (file) => {
        let newList = this.state.fileList.filter(item => item.uid !== file.uid)
        this.setState({
            fileList: newList
        })
    }

    render() {
        const { merchantDetailInfo, disabled, editStatus, fileList, previewVisible, previewImage, } = this.state
        const uploadButton = <PlusOutlined />
        const uploadButtonA = (
            <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上传</div>
            </div>
        );
        return (
            <div className='setting'>

                <Modal
                    visible={previewVisible}
                    footer={null}
                    title={null}
                    onCancel={this.handleCancel}
                    width={'40%'}
                >
                    <img alt="preview" style={{ width: '90%' }} src={previewImage} />
                </Modal>

                <div className='setHeaderTop'>
                    <span>设置</span>
                </div>

                {editStatus === false
                    ? <div className='setHeaderBody'>
                        <Button size='large' type="primary" onClick={this.edit} className='saveEditBtn'>修改</Button>
                    </div>
                    : <div className='setHeaderBody'>
                        <Button size='large' type="primary" className='saveEditBtn' onClick={this.save}>保存修改</Button>
                        <Button size='large' className='shBodyBtn' onClick={this.cancel}>取消</Button>
                    </div>}

                <div className='settingBody'>
                    <div className='settingSection'>

                        <div className='sectionTitle'>
                            <span style={{ color: '#1089EB', fontSize: 18 }}>门店资料</span>
                        </div>

                        <div className='sectionBody'>

                            <div className='sbodyForm'>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>门店名称</span>
                                    </div>
                                    <div className='formItemCon'>
                                        <Input value={merchantDetailInfo.name}
                                            disabled={disabled}
                                            onChange={e => this.setState({
                                                merchantDetailInfo: {
                                                    ...this.state.merchantDetailInfo,
                                                    name: e.target.value
                                                }
                                            })} />
                                    </div>
                                </div>

                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>营业时间</span>
                                    </div>
                                    <div className='formItemCon'>
                                        <Input value={merchantDetailInfo.businessTime}
                                            disabled={disabled}
                                            onChange={e => this.setState({
                                                merchantDetailInfo: {
                                                    ...this.state.merchantDetailInfo,
                                                    businessTime: e.target.value
                                                }
                                            })} />
                                    </div>
                                </div>

                            </div>

                            <div className='sbodyForm'>
                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>负责人姓名</span>
                                    </div>
                                    <div className='formItemCon'>
                                        <Input value={merchantDetailInfo.legalPerson}
                                            disabled={disabled}
                                            onChange={e => this.setState({
                                                merchantDetailInfo: {
                                                    ...this.state.merchantDetailInfo,
                                                    legalPerson: e.target.value
                                                }
                                            })} />
                                    </div>
                                </div>

                                <div className='sbodyFormItem'>
                                    <div className='formItemLabel'>
                                        <span>负责人身份证号</span>
                                    </div>
                                    <div className='formItemCon'>
                                        <Input value={merchantDetailInfo.idCard}
                                            disabled={disabled}
                                            onChange={e => this.setState({
                                                merchantDetailInfo: {
                                                    ...this.state.merchantDetailInfo,
                                                    idCard: e.target.value
                                                }
                                            })} />
                                    </div>
                                </div>
                            </div>


                            <div className='storeImg'>
                                <div className='storeImgTitle'>门店招牌照片</div>
                                <div style={{ paddingLeft: 112 }}>
                                    <Upload
                                        disabled={disabled}
                                        listType="picture-card"
                                        showUploadList={false}
                                        action="http://47.108.174.202:9010/upload/files-upload"
                                        onChange={this.signboardPhotoUpload}
                                    >
                                        {merchantDetailInfo.signboardPhoto
                                            ? <img src={merchantDetailInfo.signboardPhoto} alt="photos" className='fItemConimg' />
                                            : uploadButton}
                                    </Upload>
                                </div>
                            </div>

                            <div className='storeImg'>
                                <div className='storeImgTitle'>门店其他照片</div>
                                <div style={{ paddingLeft: 112 }}>
                                    <Upload
                                        disabled={disabled}
                                        action="http://47.108.174.202:9010/upload/files-upload"
                                        listType="picture-card"
                                        fileList={fileList}
                                        onPreview={this.handlePreview}
                                        onChange={this.handleChange}
                                        onRemove={this.onRemove}
                                    >
                                        {fileList.length >= 3 ? null : uploadButtonA}
                                    </Upload>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        userInfo: state.userReducer.user
    }
}

export default connect(mapStateToProps)(Setting)