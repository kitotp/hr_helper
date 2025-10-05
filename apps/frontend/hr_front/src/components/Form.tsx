import { useForm, Controller } from "react-hook-form";
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";


const schema = z.object({
    name: z.string().min(2, 'Name must be at least 2 letters long.'),
    email: z.email(),
    age: z.number().refine((v) => !Number.isNaN(v), {message: "Age is required."}).min(18,'You must be at least 18 years old').max(99, 'Maximum age is 99.'),
    phone: z.string().optional(),
    resume: z.any().refine((files) => files && files?.length > 0, "CV is required."),
    description: z.string().optional()
})

type Post = {
    name: string,
    email: string,
    age: string,
    phone: string,
    resume: string,
    description: string
}

export default function Form(){
    const {register, control, handleSubmit, formState: {errors}, reset} = useForm({
        resolver: zodResolver(schema)
    })


    async function submitForm(data: any){

        const res = await fetch('http://localhost:4000/submit', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data as Post)
        })

        if(!res.ok){
            throw new Error('Error on logging')
            return
        }

        const res2 = await fetch('http://localhost:4000/send-test-email', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
        })

        if(!res2.ok){
            throw new Error('Error on sending mail')
            return
        }

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
                    <input className="w-full border border-gray-400/40 rounded-lg py-2 px-2"  {...register('age', {valueAsNumber: true})}/>
                    {errors.age && <p className="text-red-600 text-[14px]">{errors.age.message}</p>}
                </div>
                <div className="flex flex-col">
                    <label className="text-[12px]">Phone number(optional)</label>
                    <Controller control={control} name="phone" render={({field}) => (
                        <PhoneInput {...field} defaultCountry="US" international className="w-full border border-gray-400/40 rounded-lg py-2 px-2 PhoneInput"/>
                    )} />
                    {errors.phone && <p className="text-red-600 text-[14px]">{errors.phone.message}</p>}
                </div>
                
                <div className="flex flex-col">
                    <label className="text-[12px]">Upload resume *</label>
                    <input type="file" className=" border border-dashed h-[200px] rounded-2xl" {...register('resume')}/>
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