import React from "react"
import './Login.css'
import { Input, Button, message } from 'antd'
import { UserOutlined, KeyOutlined, UnlockOutlined } from '@ant-design/icons'
import axios from '../../http/index'
import { connect } from "react-redux"
import { loginAction } from "../../store/user/userActions"

class Login extends React.Component {
    state = {
        height: '', // 浏览器可视高度
        userphone: '',
        userpass: '',
        phonecode: '',
        forgetPwd: false,
        pwdLogin: true,
        codeLogin: false,
        time: 60,
        codeShow: false,
        telNone: false
    }
    componentDidMount() {
        this.setState({
            height: window.innerHeight + 'px'
        })
    }
    timer = () => {
        if (this.state.telNone === false && this.state.userphone) {
            this.setState({
                codeShow: true
            }, () => {
                axios({
                    url: '/api/appLogin/register/verify',
                    method: 'POST',
                    data: 'phone=' + this.state.userphone,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                    }
                })
                    .then(res => {
                        message.success('验证码发送成功')
                    })
                    .catch(err => {
                        message.success('验证码发送失败')
                    })
                if (this.state.time >= 0) {
                    var codeTime = setInterval(() => {
                        this.setState({
                            time: this.state.time - 1,
                        }, () => {
                            if (this.state.time === 0) {
                                clearInterval(codeTime)
                                this.setState({
                                    codeShow: false,
                                    time: 60
                                })
                            }
                        })
                    }, 1000)
                }
            })
        } else {
            message.warning('手机号码为空或不正确')
        }
    }
    toLogin = () => {
        console.log(this.props)
        const { userphone, userpass, phonecode } = this.state
        if (this.state.codeLogin || this.state.pwdLogin) {
            axios({
                url: '/merchantLogin/merchantLogin',
                method: 'POST',
                data: {
                    accountNumber: userphone,
                    code: phonecode,
                    password: userpass
                }
            })
                .then(res => {
                    console.log(res)
                    if (res.data.status === 200) {
                        localStorage.setItem('token', res.data.token)
                        localStorage.setItem('user', JSON.stringify(res.data.data))
                        this.props.loginHandler(
                            {
                                user: res.data.data
                            },
                            this.props.history
                        )
                        this.props.history.push({
                            pathname: '/home'
                        })
                    }
                    message.success('登录成功,欢迎您！')
                })
                .catch(err => {
                    message.error('登录失败，请重试！')
                    console.log(err)
                })
        } else {
            axios({
                url: '/api/appLogin/retrievePassword',
                method: 'POST',
                data: {
                    accountNumber: userphone,
                    code: phonecode,
                    password: userpass,
                    type: 2
                }
            })
                .then(res => {
                    if (res.data.status === 200) {
                        message.success('修改成功，请登录')
                        this.setState({
                            pwdLogin: true,
                            forgetPwd: false,
                            codeLogin: false
                        })
                    } else {
                        message.warning(res.data.message)
                    }
                })
                .catch(err => {
                    message.error('修改失败，请重试')
                })
        }
    }
    codePhone = e => { // 手机号
        this.setState({
            userphone: e.target.value,
        }, () => {
            if (!(/^[1][3,4,5,7,8,9][0-9]{9}$/.test(this.state.userphone))) {
                this.setState({
                    telNone: true
                })
            } else {
                this.setState({
                    telNone: false
                })
            }
        })
    }
    phoneCode = e => { // 验证码
        this.setState({
            phonecode: e.target.value
        })
    }
    render() {
        const { height, pwdLogin, userphone, userpass, phonecode, forgetPwd, codeLogin, telNone, codeShow, time } = this.state
        let dom, formDom
        if (forgetPwd) {
            dom = <div className='codeLoginPart'>
                <span className='loginCode' onClick={() => this.setState({
                    pwdLogin: false, codeLogin: true, forgetPwd: false
                })}>验证码登录</span>
            </div>
            formDom = <div className='loginFormItem loginInputGroup flexPhone'>
                <KeyOutlined />
                <Input size="large" bordered={false}
                    placeholder='请输入验证码'
                    value={phonecode}
                    onChange={e => this.phoneCode(e)} />
                {codeShow
                    ? <span className='loginCode'>请{time}秒后重试</span>
                    : <span className='loginCode' onClick={this.timer}>发送验证码</span>}
            </div>
        } else if (pwdLogin) {
            dom = <div className='codeLoginPart'>
                <span className='loginCode' onClick={() => this.setState({
                    pwdLogin: false, codeLogin: true, forgetPwd: false
                })}>验证码登录</span>
                <span className='loginCode' onClick={() => this.setState({
                    pwdLogin: false, codeLogin: false, forgetPwd: true
                })}>忘记密码</span>
            </div>
            formDom = <div className='loginFormItem loginInputGroup flexPhone'>
                <UnlockOutlined />
                <Input size="large" bordered={false}
                    type='password'
                    placeholder='请输入密码'
                    value={userpass}
                    onChange={e => this.setState({ userpass: e.target.value })} />
            </div>
        } else if (codeLogin) {
            dom = <div className='codeLoginPart'>
                <span className='loginCode' onClick={() => this.setState({
                    pwdLogin: true, codeLogin: false, forgetPwd: false
                })}>密码登录</span>
            </div>
            formDom = <div className='loginFormItem loginInputGroup flexPhone'>
                <KeyOutlined />
                <Input size="large" bordered={false}
                    placeholder='请输入验证码'
                    value={phonecode}
                    onChange={e => this.phoneCode(e)} />
                {codeShow
                    ? <span className='loginCode'>请{time}秒后重试</span>
                    : <span className='loginCode' onClick={this.timer}>发送验证码</span>}
            </div>
        }
        return (
            <div className="login" style={{ height }}>
                <div className='loginPart'>
                    <div className='loginTitle'>
                        <div className='loginTitleTop'>
                            <div className='loginTopLogo' >
                                <img alt='logo' src={require('../../assets/imgs/ic_launcher.png')} style={{ width: '50%', height: '50%' }}></img>
                            </div>
                            <div className='systemName'>
                                博客云商家版后台管理系统
                            </div>
                        </div>
                    </div>
                    <div className='loginContent'>
                        <div className='loginImg'>

                        </div>
                        <div className='loginForm'>
                            <div className='loginFormItem loginLogo'>
                                <img alt='logo' src={require('../../assets/imgs/ic_launcher.png')}
                                    style={{ width: '30px', height: '30px', margin: '0 20px 0' }}></img>
                                <span>博客云</span>
                            </div>
                            <div className='loginFormItem loginInputGroup flexPhone'>
                                <UserOutlined />
                                <Input size="large" bordered={false}
                                    placeholder='请输入电话号码'
                                    value={userphone}
                                    onChange={e => this.codePhone(e)} />
                                {telNone ? <span style={{ color: 'red', fontSize: '12px' }} className='tips'>请正确输入</span> : null}
                            </div>
                            {formDom}
                            {forgetPwd
                                ? <div className='loginFormItem loginInputGroup flexPhone'>
                                    <UnlockOutlined />
                                    <Input size="large" bordered={false}
                                        type='password'
                                        placeholder='设置新密码'
                                        value={userpass}
                                        onChange={e => this.setState({ userpass: e.target.value })} />
                                </div>
                                : null}
                            {dom}
                            <div className='loginBtnBox'>
                                <Button type="primary" size='large'
                                    className='loginBtn'
                                    onClick={this.toLogin}>登录</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        loginHandler: (user, history) => dispatch(loginAction(user, history)),
    };
}

export default connect(null, mapDispatchToProps)(Login)