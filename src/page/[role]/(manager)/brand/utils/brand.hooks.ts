import { useEffect, useState } from "react";
import { IBrand, IBrandCreate, IBrandEdit, IBrandReq } from "../../../../../common/types/brand.interface";
import { ConfirmModalParams, ConfirmModalType, DefaultConfirmModalParams, PAGINATE_DEFAULT, showAlertError, showAlertSuccess } from "../../../../../contains/contants";
import axios from "axios";
import { Form } from "antd";
import instance from "@/api/axios";
import _ from 'lodash';
export default function useBrand() {
    const [form] = Form.useForm();
    const [dataList, setDataList] = useState<IBrand[]>([]);
    const [test, setTest] = useState([]);
    const [dataTotal, setDataTotal] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [Index, setIndex] = useState<number>();
    const [modalParams, setModalParams] = useState<ConfirmModalParams>(DefaultConfirmModalParams);
    const [dataIndex, setDataIndex] = useState<number>();
    const [visibleModalBrandDetail, setVisibleModalBrandDetail] = useState<boolean>(false);
    console.log(visibleModalBrandDetail);


    useEffect(() => {
        fetchData();
    }, [refresh]);


    const fetchData = async (q?: string) => {
        setLoading(true);
        try {
            const res = await instance.get(`brand`, {
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

    const onEditBrand = (values: any) => {
        setIndex(values.id);
        setVisibleModalBrandDetail(true);
        form.setFieldsValue({
            name: values.name,
            logo: values.logo,
            // create_at: getCurrentDateTime(),
            updated_at: getCurrentDateTime()
        })
    }

    const onDelete = async () => {
        const res = await axios.delete(`http://localhost:3000/brand/${dataIndex}`, {
            headers: {
                'Content-Type': 'application/vnd.api+json'
            }
        });

        if (!res) {
            showAlertError('Xóa không thành công');;
            return;
        }

        showAlertSuccess('Xóa thành công thành công');
        setRefresh((prev) => !prev);
        onHideConfirmPopup();
    };

    const onShowDeletePopup = (item: IBrand) => {

        setModalParams({
            visible: true,
            title: 'Xóa Brand',
            content: 'Bạn có muốn xóa brand không ?',
            type: ConfirmModalType.DELETE
        });
        setDataIndex(item.id);
    };

    const debounceFn = _.debounce(fetchData, 800)

    const onSearch = (e: any) => {
        if (!e.target.value.startsWith(' ')) {
            debounceFn(e.target.value);
        }
    }

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
        setVisibleModalBrandDetail(true);
        setIndex(undefined);

    };

    const onCancelModalDetail = () => {
        setVisibleModalBrandDetail(false);
        setIndex(undefined);
        // setNewsEdit(undefined);
    };

    const getCurrentDateTime = () => {
        const now = new Date();
        return now.toISOString(); // Format as ISO string
    };

    const onSubmit = async (values: any) => {
        try {
            setLoading(true);
            if (Index) {
                const bodyEdit: IBrandEdit = {
                    name: values.name,
                    logo: values.logo,
                    // create_at: getCurrentDateTime(),
                    updated_at: getCurrentDateTime()
                }
                const res = await axios.put(`http://localhost:3000/brand/${Index}`, bodyEdit, {

                });

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
                const bodyCreate: IBrandCreate = {
                    name: values.name,
                    logo: values.logo,
                    create_at: getCurrentDateTime(),
                    updated_at: getCurrentDateTime()
                }
                const res = await axios.post(`http://localhost:3000/brand`, bodyCreate, {

                });
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
        onSearch,
        onEditBrand,
        onHideConfirmPopup,
        handleOkPopup,
        modalParams,
        onShowDeletePopup,
        dataTotal,
        onCancelModalDetail,
        visibleModalBrandDetail,
        onShowModalDetail,
        onSubmit

    };

}