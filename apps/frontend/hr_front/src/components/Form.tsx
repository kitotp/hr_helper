import { useForm, Controller } from "react-hook-form";
import {z} from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import PhoneInput, { type Value as PhoneValue } from "react-phone-number-input";
import "react-phone-number-input/style.css";


const schema = z.object({
    name: z.string().min(2, 'Name must be at least 2 letters long.'),
    email: z.string().email(),
    age: z.number().refine((v) => !Number.isNaN(v), {message: "Age is required."}).min(18,'You must be at least 18 years old').max(99, 'Maximum age is 99.'),
    phone: z.string().optional(),
    resume: z.custom<FileList>((v) => v instanceof FileList && v.length > 0, "CV is required."),
    description: z.string().optional()
})

export default function Form(){
    const {register, control, handleSubmit, formState: {errors}, reset} = useForm({
        resolver: zodResolver(schema),
    })


    async function submitForm(data: any){
        const fd = new FormData()

        fd.append('name', data.name)
        fd.append('email', data.email)
        fd.append('age', String(data.age))
        if (data.phone) fd.append('phone', data.phone)
        if (data.description) fd.append('description',data.description)
        
        fd.append('resume', data.resume[0])         

        const res = await fetch('/api/submit', {
            method: "POST",
            body: fd
        })
        if(!res.ok) throw new Error('error while submitting form')

        reset()
        
    }

    return(
        <div className="w-[500px] h-fit px-8 py-8 bg-white rounded-3xl">
            <form onSubmit={handleSubmit(submitForm)} className="flex flex-col gap-5">
                <div className="flex flex-col">
                    <label className="text-[12px]">Full name *</label>
                    <input className="w-full border border-gray-400/40 rounded-lg py-2 px-2"  {...register('name')}/>
                    {errors.name && <p className="text-red-600 text-[14px]">{errors.name.message}</p>}
                </div>
                <div className="flex flex-col">
                    <label className="text-[12px]">Email *</label>
                    <input className="w-full border border-gray-400/40 rounded-lg py-2 px-2"  {...register('email')}/>
                    {errors.email && <p className="text-red-600 text-[14px]">{errors.email.message}</p>}
                </div>
                <div className="flex flex-col">
                    <label className="text-[12px]">Age *</label>
                    <input type="number" className="w-full border border-gray-400/40 rounded-lg py-2 px-2"  {...register('age', {valueAsNumber: true})}/>
                    {errors.age && <p className="text-red-600 text-[14px]">{errors.age.message}</p>}
                </div>
                <div className="flex flex-col">
                    <label className="text-[12px]">Phone number(optional)</label>
                    <Controller control={control} name="phone" render={({field}) => (
                        <PhoneInput onChange={(v: PhoneValue) => field.onChange(v ?? "")} value={field.value as PhoneValue} defaultCountry="US" international className="w-full border border-gray-400/40 rounded-lg py-2 px-2 PhoneInput"/>
                    )} />
                    {errors.phone && <p className="text-red-600 text-[14px]">{errors.phone.message}</p>}
                </div>
                
                <div className="flex flex-col">
                    <label className="text-[12px]">Upload resume *</label>
                    <input id="cv" type="file" className="hidden" {...register('resume')}/>
                    <label htmlFor="cv" className="border border-dashed rounded-2xl h-[200px] border-gray-400 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition">
                        <span className="text-gray-600">Click or drag CV here</span>  
                    </label>
                    {typeof errors.resume?.message === 'string' && <p className="text-red-600 text-[14px]">{errors.resume.message}</p>}
                </div>
                <div className="flex flex-col">
                    <label className="text-[12px]">Description(optional)</label>
                    <textarea {...register('description')} className=" w-full border border-gray-400/40 rounded-lg py-2 h-[100px] px-2"/>
                    {errors.description && <p className="text-red-600 text-[14px]">{errors.description.message}</p>}
                </div>

                <button type="submit" className="bg-purple-600 py-3 px-2 text-white">Submit</button>
            </form>
        </div>
    )
}