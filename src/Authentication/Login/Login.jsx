import React, { useContext, useState } from "react";
import { Input } from "@heroui/react";
import { Button } from "@heroui/react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schemaLogin } from "../../schema/LoginSchema/LoginSchema";
import { signin } from "../../Server/LoginApi/LoginApi";
import { AuthContext } from "../../Context/authContext";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [apiError, setapiError] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  let {
    handleSubmit,
    register,
    formState: { errors, touchedFields },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(schemaLogin),
    mode: "onBlur",
    reValidateMode: "onBlur",
  });
  register("name");
  let { setusertoken } = useContext(AuthContext);
  async function SubmitForm(userData) {
    setisLoading(true);
    const response = await signin(userData);
    if (response.message == "success") {
      localStorage.setItem("token", response.token);
      setusertoken(response.token);
      toast.success("Welcome back to Moody");
      navigate("/Home");
    } else {
      setapiError(response.error);
    }
    setisLoading(false);
  }
  return (
    <>
      <div className=' min-h-screen bg-[url("/R_BG.jpg")] bg-cover bg-center text-center flex items-center justify-center'>
        <div className="w-full lg:w-1/2 p-5 md:bg-white/20  backdrop-blur-none lg:backdrop-blur-md  rounded-none lg:rounded-xl  min-h-screen lg:min-h-[90vh] flex flex-col justify-center">
          <div className="text-center mb-6">
            <p className="uppercase tracking-widest text-white/90 text-3xl">
              Join
            </p>
            <div className="flex items-center justify-center mt-2">
              <img src="/bird.png" alt="Mody logo" className="w-15 h-15" />
              <h2
                className="text-5xl font-semibold text-[#F5D98C]"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Moody
              </h2>
            </div>
            <p className="text-white/70 mt-4 text-base">
              Good to see you again — signin and enjoy the vibe
            </p>
            <div className="flex justify-center mt-4">
              <span className="w-44 h-1 rounded-full bg-gradient-to-r from-white/0 via-white/80 to-white/0"></span>
            </div>
          </div>
          <form onSubmit={handleSubmit(SubmitForm)}>
            <div className="flex w-full flex-wrap md:flex-nowrap gap-4 my-5">
              <Input
                isInvalid={Boolean(errors.email && touchedFields.email)}
                errorMessage={errors.email?.message}
                {...register("email")}
                label="Email"
                type="email"
                color={"warning"}
              />
            </div>
            <div className="flex w-full flex-wrap md:flex-nowrap gap-4 my-5">
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
            </div>
            {apiError ? (
              <p className="text-red-600 py-2 font-bold ">{apiError}</p>
            ) : null}
            <Button
              isLoading={isLoading}
              type="submit"
              size="lg"
              radius="lg"
              color="secondary"
              variant="shadow"
              className="w-full"
            >
              Login
            </Button>
          </form>
          <p className="text-center mt-4 text-white/80 text-sm">
            Don’t have an account?{" "}
            <Link
              to="/Register"
              className="text-[#f5a524] font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}