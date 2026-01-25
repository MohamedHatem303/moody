import React, { useState } from 'react'
import {Input} from "@heroui/react";
import {Select, SelectItem} from "@heroui/react";
import {Button} from "@heroui/react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import * as zod from "zod"
import {  schemaRegister } from '../../schema/RegisterSchema/RegisterSchema'
import { zodResolver } from "@hookform/resolvers/zod";
import { signup } from '../../Server/RegisterApi/RegisterApi';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from "lucide-react";

export default function Register() {

  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const navigate = useNavigate();
  const [apiError,setapiError]=useState(null);    
  const [isLoading,setisLoading]=useState(false);    

  let {handleSubmit,register,formState:{errors , touchedFields}} = useForm({
    defaultValues:{
      name:'',
      email:'',
      password:'',
      rePassword:'',
      dateOfBirth:'',
      gender:''
    },
    resolver: zodResolver(schemaRegister),
    mode:'onBlur',
    reValidateMode:'onBlur'
  });
  

  register('name');
  
  
  async function SubmitForm(userData){
    setisLoading(true);
    const response = await signup(userData);
    if(response.message=='success'){
      toast.success('account created successfully')
      navigate('/');
    }
    else{
      setapiError(response.error);
    }
    setisLoading(false);
  }
  
  
  return (
    <>
        <div className='min-h-screen bg-[url("/R_BG.jpg")] bg-cover bg-center text-center flex items-center'>
            <div className='w-full lg:w-3/4 lg:w-1/2 m-auto p-5 md:bg-white/20 backdrop-blur-md rounded-xl min-h-[97vh]'>
              <div className="text-center mb-6">
                <p className="uppercase tracking-widest text-white/90 text-3xl">
                  Join
                </p>
                <div className="flex items-center justify-center mt-2">
                  <img
                    src="/bird.png"
                    alt="Mody logo"
                    className="w-15 h-15"
                  />
                  <h2
                    className="text-5xl font-semibold text-[#F5D98C]"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Moody
                  </h2>
                </div>
                <p className="text-white/70 mt-4 text-base">
                  Create your account and enjoy the vibe
                </p>
                <div className="flex justify-center mt-4">
                  <span className="w-44 h-1 rounded-full bg-gradient-to-r from-white/0 via-white/80 to-white/0"></span>
                </div>
              </div>
              <form onSubmit={handleSubmit(SubmitForm)}>
                <div className="flex w-full flex-wrap md:flex-nowrap gap-4 my-5 ">
                  <Input
                  isInvalid={Boolean(errors.name && touchedFields.name)} errorMessage={errors.name?.message}
                  {...register('name')} label="Name" type="text" color={'warning'} />
                </div>
                <div className="flex w-full flex-wrap md:flex-nowrap gap-4 my-5">
                  <Input
                  isInvalid={Boolean(errors.email && touchedFields.email)} errorMessage={errors.email?.message}
                  {...register('email')} label="Email" type="email" color={'warning'}/>
                </div>
                <div className="flex w-full flex-wrap md:flex-nowrap gap-4 my-5">
                  {/* Password */}
                  <Input
                    isInvalid={Boolean(errors.password && touchedFields.password)}
                    errorMessage={errors.password?.message}
                    {...register("password")}
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    color="warning"
                    endContent={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="focus:outline-none"
                      >
                        {showPassword ? (
                          <EyeOff className="text-default-400" size={20} />
                        ) : (
                          <Eye className="text-default-400" size={20} />
                        )}
                      </button>
                    }
                  />
                  {/* Re-Password */}
                  <Input
                    isInvalid={Boolean(errors.rePassword && touchedFields.rePassword)}
                    errorMessage={errors.rePassword?.message}
                    {...register("rePassword")}
                    label="Re-password"
                    type={showRePassword ? "text" : "password"}
                    color="warning"
                    endContent={
                      <button
                        type="button"
                        onClick={() => setShowRePassword(!showRePassword)}
                        className="focus:outline-none"
                      >
                        {showRePassword ? (
                          <EyeOff className="text-default-400" size={20} />
                        ) : (
                          <Eye className="text-default-400" size={20} />
                        )}
                      </button>
                    }
                  />
                </div>
                <div className="flex w-full flex-wrap md:flex-nowrap gap-4 my-5">
                  <Input 
                  isInvalid={Boolean(errors.dateOfBirth && touchedFields.dateOfBirth)} errorMessage={errors.dateOfBirth?.message}
                  {...register('dateOfBirth')} label="DateOfBirth" type="date" color={'warning'}/>
                  <Select 
                  isInvalid={Boolean(errors.gender&& touchedFields.gender)} errorMessage={errors.gender?.message}
                  {...register('gender')} label="Select gender" color={'warning'}>
                    <SelectItem key={'male'} color={'warning'}>Male</SelectItem>
                    <SelectItem key={'female'} color={'warning'}>Female</SelectItem>
                  </Select>
                </div>
                {apiError?<p className='text-red-600 py-2 font-bold '>{apiError}</p>: null }
                <Button isLoading={isLoading} type='submit' size="lg" radius="lg" color="secondary" variant="shadow" className='w-full' >Create Account</Button>
              </form>
              <p className="text-center mt-4 text-white/80 text-sm">
                Already have an account?{" "}
                <Link
                  to="/"
                  className="text-[#f5a524] font-medium hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
        </div>
    </>
  )
}
// مشكلة الجندر و مشكلة الريبسورد 