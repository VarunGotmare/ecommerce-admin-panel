import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function GET(
    _req: Request,
     {params}: {params: {productId: string}}
     ) {
    try{
        
        if(!params.productId){
            return new NextResponse("Product ID is required", {status: 401});
        }
        
        const product = await prismadb.product.findUnique({
            where:{
                id: params.productId,
                
            },
            include:{
                category: true,
                color: true,
                size: true,
                images: true
            }
        });
        return NextResponse.json(product);
    }catch(error){
        console.log("[PRODUCTS_GET]", error);
        return new NextResponse("Internal Server Error", {status: 500})
    }
}

export async function PATCH(
    req: Request,
     {params}: {params: {billboardId: string, storeId: string}}
     ) {
    try{
        const {userId} = auth();
        const body = await req.json();
        const { label, imageUrl } = body;
        if(!userId){
            return new NextResponse("Unauthorized", {status: 401});
        }
        if(!label){
            return new NextResponse("Label is required", {status: 400});
        }
        if(!params.billboardId){
            return new NextResponse("Billboard ID is required", {status: 401});
        }
        const storeByUserId = await prismadb.store.findFirst({
            where:{
                id: params.storeId,
                userId
            }
        });
        if(!storeByUserId){
            return new NextResponse("Unauthorized", {status: 403});
        }
        const billboard = await prismadb.billboard.updateMany({
            where:{
                id: params.billboardId,
                
            },
            data:{
                label,
                imageUrl
            }
        });
        return NextResponse.json(billboard);
    }catch(error){
        console.log("[PRODUCTS_PATCH]", error);
        return new NextResponse("Internal Server Error", {status: 500})
    }
}

export async function DELETE(
    _req: Request,
     {params}: {params: {storeId: string,billboardId: string}}
     ) {
    try{
        const {userId} = auth();
     

        if(!userId){
            return new NextResponse("Unauthorized", {status: 401});
        }
        if(!params.billboardId){
            return new NextResponse("Billboard ID is required", {status: 401});
        }
        const storeByUserId = await prismadb.store.findFirst({
            where:{
                id: params.storeId,
                userId
            }
        });
        if(!storeByUserId){
            return new NextResponse("Unauthorized", {status: 403});
        }
        const billboard = await prismadb.billboard.deleteMany({
            where:{
                id: params.billboardId,
                
            }
        });
        return NextResponse.json(billboard);
    }catch(error){
        console.log("[PRODUCTS_DELETE]", error);
        return new NextResponse("Internal Server Error", {status: 500})
    }
}