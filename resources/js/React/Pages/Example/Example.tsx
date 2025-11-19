import { useEffect, useRef, useState } from "react";
import ProductList from "@app/js/React/components/ProductList/ProductList";
import Counter from "@app/js/React/components/Counter/Counter";
import ProductCreateForm from "@app/js/React/components/ProductCreateForm/ProductCreateForm";
import InputText from "../../components/InputText/InputText";
import { CounterRef } from "../../components/Counter/Counter.types";
import useListProductsApi from "../../hooks/useListProductsApi";
import Pagination from "../../components/Pagination/Pagination";
import ProductsProvider from "../../providers/ProductProvider/ProductsProvider";


export default function Example() {

    const LIMIT = 10;

    const { loading, callProductListApi, productList } = useListProductsApi();

    useEffect(() => {

        callProductListApi(0, LIMIT);

    }, []);

    const createProductHandler = () => {
        callProductListApi(0, LIMIT);
    }

    const deleteProductHandler = () => {
        callProductListApi(0, LIMIT);
    }/** */

    const paginateChangeHandler = (page: number) => {
        callProductListApi((page - 1) * LIMIT, LIMIT);
    }

    return (
        <div className="row g-4">
            <ProductCreateForm onCreate={createProductHandler} />
            <div className="col-12 col-lg-8">
                {
                    loading ?
                        <i className="fas fa-spinner fa-spin"></i> :
                        (
                            <div className="d-flex gap-4 flex-column">
                                <ProductList products={productList} onDelete={deleteProductHandler} />
                                <Pagination data={productList} onChange={paginateChangeHandler} />
                            </div>
                        )

                }
            </div>
        </div>
    );

}
