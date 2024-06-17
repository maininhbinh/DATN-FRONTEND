import { useEffect, useState } from "react";
import { ConfirmModalParams, ConfirmModalType, DefaultConfirmModalParams, PAGINATE_DEFAULT, showAlertError, showAlertSuccess } from "../../../../../contains/contants";
import { Form } from "antd";
import instance from "@/api/axios";
import dayjs from "dayjs";
import _ from 'lodash';
import { IColor, IColorCreate, IColorEdit } from "@/common/types/color.interface";

export default function useColor() {
    const [form] = Form.useForm();
    const [dataList, setDataList] = useState<IColor[]>([]);
    const [test, setTest] = useState([]);
    const [dataTotal, setDataTotal] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [Index, setIndex] = useState<number>();
    const [modalParams, setModalParams] = useState<ConfirmModalParams>(DefaultConfirmModalParams);
    const [dataIndex, setDataIndex] = useState<number>();
    const [visibleModalColorDetail, setVisibleModalColorDetail] = useState<boolean>(false);




    useEffect(() => {
        fetchData();
    }, [refresh]);


    const fetchData = async (q?: string) => {
        setLoading(true);
        try {
            const res = await instance.get(`color`, {
                params: {
                    name: q
                }
            })
            setTest(res.data);
            setDataList(res.data);
            setDataTotal(res.data.total);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };
    const debounceFn = _.debounce(fetchData, 800)

    const onSearch = (e: any) => {
        if (!e.target.value.startsWith(' ')) {
            debounceFn(e.target.value);
        }
    }
    const onEditColor = (values: any) => {
        setIndex(values.id);
        setVisibleModalColorDetail(true);
        form.setFieldsValue({
            name: values.name,
            code: values.code,
            discount_amount: values.discount_amount,
            start_date: dayjs(values.start_date),
            end_date: dayjs(values.end_date),
            usage_limit: values.usage_limit
        })
    }

    const onDelete = async () => {
        const res = await instance.delete(`color/${dataIndex}`)
        if (!res) {
            showAlertError('Xóa không thành công');;
            return;
        }

        showAlertSuccess('Xóa thành công');
        setRefresh((prev) => !prev);
        onHideConfirmPopup();
    };

    const onShowDeletePopup = (item: IColor) => {

        setModalParams({
            visible: true,
            title: 'Xóa Color',
            content: 'Bạn có muốn xóa Color không ?',
            type: ConfirmModalType.DELETE
        });
        setDataIndex(item.id);
    };

    const onHideConfirmPopup = (): void => {
        setModalParams(DefaultConfirmModalParams);
        setDataIndex(undefined);
    };

    const handleOkPopup = (): void => {
        if (modalParams.type === ConfirmModalType.DELETE) {
            onDelete();
        }

    };

    const onShowModalDetail = () => {
        setVisibleModalColorDetail(true);
        setIndex(undefined);
        form.resetFields();
    };

    const onCancelModalDetail = () => {
        setVisibleModalColorDetail(false);
        setIndex(undefined);

    };

    const generateColorCode = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 10; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        }
        return result;
    };

    const onSubmit = async (values: any) => {
        try {
            setLoading(true);
            if (Index) {
                const bodyEdit: IColorEdit = {
                    name: values.name,
                    code: generateColorCode(),
                    discount_amount: values.discount_amount,
                    start_date: values.start_date,
                    end_date: values.end_date,
                    usage_limit: values.usage_limit
                }
                const res = await instance.put(`color/${Index}`, bodyEdit)
                if (res.statusText !== 'OK') {
                    showAlertError('Sửa thất bại');
                    onCancelModalDetail
                    setLoading(false);
                    return;
                }
                setLoading(false);
                showAlertSuccess('Sửa thành công');
                setRefresh((prev) => !prev);
                form.resetFields();
                onCancelModalDetail();
            } else {
                const bodyCreate: IColorCreate = {
                    name: values.name,
                    code: generateColorCode(),
                    discount_amount: values.discount_amount,
                    start_date: values.start_date,
                    end_date: values.end_date,
                    usage_limit: values.usage_limit
                }
                console.log("bodyCreate", bodyCreate);
                const res = await instance.post(`color`, bodyCreate)
                if (res.statusText !== 'Created') {
                    showAlertError('Thêm mới thất bại');
                    onCancelModalDetail
                    setLoading(false);
                    return;
                }
                setLoading(false);
                showAlertSuccess('Thêm mới thành công');
                setRefresh((prev) => !prev);
                form.resetFields();
                onCancelModalDetail();
            }

        } catch (error) {
            showAlertError('Thêm mới thất bại');
            onCancelModalDetail
            setLoading(false);
            throw (error);
        }
    };

    return {
        form,
        Index,
        onSearch,
        dataList,
        loading,
        test,
        onEditColor,
        onHideConfirmPopup,
        handleOkPopup,
        modalParams,
        onShowDeletePopup,
        dataTotal,
        onCancelModalDetail,
        visibleModalColorDetail,
        onShowModalDetail,
        onSubmit

    };

}