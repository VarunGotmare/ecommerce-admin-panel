"use client";

import { Billboard, Category } from "@prisma/client";
import { Trash } from "lucide-react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {  useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { useParams,useRouter } from "next/navigation";
import { toast} from "react-hot-toast";

import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";



interface CategoryFormProps {
        initialData: Category | null;
        billboards: Billboard[];

    }

    const formSchema = z.object({
        name: z.string().min(1),
        billboardId: z.string().min(1),
    });
    type CategoryFormValues = z.infer<typeof formSchema>;

export const CategoryForm: React.FC<CategoryFormProps> = ({
    initialData,
    billboards
}) => 
{

    const params = useParams();
    const router = useRouter();

    
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData? "Edit Category" : "Create Category";
    const description = initialData? "Edit a Category" : "Add a Category";
    const toastMessage = initialData? "Category updated" : "Successfully created a category";
    const action = initialData? "Save changes" : "Create";

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ||{
            name: "",
            billboardId: "",
        },
    });



    const onSubmit = async (data: CategoryFormValues) => {
    try{
        setLoading(true);
        if(initialData){
            await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, data);

        }else{
            await axios.post(`/api/${params.storeId}/categories`, data);
        }
        
        router.refresh();
        router.push(`/${params.storeId}/categories`);
        toast.success(toastMessage);
    }catch(error){
        toast.error("Something went wrong.");
    
    }finally{
        setLoading(false);
    
    };
    }

    const onDelete = async () => {
        try{
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`);
            router.refresh();
            router.push(`/${params.storeId}/categories`);
            toast.success("Category deleted");
        }catch(error){
            toast.error("Make sure you remove all products using this products first.");
        
        }finally{
            setLoading(false);
            setOpen(false);
        };
        }

    return ( <>
    <AlertModal 
    isOpen={open}
    onClose={() => setOpen(false)}
    onConfirm={onDelete}
    loading={loading}
    />
        <div className="flex items-center justify-between">
        <Heading title={title} description={description}/>
        { initialData && (
            <Button disabled={loading} variant={"destructive"} size={"icon"} onClick={()=>{setOpen(true)}}>
            <Trash className="h-4 w-4"/>
        </Button>
        )}
        
    </div>
    <Separator />
    <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full ">
            
            <div className="grid grid-cols-3 gap-8">
                <FormField 
                    control={form.control}
                    name="name"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Category name</FormLabel>
                            <FormControl>
                                <Input disabled={loading} {...field} placeholder="Category name"/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField 
                    control={form.control}
                    name="billboardId"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Category name</FormLabel>
                            <Select defaultValue={field.value} disabled={loading} onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue defaultValue={field.value} placeholder="Select a category"/>
                                    </SelectTrigger>
                                </FormControl>
                                    <SelectContent>
                                        {billboards.map((item) => (
                                            <SelectItem key={item.id} value={item.id}>{item.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                            </Select>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
            </div>
            <Button disabled={loading} className="ml-auto" type="submit">{action}</Button>
        </form>
    </Form>    
    <Separator />
    {/* <Toaster /> */}
    </>);

}

 
export default CategoryForm;