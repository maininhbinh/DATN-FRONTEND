import { Navigate, Route, Routes } from "react-router-dom";
import Manager from "../page/[role]/(manager)/index";
import Dashboard from "../page/[role]/(manager)/dashboard/Dashboard";
import Layout from "../page";
import Billing from "../page/[role]/(manager)/billing";
import NotPage from "../page/(error)/404";
import Profile from "../page/[role]/(manager)/profile";
import Base from "../page/[role]/(base)";
import PageHome from "../page/[role]/(base)/PageHome";


import UserManagement from "../page/[role]/(manager)/user";
import AddUser from "../page/[role]/(manager)/user/_components/add";
import EditUser from "../page/[role]/(manager)/user/_components/edit";
import ProductDetailPage from "../page/[role]/(base)/ProductDetailPage/ProductDetailPage";
import CartPage from "../page/[role]/(base)/ProductDetailPage/CartPage";
import PageCategory from "../page/[role]/(base)/CategoryPage/PageCategory";
import CheckoutPage from "../page/[role]/(base)/PageCheckout/CheckoutPage";
import PageLogin from "../page/[role]/(base)/Auth/PageLogin";
import PageSignUp from "../page/[role]/(base)/Auth/PageSignUp";
import PageSearch from "../page/[role]/(base)/PageSearch/PageSearch";
import AccountPage from "../page/[role]/(base)/AccountPage/AccountPage";
import AccountSavelists from "../page/[role]/(base)/AccountPage/AccountSavelists";
import AccountPass from "../page/[role]/(base)/AccountPage/AccountPass";
import AccountBilling from "../page/[role]/(base)/AccountPage/AccountBilling";
import AccountOrder from "../page/[role]/(base)/AccountPage/AccountOrder";
import BlogPage from "../page/[role]/(base)/BlogPage/BlogPage";
import BlogSingle from "../page/[role]/(base)/BlogPage/BlogSingle";
import PageContact from "../page/[role]/(base)/PageContact/PageContact";
import PageAbout from "../page/[role]/(base)/PageAbout/PageAbout";
import Login from "../page/[role]/(manager)/auth/login";
import AttributeManagement from "../page/[role]/(manager)/attribute";
import PrivilegeManagement from "@/page/[role]/(manager)/privilege";

import BrandManagement from '../page/[role]/(manager)/brand'
import BannerManagement from '@/page/[role]/(manager)/banner'
import AddBanner from '@/page/[role]/(manager)/banner/_components/add'
import EditBanner from '@/page/[role]/(manager)/banner/_components/edit'
import CategoryManagement from '@/page/[role]/(manager)/category'
import AddCategory from '@/page/[role]/(manager)/category/_components/add'
import EditCategory from '@/page/[role]/(manager)/category/_components/edit'
import VoucherManagement from '../page/[role]/(manager)/voucher'
import PostCategoryManagement from '@/page/[role]/(manager)/postCategory'
import AddPostCategory from '@/page/[role]/(manager)/postCategory/_components/add'
import EditPostCategory from '@/page/[role]/(manager)/postCategory/_components/edit'
import PrivilegeUser from "@/page/[role]/(manager)/user/_components/privilege";
import PostsManagement from "@/page/[role]/(manager)/posts";
import AddPosts from "@/page/[role]/(manager)/posts/_components/add";
import EditPosts from "@/page/[role]/(manager)/posts/_components/edit";
import ProductManagement from "@/page/[role]/(manager)/products";
import AddProduct from "@/page/[role]/(manager)/products/_components/add";
import EditProduct from "@/page/[role]/(manager)/products/_components/edit";
import ColorManagement from "@/page/[role]/(manager)/color";
export default function Router() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route path='' element={<Base />}>
            <Route index element={<PageHome />} />
            <Route path='' element={<ProductDetailPage />} />
          </Route>

          <Route path='' element={<Base />}>
            <Route path='login' element={<PageLogin />} />
            <Route path='signup' element={<PageSignUp />} />

            <Route path='contact' element={<PageContact />} />
            <Route path='about' element={<PageAbout />} />

            <Route path='blog' element={<BlogPage />} />
            <Route path='blog/:slug' element={<BlogSingle />} />

            <Route path='account' element={<AccountPage />} />
            <Route path='account-savelists' element={<AccountSavelists />} />
            <Route path='account-change-password' element={<AccountPass />} />
            <Route path='account-billing' element={<AccountBilling />} />
            <Route path='account-my-order' element={<AccountOrder />} />

            <Route path='cart' element={<CartPage />} />
            <Route path='checkout' element={<CheckoutPage />} />
            <Route path='search' element={<PageSearch />} />
            <Route path='category' element={<PageCategory />} />
            <Route path='category/:slug' element={<PageCategory />} />
            <Route path=':slug' element={<ProductDetailPage />} />
          </Route>

          <Route path='admin/login' element={<Login />} />

          <Route path='admin' element={<Manager />}>
            <Route index element={<Navigate to='/admin/dashboard' />} />
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='billing' element={<Billing />} />
            <Route path='profile' element={<Profile />} />

            <Route path='users' element={<UserManagement />}>
              <Route path='add' element={<AddUser />} />
              <Route path='privilege/:id' element={<PrivilegeUser />} />
              <Route path=':id' element={<EditUser />} />
              
            </Route>
            <Route path='products' element={<ProductManagement />}>
              <Route path='add' element={<AddProduct />} />
              <Route path=':id' element={<EditProduct />} />
              
            </Route>

            <Route path='attributes-product' element={<AttributeManagement />}></Route>

            {/* <Route path="categories" element={<CategoryManagement />}>
                  <Route path="add" element={<AddCategory />} />
                  <Route path=":id" element={<EditCategory />} />
               </Route> */}

            <Route path='voucher' element={<VoucherManagement />}></Route>
            <Route path='color' element={<ColorManagement />}></Route>
            <Route path='brand' element={<BrandManagement />}></Route>


               <Route path="banner" element={<BannerManagement />}>
                  <Route path="add" element={<AddBanner />} />
                  <Route path=":id" element={<EditBanner />} />
               </Route>

               <Route path="privilege" element={<PrivilegeManagement />} />
          


             
            <Route path='banner' element={<BannerManagement />}>
              <Route path='add' element={<AddBanner />} />
              <Route path=':id' element={<EditBanner />} />
            </Route>

            <Route path='categories' element={<CategoryManagement />}>
              <Route path='add' element={<AddCategory />} />
              <Route path=':id' element={<EditCategory />} />
            </Route>

            <Route path='post-categories' element={<PostCategoryManagement />}>
              <Route path='add' element={<AddPostCategory />} />
              <Route path=':id' element={<EditPostCategory />} />
            </Route>

            <Route path='posts' element={<PostsManagement />}>
              <Route path='add' element={<AddPosts />} />
              <Route path=':id' element={<EditPosts />} />
            </Route>
          </Route>
        </Route>
        <Route path='*' element={<NotPage />} />
      </Routes>
    </>
  )
}
