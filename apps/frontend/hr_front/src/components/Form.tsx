import { useForm, Controller } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

export default function Form(){
    const {register, control} = useForm()

    return(
        <div className="w-[500px] h-[800px] px-8 py-8 bg-white rounded-3xl">
            <form className="flex flex-col gap-5">
                <div className="flex flex-col">
                    <label className="text-[12px]">Full name *</label>
                    <input className="w-full border border-gray-400/40 rounded-lg py-2 px-2"  {...register('Name')}/>
                </div>
                <div className="flex flex-col">
                    <label className="text-[12px]">Email *</label>
                    <input className="w-full border border-gray-400/40 rounded-lg py-2 px-2"  {...register('Email')}/>
                </div>
                <div className="flex flex-col">
                    <label className="text-[12px]">Email *</label>
                    <input className="w-full border border-gray-400/40 rounded-lg py-2 px-2"  {...register('Email')}/>
                </div>
                <div className="flex flex-col">
                    <label className="text-[12px]">Phone number(optional)</label>
                    <Controller control={control} name="PhoneInput" render={({field}) => (
                        <PhoneInput {...field} defaultCountry="US" international className="w-full border border-gray-400/40 rounded-lg py-2 px-2 PhoneInput"/>
                    )} />
                </div>
                
                <div className="flex flex-col">
                    <label className="text-[12px]">Upload resume *</label>
                    <input type="file" className=" border border-dashed h-[200px] rounded-2xl"/>
                </div>
                <div className="flex flex-col">
                    <label className="text-[12px]">Phone number(optional)</label>
                    <input className="h-[100px] w-full border border-gray-400/40 rounded-lg py-2 px-2"/>
                </div>

                
            </form>
        </div>
    )
}