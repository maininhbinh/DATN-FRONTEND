import  { FC, useState } from "react";
import facebookSvg from "../../../../assets/images/base/Facebook.svg";
import twitterSvg from "../../../../assets/images/base/Twitter.svg";
import googleSvg from "../../../../assets/images/base/Google.svg";
import { Helmet } from "react-helmet-async";
import Input from "../shared/Input/Input";
import ButtonPrimary from "../shared/Button/ButtonPrimary";
import { useNavigate } from "react-router-dom";
import { Modal } from "antd";
import Joi from 'joi';
import { useForm, SubmitHandler } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import {  Input as INPUTANT}  from 'antd';
import type { GetProps } from 'antd';
import { SignupService, VerifyToken} from "@/services/AuthService";
import { popupError, popupSuccess } from "../../shared/Toast";
import { useAppDispatch } from "@/app/hooks";
import { login } from "@/app/slices/authSlide";
import { Statistic } from 'antd';

const { Countdown } = Statistic;
export interface PageSignUpProps {
  className?: string;
}
type OTPProps = GetProps<typeof INPUTANT.OTP>;

interface IFormInput {
  username : string;
  email: string;
  password: string;
  confirmPassword: string;
}

const loginSocials = [
  {
    name: "Continue with Facebook",
    href: "#",
    icon: facebookSvg,
  },
  {
    name: "Continue with Twitter",
    href: "#",
    icon: twitterSvg,
  },
  {
    name: "Continue with Google",
    href: "#",
    icon: googleSvg,
  },
];


const validationSchema = Joi.object({
  username: Joi.string().min(6).required().messages({
    'string.min': 'Username must be at least 6 characters',
    'any.required': 'Username is required',
  }),
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    'string.email': 'Invalid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required',
  }),
  confirmPassword: Joi.any().equal(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match',
    'any.required': 'Confirm password is required',
  }),
});

const PageSignUp: FC<PageSignUpProps> = ({ className = "" }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isVerifyToken, setIsVerifyToken] = useState<boolean>(false);
  const [isLoadingSignUp, setLoadingSignUp] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit,  watch, formState: { errors } } = useForm<IFormInput>({
    resolver: joiResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const payload = {
      username : data.username,
      email : data.email,
      password : data.password,
      password_confirmation : data.password
    }
    try {
      setLoadingSignUp(true);
      await SignupService(payload);
      setIsModalOpen(true)
    } catch (error) {
      popupError('SignUp error');
    }finally {
      setLoadingSignUp(false);
    }
   
  };

  const onChange: OTPProps['onChange'] = (text) => {
    setOtp(text);
  };

  const sharedProps: OTPProps = {
    onChange,
  };
 
  const handleConfirmOtp = async () => {
    try {
      setIsVerifyToken(true);
      const response = await VerifyToken(otp, watch('email'));
      dispatch(login(response.data));
      popupSuccess(`Hello "${watch('username')}"`);
      setIsModalOpen(false)
      navigate("../");
    } catch (error) {
      popupError('OTP does not match');
    }finally{
      setIsVerifyToken(false);
    }
    
    
  }
  return (
  <>  
  <Modal title="Enter OTP" open={isModalOpen} footer={false} closeIcon={false}>
  <p>OTP sent to <span className="text-red-500">"{watch('email')}"</span> within 1 minute, please check your email !</p>
 
  <div className="my-3">
    <Countdown title="OTP will expired" value={Date.now() + 60 * 1000} />
  </div>
  <div className="mt-5">
    <INPUTANT.OTP  length={4} mask="🔒" {...sharedProps} />
  </div>

  <button disabled={isVerifyToken} onClick={() => handleConfirmOtp()} className={`mt-5 cursor-pointer bg-black rounded-[20px] text-white py-2 px-5 font-[700] ${isVerifyToken && 'cursor-not-allowed'}`} >
     Confirm
  </button>
</Modal>
  <div className={`nc-PageSignUp  ${className}`} data-nc-id="PageSignUp">
    <Helmet>
      <title>Sign up || Ciseco React Template</title>
    </Helmet>
    <div className="container mb-24 lg:mb-32">
      <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
        Signup
      </h2>
      <div className="max-w-md mx-auto space-y-6 ">
        <div className="grid gap-3">
          {loginSocials.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className=" flex w-full rounded-lg bg-primary-50 dark:bg-neutral-800 px-4 py-3 transform transition-transform sm:px-6 hover:translate-y-[-2px]"
            >
              <img
                className="flex-shrink-0"
                src={item.icon}
                alt={item.name}
              />
              <h3 className="flex-grow text-center text-sm font-medium text-neutral-700 dark:text-neutral-300 sm:text-sm">
                {item.name}
              </h3>
            </a>
          ))}
        </div>
        {/* OR */}
        <div className="relative text-center">
          <span className="relative z-10 inline-block px-4 font-medium text-sm bg-white dark:text-neutral-400 dark:bg-neutral-900">
            OR
          </span>
          <div className="absolute left-0 w-full top-1/2 transform -translate-y-1/2 border border-neutral-100 dark:border-neutral-800"></div>
        </div>
        {/* FORM */}
        <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit(onSubmit)}>
        <label className="block">
            <span className="text-neutral-800 dark:text-neutral-200">
              Username
            </span>
            <Input
            {...register('username')}
              type="text"
              placeholder="Enter your username"
              className="mt-1"
            />
            {errors.username && <p className="text-red-500">{errors.username.message}</p>}
          </label>
          <label className="block">
            <span className="text-neutral-800 dark:text-neutral-200">
              Email address
            </span>
            <Input
            {...register('email')}
              type="email"
              placeholder="example@example.com"
              className="mt-1"
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </label>
          <label className="block">
            <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
              Password
            </span>
            <Input {...register('password')} type="password" placeholder="*******" className="mt-1" />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
          </label>

          <label className="block">
            <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
              Confirm Password
            </span>
            <Input {...register('confirmPassword')}  type="password" placeholder="*******" className="mt-1" />
            {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
          </label>
          <ButtonPrimary loading={isLoadingSignUp} disabled={isLoadingSignUp} type="submit">Sign Up</ButtonPrimary>
        </form>

      
  
      </div>
    </div>
  </div></>
  
  );
};

export default PageSignUp;
