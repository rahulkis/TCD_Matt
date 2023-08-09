var fs=require('fs');
var path = require('path');
const strainModel = require("../models/strainsModel");
const medicineCompositionModel = require("../models/medicineCompositionParametersModel");
const coaModel = require("../models/coaModel");
const Product = require("../models/productModel");
const ProductType = require("../models/productTypeModel")
const Strain = require("../models/strainsModel");
const layout = require('../../config/layout');
const commonController = require('./commonController');
const uploadPath = path.resolve(__dirname, '../../public/uploads');
const CommonHelper = require('../utils/commonHelper');

let imageResize = async (width,height,imagePath,outputImagePath) => {
	const sharp = require('sharp')
	await sharp(imagePath)
	.resize(width, height)
	.toFile(outputImagePath)
}
//coa model
exports.getProducts = async(req,res,next)=> {
    let data = commonController.getCommonParams('Product List', req);
    let findCond = {is_deleted:0}
    let filterDatas = data.filterDatas;
    if(req.body.filter == 1){
        if(filterDatas.search_text){
          findCond.name = { '$regex' : filterDatas.search_text, '$options' : 'i' }
        }
        if(filterDatas.strain){
          findCond.strain = filterDatas.strain
        }
    }
    let productList = await Product.find(findCond).populate({
        path:'strain',
        select:{"name":1}
    }).populate({
        path:'product_type',
        select:{"name":1}
    }).sort({created_at:-1})
    //console.log(productList)
    let products= []
    if(productList.length>0){
        var imagePath = req.protocol+'://'+req.get('host')+'/uploads/product/'
        for(var m=0;m<productList.length;m++){
            products.push({
                _id:productList[m]._id,
                name:productList[m].name,
                product_image: (productList[m].product_image) ? imagePath+productList[m].product_image : '',
                product_type:(productList[m].product_type) ? productList[m].product_type.name: '',
                description:productList[m].description,
                strain:(productList[m].strain) ? productList[m].strain._id : '',
                strain_name:(productList[m].strain) ? productList[m].strain.name : '',
                is_active : productList[m].is_active
            })
            // console.log(productList[m]);
        }
    }
    data.list = products
    let strainlist = await Strain.find({is_deleted:0,is_active:1}).select({"name":1})
    data.strainlist = strainlist
    res.render('admin/product_list',{ layout: layout.admin.session_with, data });
}
  
exports.addProduct= async(req,res,next)=>{
    let data = commonController.getCommonParams('Add new Product', req);
    let parent_types = await ProductType.find({is_deleted:0,is_active:1,type:1})
    data.parent_types = parent_types
    data.product_types = []
    let productInfo = {
        _id:'',
        name:'',
        strain:'',
        description:'',
        is_active:1,
        product_type:'',
        product_image:'',
        weight:''
    }
    data.details = productInfo
    let strainName =await strainModel.find({is_active:1,is_deleted:0}).select({"name":1});
    data.strainList = strainName;
    res.render('admin/product_form',{ layout: layout.admin.session_with, data });
}
  
exports.updateProduct = async(req,res,next) => {
    let data = commonController.getCommonParams('Update Product', req);
    let parent_types = await ProductType.find({is_deleted:0,is_active:1,type:1})
    data.parent_types = parent_types
    const productId = req.params.id
    let productInfo = await Product.findById(productId).populate({
        path:'product_type',
        select:{"name":1,"type":1},
        populate:{
            path:'parent_id',
            select:{"name":1}
        }
    })
    //console.log(productInfo.product_type)
    //return
    if(!productInfo){
        req.flash('error_msg',`Product does not exist`)
        return res.redirect('/admin/products')
    }
    //console.log(coaInfo);
    var imagePath = req.protocol+'://'+req.get('host')+'/uploads/product/'
    let productDetails = productInfo.toObject()

    if(productInfo.product_type.type == 1){
        productDetails.parent_id = (productInfo.product_type) ? productInfo.product_type._id : ''
        
    }
    
    if(productDetails.product_type.type == 2){
        productDetails.parent_id = (productDetails.product_type) ? productDetails.product_type.parent_id._id : ''
        
    }
    
    productDetails.product_type = (productDetails.product_type) ? productDetails.product_type._id : ''
    
    productDetails.product_image = (productDetails.product_image) ? imagePath+productDetails.product_image : ''
    //console.log(productDetails)
    data.details=productDetails
    let product_types = []
    if(productInfo.product_type.type == 2){
        product_types = await ProductType.find({
            is_deleted:0,
            is_active:1,
            parent_id:productInfo.product_type.parent_id._id
        })
    }
    data.product_types = product_types
    let strainList =await strainModel.find({is_active:1,is_deleted:0}).select({"name":1});
    data.strainList = strainList;
    res.render('admin/product_form',{ layout: layout.admin.session_with, data });
}
  
exports.manageProduct = async(req,res,next)=>{
    //console.log(req.body)
    const userId=req.user._id
    try{
        const productId = req.body.id
        if(productId){
            //update
            let check = await Product.findOne({_id:{$ne:productId},name:req.body.name,is_deleted:0})
            if(check){
                req.flash('error_msg',`Sorry! The product ${req.body.name} already exists, please try with some other value`)
                
                return res.redirect('/admin/products/update/'+productId)
            }
            let productInfo = await Product.findById(productId)
            productInfo.name = req.body.product_name;
            productInfo.description = req.body.description;
            productInfo.strain = req.body.strain;
            productInfo.weight = req.body.weight;
            productInfo.product_type = (req.body.product_type) ? req.body.product_type : req.body.parent_id;
            productInfo.is_active = req.body.is_active ? 1 : 0;
            productInfo.updated_at = new Date();
            productInfo.updated_by = userId
            // console.log(productInfo);
            //console.log(req.file)
            if(req.file){
                var oldImage = (productInfo.product_image) ? productInfo.product_image :''
                if(oldImage){
                    CommonHelper.unlinkFile(uploadPath+'/product/' + oldImage)
                }
                //Crop Image
                const imagePath = uploadPath+'/product/'+req.file.filename;
                const outputImageName = 'IMG_'+ req.file.filename;
                const outputImagePath = uploadPath+'/product/' + outputImageName;
                await imageResize(750,500,imagePath,outputImagePath)			
                productInfo.product_image = outputImageName
                CommonHelper.unlinkFile(imagePath)
            }
            await productInfo.save()
            req.flash('success_msg','Product has been updated successfully')
        }else{
            let check = await Product.findOne({name:req.body.name,is_deleted:0})
            if(check){
                req.flash('error_msg',`Sorry! The product ${req.body.name} already exists, please try with some other value`);
                
                return res.redirect('/admin/products/add/');
            }
            let productInfo = new Product({
                name:req.body.product_name,
                strain:req.body.strain,
                product_type : req.body.product_type,
                weight:req.body.weight,
                description:req.body.description,
                is_active:(req.body.is_active == 1) ? req.body.is_active :0,
                updated_by : userId
            });
            if(req.file){
                //Crop Image
                const imagePath = uploadPath+'/product/'+req.file.filename;
                const outputImageName = 'IMG_'+ req.file.filename;
                const outputImagePath = uploadPath+'/product/' + outputImageName;
                await imageResize(750,500,imagePath,outputImagePath)			
                productInfo.product_image = outputImageName
                CommonHelper.unlinkFile(imagePath)
            }
            await productInfo.save()
            req.flash('success_msg','Product has been created successfully')
        }
    }catch(e){
        req.flash('error_msg',e.message)
    }
    res.redirect('/admin/products')
}
  
exports.deleteProduct = async(req,res,next) =>{
    try{
        var id = req.params.id;
        var productInfo = await Product.findById(id);
        // if(productInfo.image.length>0){
        //     for(let i=0;i<productInfo.image.length;i++){
        //         CommonHelper.unlinkFile(uploadPath+`/product/${productInfo.image[i]}`);
        //     }
        // }
        // //productInfo.image=[];
        productInfo.is_deleted=1;
        productInfo.updated_at=new Date();
        await productInfo.save();
        req.flash('success_msg','Product deleted successfully');
            
    }
    catch(e){
        console.log("Error message :: ",e.message);
        req.flash('error_msg',e.message);
    }
    res.redirect('/admin/products');
}
  


exports.getProductTypes = async(req,res,next)=>{
    let data = commonController.getCommonParams('Product Types', req);
    var totalRecords = 0
    try{
        let findCond = {is_deleted:0}
        let filterDatas = data.filterDatas;
        var pageNo = (data.filterDatas.page_no && data.filterDatas.page_no>1) ? data.filterDatas.page_no:1
        if(req.body.filter == 1){
            if(filterDatas.name){
                findCond.name = { '$regex' : filterDatas.name, '$options' : 'i' }
            }
        }
        totalRecords = await ProductType.countDocuments(findCond);
        let list = []
        if(totalRecords > 0){
            var skip = 0
            var pageRecordLimit = 20
            if (pageNo>0) {
                skip = (parseInt(pageNo)-1)*pageRecordLimit
            }
            let productTypes = await ProductType.find(findCond).populate({
                path:'parent_id',
                select:{"name":1}
            }).limit(pageRecordLimit).skip(skip).sort({display_order: 1})
            //console.log(productTypes)
            if(productTypes.length > 0){
            for(var i=0;i<productTypes.length;i++){
                list.push({
                    _id:productTypes[i]._id,
                    parent_id:(productTypes[i].parent_id) ? productTypes[i].parent_id._id : '',
                    parent_type:(productTypes[i].parent_id) ? productTypes[i].parent_id.name : '',
                    name:productTypes[i].name,
                    is_active:productTypes[i].is_active
                })
            }
            }
        }
        //console.log(list)
        data.records = list
        data.current = pageNo;
        data.totalRecords = totalRecords;
        data.pages = Math.ceil(totalRecords / pageRecordLimit)
    }catch(e){
        req.flash('danger',e.message)
    }
    
    res.render('admin/product_type_list',{ layout: layout.admin.session_with, data });
}
  
exports.getCreateProductTypeView = async(req,res,next)=>{
    let data = commonController.getCommonParams('Add New Product Type', req);
    let parent_types = await ProductType.find({is_deleted:0,is_active:1,type:1})
    data.parent_types = parent_types
    data.details = {
        _id:'',
        name:'',
    }
    res.render('admin/product_type_form',{ layout: layout.admin.session_with, data });
}
  
exports.getUpdateProductTypeView = async(req,res,next)=>{
    let data = commonController.getCommonParams('Update Product Type', req);
    let parent_types = await ProductType.find({is_deleted:0,is_active:1,type:1})
    data.parent_types = parent_types
    var stateId = req.params.id
    let stateInfo = await ProductType.findOne({_id:stateId,is_deleted:0})
    if(!stateInfo){
        req.flash('error_msg','Product does not exist');
        res.redirect('/admin/product-types')
    }
    data.details = stateInfo
    res.render('admin/product_type_form',{ layout: layout.admin.session_with, data });
}
  
exports.manageProductType = async(req,res,next)=>{
    //console.log(req.body)
    try {
        const id = req.body.id
        let checkStateCond = {is_deleted:0,name:req.body.name}
        if(req.body.parent_id){
            checkStateCond.parent_id = req.body.parent_id
        }
        if(id){
            checkStateCond._id = {$ne: id}
        }
        const check = await ProductType.findOne(checkStateCond);
        if(check){
            req.flash('error_msg','Sorry! this product type already exists, Please try with some other name.');
            return res.redirect('/admin/product-types')
        }
        if(id){
            let info = await ProductType.findOne({is_deleted:0,_id:id})
            if(!info){
                req.flash('error_msg','Product type does not exist.');
                return res.redirect('/admin/product-types')
            }
            info.name = req.body.name
            info.parent_id = (req.body.parent_id) ? req.body.parent_id : ''
            info.type = (req.body.parent_id) ? 2 : 1
            info.updated_by = req.user._id
            info.is_active = (req.body.is_active==='1') ? req.body.is_active : 0
            if(req.body.parent_id){
                info.parent_id = req.body.parent_id
            }
            
            await info.save();
            req.flash('success_msg','Product type has been updated successfully');
        }else{
            let newType = new ProductType({
                name:req.body.name,
                
                type:(req.body.parent_id) ? 2 : 1,
                updated_by:req.user._id
            });
            if(req.body.parent_id){
                newType.parent_id = req.body.parent_id
            }
            newType.is_active = (req.body.is_active==='1') ? req.body.is_active : 0
            
            await newType.save();
            req.flash('success_msg','Product type has been added successfully');
        }
        
    } catch (e){
        console.log(e)
        req.flash('error_msg',e.message)
    }
    res.redirect('/admin/product-types')	
}
  
exports.deleteProductType = async(req,res,next)=>{
    try{
        const id = req.params.id
        let info = await ProductType.findOne({is_deleted:0,_id:id})
        if(!info){
            req.flash('error_msg','Product type does not exist.');
            return res.redirect('/admin/product-types')
        }
        //let check = await User
        var typeInUse = await ProductType.find({state:id});
        if(typeInUse.length  > 0){
            req.flash('error_msg','Product type is in use so you could not remove this record.');
            return res.redirect('/admin/product-types')
        }
        await ProductType.updateOne({ _id: id }, { is_deleted: 1})
        req.flash('success_msg','Product type removed successfully.');
    }catch(e){
        console.log(e)
        req.flash('error_msg',e.message)
    }
    res.redirect('/admin/product-types')	
}
  
exports.getProductSubTypes = async(req,res,next)=>{
    var parentType = req.body.parent_product_type
    console.log(parentType)
    var status = 2
    let product_types = await ProductType.find({
        is_deleted:0,
        is_active:1,
        type:2,
        parent_id:parentType
    })
    if(product_types.length > 0){
        status = 1
    }
    res.send({status,data:{product_types}})
}