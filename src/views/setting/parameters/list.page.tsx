import { Button, Col, Input, Row, Table, DatePicker, message, Form } from 'antd';
import axios from 'axios';

import { useEffect, useState } from 'react';

import locale from 'antd/es/date-picker/locale/zh_CN';

import config from '../../../../public/config.json';

import { DataType, columns } from './constants';
import { CollectionEditForm } from './edit.page';

const { RangePicker } = DatePicker;

export default () => {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [showInfo, setShowInfo] = useState(false);
    // 列表查询请求
    const listRequest = (values?: DataType) => {
        axios
            .get(`${config.api.baseUrl}/param`, {
                params: {
                    ...values,
                },
            })
            .then((res) => {
                if (res) {
                    setData(res.data.items);
                }
            })
            .catch((err) => {
                message.error(err.message);
            });
    };
    useEffect(() => {
        /**
         * 暂时停止useEffect多次加载的方法
         * const initialized = useRef(false);
         * ...
         * if (!initialized.current) {
         *   initialized.current = true;
         *   ...
         * }
         */
        // 加载列表查询方法，初始加载和在关闭弹窗时加载
        if (!showInfo) {
            listRequest();
        }
    }, [showInfo]);
    // 删除处理器，点击删除按钮触发
    const onDelHandler = (ids: number[]) => {
        axios
            .delete(`${config.api.baseUrl}/param`, {
                data: {
                    ids,
                },
            })
            .then((res) => {
                // 剔除掉删除的数据，使用useState重新加载数据
                const updatedData = data.filter((item: DataType) => {
                    return !ids.includes(item.id);
                });
                setData(updatedData);
                // Antd全局提示
                if (res) message.success('删除成功');
            })
            .catch((err) => {
                message.error(err.message);
            });
    };
    const [curId, setCurId] = useState(0);
    // 打开编辑表单处理器，点击按钮触发
    const onOpenFormHandler = (id?: number) => {
        if (id) {
            setCurId(id);
        } else {
            setCurId(0);
        }
        setShowInfo(true);
    };
    // 时间改变时回调，更新时间传值
    const [timedate, setDate] = useState<string[]>([]);
    const dateChangeHandler = (_date: [], dateString: [string, string]) => {
        setDate(dateString);
    };
    // 表单提交时把范围时间传入values参数中
    const onFinishHandler = (values: DataType) => {
        if (timedate.length > 0 && timedate[0] !== '' && timedate[1] !== '') {
            values.timeRange = `'${timedate[0]} 00:00:00','${timedate[1]} 23:56:59'`;
        }
        listRequest(values);
    };
    const resetHandler = () => {
        form.resetFields();
        listRequest();
    };
    return (
        <div>
            {/* 搜索和操作栏 */}
            <Form form={form} onFinish={onFinishHandler}>
                <Row gutter={24}>
                    <Col span={4}>
                        <Form.Item name="key">
                            <Input placeholder="参数键" allowClear />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item name="name">
                            <Input placeholder="参数名称" allowClear />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item name="value">
                            <Input placeholder="参数值" allowClear />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <RangePicker locale={locale} onChange={dateChangeHandler} />
                    </Col>
                    <Col span={2}>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                搜索
                            </Button>
                        </Form.Item>
                    </Col>
                    <Col span={2}>
                        <Button type="primary" onClick={resetHandler}>
                            重置
                        </Button>
                    </Col>
                    <Col span={2}>
                        <Button type="primary" onClick={() => onOpenFormHandler()}>
                            添加
                        </Button>
                    </Col>
                    <Col span={2}>
                        <Button type="primary" onClick={() => onOpenFormHandler}>
                            删除
                        </Button>
                    </Col>
                </Row>
            </Form>
            {/* 表格数据 */}
            <Table columns={columns({ onOpenFormHandler, onDelHandler })} dataSource={data} />
            {/* 弹出层表单 */}
            {showInfo && <CollectionEditForm id={curId} onClose={() => setShowInfo(false)} />}
        </div>
    );
};