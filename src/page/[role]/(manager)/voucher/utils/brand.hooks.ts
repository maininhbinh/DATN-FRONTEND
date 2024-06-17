import { useEffect, useState } from "react";
import { ConfirmModalParams, ConfirmModalType, DefaultConfirmModalParams, PAGINATE_DEFAULT, showAlertError, showAlertSuccess } from "../../../../../contains/contants";
import axios from "axios";
import { Form } from "antd";
import { IVoucher, IVoucherEdit, IVoucherCreate } from "@/common/types/voucher.interface copy";
import instance from "@/api/axios";
import moment from "moment";
import _ from 'lodash';
import dayjs from "dayjs";

export default function useVoucher() {
    const [form] = Form.useForm();
    const [dataList, setDataList] = useState<IVoucher[]>([]);
    const [test, setTest] = useState([]);
    const [dataTotal, setDataTotal] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [Index, setIndex] = useState<number>();
    const [modalParams, setModalParams] = useState<ConfirmModalParams>(DefaultConfirmModalParams);
    const [dataIndex, setDataIndex] = useState<number>();
    const [visibleModalVoucherDetail, setVisibleModalVoucherDetail] = useState<boolean>(false);


    useEffect(() => {
        fetchData();
    }, [refresh]);

    const fetchData = async (q?: string) => {
        setLoading(true);
        try {
            const res = await instance.get(`voucher`, {
                params: {
                    name: q
                }
            });
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
    const onEditVoucher = (values: any) => {
        setIndex(values.id);
        setVisibleModalVoucherDetail(true);
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
        const res = await instance.delete(`voucher/${dataIndex}`)
        if (!res) {
            showAlertError('Xóa không thành công');;
            return;
        }

        showAlertSuccess('Xóa thành công');
        setRefresh((prev) => !prev);
        onHideConfirmPopup();
    };

    const onShowDeletePopup = (item: IVoucher) => {

        setModalParams({
            visible: true,
            title: 'Xóa Voucher',
            content: 'Bạn có muốn xóa Voucher không ?',
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
        setVisibleModalVoucherDetail(true);
        setIndex(undefined);
        form.resetFields();
    };

    const onCancelModalDetail = () => {
        setVisibleModalVoucherDetail(false);
        setIndex(undefined);

    };

    const generateVoucherCode = () => {
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
                const bodyEdit: IVoucherEdit = {
                    name: values.name,
                    code: generateVoucherCode(),
                    discount_amount: values.discount_amount,
                    start_date: values.start_date,
                    end_date: values.end_date,
                    usage_limit: values.usage_limit
                }
                // const res = await axios.put(`http://localhost:3000/Voucher/${Index}`, bodyEdit, {

                // });

                const res = await instance.put(`voucher/${Index}`, bodyEdit)

                console.log("body", res);

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
                const bodyCreate: IVoucherCreate = {
                    name: values.name,
                    code: generateVoucherCode(),
                    discount_amount: values.discount_amount,
                    start_date: values.start_date,
                    end_date: values.end_date,
                    usage_limit: values.usage_limit
                }
                console.log("bodyCreate", bodyCreate);
                const res = await instance.post(`voucher`, bodyCreate)
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
        dataList,
        loading,
        test,
        onEditVoucher,
        onHideConfirmPopup,
        handleOkPopup,
        modalParams,
        onShowDeletePopup,
        dataTotal,
        onCancelModalDetail,
        visibleModalVoucherDetail,
        onShowModalDetail,
        onSubmit,
        onSearch
    };

}