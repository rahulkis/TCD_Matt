var fs=require('fs');
var path = require('path');
const strainModel = require("../models/strainsModel");
const medicineCompositionModel = require("../models/medicineCompositionParametersModel");
const coaModel = require("../models/coaModel")
const ProductType = require("../models/productTypeModel")
const Product = require("../models/productModel");
const Strain = require("../models/strainsModel");
const layout = require('../../config/layout');
const commonController = require('./commonController');
const uploadPath = path.resolve(__dirname, '../../public/uploads');
const CommonHelper = require('../utils/commonHelper');
const Excel = require('exceljs');
const COA = require('../models/coaModel');
const COAJobsStatus = require('../models/coaJobsStatusModel');
const SearchLogs = require('../models/searchLoggingModel');
const CoaTestLabs = require('../models/coaTestLabsModel');
const { awsTextTractJobProcess, awsTextTract } = require("../utils/AWS");
const http      = require('http'), https     = require('https');
//coa model
exports.getCoa = async(req,res,next)=> {
    let data = commonController.getCommonParams('COA Full Listing', req);
    let findCond = {is_deleted:0}
    let filterDatas = data.filterDatas;
    var match = {}
    var matchStrain = {}
    if(req.body.filter == 1){
      if(filterDatas.coa_no){
          findCond.coa_no = { '$regex' : filterDatas.coa_no, '$options' : 'i' }
      }
      if(filterDatas.product_name){
        //findCond.name = { '$regex' : filterDatas.coa_name, '$options' : 'i' }
        match.name = { '$regex' : filterDatas.product_name, '$options' : 'i' }
      }
      if(filterDatas.weight){
        findCond.weight = { '$regex' : filterDatas.weight, '$options' : 'i' }
      }
      if(filterDatas.strain){
        matchStrain.name = { '$regex' : filterDatas.straing, '$options' : 'i' }
      }
      if(filterDatas.lab_name){
        findCond.laboratory_name = { '$regex' : filterDatas.lab_name, '$options' : 'i' }
      }
      if(filterDatas.tested_at){
        var testDateSplit = filterDatas.tested_at.split("-");
        var testDate = testDateSplit[2]+"-"+testDateSplit[0]+"-"+testDateSplit[1];
        findCond.tested_at =testDate;
      }
  }
    //console.log(match)
    let coa = await coaModel.find(findCond).populate({
      path:'product',
      match,
      select:{"name":1,"description":1}
    }).populate({
      path:'strain',
      matchStrain,
      select:{"name":1}
    }).populate({
      path:'cannabinoid_profile.composition_id',
      select:{"name":1}
    }).populate({
      path:'terpenes.composition_id',
      select:{"name":1}
    }).sort({created_at:-1})
    //console.log(coa)
    let coaList= []
    if(coa.length>0){
      for(var m=0;m<coa.length;m++){
        var cannabinoidProfileList = []
        if(coa[m].cannabinoid_profile.length > 0){
          for(var u=0;u<coa[m].cannabinoid_profile.length;u++){
            cannabinoidProfileList.push({
              composition_id : coa[m].cannabinoid_profile[u].composition_id._id,
              composition_name: coa[m].cannabinoid_profile[u].composition_id.name,
              weight: coa[m].cannabinoid_profile[u].weight
            }) 
          }
        }
        var terpenesList = []
        if(coa[m].terpenes.length > 0){
          for(var u=0;u<coa[m].terpenes.length;u++){
            terpenesList.push({
              composition_id : coa[m].terpenes[u].composition_id._id,
              composition_name: coa[m].terpenes[u].composition_id.name,
              weight: coa[m].terpenes[u].weight
            }) 
          }
        }
        coaList.push({
          _id:coa[m]._id,
          coa_no:coa[m].coa_no,
          name:(coa[m].product) ? coa[m].product.name : '',
          strain:(coa[m].strain) ? coa[m].strain._id : '',
          strain_name:(coa[m].strain) ? coa[m].strain.name : '',
          weight:coa[m].weight,
          description:(coa[m].product) ? coa[m].product.description :'',
          total_cannabinoid: coa[m].total_cannabinoid,
          total_terpenes: coa[m].total_terpenes,
          cannabinoid_profile : cannabinoidProfileList,
          terpenes : terpenesList,
          laboratory_name: coa[m].laboratory_name,
          tested_at: (coa[m].tested_at) ? CommonHelper.formatedDate(coa[m].tested_at,7): '',
          positive_test_report_text:coa[m].positive_test_report_text,
          negative_test_report_text:coa[m].negative_test_report_text,
          is_active : coa[m].is_active
        })
        // console.log(coaList[m]);
      }
    }
    data.list = coaList
    let strainlist = await Strain.find({is_deleted:0,is_active:1}).select({"name":1})
    data.strainlist = strainlist
    res.render('admin/coa_list',{ layout: layout.admin.session_with, data });
}
  
exports.addCoa= async(req,res,next)=>{
  let data = commonController.getCommonParams('Add new COA', req);
  let coaInfo = {
    _id:'',
    coa_no:'',
    product_id:'',
    name:'',
    strain:'',
    weight:'',
    description:'',
    total_cannabinoid:'',
    total_terpenes:'',
    cannabinoid_profile: [],
    cannabinoid_weight:[],
    terpenes:[],
    terpenes_weight:[],
    tested_at:'',
    positive_test_report_text:'',
    negative_test_report_text:'',
    total_THC:'',
    total_CBD:'',
    producer_name:'',
    producer_lic:'',
    distributor_name:'',
    distributor_lic:'',
    laboratory_name:'',
    sample_id:'',
    batch_id:'',
    is_active:1
  }
  data.details = coaInfo
  let strainName =await strainModel.find({is_active:1,is_deleted:0}).select({"name":1});
  data.strainList = strainName;
  let cannabinoid = await medicineCompositionModel.find({is_active:1,is_deleted:0,type:1}).select({"name":1}).sort({name:1})
  let terpenes = await medicineCompositionModel.find({is_active:1,is_deleted:0,type:2}).select({"name":1}).sort({name:1})
  data.cannabinoidList = cannabinoid
  data.terpenesList = terpenes
  let productList = await Product.find({is_deleted:0,is_active:1})
  data.products = productList
  res.render('admin/coa_form',{ layout: layout.admin.session_with, data });
}
  
exports.updateCoa = async(req,res,next) => {
  let data = commonController.getCommonParams('Update COA', req);
  const coaId = req.params.id
  let coaInfo = await coaModel.findById(coaId).populate({
    path:'product',
    select:{"name":1,"description":1}
  })
  //console.log(coaInfo);
  let coaDetails = coaInfo.toObject()
  coaDetails.product_id = (coaDetails.product) ? coaDetails.product._id :''
  coaDetails.name = (coaDetails.product) ? coaDetails.product.name :''
  coaDetails.description = (coaDetails.product) ? coaDetails.product.description :''
  //console.log(coaDetails)
  data.details = coaDetails
  let strainName =await strainModel.find({is_active:1,is_deleted:0}).select({"name":1});
  data.strainList = strainName;
  let cannabinoid = await medicineCompositionModel.find({is_active:1,is_deleted:0,type:1}).select({"name":1}).sort({name:1})
  let terpenes = await medicineCompositionModel.find({is_active:1,is_deleted:0,type:2}).select({"name":1}).sort({name:1})
  data.cannabinoidList = cannabinoid
  data.terpenesList = terpenes   
  let productList = await Product.find({is_deleted:0,is_active:1})
  data.products = productList 
  res.render('admin/coa_form',{ layout: layout.admin.session_with, data });
}
  
exports.manageCoa = async(req,res,next)=>{
  //console.log(req.body)
  var userId=req.user._id
  try{
    const coaId = req.body.id
    if(coaId){
      //update
      let check = await coaModel.findOne({_id:{$ne:coaId},coa_no:req.body.coa_no,is_deleted:0})
      if(check){
        req.flash('error_msg',`Sorry! The COA ${req.body.coa_no} already exists, please try with some other value`)
        if(typeof(req.files.coa_image)!=='undefined'){
          for(let i=0;i<req.files.coa_image.length;i++){
            CommonHelper.unlinkFile(uploadPath+`/coa/${req.files.coa_image[i].filename}`);
          }
        }
        return res.redirect('/admin/coa/update/'+coaId)
      }
      let coaInfo = await coaModel.findById(coaId)

      coaInfo.coa_no = req.body.coa_no;
      coaInfo.product = req.body.product;
      coaInfo.coa_source = req.body.coa_source;
      coaInfo.coa_source2 = req.body.coa_source2;
      coaInfo.strain = req.body.strain;
      coaInfo.weight = req.body.weight;
      coaInfo.total_cannabinoid = (req.body.total_cannabinoid) ? req.body.total_cannabinoid :'';
      coaInfo.total_terpenes = (req.body.total_terpenes) ? req.body.total_terpenes :'';
      coaInfo.positive_test_report_text = req.body.positive_test_report_text;
      coaInfo.negative_test_report_text = req.body.negative_test_report_text;
      coaInfo.tested_at = req.body.tested_at;
      coaInfo.total_THC = req.body.total_THC;
      coaInfo.total_CBD = req.body.total_CBD;
      coaInfo.producer_name = req.body.producer_name
      coaInfo.producer_lic = req.body.producer_lic
      coaInfo.distributor_name = req.body.distributor_name
      coaInfo.distributor_lic = req.body.distributor_lic
      coaInfo.laboratory_name = req.body.laboratory_name
      coaInfo.sample_id = req.body.sample_id
      coaInfo.batch_id = req.body.batch_id
      coaInfo.updated_by = userId
      var image = [];
      if(typeof(req.files.coa_image)!=='undefined'){
        for(let i=0;i<req.files.coa_image.length;i++){
          image.push(req.files.coa_image[i].filename);
        }
        for(let i=0;i<coaInfo.image.length;i++){
          CommonHelper.unlinkFile(uploadPath+`/coa/${coaInfo.image[i]}`);
        }
      }
      if(image.length>0){
        coaInfo.image=image;
      }
      var cannabinoid_profile = []
      if(typeof(req.body.cannabinoid_profile)==="string"){
        cannabinoid_profile.push({
          composition_id: req.body.cannabinoid_profile,
          weight_mg: req.body.cannabinoid_weight_mg,
          weight:req.body.cannabinoid_weight
        })
      }
      else{
        for(var i=0;i<req.body.cannabinoid_profile.length;i++){
          if(req.body.cannabinoid_profile[i] !== ''){
            cannabinoid_profile.push({
              composition_id: req.body.cannabinoid_profile[i],
              weight_mg: req.body.cannabinoid_weight_mg[i],
              weight: req.body.cannabinoid_weight[i]
            });
          }
          else{
            continue;
          }
        }
      }
      var terpenes = []
      if(typeof(req.body.terpenes)==="string"){
        terpenes.push({
          composition_id: req.body.terpenes,
          weight_mg: req.body.terpenes_weight_mg,
          weight:req.body.terpenes_weight
        })
      }
      else{
        for(var i=0;i<req.body.terpenes.length;i++){
          if(req.body.terpenes[i]!==''){
            terpenes.push({
              composition_id: req.body.terpenes[i],
              weight_mg: req.body.terpenes_weight_mg[i],
              weight: req.body.terpenes_weight[i]
            });
          }
          else{
            continue;
          }
        }
      }
      coaInfo.cannabinoid_profile = cannabinoid_profile
      coaInfo.terpenes = terpenes
      coaInfo.is_active = req.body.is_active ? 1 : 0;
      // console.log(coaInfo);
      await coaInfo.save()
      req.flash('success_msg','COA has been updated successfully')
    }else{
      //add
      // console.log(req.body);
      // console.log(req.files);
      let check = await coaModel.findOne({coa_no:req.body.coa_no,is_deleted:0})
      if(check){
        req.flash('error_msg',`Sorry! The COA ${req.body.coa_no} already exists, please try with some other value`);
        if(typeof(req.files.coa_image)!=='undefined'){
          for(let i=0;i<req.files.coa_image.length;i++){
            CommonHelper.unlinkFile(uploadPath+`/coa/${req.files.coa_image[i].filename}`);
          }
        }
        return res.redirect('/admin/coa/add/');
      }
      
      // let newProduct = new Product({
      //   name:req.body.name,
      //   description:req.body.description,
      //   strain:req.body.strain,
      //   updated_by:userId
      // })
      // let productInfo = await newProduct.save()
      
      var productId = req.body.product
      let coaInfo = new coaModel({
        coa_no:req.body.coa_no,
        product:productId,
        coa_source:req.body.coa_source,
        coa_source2:req.body.coa_source2,
        strain:req.body.strain,
        weight:req.body.weight,
        total_cannabinoid:req.body.total_cannabinoid,
        total_terpenes:req.body.total_terpenes,
        lab_name:req.body.lab_name,
        tested_at:req.body.tested_at,
        positive_test_report_text:req.body.positive_test_report_text,
        negative_test_report_text:req.body.negative_test_report_text,
        total_THC:req.body.total_THC,
        total_CBD:req.body.total_CBD,
        producer_name:req.body.producer_name,
        producer_lic : req.body.producer_lic,
        distributor_name : req.body.distributor_name,
        distributor_lic : req.body.distributor_lic,
        laboratory_name : req.body.laboratory_name,
        sample_id : req.body.sample_id,
        batch_id : req.body.batch_id,
        updated_by:userId
      });
      var image = [];
      if(typeof(req.files.coa_image)!=='undefined'){
        for(let i=0;i<req.files.coa_image.length;i++){
          image.push(req.files.coa_image[i].filename);
        }
      }
      var cannabinoid_profile = []
      if(typeof(req.body.cannabinoid_profile)==="string"){
        cannabinoid_profile.push({
          composition_id: req.body.cannabinoid_profile,
          weight_mg: req.body.cannabinoid_weight_mg,
          weight:req.body.cannabinoid_weight
        })
      }
      else{
        for(var i=0;i<req.body.cannabinoid_profile.length;i++){
          if(req.body.cannabinoid_profile[i] !== ''){
            cannabinoid_profile.push({
              composition_id: req.body.cannabinoid_profile[i],
              weight_mg: req.body.cannabinoid_weight_mg[i],
              weight: req.body.cannabinoid_weight[i]
            });
          }
          else{
            continue;
          }
        }
      }
      var terpenes = []
      if(typeof(req.body.terpenes)==="string"){
        terpenes.push({
          composition_id: req.body.terpenes,
          weight_mg: req.body.terpenes_weight_mg,
          weight:req.body.terpenes_weight
        })
      }
      else{
        for(var i=0;i<req.body.terpenes.length;i++){
          if(req.body.terpenes[i]!==''){
            terpenes.push({
              composition_id: req.body.terpenes[i],
              weight_mg: req.body.terpenes_weight_mg[i],
              weight: req.body.terpenes_weight[i]
            });
          }
          else{
            continue;
          }
        }
      }
      coaInfo.cannabinoid_profile = cannabinoid_profile
      coaInfo.terpenes = terpenes
      coaInfo.image = image;
      coaInfo.is_active = req.body.is_active ? 1 : 0;
      // console.log(coaInfo);
      let coaRes = await coaInfo.save()
      console.log(coaRes.id)
      // const coaId = coaRes.id
      // let productInfo = await Product.findById(coaId)
      // productInfo.coa_id = coaId
      // await productInfo.save()
      req.flash('success_msg','COA has been created successfully')
    }
  }catch(e){
    console.log(e)
    req.flash('error_msg',e.message)
  }
  res.redirect('/admin/coa')
}

exports.deleteCoa = async(req,res,next) =>{
  try{
    var id = req.params.id;
    var coaInfo = await coaModel.findById(id);
    coaInfo.is_deleted=1;
    coaInfo.updated_at=new Date();
    await coaInfo.save();
    req.flash('success_msg','COA deleted successfully');
  }catch(e){
    console.log("Error message :: ",e.message);
    req.flash('error_msg',e.message);
  }
  res.redirect('/admin/coa');
}

exports.getCOADetails = async(req,res,next)=>{
  let data = commonController.getCommonParams('COA Details', req);
  const coaId = req.params.id
  let coaInfo = await coaModel.findOne({_id:coaId}).populate({
    path:'product',
    select:{"name":1,"description":1}
  }).populate({
    path:'mycotoxins.composition_id',
    select:{"name":1}
  }).populate({
    path:'cannabinoid_profile.composition_id',
    select:{"name":1}
  })
  console.log(coaInfo.cannabinoid_profile)
  let coaDetails = coaInfo.toObject()

  let cannabinoids = []
  if(coaInfo.cannabinoid_profile.length > 0){
    for(var m=0;m<coaInfo.cannabinoid_profile.length;m++){
      cannabinoids.push({
        LOD:coaInfo.cannabinoid_profile[m].LOD,
        LOQ:coaInfo.cannabinoid_profile[m].LOQ,
        weight:coaInfo.cannabinoid_profile[m].weight,
        weight_mg:coaInfo.cannabinoid_profile[m].weight_mg,
        tested_date:coaInfo.cannabinoid_profile[m].tested_date,
        notes:coaInfo.cannabinoid_profile[m].notes,
        composition_id:coaInfo.cannabinoid_profile[m].composition_id._id,
        composition_name:coaInfo.cannabinoid_profile[m].composition_id.name
      })
    }
  }
  coaDetails.cannabinoid_profile = cannabinoids


  let mycotoxins = []
  if(coaInfo.mycotoxins.length > 0){
    for(var m=0;m<coaInfo.mycotoxins.length;m++){
      mycotoxins.push({
        LOD:coaInfo.mycotoxins[m].LOD,
        LOQ:coaInfo.mycotoxins[m].LOQ,
        limit:coaInfo.mycotoxins[m].limit,
        composition_id:coaInfo.mycotoxins[m].composition_id._id,
        composition_name:coaInfo.mycotoxins[m].composition_id.name
      })
    }
  }
  coaDetails.mycotoxins = mycotoxins
  coaDetails.product_id = (coaDetails.product) ? coaDetails.product._id :''
  coaDetails.name = (coaDetails.product) ? coaDetails.product.name :''
  coaDetails.description = (coaDetails.product) ? coaDetails.product.description :''
  data.details = coaDetails
  
  let strainName =await strainModel.find({is_active:1,is_deleted:0}).select({"name":1});
  data.strainList = strainName;
  let cannabinoid = await medicineCompositionModel.find({is_active:1,is_deleted:0,type:1}).select({"name":1}).sort({name:1})
  let terpenes = await medicineCompositionModel.find({is_active:1,is_deleted:0,type:2}).select({"name":1}).sort({name:1})
  let pesticides = await medicineCompositionModel.find({is_active:1,is_deleted:0,type:3}).select({"name":1}).sort({name:1})
  let microbials = await medicineCompositionModel.find({is_active:1,is_deleted:0,type:4}).select({"name":1}).sort({name:1})
  let micotoxins = await medicineCompositionModel.find({is_active:1,is_deleted:0,type:5}).select({"name":1}).sort({name:1})
  let heavy_metals = await medicineCompositionModel.find({is_active:1,is_deleted:0,type:6}).select({"name":1}).sort({name:1})
  data.cannabinoidList = cannabinoid
  data.terpenesList = terpenes   
  data.pesticidesList = pesticides
  data.microbialsList = microbials
  data.micotoxinsList = micotoxins
  data.metalList = heavy_metals
  
  let productList = await Product.find({is_deleted:0,is_active:1})
  data.products = productList 
  res.render('admin/coa_details',{ layout: layout.admin.session_with, data })
}
  
exports.downloadSampleExcel = async(req,res,next) =>{	  
	var workbook = new Excel.Workbook();

	workbook.views = [
		{
			x: 0, y: 0, width: 10000, height: 20000,
			firstSheet: 0, activeTab: 1, visibility: 'visible'
		}
	];
	var worksheet = workbook.addWorksheet('details');
	worksheet.columns = [
    { header: 'Product Name', key: 'name', width: 25 },
    { header: 'Product Description', key: 'description', width: 20 },
    { header: 'Product Type', key: 'product_type', width: 10 },
    { header: 'Strain', key: 'strain', width: 10 },
    { header: 'COA Number', key: 'coa_number', width: 30 },
    { header: 'Sample ID', key: 'sample_id', width: 30 },
    { header: 'Batch ID', key: 'batch_id', width: 30 },
    { header: 'Weight', key: 'weight', width: 10 },
    { header: 'Lab Name', key: 'laboratory_name', width: 10 },
    { header: 'Tested At', key: 'tested_at', width: 10 },
    { header: 'Positive Test Report', key: 'positive_test_report_text', width: 10 },
    { header: 'Negetive Test Report', key: 'negative_test_report_text', width: 10 },
    { header: 'Total Cannabinoid', key: 'total_cannabinoid', width: 10 },
    { header: 'Total Terpenes', key: 'total_terpenes', width: 10 }
	];

	//worksheet.addRow({ coa_number: 'ABC123', name: 'John Doe', description:'LOrem Ipsum', strain: 'Sativa', weight: 10,lab_name:'Test Lab',tested_at:'2021-04-12',positive_test_report_text:'Pesticides: Microbials: Mycrotoxins: Heavy Metals',negative_test_report_text:'',total_cannabinoid:'120', total_terpenes:'89',cannabinoid_profile:'',terpenes:''});
  var worksheet2 = workbook.addWorksheet('summary');
  worksheet2.columns = [
    { header: 'Test', key: '', width: 30 },
    { header: 'Tested At', key: '', width: 30 },
    { header: 'Result', key: '', width: 30 }
    
  ];
  var worksheet3 = workbook.addWorksheet('cannabinoids');
  worksheet3.columns = [
    { header: 'Analyte', key: '', width: 30 },
    { header: 'LOD', key: '', width: 30 },
    { header: 'LOQ', key: '', width: 30 },
    { header: 'Result In Percentage', key: '', width: 30 },
    { header: 'Result In mg/g', key: '', width: 30 },
    { header: 'Tested Date', key: '', width: 30 },
    { header: 'Notes', key: '', width: 30 },
    { header: 'Total THC', key: '', width: 30 },
    { header: 'Total CBD', key: '', width: 30 },
    { header: 'Total Cannabinoids', key: '', width: 30 }
    
  ];
  var worksheet4 = workbook.addWorksheet('terpenes');
  worksheet4.columns = [
    { header: 'Analyte', key: '', width: 30 },
    { header: 'LOD', key: '', width: 30 },
    { header: 'LOQ', key: '', width: 30 },
    { header: 'Result In Percentage', key: '', width: 30 },
    { header: 'Result In mg/g', key: '', width: 30 },
    { header: 'Tested Date', key: '', width: 30 },
    { header: 'Notes', key: '', width: 30 }
  ];
  var worksheet5 = workbook.addWorksheet('pesticides');
  worksheet5.columns = [
    { header: 'Analyte', key: '', width: 30 },
    { header: 'LOD', key: '', width: 30 },
    { header: 'LOQ', key: '', width: 30 },
    { header: 'Limit', key: '', width: 30 },
    { header: 'Mass', key: '', width: 30 },
    { header: 'Status', key: '', width: 30 }
  ];
  var worksheet6 = workbook.addWorksheet('microbials');
  worksheet6.columns = [
    { header: 'Analyte', key: '', width: 30 },
    { header: 'Result', key: '', width: 30 },
    { header: 'Status', key: '', width: 30 }
  ];
  var worksheet7 = workbook.addWorksheet('mycotoxins');
  worksheet7.columns = [
    { header: 'Analyte', key: '', width: 30 },
    { header: 'LOD', key: '', width: 30 },
    { header: 'LOQ', key: '', width: 30 },
    { header: 'Limit', key: '', width: 30 },
    { header: 'Units', key: '', width: 30 },
    { header: 'Status', key: '', width: 30 }
  ];
  var worksheet8 = workbook.addWorksheet('heavy_metals');
  worksheet8.columns = [
    { header: 'Analyte', key: '', width: 30 },
    { header: 'LOD', key: '', width: 30 },
    { header: 'LOQ', key: '', width: 30 },
    { header: 'Limit', key: '', width: 30 },
    { header: 'Units', key: '', width: 30 },
    { header: 'Status', key: '', width: 30 }
  ];
	res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
	res.setHeader("Content-Disposition", "attachment; filename=" + "COASample.xlsx");
	workbook.xlsx.write(res)
	.then(function (data) {
		res.end();
	});
}

exports.uploadCOAExcelData = async(req,res,next) =>{
  if(req.file){
    var filename = uploadPath+'/coadata/'+req.file.filename
  }
  if(!filename){
    req.flash('error_msg','Please upload a file')
    return res.redirect('/admin/coa')
  }
  const userId = req.user._id
  //console.log('hi')
  let cannabinoidName = []
  let cannabinoidArr = []
  let terpenesName = []
  let terpenesArr = []
  let pesticidesName = []
  let pesticidesArr = []
  let microbialsName = []
  let microbialsArr = []
  let mycotoxinsName = []
  let mycotoxinsArr = []
  let compositions = await medicineCompositionModel.find({is_deleted:0}).select({"name":1,"type":1})
  if(compositions.length > 0){
    for(var c = 0; c < compositions.length; c++){
      if(compositions[c].type == 1){
        cannabinoidName.push(compositions[c].name)
        cannabinoidArr[compositions[c].name]=compositions[c]
      }
      if(compositions[c].type == 2){
        terpenesName.push(compositions[c].name)
        terpenesArr[compositions[c].name]=compositions[c]
      }
      if(compositions[c].type == 3){
        pesticidesName.push(compositions[c].name)
        pesticidesArr[compositions[c].name]=compositions[c]
      }
      if(compositions[c].type == 4){
        microbialsName.push(compositions[c].name)
        microbialsArr[compositions[c].name]=compositions[c]
      }
      if(compositions[c].type == 5){
        mycotoxinsName.push(compositions[c].name)
        mycotoxinsArr[compositions[c].name]=compositions[c]
      }
    }
  }

  
  let pTypes = []
  let productTypeArr = []
  let productTypes = await ProductType.find({is_deleted:0})
  if(productTypes.length > 0){
    for(var s = 0; s < productTypes.length; s++){
      var type = productTypes[s].name
      pTypes.push(type)
      productTypeArr[type]=productTypes[s]
    }
  }

  let strains = await Strain.find({is_deleted:0})
  let strainNames = []
  let strainInfoArr = []
  
  if(strains.length > 0){
    for(var s = 0; s < strains.length; s++){
      var strainName = strains[s].name
      strainNames.push(strainName)
      strainInfoArr[strainName]=strains[s]
    }
  }

  let productIdentifiers = await Product.find({is_deleted:0,has_identifier:1})
  //console.log(productIdentifiers)
  let pIInfoArr = []
  let identifiers = []
  if(productIdentifiers.length > 0){
    for(var s = 0; s < productIdentifiers.length; s++){
      var identifier = productIdentifiers[s].COA_identifier
      identifiers.push(identifier)
      pIInfoArr[identifier]=productIdentifiers[s]
    }
  }
  
  //console.log(filename)
  var workbook = new Excel.Workbook(); 
  //let result = await workbook.xlsx.readFile(filename)
  
  workbook.xlsx.readFile(filename).then(function() {
      var coaNo = ''
      let product = new Product({updated_by:userId,is_deleted:0})
      let coaData = new COA({updated_by:userId,is_deleted:0})
      let summary = []
      var summaryWorksheet = workbook.getWorksheet('summary');
      if(summaryWorksheet.length > 0){
        summaryWorksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
          //console.log("Row " + rowNumber + " = " + JSON.stringify(row.values));
          if(rowNumber >= 2){
            if(row.values.length > 0){
              var summaryRow = row.values
              summary.push({
                test: summaryRow[1],
                tested_at: (summaryRow[2]) ? new Date(summaryRow[2]) : '',
                result: summaryRow[3]
              })
            }
          }
        });
      }
      //console.log(summary)
      if(summary.length > 0){
        coaData.summary = summary
      }

      /**Cannabinoids */
      let cannabinoids = []
      var cannabinoidsWorksheet = workbook.getWorksheet('cannabinoids');
      cannabinoidsWorksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
        //console.log("Row " + rowNumber + " = " + JSON.stringify(row.values));
        if(rowNumber >= 2){
          if(row.values.length > 0){
            var cannabiRow = row.values
            if(cannabiRow[1] !== 'Total'){
              var cIndex = cannabinoidName.indexOf(cannabiRow[1])
              if(cIndex > -1){
                var id = cannabinoidArr[cannabiRow[1]]._id
              }
              if(id){
                cannabinoids.push({
                  composition_id: id,
                  LOD:cannabiRow[2],
                  LOQ:cannabiRow[3],
                  weight:(cannabiRow[4] != 'ND') ? cannabiRow[4] : 0,
                  weight_mg:(cannabiRow[5] != 'ND') ? cannabiRow[5] :0,
                  tested_date: (cannabiRow[6]) ? new Date(cannabiRow[6]) : '',
                  notes: cannabiRow[7],
                })
              }
              
            }
          }
        }
      });
      //console.log(cannabinoids)
      coaData.cannabinoid_profile = cannabinoids

      /**Terpenes */
      let terpenes = []
      var terpenesWorksheet = workbook.getWorksheet('terpenes');
      if(terpenesWorksheet.length > 0){
        terpenesWorksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
          //console.log("Row " + rowNumber + " = " + JSON.stringify(row.values));
          if(rowNumber >= 2){
            if(row.values.length > 0){
              var terpeneRow = row.values
              if(terpeneRow[1] !== 'Total'){
                var tIndex = terpenesName.indexOf(terpeneRow[1])
                if(tIndex > -1){
                  var id = terpenesArr[terpeneRow[1]]._id
                }
                if(id){
                  terpenes.push({
                    composition_id: id,
                    LOD:terpeneRow[2],
                    LOQ:terpeneRow[3],
                    weight:(terpeneRow[4] != 'ND') ? terpeneRow[4] : '',
                    weight_mg:(terpeneRow[5] != 'ND') ? terpeneRow[5] : '',
                    //tested_date: (terpeneRow[6]) ? new Date(terpeneRow[6]) : '',
                    tested_date: '',
                    notes: terpeneRow[7],
                  })
                }
                
              }
            }
          }
        });
      }
      
      //console.log(terpenes)
      if(terpenes.length > 0){
        coaData.terpenes = terpenes
      }

      /**Pesticides */
      let pesticides = []
      var pesticidesWorksheet = workbook.getWorksheet('pesticides');
      if(pesticidesWorksheet.length > 0){
        pesticidesWorksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
          //console.log("Row " + rowNumber + " = " + JSON.stringify(row.values));
          if(rowNumber >= 2){
            if(row.values.length > 0){
              var pesticidesRow = row.values
              if(pesticidesRow[1] !== 'Total'){
                //let pesticidesName = []
                //let pesticidesArr = []
                var pIndex = pesticidesName.indexOf(pesticidesRow[1])
                if(pIndex > -1){
                  var id = pesticidesArr[pesticidesRow[1]]._id
                }
                if(id){
                  pesticides.push({
                    composition_id: id,
                    LOD:(pesticidesRow[2]) ? pesticidesRow[2] : '',
                    LOQ:(pesticidesRow[3]) ? pesticidesRow[3] : '',
                    limit:(pesticidesRow[4]) ? pesticidesRow[4] : 0.00,
                    weight:(pesticidesRow[5] != 'ND') ? pesticidesRow[5] : 0.00,
                    status:(pesticidesRow[6]) ? pesticidesRow[6] : '',
                    tested_date: (pesticidesRow[7]) ? new Date(pesticidesRow[7]) : ''
                  })
                }
                
              }
            }
          }
        });
      }
      
      //console.log(pesticides)
      coaData.pesticides = pesticides

      
      /**Microbials */
      let microbials = []
      var microbialsWorksheet = workbook.getWorksheet('microbials');
      if(microbialsWorksheet.length > 0){
        microbialsWorksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
          //console.log("Row " + rowNumber + " = " + JSON.stringify(row.values));
          if(rowNumber >= 2){
            if(row.values.length > 0){
              var microbialsRow = row.values
              if(microbialsRow[1] !== 'Total'){
                var mIndex = microbialsName.indexOf(microbialsRow[1])
                if(mIndex > -1){
                  var id = microbialsArr[microbialsRow[1]]._id
                }
                if(id){
                  microbials.push({
                    composition_id: id,
                    weight:(microbialsRow[2] != 'ND') ? microbialsRow[2] : 0.00,
                    status:(microbialsRow[3]) ? microbialsRow[3] : '',
                    tested_at: (microbialsRow[4]) ? new Date(microbialsRow[4]) : ''
                  })
                }
                
              }
            }
          }
        });
      }
      
      //console.log(microbials)
      coaData.microbials = microbials

      
      /**Mycotoxins */
      let mycotoxins = []
      var mycotoxinsWorksheet = workbook.getWorksheet('mycotoxins');
      if(mycotoxinsWorksheet.length > 0){
        mycotoxinsWorksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
          //console.log("Row " + rowNumber + " = " + JSON.stringify(row.values));
          if(rowNumber >= 2){
            if(row.values.length > 0){
              var mycotoxinsRow = row.values
              if(mycotoxinsRow[1] !== 'Total'){
                var mIndex = mycotoxinsName.indexOf(mycotoxinsRow[1])
                if(mIndex > -1){
                  var id = mycotoxinsArr[mycotoxinsRow[1]]._id
                }
                if(id){
                  mycotoxins.push({
                    composition_id: id,
                    LOD:(mycotoxinsRow[2] != 'ND') ? mycotoxinsRow[2] : 0.00,
                    LOQ:(mycotoxinsRow[3] != 'ND') ? mycotoxinsRow[3] : 0.00,
                    limit:(mycotoxinsRow[4] != 'ND') ? mycotoxinsRow[4] : 0.00
                  })
                }
                
              }
            }
          }
        });
      }
      
      //console.log(mycotoxins)
      coaData.mycotoxins = mycotoxins

      var detailsWorksheet = workbook.getWorksheet('details');
      
      detailsWorksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
          //console.log("Row " + rowNumber + " = " + JSON.stringify(row.values));
          if(rowNumber == 2){
            let details = row.values
            product.name = details[1]
            product.description=details[2]
            
            var productType = details[3]
            var strain = details[4]
            var sIndex = strainNames.indexOf(strain)
            if(sIndex > -1){
              product.strain = strainInfoArr[strain]._id
            }

            var pIndex = pTypes.indexOf(productType)
            if(pIndex > -1){
              product.product_type = productTypeArr[productType]._id
            }
            coaNo = details[5]
            coaData.coa_no = details[5]
            coaData.sample_id = details[6]
            coaData.batch_id = details[7]
            coaData.weight = details[8]
            coaData.laboratory_name = details[9]
            coaData.tested_at = new Date(details[10])
            coaData.positive_test_report_text = details[11]
            coaData.negative_test_report_text = details[12]
            coaData.total_cannabinoid = details[13]
            coaData.total_terpenes = details[14]
            coaData.total_CBD = details[15]
            coaData.total_THC = details[16]
            
          }
      });
      

      console.log(coaNo)
      // var cIndex = cannabinoidName.indexOf(cannabiRow[1])
      // if(cIndex > -1){
      //   var id = cannabinoidArr[cannabiRow[1]]._id
      // }

      product.save().then(savedProductRes=>{
        coaData.product = savedProductRes._id
        coaData.strain = savedProductRes.strain
        //console.log(coaData)
        coaData.save().then(savedCOARes=>{
          console.log(savedCOARes)
          req.flash('success_msg','Product & associated COA information has been created successfully')
          res.redirect('/admin/coa')
        }).catch(savedCOAErr=>{
          console.log(savedCOAErr)
          req.flash('error_msg',savedCOAErr.message)
          return res.redirect('/admin/coa')
        })
        
      }).catch(savedProductErr=>{
          console.log(savedProductErr)
          req.flash('error_msg',savedProductErr.message)
          return res.redirect('/admin/coa')
      })
      
  });
}

exports.getUploadCoa = async(req,res,next)=>{
  let data = commonController.getCommonParams('Upload COA Image', req);
  res.render('admin/coa_upload', {layout:layout.admin.session_with, data })
}

exports.pendingCoa = async(req,res,next)=>{
  let data = commonController.getCommonParams('COA Queue', req);
  let coa_record = []
  let findCond = { is_deleted: 0 }
  const coaAllRecords = await COAJobsStatus.find(findCond);
  if (!!coaAllRecords) {
    for (var r = 0; r < coaAllRecords.length; r++) {
      if (!!coaAllRecords[r].job_id) {
        if (!!coaAllRecords[r].parsedCoa && coaAllRecords[r].parsedCoa.length > 0) {
          //await COAJobsStatus.findByIdAndUpdate(coaAllRecords[r]._id, {parsedCoa: getTextractData.Blocks});
          coa_record.push({
            _id: coaAllRecords[r]._id,
            job_id: coaAllRecords[r].job_id,
            filename: coaAllRecords[r].filename,
            originalFilename: coaAllRecords[r].originalFilename,
            created_at: coaAllRecords[r].created_at,
            parsedCoa: coaAllRecords[r].parsedCoa,
            completed_date: !!coaAllRecords[r].completed_date ? coaAllRecords[r].completed_date : 'Pending',
            job_status: 'SUCCEEDED'
          })
        } else {
          const getTextractData = await awsTextTractJobProcess(coaAllRecords[r].job_id);
          if (getTextractData.JobStatus==='SUCCEEDED') {
            var parsedCoa = getTextractData.Blocks;
            var datenow = new Date().toISOString()
            await COAJobsStatus.findByIdAndUpdate(coaAllRecords[r]._id, {'$set': { parsedCoa: parsedCoa, update_date: datenow }});
          } else {
            var parsedCoa = '';
          }
          coa_record.push({
            _id: coaAllRecords[r]._id,
            job_id: coaAllRecords[r].job_id,
            filename: coaAllRecords[r].filename,
            originalFilename: coaAllRecords[r].originalFilename,
            created_at: coaAllRecords[r].created_at,
            parsedCoa: parsedCoa,
            completed_date: !!coaAllRecords[r].completed_date ? coaAllRecords[r].completed_date : 'Pending',
            job_status: getTextractData.JobStatus
          })
        }
      } else {
        coa_record.push({
          _id: coaAllRecords[r]._id,
          job_id: coaAllRecords[r].job_id,
          filename: coaAllRecords[r].filename,
          originalFilename: coaAllRecords[r].originalFilename,
          created_at: coaAllRecords[r].created_at,
          completed_date: !!coaAllRecords[r].completed_date ? coaAllRecords[r].completed_date : 'Pending',
          job_status: 'InValid'
        })
      }
    }
  }
  data.coa_record = coa_record
  res.render('admin/coa_pending', {layout:layout.admin.session_with, data })
}

exports.deletePendingCoa = async(req,res,next) =>{
  try{
    var id = req.params.id;
    var coaInfo = await COAJobsStatus.findById(id);
    coaInfo.is_deleted=1;
    coaInfo.updated_at=new Date();
    await coaInfo.save();
    req.flash('success_msg','COA deleted successfully');
  }catch(e){
    console.log("Error message :: ",e.message);
    req.flash('error_msg',e.message);
  }
  res.redirect('/admin/coa-pending');
}

exports.getURLCoa = async(req,res,next)=>{
  let data = commonController.getCommonParams('Process COA URL', req);
  res.render('admin/coa_url', {layout:layout.admin.session_with, data })
}

exports.getCoaSearchList = async(req,res,next)=>{
  let data = commonController.getCommonParams('COA Search Results', req);
  let findCond = { is_deleted: 0, type: 'getCOAinformation' }
  data.searchResult = await SearchLogs.find(findCond).populate({path: 'search_by', select: {full_name: 1}})
  res.render('admin/coa_search_list', {layout:layout.admin.session_with, data })
}

exports.getURLCoaProcess = async(req,res,next)=>{
  //let data = commonController.getCommonParams('Process COA URL', req);
  //let client = http;

  /*  if (url.toString().indexOf("https") === 0) {
        client = https;
    }

    client.get(url, (resp) => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            resolve(data);
        });

    }).on("error", (err) => {
        reject(err);
    }); */
    console.log(req);
    var new_coa = {
      filename : req.body.coa_url,
      originalFilename : req.body.coa_url,
      job_status : 'In Progress',
      created_by : req.user._id
    }
    await COAJobsStatus.create(new_coa)
    return res.redirect('/admin/coa-pending')
}

exports.getCoaTestLabs = async(req,res,next)=>{
  let data = commonController.getCommonParams('Coa Test Laboratory', req);
  let findCond = { is_deleted: 0 }
  const coaTestLabsAllRecords = await CoaTestLabs.find(findCond);
  data.test_labs = coaTestLabsAllRecords
  res.render('admin/coa_test_labs', {layout:layout.admin.session_with, data })
}

exports.coaTestLabs = async(req,res,next)=>{
  let data = commonController.getCommonParams('Coa Test Laboratory', req);
  res.render('admin/testlabs_newform', {layout:layout.admin.session_with, data })
}

exports.addTestLabs = async(req,res,next)=>{
    let data = commonController.getCommonParams('Coa Test Laboratory', req);
  try {
    var { labname, address, license_number, contact } = req.body;
    let findCond = { labname, is_deleted: 0 }
    const coaTestLabs = await CoaTestLabs.find(findCond);
    if (coaTestLabs.length > 0) {
      req.flash('error_msg', 'Sorry! Laboratory already exists, please try with some other value');
    } else {
      const newCoaTestLabs = new CoaTestLabs({
        labname,
        address,
        license_number,
        contact
      });

      newCoaTestLabs.is_active = (req.body.is_active === '1') ? req.body.is_active : 0;
      await newCoaTestLabs.save();
      req.flash('success_msg', 'Test Lab has been added successfully');
    }
  }
  catch (e) {
    console.log("Error message :: " + e);
    req.flash('error_msg', e.message);
  }
  res.render('admin/coa_test_labs', {layout:layout.admin.session_with, data })
}

exports.editTestLabs = async(req,res,next)=>{
  let data = commonController.getCommonParams('Coa Test Laboratory', req);

  let findCond = { _id: req.params.id, is_deleted: 0 }
  const coaTestLabs = await CoaTestLabs.find(findCond);
  data.details = coaTestLabs;

  res.render('admin/testlabs_form', {layout:layout.admin.session_with, data })
}
exports.processCoa = async(req,res,next)=>{
  let data = commonController.getCommonParams('Add new COA', req);
  let coaInfo = {
    _id:'',
    coa_no:'',
    product_id:'',
    name:'',
    strain:'',
    weight:'',
    description:'',
    total_cannabinoid:'',
    total_terpenes:'',
    cannabinoid_profile: [],
    cannabinoid_weight:[],
    terpenes:[],
    terpenes_weight:[],
    tested_at:'',
    positive_test_report_text:'',
    negative_test_report_text:'',
    total_THC:'',
    total_CBD:'',
    producer_name:'',
    producer_lic:'',
    distributor_name:'',
    distributor_lic:'',
    laboratory_name:'',
    sample_id:'',
    batch_id:'',
    is_active:1
  }
  data.details = coaInfo
  let strainName =await strainModel.find({is_active:1,is_deleted:0}).select({"name":1});
  data.strainList = strainName;
  let cannabinoid = await medicineCompositionModel.find({is_active:1,is_deleted:0,type:1}).select({"name":1}).sort({name:1})
  let terpenes = await medicineCompositionModel.find({is_active:1,is_deleted:0,type:2}).select({"name":1}).sort({name:1})
  data.cannabinoidList = cannabinoid
  data.terpenesList = terpenes
  let productList = await Product.find({is_deleted:0,is_active:1})
  data.products = productList

  let findCond = { is_deleted: 0 }
  const coaAllRecords = await COAJobsStatus.findOne({ is_deleted: 0, _id: req.params.id });
  if (!!coaAllRecords) {
  const getCoaTestLabs = await CoaTestLabs.find(findCond);
  for (var ca = 0; ca < coaAllRecords.parsedCoa.length; ca++) {
      if (!!coaAllRecords.parsedCoa[ca].Text) {
        for (var ct = 0; ct < getCoaTestLabs.length; ct++) {
          //console.log(coaAllRecords.parsedCoa[ca].Text);
          if(coaAllRecords.parsedCoa[ca].Text === getCoaTestLabs[ct].labname) {
            await COAJobsStatus.findByIdAndUpdate(coaAllRecords._id, {coatestlabs: getCoaTestLabs[ct]._id});
            //console.log('Matched '+ getCoaTestLabs[ct].labname + ' .');
          } else {
            //console.log('Nothing Found for '+ getCoaTestLabs[ct].labname);
          }
        }
      }
    }
  }

  let coa_record = []
  if (coaAllRecords.parsedCoa) {
    for (var r = 0; r < coaAllRecords.parsedCoa.length; r++) {
      if (!!coaAllRecords.parsedCoa[r].Text) {
        coa_record.push({
          Text: coaAllRecords.parsedCoa[r].Text,
          Number: r,
          Confidence: coaAllRecords.parsedCoa[r].Confidence,
        })
      }
    }
    data.coa_status = 'Success';
  } else {
    data.coa_status = 'InProcess';
  }

  try {
    var url = new URL(coaAllRecords.originalFilename);
    var checkURL = true;
  } catch(e) {
      var checkURL = false;
  }
  
  data.fileurl = checkURL ? coaAllRecords.originalFilename : 'https://tcd-coaparser.s3.us-west-2.amazonaws.com/'+coaAllRecords.filename
  data.coa_record = coa_record
  
  res.render('admin/coa_process', {layout:layout.admin.session_with, data })
}

exports.parseCoa = async(req,res,next)=>{
  const processFile = await awsTextTract(req.file.key);

  if (!!processFile.success) {
    var new_coa = {
      job_id : processFile.JobId,
      filename : req.file.key,
      originalFilename : req.file.originalname,
      job_status : 'In Progress'
    }
    console.log(new_coa);
    await COAJobsStatus.create(new_coa)
      .then((response) => {
        if (response) {
          req.flash('success_msg', req.file.originalname+' has been processed with JobID ' + processFile.JobId + ' .')
        }
      })
      .catch((err) => {
        console.log(err);
        req.flash('error_msg', 'Something went wrong on saving cOA!')
      });
  } else {
    req.flash('error_msg', 'Something went wrong please contact your admin!')
  }
  res.redirect('/admin/coa-pending')
}

exports.readJsonData = async(req,res,next)=>{
  var workbook = new Excel.Workbook();
	workbook.views = [
		{
			x: 0, y: 0, width: 10000, height: 20000,
			firstSheet: 0, activeTab: 1, visibility: 'visible'
		}
	];
  //console.log(req.body.json_string)
  var inputStr = JSON.parse(decodeURI(req.body.json_string))
  //let JsonData = JSON.parse(fs.readFileSync(`${uploadPath}/coadata/coadata.json`))
  //console.log(JsonData.table)
  //res.send(inputStr.table)
  var tableData = inputStr.table;
  
  for (let i = 0; i < tableData.length; i++) {
    theader = []
    rows = []
    //console.log(tableData[i])
    var singletable = tableData[i].child;
    var worksheet = workbook.addWorksheet('table'+i);
    
    var rowskeys = Object.keys(singletable);

    
    for (let j = 0; j < rowskeys.length; j++) {
      worksheet.addRow(Object.values(singletable[rowskeys[j]]))
    }
    //console.log(rows)
  }
  
	res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
	res.setHeader("Content-Disposition", "attachment; filename=" + "COAdata.xlsx");
	workbook.xlsx.write(res)
	.then(function (data) {
		res.end();
	});
}