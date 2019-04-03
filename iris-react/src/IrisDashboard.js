/**
 * Created by evanli on 01/04/2019.
 */
import React from 'react';
import {
    XAxis,
    YAxis,
    XYPlot,
    MarkSeriesCanvas,
    Highlight
} from 'react-vis';

import {
    Row, Col, Layout, Menu, Icon,Drawer, Form, Button, Input, Select,message
} from 'antd';


import Iris from './iris.json';

import './iris-dashboard.css';

const {
    Header, Content, Sider,
} = Layout;

const AXES = [
    'sepal length',
    'sepal width',
    'petal length',
    'petal width'
];

const SPECIES = ['setosa', 'versicolor', 'virginica','variable'];

const SIZE = 230;

class IrisDashboard extends React.Component {

    onCollapse = (collapsed) => {
        console.log(collapsed);
        this.setState({ collapsed });
    };

    state = {
        filters: AXES.reduce((acc, axis) => {
            acc[axis] = {min: null, max: null};
            return acc;
        }, {}),

        collapsed: false,
        visible: false,
        insertData: []
    };

    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };

    onClose = () => {
        this.setState({
            visible: false,
        });
    };

    isNumber = (val)=> {
    const regPos = /^\d+(\.\d+)?$/;
    const regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/;
    if(regPos.test(val) || regNeg.test(val)) {
        return true;
    } else {
        return false;
    }
}

    success = (info) => {
    message.success(info + ' Success');
    };

    updateError = () => {
    message.error('Updated Failed');
};

    handleSubmit=(e)=>{
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err,fieldsValue)=>{
            if (err) {
                return;
            }

            const {sepalLength,sepalWidth,petalLength,petalWidth} = fieldsValue;
            if(this.isNumber(sepalLength) && this.isNumber(sepalWidth) && this.isNumber(petalLength) && this.isNumber(petalWidth)){
                const newData = {'petal length': petalLength, 'petal width': petalWidth, 'selected': true, 'sepal length': sepalLength, 'sepal width': sepalWidth, 'species': "variable"}
                this.setState({insertData:[...this.state.insertData,newData]}, ()=>{
                    this.success('Updated');
                    this.onClose();
                    this.resetField();
                })
            }else{
                this.updateError();
            }
        })
    };

    resetField = ()=> {
        this.props.form.resetFields();
    };

    resetData = () => {
        this.setState({insertData: []},()=>{
            this.success('Reset');
        });
    };

    render() {

        const { getFieldDecorator } = this.props.form;

        const {filters,insertData} = this.state;

        let data = Iris.map(d => {
            const unselected = AXES.some(key => {
                const filter = filters[key];
                return (filter.min !== filter.max) && (filter.min > d[key] || filter.max < d[key]);
            });
            return {...d, selected: !unselected};
        });
        if(insertData!==[]){
            insertData.forEach((item)=>{
                data = [...data,item];
            })
        }
        console.log(data);


        const drawer = <Drawer
            title="Insert"
            width={260}
            onClose={this.onClose}
            visible={this.state.visible}
        >
            <Form layout="vertical" hideRequiredMark>
                <Row>
                    <Form.Item label="Sepal Length">
                        {getFieldDecorator('sepalLength', {
                            rules: [{ required: true, message: 'Please input sepal length' }],
                        })(<Input placeholder="Please input sepal length" />)}
                    </Form.Item>
                </Row>
                <Row>
                    <Form.Item label="Sepal Width">
                        {getFieldDecorator('sepalWidth', {
                            rules: [{ required: true, message: 'Please input sepal width' }],
                        })(
                            <Input placeholder="Please input sepal width" />
                        )}
                    </Form.Item>
                </Row>
                <Row>
                    <Form.Item label="Petal Length">
                        {getFieldDecorator('petalLength', {
                            rules: [{ required: true, message: 'Please input petal length' }],
                        })(
                            <Input placeholder="Please input petal length" />
                        )}
                    </Form.Item>
                </Row>
                <Row>
                    <Form.Item label="Petal Width">
                        {getFieldDecorator('petalWidth', {
                            rules: [{ required: true, message: 'Please input petal width' }],
                        })(
                            <Input placeholder="Please input petal width" />
                        )}
                    </Form.Item>
                </Row>
            </Form>
            <div
                style={{
                    position: 'absolute',
                    left: 0,
                    bottom: 0,
                    width: '100%',
                    borderTop: '1px solid #e9e9e9',
                    padding: '10px 16px',
                    background: '#fff',
                    textAlign: 'right',
                }}
            >
                <Button onClick={this.resetField} style={{ marginRight: 8 }}>
                    Reset
                </Button>
                <Button onClick={this.handleSubmit} type="primary">
                    Submit
                </Button>
            </div>
        </Drawer>;

        return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                collapsible = {false}
                collapsed={this.state.collapsed}
                onCollapse={this.onCollapse}
            >
                <h2 className="logo">Iris Data Set</h2>
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                    <Menu.Item key="1">
                        <Icon type="dot-chart" />
                        <span>Report</span>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Header style={{ background: '#13233b', padding: 0 }} >
                    <h2 className="header">Report</h2>
                    <div className="style-two"></div>
                </Header>
                <Content >
                    <div className="iris-dasboard-example">
                        <div className="chart-container">
                            {AXES.map(yAxis => {
                                return (
                                    <div key={yAxis} className="chart-row">
                                        <Row gutter={50}>
                                        {AXES.map(xAxis => {
                                            if (xAxis !== yAxis) {
                                                const updateFilter = area => {
                                                    if (!area) {
                                                        filters[xAxis] = {min: null, max: null};
                                                        filters[yAxis] = {min: null, max: null};
                                                        this.setState({filters});
                                                    } else {
                                                        const {left, right, top, bottom} = area;
                                                        filters[xAxis] = {min: left, max: right};
                                                        filters[yAxis] = {min: bottom, max: top};
                                                    }
                                                    this.setState({filters});
                                                };
                                                return (
                                                    <Col span={7} key={xAxis}>
                                                        <div className="form-back">
                                                            <XYPlot height={SIZE} width={SIZE} key={`${xAxis}-${yAxis}`}>
                                                                <MarkSeriesCanvas
                                                                    data={data.map(d => ({
                                                                        x: Number(d[xAxis]),
                                                                        y: Number(d[yAxis]),
                                                                        color: d.species,
                                                                        selected: d.selected
                                                                    }))}
                                                                    colorType="category"
                                                                    colorDomain={SPECIES}
                                                                    colorRange={['#19CDD7', 'red', '#88572C','#f8ed41']}
                                                                    getOpacity={d => d.selected ? 1 : 0.1}
                                                                    size={2}
                                                                />
                                                                <XAxis title={xAxis} style={{fontSize:'12px'}}/>
                                                                <YAxis title={yAxis} style={{fontSize:'12px'}}/>
                                                                <Highlight
                                                                    drag
                                                                    onBrush={updateFilter}
                                                                    onDrag={updateFilter}
                                                                    onBrushEnd={updateFilter} />
                                                            </XYPlot>
                                                        </div>
                                                    </Col>
                                                )
                                            }
                                        })}
                                            <Col span={3} style={{display:yAxis!=='sepal length'?'none':'inline'}}>
                                                <div className="setosa-circle"></div>
                                                <div className="explain-span">Setosa</div>
                                                <div className="versicolor-circle"></div>
                                                <div className="explain-span">Versicolor</div>
                                                <div className="virginica-circle"></div>
                                                <div className="explain-span">Virginica</div>
                                                <div className="variable-circle"></div>
                                                <div className="explain-span">Variable</div>
                                            </Col>
                                            <Col span={3} style={{display:yAxis!=='sepal width'?'none':'inline'}}>
                                                <Button className='insert-button' type="primary" onClick={this.showDrawer}>
                                                    <Icon type="plus" /> Insert
                                                </Button>
                                            </Col>
                                            <Col span={3} style={{display:yAxis!=='petal length'?'none':'inline'}}>
                                                <Button className='insert-button' type="primary" onClick={this.resetData}>
                                                    <Icon type="rollback" /> Reset
                                                </Button>
                                            </Col>
                                            <Col span={3} style={{display:yAxis!=='petal width'?'none':'inline'}}>
                                                <Button className='dis-insert-button' type="primary" onClick={this.showDrawer}>
                                                    <Icon type="plus" /> Insert
                                                </Button>
                                            </Col>
                                            {drawer}

                                        </Row>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </Content>
            </Layout>
        </Layout>
        );
    }
}


const toForm = Form.create()(IrisDashboard);

export default toForm;