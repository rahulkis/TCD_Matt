const layout = require('../../config/layout');
const commonController = require('./commonController');
const TCDUpdates = require('../models/tcdUpdatesModel');

exports.getPartnerUpdates = async (req, res, next) => {
  try {
    let data = commonController.getCommonParams('TCD Updates List', req);
    const updates_list = await TCDUpdates.find().sort({ _id: -1 });
    data.updates_list = updates_list;
    res.render('admin/tcd_updates_list', {
      layout: layout.admin.session_with,
      data,
    });
  } catch (err) {
    req.flash('error_msg', e.message);
  }
};

exports.addPartnerUpdate = (req, res, next) => {
  try {
    let data = commonController.getCommonParams('Add TCD Updates', req);
    const tcd_update = {
      _id: '',
      title: '',
      category: '',
      description: '',
      is_published: 0,
    };
    data.tcd_update_data = tcd_update;
    res.render('admin/tcd_updates_add', {
      layout: layout.admin.session_with,
      data,
    });
  } catch (err) {
    req.flash('error_msg', e.message);
  }
};

exports.updatePartnerUpdate = async (req, res, next) => {
  const data = commonController.getCommonParams('Update TCD Updates', req);
  const { id } = req.params;
  const tcd_update = await TCDUpdates.findById(id);
  data.tcd_update_data = tcd_update;
  res.render('admin/tcd_updates_add', {
    layout: layout.admin.session_with,
    data,
  });
};

exports.managePartnerUpdate = async (req, res, next) => {
  try {
    const { id, title, description, is_published, category } = req.body;
    if (id) {
      await TCDUpdates.findByIdAndUpdate(id, {
        title,
        description,
        category,
        is_published: is_published ? 1 : 0,
        published_at: is_published ? new Date() : null,
      });
      req.flash('success_msg', 'Updated Successfully');
    } else {
      const newData = new TCDUpdates({
        title: title,
        description: description,
        category,
        is_published: is_published ? 1 : 0,
        published_at: is_published ? new Date() : null,
      });
      await newData.save();
      req.flash('success_msg', 'Added Successfully');
    }
    res.redirect('/admin/tcd-updates');
  } catch (err) {
    req.flash('error_msg', err.message);
  }
};

exports.deletePartnerUpdate = async (req, res, next) => {
  try {
    const { id } = req.params;
    await TCDUpdates.findByIdAndRemove(id);
    req.flash('success_msg', 'Deleted Successfully');
    res.redirect('/admin/tcd-updates');
  } catch (err) {
    req.flash('error_msg', err.message);
  }
};
